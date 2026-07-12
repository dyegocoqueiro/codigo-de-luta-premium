export const SUPPORT_EMAIL = "dyegocodigodeluta@gmail.com";
export const OWNER_EMAIL = SUPPORT_EMAIL;
export const AUTH_USER_KEY = "cl_auth_user";

export interface StoredAuthUser {
  id: number | string;
  email: string;
  name?: string | null;
  phone?: string | null;
}

export function getStoredAuthUser(): StoredAuthUser | null {
  try {
    const raw = localStorage.getItem(AUTH_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function safeEmailKey(email: string) {
  return email.trim().toLowerCase().replace(/[^a-z0-9._-]/g, "_");
}

export function userScopedStorageKey(baseKey: string, user = getStoredAuthUser()) {
  return user?.email ? `${baseKey}:${safeEmailKey(user.email)}` : baseKey;
}

export function isOwnerEmail(email?: string | null) {
  return Boolean(email && email.trim().toLowerCase() === OWNER_EMAIL);
}

export function buildSupportMailto(subject: string, bodyLines: string[] = []) {
  const user = getStoredAuthUser();
  const body = [
    "Olá, preciso de ajuda no Código de Luta.",
    "",
    user?.email ? `Conta: ${user.email}` : "Conta: não logado",
    `Página: ${window.location.href}`,
    "",
    ...bodyLines,
  ].join("\n");

  return `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
