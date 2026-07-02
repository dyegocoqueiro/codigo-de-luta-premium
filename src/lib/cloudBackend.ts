import type { FirebaseApp } from "firebase/app";
import type { User } from "firebase/auth";
import type { Firestore } from "firebase/firestore";
import { SUPPORT_EMAIL, type StoredAuthUser } from "./support";

interface FirebaseRuntimeConfig {
  enabled?: boolean;
  apiKey?: string;
  authDomain?: string;
  projectId?: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
}

interface CloudContext {
  app: FirebaseApp;
  db: Firestore;
}

interface AuthResult {
  token: string;
  user: StoredAuthUser;
}

let configPromise: Promise<FirebaseRuntimeConfig> | null = null;
let contextPromise: Promise<CloudContext | null> | null = null;
let appApiPromise: Promise<typeof import("firebase/app")> | null = null;
let authApiPromise: Promise<typeof import("firebase/auth")> | null = null;
let firestoreApiPromise: Promise<typeof import("firebase/firestore")> | null = null;

function getAppApi() {
  appApiPromise ??= import("firebase/app");
  return appApiPromise;
}

function getAuthApi() {
  authApiPromise ??= import("firebase/auth");
  return authApiPromise;
}

function getFirestoreApi() {
  firestoreApiPromise ??= import("firebase/firestore");
  return firestoreApiPromise;
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

async function loadRuntimeConfig() {
  if (!configPromise) {
    configPromise = fetch(`${import.meta.env.BASE_URL}firebase-config.json`, { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : null))
      .then((config) => (config && typeof config === "object" ? config : {}))
      .catch(() => ({}));
  }
  return configPromise;
}

async function getCloudContext() {
  if (!contextPromise) {
    contextPromise = loadRuntimeConfig().then(async (config) => {
      if (!config.enabled || !config.apiKey || !config.authDomain || !config.projectId || !config.appId) {
        return null;
      }

      const [{ initializeApp, getApps }, { getFirestore }] = await Promise.all([
        getAppApi(),
        getFirestoreApi(),
      ]);
      const app = getApps().length ? getApps()[0] : initializeApp(config);
      return { app, db: getFirestore(app) };
    });
  }
  return contextPromise;
}

async function requireCloudContext() {
  const context = await getCloudContext();
  if (!context) {
    throw new Error("Firebase ainda não está configurado.");
  }
  return context;
}

async function isEmailApproved(email: string) {
  const { db } = await requireCloudContext();
  const { doc, getDoc } = await getFirestoreApi();
  const normalizedEmail = normalizeEmail(email);
  const approvedRef = doc(db, "approvedEmails", normalizedEmail);
  const approvedSnap = await getDoc(approvedRef);
  return approvedSnap.exists() && approvedSnap.data().approved !== false;
}

async function authUserFromFirebase(user: User): Promise<AuthResult> {
  const { db } = await requireCloudContext();
  const { doc, getDoc } = await getFirestoreApi();
  const profileRef = doc(db, "users", user.uid);
  const profileSnap = await getDoc(profileRef);
  const profile = profileSnap.exists() ? profileSnap.data() : {};
  const token = await user.getIdToken();

  return {
    token,
    user: {
      id: user.uid,
      email: normalizeEmail(user.email || String(profile.email || "")),
      name: user.displayName || String(profile.name || "") || null,
      phone: String(profile.phone || "") || null,
    },
  };
}

async function ensureInitialUserDocs(user: User, profile: Partial<StoredAuthUser>) {
  const { db } = await requireCloudContext();
  const { doc, serverTimestamp, setDoc } = await getFirestoreApi();
  const email = normalizeEmail(user.email || profile.email || "");
  const userRef = doc(db, "users", user.uid);

  await setDoc(
    userRef,
    {
      email,
      name: profile.name || user.displayName || null,
      phone: profile.phone || null,
      updatedAt: serverTimestamp(),
      createdAt: serverTimestamp(),
    },
    { merge: true },
  );

  await setDoc(
    doc(db, "users", user.uid, "app", "progress"),
    {
      value: {
        xp: 0,
        streak: 0,
        completedModules: [],
        currentWeek: 1,
        totalSessions: 0,
        lastSession: "",
      },
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );

  await setDoc(doc(db, "users", user.uid, "app", "evolution"), { value: [], updatedAt: serverTimestamp() }, { merge: true });
  await setDoc(doc(db, "users", user.uid, "app", "combos"), { value: [], updatedAt: serverTimestamp() }, { merge: true });
}

export async function isCloudConfigured() {
  return Boolean(await getCloudContext());
}

export async function registerCloudAccount(params: {
  email: string;
  password: string;
  name?: string;
  phone?: string;
}): Promise<AuthResult> {
  const { app } = await requireCloudContext();
  const { createUserWithEmailAndPassword, getAuth, updateProfile } = await getAuthApi();
  const auth = getAuth(app);
  const email = normalizeEmail(params.email);
  const name = params.name?.trim() || "";
  const phone = params.phone?.trim() || "";

  if (!(await isEmailApproved(email))) {
    throw new Error(`Este e-mail ainda não foi liberado. Peça liberação em ${SUPPORT_EMAIL}.`);
  }

  const credential = await createUserWithEmailAndPassword(auth, email, params.password);
  if (name) {
    await updateProfile(credential.user, { displayName: name });
  }

  await ensureInitialUserDocs(credential.user, {
    email,
    name: name || null,
    phone: phone || null,
  });

  return authUserFromFirebase(credential.user);
}

export async function loginCloudAccount(email: string, password: string): Promise<AuthResult> {
  const { app } = await requireCloudContext();
  const { getAuth, signInWithEmailAndPassword, signOut } = await getAuthApi();
  const auth = getAuth(app);
  const normalizedEmail = normalizeEmail(email);
  const credential = await signInWithEmailAndPassword(auth, normalizedEmail, password);

  if (!(await isEmailApproved(normalizedEmail))) {
    await signOut(auth);
    throw new Error(`Este e-mail não está liberado para acessar o Código de Luta. Fale com ${SUPPORT_EMAIL}.`);
  }

  await ensureInitialUserDocs(credential.user, { email: normalizedEmail });
  return authUserFromFirebase(credential.user);
}

export async function subscribeCloudAuth(callback: (auth: AuthResult | null) => void) {
  const context = await getCloudContext();
  if (!context) return () => {};

  const { getAuth, onAuthStateChanged, signOut } = await getAuthApi();
  const auth = getAuth(context.app);
  return onAuthStateChanged(auth, async (user) => {
    if (!user?.email) {
      callback(null);
      return;
    }

    try {
      if (!(await isEmailApproved(user.email))) {
        await signOut(auth);
        callback(null);
        return;
      }
      callback(await authUserFromFirebase(user));
    } catch {
      callback(null);
    }
  });
}

export async function signOutCloudAccount() {
  const context = await getCloudContext();
  if (!context) return;
  const { getAuth, signOut } = await getAuthApi();
  await signOut(getAuth(context.app));
}

async function getCurrentCloudUser() {
  const context = await getCloudContext();
  if (!context) return null;
  const { getAuth } = await getAuthApi();
  const user = getAuth(context.app).currentUser;
  return user ? { context, user } : null;
}

async function loadCloudValue<T>(docName: string): Promise<T | null> {
  const current = await getCurrentCloudUser();
  if (!current) return null;
  const { doc, getDoc } = await getFirestoreApi();
  const snap = await getDoc(doc(current.context.db, "users", current.user.uid, "app", docName));
  if (!snap.exists()) return null;
  return (snap.data().value ?? null) as T | null;
}

async function saveCloudValue<T>(docName: string, value: T) {
  const current = await getCurrentCloudUser();
  if (!current) return;
  const { doc, serverTimestamp, setDoc } = await getFirestoreApi();
  await setDoc(
    doc(current.context.db, "users", current.user.uid, "app", docName),
    { value, updatedAt: serverTimestamp() },
    { merge: true },
  );
}

export function loadCloudProgress<T>() {
  return loadCloudValue<T>("progress");
}

export function saveCloudProgress<T>(value: T) {
  return saveCloudValue("progress", value);
}

export function loadCloudSessions<T>() {
  return loadCloudValue<T>("evolution");
}

export function saveCloudSessions<T>(value: T) {
  return saveCloudValue("evolution", value);
}

export function loadCloudStudiedCombos<T>() {
  return loadCloudValue<T>("combos");
}

export function saveCloudStudiedCombos<T>(value: T) {
  return saveCloudValue("combos", value);
}
