import { useState, type FormEvent } from "react";
import logoImg from "@assets/codigo-luta-logo_1782758047742.png";
import muayThaiImg from "@assets/muay-thai-legend-bg_1782758047742.png";
import { SUPPORT_EMAIL, buildSupportMailto } from "../lib/support";
import { isCloudConfigured, loginCloudAccount, registerCloudAccount } from "../lib/cloudBackend";

interface AuthUser {
  id: number | string;
  email: string;
  name?: string | null;
  phone?: string | null;
}

interface StoredUser extends AuthUser {
  passwordHash: string;
}

interface AuthPageProps {
  onAuth: (token: string, user: AuthUser) => void;
}

type Mode = "login" | "register";
const LOCAL_USERS_KEY = "cl_auth_users";

function loadUsers(): StoredUser[] {
  try {
    const raw = localStorage.getItem(LOCAL_USERS_KEY);
    const users = raw ? JSON.parse(raw) : [];
    return Array.isArray(users) ? users : [];
  } catch {
    return [];
  }
}

function saveUsers(users: StoredUser[]) {
  localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
}

async function hashPassword(password: string) {
  const data = new TextEncoder().encode(password);

  if (window.crypto?.subtle) {
    const digest = await window.crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(digest))
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");
  }

  return btoa(unescape(encodeURIComponent(password)));
}

function createToken() {
  return `local-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

async function loadApprovedEmails() {
  try {
    const response = await fetch(`${import.meta.env.BASE_URL}approved-emails.json`, { cache: "no-store" });
    if (!response.ok) return [SUPPORT_EMAIL];
    const data = await response.json();
    const allowed = Array.isArray(data.allowed) ? data.allowed : [];
    return allowed.map((item: unknown) => String(item).trim().toLowerCase()).filter(Boolean);
  } catch {
    return [SUPPORT_EMAIL];
  }
}

function friendlyAuthError(error: unknown) {
  const message = error instanceof Error ? error.message : "";
  if (message.includes("auth/email-already-in-use")) return "Este e-mail já possui cadastro. Use a aba Entrar.";
  if (message.includes("auth/invalid-credential") || message.includes("auth/wrong-password")) return "E-mail ou senha inválidos.";
  if (message.includes("auth/user-not-found")) return "Conta não encontrada para este e-mail.";
  if (message.includes("auth/weak-password")) return "A senha deve ter pelo menos 6 caracteres.";
  if (message.includes("auth/too-many-requests")) return "Muitas tentativas. Aguarde um pouco e tente novamente.";
  return message || "Não foi possível acessar sua conta. Tente novamente.";
}

function isPendingAccessResult(result: unknown): result is { status: "pending"; email: string; message: string } {
  return Boolean(result && typeof result === "object" && "status" in result && result.status === "pending");
}

function isPendingAccessMessage(message: string) {
  return message.includes("aguardando liberação") || message.includes("liberação em até 24h");
}

async function sendAccessRequestEmail(params: {
  email: string;
  name: string;
  phone: string;
}) {
  try {
    await fetch(`https://formsubmit.co/ajax/${SUPPORT_EMAIL}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        _subject: "Novo pedido de liberação - Código de Luta",
        _template: "table",
        _captcha: "false",
        nome: params.name.trim() || "Não informado",
        email: params.email,
        telefone: params.phone.trim() || "Não informado",
        mensagem: `A pessoa criou uma conta e está aguardando liberação no Código de Luta. Para liberar, adicione no Firestore o documento approvedEmails/${params.email} com approved = true.`,
        pagina: window.location.href,
      }),
    });
  } catch {
    // O pedido principal fica salvo no Firestore; o e-mail é apenas um aviso extra.
  }
}

export default function AuthPage({ onAuth }: AuthPageProps) {
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPass, setShowPass] = useState(false);

  const switchMode = (m: Mode) => {
    setMode(m);
    setError("");
    setSuccess("");
    setPassword("");
    setConfirm("");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (mode === "register") {
      if (password !== confirm) {
        setError("As senhas não coincidem.");
        return;
      }
      if (password.length < 6) {
        setError("A senha deve ter pelo menos 6 caracteres.");
        return;
      }
    }

    setLoading(true);
    try {
      const normalizedEmail = email.trim().toLowerCase();
      const cloudReady = await isCloudConfigured();

      if (cloudReady) {
        const authResult = mode === "register"
          ? await registerCloudAccount({
              email: normalizedEmail,
              password,
              name,
              phone,
              page: window.location.href,
            })
          : await loginCloudAccount(normalizedEmail, password);

        if (isPendingAccessResult(authResult)) {
          await sendAccessRequestEmail({
            email: authResult.email,
            name,
            phone,
          });
          setSuccess(authResult.message);
          setPassword("");
          setConfirm("");
          return;
        }

        localStorage.setItem("cl_auth_token", authResult.token);
        localStorage.setItem("cl_auth_user", JSON.stringify(authResult.user));
        onAuth(authResult.token, authResult.user);
        return;
      }

      const users = loadUsers();
      const passwordHash = await hashPassword(password);
      let storedUser = users.find((user) => user.email.toLowerCase() === normalizedEmail);

      if (mode === "register") {
        const approvedEmails = await loadApprovedEmails();
        if (!approvedEmails.includes(normalizedEmail)) {
          await sendAccessRequestEmail({
            email: normalizedEmail,
            name,
            phone,
          });
          setSuccess("Conta criada com sucesso. Agora é só aguardar a liberação em até 24h.");
          setPassword("");
          setConfirm("");
          return;
        }

        if (storedUser) {
          setError("Este e-mail já possui cadastro neste dispositivo.");
          return;
        }

        storedUser = {
          id: Date.now(),
          email: normalizedEmail,
          name: name.trim() || null,
          phone: phone.trim() || null,
          passwordHash,
        };
        saveUsers([...users, storedUser]);
      } else if (!storedUser || storedUser.passwordHash !== passwordHash) {
        setError("E-mail ou senha inválidos. Crie uma conta neste dispositivo se for seu primeiro acesso.");
        return;
      }

      const token = createToken();
      const user: AuthUser = {
        id: storedUser.id,
        email: storedUser.email,
        name: storedUser.name,
        phone: storedUser.phone,
      };

      localStorage.setItem("cl_auth_token", token);
      localStorage.setItem("cl_auth_user", JSON.stringify(user));
      onAuth(token, user);
    } catch (error) {
      const message = friendlyAuthError(error);
      if (isPendingAccessMessage(message)) {
        setSuccess(message);
        setPassword("");
        setConfirm("");
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center p-4"
      style={{ background: "#07080b", zIndex: 200 }}
    >
      <div className="absolute inset-0 cl-grid-bg opacity-20 pointer-events-none" />

      <div className="absolute right-0 top-0 bottom-0 w-1/2 pointer-events-none overflow-hidden">
        <img
          src={muayThaiImg}
          alt=""
          className="absolute right-0 bottom-0 h-full object-contain object-right"
          style={{ opacity: 0.07, filter: "saturate(1.2)", mixBlendMode: "screen" }}
        />
      </div>

      <div
        className="relative w-full max-w-md"
        style={{
          background: "rgba(12,16,24,0.97)",
          border: "1px solid rgba(213,15,50,0.25)",
          borderRadius: "24px",
          backdropFilter: "blur(30px)",
          boxShadow: "0 0 80px rgba(213,15,50,0.12), 0 0 0 1px rgba(255,255,255,0.04)",
        }}
      >
        <div
          className="px-8 py-6 text-center"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="absolute inset-0 rounded-full blur-xl" style={{ background: "rgba(213,15,50,0.4)" }} />
              <img src={logoImg} alt="Logo" className="w-14 h-14 object-contain relative z-10" />
            </div>
          </div>
          <div
            className="font-black text-2xl tracking-wider mb-1"
            style={{ fontFamily: "Impact, Arial Black, sans-serif", color: "#fff" }}
          >
            CÓDIGO<span style={{ color: "#d50f32" }}>◆</span>LUTA
          </div>
          <div className="text-xs tracking-widest uppercase" style={{ color: "#aab5c4" }}>
            Sistema Híbrido Solo
          </div>
        </div>

        <div className="p-8">
          {/* Tabs */}
          <div
            className="flex rounded-xl p-1 mb-7"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            {(["login", "register"] as Mode[]).map(m => (
              <button
                key={m}
                onClick={() => switchMode(m)}
                className="flex-1 py-2 rounded-lg text-sm font-bold transition-all"
                style={{
                  background: mode === m ? "#d50f32" : "transparent",
                  color: mode === m ? "#fff" : "#aab5c4",
                }}
              >
                {m === "login" ? "Entrar" : "Criar Conta"}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <div>
                <label className="block text-xs font-bold mb-1.5" style={{ color: "#aab5c4" }}>
                  Nome (opcional)
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Seu nome"
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "#fff",
                  }}
                  onFocus={e => (e.target.style.borderColor = "rgba(213,15,50,0.5)")}
                  onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-bold mb-1.5" style={{ color: "#aab5c4" }}>
                E-mail *
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "#fff",
                }}
                onFocus={e => (e.target.style.borderColor = "rgba(213,15,50,0.5)")}
                onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
              />
            </div>

            {mode === "register" && (
              <div>
                <label className="block text-xs font-bold mb-1.5" style={{ color: "#aab5c4" }}>
                  WhatsApp / Telefone (opcional)
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="+55 (11) 99999-9999"
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "#fff",
                  }}
                  onFocus={e => (e.target.style.borderColor = "rgba(213,15,50,0.5)")}
                  onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-bold mb-1.5" style={{ color: "#aab5c4" }}>
                Senha *
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder={mode === "register" ? "Mínimo 6 caracteres" : "Sua senha"}
                  required
                  className="w-full px-4 py-3 pr-11 rounded-xl text-sm outline-none transition-all"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "#fff",
                  }}
                  onFocus={e => (e.target.style.borderColor = "rgba(213,15,50,0.5)")}
                  onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs"
                  style={{ color: "#aab5c4", background: "none", border: "none", cursor: "pointer" }}
                >
                  {showPass ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            {mode === "register" && (
              <div>
                <label className="block text-xs font-bold mb-1.5" style={{ color: "#aab5c4" }}>
                  Confirmar Senha *
                </label>
                <input
                  type={showPass ? "text" : "password"}
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  placeholder="Repita a senha"
                  required
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "#fff",
                  }}
                  onFocus={e => (e.target.style.borderColor = "rgba(213,15,50,0.5)")}
                  onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
                />
              </div>
            )}

            {success && (
              <div
                className="px-4 py-3 rounded-xl text-sm"
                style={{ background: "rgba(22,163,74,0.12)", border: "1px solid rgba(22,163,74,0.35)", color: "#86efac" }}
              >
                {success}
              </div>
            )}

            {error && (
              <div
                className="px-4 py-3 rounded-xl text-sm"
                style={{ background: "rgba(213,15,50,0.12)", border: "1px solid rgba(213,15,50,0.3)", color: "#ff6b6b" }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-bold text-base transition-all mt-2"
              style={{
                background: loading ? "rgba(213,15,50,0.5)" : "#d50f32",
                color: "#fff",
                opacity: loading ? 0.7 : 1,
                boxShadow: loading ? "none" : "0 0 30px rgba(213,15,50,0.4)",
              }}
            >
              {loading
                ? "Aguarde..."
                : mode === "login" ? "Entrar no Sistema" : "Criar Conta"
              }
            </button>
          </form>

          <div className="mt-6 text-center text-xs" style={{ color: "#6b7a8d" }}>
            {mode === "login" ? (
              <>
                Ainda não tem conta?{" "}
                <button
                  onClick={() => switchMode("register")}
                  className="font-bold transition-colors hover:opacity-80"
                  style={{ color: "#d50f32", background: "none", border: "none", cursor: "pointer" }}
                >
                  Cadastrar agora
                </button>
              </>
            ) : (
              <>
                Já tem conta?{" "}
                <button
                  onClick={() => switchMode("login")}
                  className="font-bold transition-colors hover:opacity-80"
                  style={{ color: "#d50f32", background: "none", border: "none", cursor: "pointer" }}
                >
                  Fazer login
                </button>
              </>
            )}
          </div>

          <div className="mt-4 text-center text-xs" style={{ color: "#6b7a8d" }}>
            Cadastro liberado apenas para e-mails autorizados pelo Código de Luta.
          </div>

          <div className="mt-3 text-center text-xs">
            <a
              href={buildSupportMailto("Liberação de acesso ao Código de Luta", [
                "Quero liberar meu e-mail para criar conta.",
                `E-mail para liberar: ${email.trim() || "(preencha seu e-mail acima)"}`,
                phone.trim() ? `Telefone/WhatsApp: ${phone.trim()}` : "",
              ].filter(Boolean))}
              className="font-bold transition-colors hover:opacity-80"
              style={{ color: "#f8c54d" }}
            >
              Pedir liberação ou tirar dúvida
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
