import { useEffect, useState } from "react";
import { buildSupportMailto } from "../lib/support";

export default function ErrorReporter() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      setMessage(event.message || "Erro inesperado no site.");
    };

    const handleRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason instanceof Error ? event.reason.message : String(event.reason || "");
      setMessage(reason || "Falha inesperada no site.");
    };

    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleRejection);
    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handleRejection);
    };
  }, []);

  if (!message) return null;

  return (
    <div
      className="fixed left-4 bottom-4 z-50 max-w-xs rounded-2xl p-4"
      style={{
        background: "rgba(12,16,24,0.97)",
        border: "1px solid rgba(213,15,50,0.35)",
        boxShadow: "0 18px 60px rgba(0,0,0,0.5)",
      }}
    >
      <div className="text-sm font-bold text-white">Algo falhou no site</div>
      <div className="mt-1 text-xs" style={{ color: "#aab5c4" }}>
        Envie um aviso para o suporte com a página e o erro.
      </div>
      <div className="mt-3 flex gap-2">
        <a
          href={buildSupportMailto("Problema no site Código de Luta", [`Erro: ${message}`])}
          className="rounded-xl px-3 py-2 text-xs font-bold"
          style={{ background: "#d50f32", color: "#fff" }}
        >
          Enviar
        </a>
        <button
          type="button"
          onClick={() => setMessage("")}
          className="rounded-xl px-3 py-2 text-xs font-bold"
          style={{ background: "rgba(255,255,255,0.06)", color: "#aab5c4" }}
        >
          Fechar
        </button>
      </div>
    </div>
  );
}
