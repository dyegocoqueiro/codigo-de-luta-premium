import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Clock, Mail, Phone, RefreshCw, ShieldCheck, User } from "lucide-react";
import { approveAccessRequest, loadAccessRequests, type AccessRequest } from "@/lib/cloudBackend";

function formatDate(value: number) {
  if (!value) return "Sem data";
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

function statusLabel(status: AccessRequest["status"]) {
  return status === "approved" ? "Liberado" : "Pendente";
}

export default function AdminPage() {
  const [requests, setRequests] = useState<AccessRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const focusEmail = useMemo(() => {
    return new URLSearchParams(window.location.search).get("approve")?.trim().toLowerCase() || "";
  }, []);

  const pendingCount = requests.filter((request) => request.status === "pending").length;

  const refresh = async () => {
    setLoading(true);
    setError("");
    try {
      setRequests(await loadAccessRequests());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nao foi possivel carregar os pedidos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleApprove = async (email: string) => {
    setApproving(email);
    setError("");
    setSuccess("");
    try {
      await approveAccessRequest(email);
      setSuccess(`${email} foi liberado para entrar no Codigo de Luta.`);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nao foi possivel confirmar esse acesso.");
    } finally {
      setApproving("");
    }
  };

  const sortedRequests = useMemo(() => {
    if (!focusEmail) return requests;
    return [...requests].sort((a, b) => {
      if (a.email === focusEmail) return -1;
      if (b.email === focusEmail) return 1;
      if (a.status !== b.status) return a.status === "pending" ? -1 : 1;
      return b.requestedAt - a.requestedAt;
    });
  }, [focusEmail, requests]);

  return (
    <main className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8" style={{ color: "#fff" }}>
      <div className="max-w-6xl mx-auto">
        <section className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-3 text-xs font-bold uppercase tracking-wider rounded-lg"
              style={{ color: "#f8c54d", border: "1px solid rgba(248,197,77,0.35)", background: "rgba(248,197,77,0.08)" }}
            >
              <ShieldCheck size={14} />
              Dono
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-wide" style={{ fontFamily: "Impact, Arial Black, sans-serif" }}>
              Pedidos de acesso
            </h1>
            <p className="mt-2 text-sm" style={{ color: "#aab5c4" }}>
              {pendingCount} pedido{pendingCount === 1 ? "" : "s"} aguardando confirmacao.
            </p>
          </div>

          <button
            type="button"
            onClick={refresh}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-bold rounded-lg transition-all"
            style={{
              color: "#fff",
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.12)",
              opacity: loading ? 0.65 : 1,
            }}
          >
            <RefreshCw size={16} />
            Atualizar
          </button>
        </section>

        {success && (
          <div className="mb-5 px-4 py-3 rounded-lg text-sm"
            style={{ background: "rgba(22,163,74,0.12)", border: "1px solid rgba(22,163,74,0.35)", color: "#86efac" }}
          >
            {success}
          </div>
        )}

        {error && (
          <div className="mb-5 px-4 py-3 rounded-lg text-sm"
            style={{ background: "rgba(213,15,50,0.12)", border: "1px solid rgba(213,15,50,0.3)", color: "#ff6b6b" }}
          >
            {error}
          </div>
        )}

        <section
          className="overflow-hidden rounded-lg"
          style={{ background: "rgba(12,16,24,0.9)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <div className="grid grid-cols-1">
            {loading ? (
              <div className="px-5 py-10 text-center text-sm" style={{ color: "#aab5c4" }}>
                Carregando pedidos...
              </div>
            ) : sortedRequests.length === 0 ? (
              <div className="px-5 py-10 text-center text-sm" style={{ color: "#aab5c4" }}>
                Nenhum pedido encontrado.
              </div>
            ) : (
              sortedRequests.map((request) => {
                const highlighted = focusEmail && request.email === focusEmail;
                const isPending = request.status === "pending";

                return (
                  <article
                    key={request.email}
                    className="grid gap-4 p-5 md:grid-cols-[1fr_auto] md:items-center"
                    style={{
                      borderBottom: "1px solid rgba(255,255,255,0.07)",
                      background: highlighted ? "rgba(248,197,77,0.08)" : "transparent",
                    }}
                  >
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-md"
                          style={{
                            color: isPending ? "#f8c54d" : "#86efac",
                            background: isPending ? "rgba(248,197,77,0.1)" : "rgba(22,163,74,0.12)",
                            border: isPending ? "1px solid rgba(248,197,77,0.3)" : "1px solid rgba(22,163,74,0.35)",
                          }}
                        >
                          {isPending ? <Clock size={13} /> : <CheckCircle2 size={13} />}
                          {statusLabel(request.status)}
                        </span>
                        <span className="text-xs" style={{ color: "#6b7a8d" }}>
                          {formatDate(request.requestedAt)}
                        </span>
                      </div>

                      <div className="grid gap-2 text-sm">
                        <div className="flex items-center gap-2 min-w-0">
                          <Mail size={15} style={{ color: "#f8c54d", flex: "0 0 auto" }} />
                          <span className="truncate font-bold">{request.email}</span>
                        </div>
                        <div className="flex flex-wrap gap-x-5 gap-y-2" style={{ color: "#aab5c4" }}>
                          <span className="inline-flex items-center gap-2">
                            <User size={14} />
                            {request.name || "Nome nao informado"}
                          </span>
                          <span className="inline-flex items-center gap-2">
                            <Phone size={14} />
                            {request.phone || "Telefone nao informado"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleApprove(request.email)}
                      disabled={!isPending || approving === request.email}
                      className="inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-black rounded-lg transition-all"
                      style={{
                        color: "#fff",
                        background: isPending ? "#16a34a" : "rgba(255,255,255,0.06)",
                        border: isPending ? "1px solid rgba(134,239,172,0.45)" : "1px solid rgba(255,255,255,0.1)",
                        opacity: !isPending || approving === request.email ? 0.7 : 1,
                        cursor: !isPending || approving === request.email ? "default" : "pointer",
                      }}
                    >
                      <CheckCircle2 size={17} />
                      {isPending ? (approving === request.email ? "Confirmando..." : "Confirmar") : "Confirmado"}
                    </button>
                  </article>
                );
              })
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
