import { Mail } from "lucide-react";
import { buildSupportMailto } from "../lib/support";

export default function SupportButton() {
  return (
    <a
      href={buildSupportMailto("Ajuda no Código de Luta")}
      className="fixed right-4 bottom-4 z-40 flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold transition-all hover:scale-105"
      style={{
        background: "rgba(12,16,24,0.94)",
        border: "1px solid rgba(248,197,77,0.28)",
        color: "#f8c54d",
        boxShadow: "0 12px 40px rgba(0,0,0,0.35)",
        backdropFilter: "blur(14px)",
      }}
    >
      <Mail className="h-4 w-4" />
      <span>Ajuda</span>
    </a>
  );
}
