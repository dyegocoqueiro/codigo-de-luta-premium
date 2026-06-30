import { useState, useMemo, useCallback } from "react";
import { Link } from "wouter";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, RadarChart as RechartsRadar, PolarGrid, PolarAngleAxis, Radar,
} from "recharts";
import RadarChart from "../components/RadarChart";
import ScrollReveal from "../components/ScrollReveal";
import { getLevelFromXP, getRank } from "../data/modules";
import logoImg from "@assets/codigo-luta-logo_1782758047742.png";

interface SessionEntry {
  id: string;
  date: string;
  energia: number;
  dor: number;
  tecnica: number;
  rounds: number;
  velocidade: number;
  potencia: number;
  foco: number;
  consistencia: number;
  anotacao: string;
  modulo: string;
  xpGanho: number;
  kodeAnalise: string;
}

const LOCAL_KEY = "cl_evolution_v2";

function loadSessions(): SessionEntry[] {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveSessions(sessions: SessionEntry[]) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(sessions));
}

function generateKodeAnalise(session: Omit<SessionEntry, "id" | "date" | "kodeAnalise" | "xpGanho">): string {
  const media = (session.energia + session.tecnica + session.velocidade + session.potencia + session.foco + session.consistencia) / 6;
  const fraquezas: string[] = [];
  const forcas: string[] = [];

  if (session.tecnica < 5) fraquezas.push("técnica");
  if (session.velocidade < 5) fraquezas.push("velocidade");
  if (session.consistencia < 5) fraquezas.push("consistência");
  if (session.foco < 5) fraquezas.push("foco mental");
  if (session.potencia < 5) fraquezas.push("potência");

  if (session.tecnica >= 7) forcas.push("técnica sólida");
  if (session.velocidade >= 7) forcas.push("boa velocidade");
  if (session.foco >= 7) forcas.push("foco afiado");
  if (session.energia >= 7) forcas.push("energia alta");
  if (session.consistencia >= 7) forcas.push("consistência elevada");

  let analise = `📊 Análise da sessão — ${session.modulo || "MMA Integrado"}\n\n`;

  if (media >= 7.5) {
    analise += `Sessão excelente, guerreiro. Média geral ${media.toFixed(1)}/10 — você está no topo da sua forma. `;
  } else if (media >= 5.5) {
    analise += `Sessão sólida com média ${media.toFixed(1)}/10. Progresso visível. `;
  } else {
    analise += `Sessão de construção com média ${media.toFixed(1)}/10. É nessas sessões difíceis que o verdadeiro lutador é forjado. `;
  }

  if (forcas.length > 0) {
    analise += `\n\n✅ **Pontos fortes desta sessão:** ${forcas.join(", ")}.`;
  }

  if (fraquezas.length > 0) {
    analise += `\n\n⚡ **Foco para próxima sessão:** ${fraquezas.join(", ")}. `;
    if (fraquezas.includes("técnica")) analise += "Reduza a velocidade e revise a mecânica fundamental de cada golpe. ";
    if (fraquezas.includes("consistência")) analise += "Trabalhe com rounds mais curtos mas sem pausas. ";
    if (fraquezas.includes("foco mental")) analise += "Shadowbox com intenção — cada golpe com alvo mental definido. ";
    if (fraquezas.includes("velocidade")) analise += "Drills de velocidade: burst de 10 golpes rápidos entre séries lentas. ";
  }

  if (session.dor >= 7) {
    analise += `\n\n⚠️ **Dor em ${session.dor}/10:** Sinalize se é dor muscular (ok) ou articular (problema). Inclua recuperação ativa amanhã.`;
  } else if (session.dor <= 3) {
    analise += `\n\n💪 Dor baixa (${session.dor}/10) — boa recuperação. Você pode aumentar a intensidade na próxima sessão.`;
  }

  if (session.rounds >= 6) {
    analise += `\n\n🔥 ${session.rounds} rounds — excelente volume. Continue construindo sua base aeróbica.`;
  }

  analise += `\n\n📈 **XP desta sessão:** +${calcXP(session)} pontos adicionados ao seu perfil de lutador.`;

  return analise;
}

function calcXP(session: Omit<SessionEntry, "id" | "date" | "kodeAnalise" | "xpGanho">) {
  const base = 50;
  const bonus = Math.round(
    (session.tecnica * 8) +
    (session.consistencia * 6) +
    (session.rounds * 5) +
    (session.velocidade * 4) +
    (session.potencia * 4) +
    (session.foco * 5) +
    (session.energia * 3)
  );
  return base + bonus;
}

const METRICS = [
  { key: "energia", label: "Energia", color: "#f8c54d", desc: "Nível de disposição física durante o treino" },
  { key: "tecnica", label: "Técnica", color: "#59bfff", desc: "Qualidade de execução dos movimentos" },
  { key: "velocidade", label: "Velocidade", color: "#32d98b", desc: "Explosividade e velocidade dos golpes" },
  { key: "potencia", label: "Potência", color: "#ff355a", desc: "Força e impacto nos golpes" },
  { key: "foco", label: "Foco Mental", color: "#9b59b6", desc: "Concentração e presença durante o treino" },
  { key: "consistencia", label: "Consistência", color: "#e67e22", desc: "Manutenção da técnica sob cansaço" },
  { key: "dor", label: "Dor/Fadiga", color: "#c0392b", desc: "Nível de dor ou cansaço muscular" },
  { key: "rounds", label: "Rounds", color: "#aab5c4", desc: "Número de rounds completados" },
];

const MODULOS = [
  "Boxe", "Muay Thai", "Kickboxing", "Sanda", "Sambo/Wrestling",
  "BJJ Solo", "Krav Maga", "MMA Integrado",
];

const DEFAULT_FORM = {
  energia: 7, dor: 2, tecnica: 6, rounds: 4,
  velocidade: 6, potencia: 6, foco: 7, consistencia: 6,
  anotacao: "", modulo: "Boxe",
};

export default function EvolutionPage() {
  const [sessions, setSessions] = useState<SessionEntry[]>(loadSessions);
  const [form, setForm] = useState(DEFAULT_FORM);
  const [showAnalise, setShowAnalise] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<"registrar" | "historico" | "analise">("registrar");

  const totalXP = sessions.reduce((s, e) => s + e.xpGanho, 0);
  const { level, currentXP, nextLevelXP } = getLevelFromXP(totalXP);
  const rank = getRank(level);

  const radarAxes = useMemo(() => {
    if (sessions.length === 0) {
      return [
        { key: "tecnica", label: "Técnica", value: 0 },
        { key: "velocidade", label: "Velocidade", value: 0 },
        { key: "potencia", label: "Potência", value: 0 },
        { key: "foco", label: "Foco Mental", value: 0 },
        { key: "consistencia", label: "Consistência", value: 0 },
        { key: "energia", label: "Energia", value: 0 },
      ];
    }
    const last5 = sessions.slice(-5);
    const avg = (key: keyof SessionEntry) =>
      Math.round(last5.reduce((s, e) => s + Number(e[key]), 0) / last5.length * 10) / 10;
    return [
      { key: "tecnica", label: "Técnica", value: avg("tecnica") },
      { key: "velocidade", label: "Velocidade", value: avg("velocidade") },
      { key: "potencia", label: "Potência", value: avg("potencia") },
      { key: "foco", label: "Foco", value: avg("foco") },
      { key: "consistencia", label: "Consistência", value: avg("consistencia") },
      { key: "energia", label: "Energia", value: avg("energia") },
    ];
  }, [sessions]);

  const xpChartData = useMemo(() => {
    let accum = 0;
    return sessions.map((s, i) => {
      accum += s.xpGanho;
      return {
        sessao: `S${i + 1}`,
        xp: accum,
        tecnica: s.tecnica,
        velocidade: s.velocidade,
        consistencia: s.consistencia,
      };
    });
  }, [sessions]);

  const streakDays = useMemo(() => {
    if (sessions.length === 0) return 0;
    let streak = 0;
    const today = new Date().toDateString();
    const sorted = [...sessions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    let expected = new Date();
    for (const s of sorted) {
      const d = new Date(s.date).toDateString();
      if (d === expected.toDateString() || d === today) {
        streak++;
        expected.setDate(expected.getDate() - 1);
      } else break;
    }
    return streak;
  }, [sessions]);

  const handleSave = () => {
    const kodeAnalise = generateKodeAnalise(form);
    const xpGanho = calcXP(form);
    const newSession: SessionEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      ...form,
      xpGanho,
      kodeAnalise,
    };
    const updated = [...sessions, newSession];
    setSessions(updated);
    saveSessions(updated);
    setShowAnalise(kodeAnalise);
    setSaved(true);
    setActiveTab("analise");
    setTimeout(() => setSaved(false), 2000);
  };

  const handleClear = () => {
    if (confirm("Zerar todo o progresso? Esta ação não pode ser desfeita.")) {
      setSessions([]);
      saveSessions([]);
      setShowAnalise(null);
    }
  };

  const renderContent = (text: string) => {
    return text.split("\n").map((line, i) => {
      const parts = line.split(/(\*\*[^*]+\*\*)/g);
      return (
        <span key={i}>
          {parts.map((part, j) =>
            part.startsWith("**") && part.endsWith("**")
              ? <strong key={j} style={{ color: "#f8c54d" }}>{part.slice(2, -2)}</strong>
              : <span key={j}>{part}</span>
          )}
          {i < text.split("\n").length - 1 && <br />}
        </span>
      );
    });
  };

  return (
    <div className="min-h-screen pt-16" style={{ background: "#07080b" }}>
      <div className="absolute inset-0 cl-grid-bg opacity-20 pointer-events-none" />

      {/* Header */}
      <ScrollReveal animation="fadeUp">
        <div className="relative py-14 overflow-hidden" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="absolute inset-0" style={{ background: "radial-gradient(circle at 50% 0%, rgba(50,217,139,0.08), transparent 60%)" }} />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="flex items-center gap-3 mb-5">
              <Link href="/">
                <button className="flex items-center gap-2 text-sm transition-colors" style={{ color: "#aab5c4", background: "none", border: "none", cursor: "pointer" }}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Voltar
                </button>
              </Link>
            </div>

            <div className="flex items-center gap-4 mb-3">
              <img src={logoImg} alt="Logo" className="w-10 h-10 object-contain" />
              <div>
                <div className="text-xs tracking-widest uppercase mb-1" style={{ color: "#32d98b" }}>Sistema Código de Luta</div>
                <h1 className="font-black" style={{ fontFamily: "Impact, Arial Black, sans-serif", fontSize: "clamp(2rem, 5vw, 3.5rem)", color: "#fff", lineHeight: 1 }}>
                  EVOLUÇÃO COM<br /><span style={{ color: "#32d98b" }}>MÉTRICAS</span>
                </h1>
              </div>
            </div>
            <p className="text-base" style={{ color: "#aab5c4", maxWidth: "520px" }}>
              Registre cada sessão. O sistema avalia 8 dimensões do seu desempenho e entrega uma análise profunda do Kode — personalizada para você evoluir de verdade.
            </p>
          </div>
        </div>
      </ScrollReveal>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* Stats Row */}
        <ScrollReveal animation="fadeUp" delay={100}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Nível", value: level.toString(), sub: rank.name, color: rank.color },
              { label: "XP Total", value: totalXP.toString(), sub: `${currentXP}/${nextLevelXP} próx.`, color: "#f8c54d" },
              { label: "Sessões", value: sessions.length.toString(), sub: "registradas", color: "#59bfff" },
              { label: "Sequência", value: `${streakDays}d`, sub: "dias seguidos", color: "#32d98b" },
            ].map((s, i) => (
              <div key={i} className="rounded-2xl p-5 text-center" style={{ background: "rgba(16,22,33,0.85)", border: `1px solid ${s.color}20` }}>
                <div className="font-black text-3xl mb-1" style={{ fontFamily: "Impact, Arial Black, sans-serif", color: s.color }}>{s.value}</div>
                <div className="text-sm font-bold text-white">{s.label}</div>
                <div className="text-xs mt-0.5" style={{ color: "#aab5c4" }}>{s.sub}</div>
              </div>
            ))}
          </div>
        </ScrollReveal>

        {/* XP Bar */}
        <ScrollReveal animation="fadeUp" delay={150}>
          <div className="rounded-2xl p-5" style={{ background: "rgba(16,22,33,0.85)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="flex justify-between items-center mb-2 text-xs">
              <span style={{ color: "#aab5c4" }}>Progresso Nível {level} → {level + 1}</span>
              <span style={{ color: rank.color }}>{currentXP} / {nextLevelXP} XP</span>
            </div>
            <div className="h-3 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
              <div
                className="h-full rounded-full xp-bar-fill"
                style={{ width: `${(currentXP / nextLevelXP) * 100}%`, background: `linear-gradient(90deg, ${rank.color}, #f8c54d)`, transition: "width 1s ease" }}
              />
            </div>
          </div>
        </ScrollReveal>

        {/* Charts Row */}
        {sessions.length > 0 && (
          <div className="grid lg:grid-cols-2 gap-6">
            <ScrollReveal animation="fadeLeft" delay={0}>
              <div className="rounded-3xl p-6" style={{ background: "rgba(16,22,33,0.85)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="text-sm font-bold mb-1" style={{ color: "#f8c54d", textTransform: "uppercase", letterSpacing: "0.08em" }}>Curva de XP</div>
                <div className="text-xs mb-4" style={{ color: "#aab5c4" }}>Acumulado por sessão</div>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={xpChartData}>
                    <defs>
                      <linearGradient id="xpGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f8c54d" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#f8c54d" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="sessao" stroke="#aab5c4" tick={{ fontSize: 10 }} />
                    <YAxis stroke="#aab5c4" tick={{ fontSize: 10 }} />
                    <Tooltip
                      contentStyle={{ background: "rgba(10,14,22,0.95)", border: "1px solid rgba(248,197,77,0.2)", borderRadius: "10px", color: "#fff", fontSize: "12px" }}
                    />
                    <Area type="monotone" dataKey="xp" stroke="#f8c54d" fill="url(#xpGrad)" strokeWidth={2} dot={{ fill: "#f8c54d", r: 3 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fadeRight" delay={0}>
              <div className="rounded-3xl p-6 flex flex-col items-center" style={{ background: "rgba(16,22,33,0.85)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="self-start">
                  <div className="text-sm font-bold mb-1" style={{ color: "#d50f32", textTransform: "uppercase", letterSpacing: "0.08em" }}>Perfil Técnico</div>
                  <div className="text-xs mb-4" style={{ color: "#aab5c4" }}>Média das últimas 5 sessões</div>
                </div>
                <RadarChart axes={radarAxes} size={260} fillColor="rgba(213,15,50,0.2)" strokeColor="#d50f32" />
              </div>
            </ScrollReveal>
          </div>
        )}

        {/* Metric Trend Charts */}
        {sessions.length >= 3 && (
          <ScrollReveal animation="fadeUp" delay={100}>
            <div className="rounded-3xl p-6" style={{ background: "rgba(16,22,33,0.85)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="text-sm font-bold mb-1" style={{ color: "#59bfff", textTransform: "uppercase", letterSpacing: "0.08em" }}>Evolução das Métricas</div>
              <div className="text-xs mb-4" style={{ color: "#aab5c4" }}>Técnica, Velocidade e Consistência por sessão</div>
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={xpChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="sessao" stroke="#aab5c4" tick={{ fontSize: 10 }} />
                  <YAxis domain={[0, 10]} stroke="#aab5c4" tick={{ fontSize: 10 }} />
                  <Tooltip contentStyle={{ background: "rgba(10,14,22,0.95)", border: "1px solid rgba(89,191,255,0.2)", borderRadius: "10px", color: "#fff", fontSize: "12px" }} />
                  <Line type="monotone" dataKey="tecnica" stroke="#59bfff" strokeWidth={2} dot={false} name="Técnica" />
                  <Line type="monotone" dataKey="velocidade" stroke="#32d98b" strokeWidth={2} dot={false} name="Velocidade" />
                  <Line type="monotone" dataKey="consistencia" stroke="#f8c54d" strokeWidth={2} dot={false} name="Consistência" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </ScrollReveal>
        )}

        {/* Tabs */}
        <ScrollReveal animation="fadeUp" delay={80}>
          <div className="flex gap-2 mb-6">
            {(["registrar", "analise", "historico"] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="px-5 py-2.5 rounded-xl text-sm font-bold transition-all capitalize"
                style={{
                  background: activeTab === tab ? "#d50f32" : "rgba(255,255,255,0.05)",
                  color: activeTab === tab ? "#fff" : "#aab5c4",
                  border: `1px solid ${activeTab === tab ? "#d50f32" : "rgba(255,255,255,0.08)"}`,
                }}
              >
                {tab === "registrar" ? "Registrar Treino" : tab === "analise" ? "Análise K.O.D.E." : "Histórico"}
              </button>
            ))}
          </div>
        </ScrollReveal>

        {/* REGISTRAR TAB */}
        {activeTab === "registrar" && (
          <ScrollReveal animation="fadeUp" delay={0}>
            <div className="rounded-3xl p-6" style={{ background: "rgba(16,22,33,0.9)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <div className="text-sm font-bold mb-1" style={{ color: "#32d98b", textTransform: "uppercase", letterSpacing: "0.08em" }}>Registrar Treino</div>
              <p className="text-xs mb-6" style={{ color: "#aab5c4" }}>
                Complete os campos após a sessão. O sistema avalia suas métricas e entrega uma análise personalizada do Kode.
              </p>

              <div className="mb-5">
                <label className="block text-xs font-bold mb-2" style={{ color: "#aab5c4" }}>Módulo Treinado</label>
                <div className="flex flex-wrap gap-2">
                  {MODULOS.map(m => (
                    <button
                      key={m}
                      onClick={() => setForm(f => ({ ...f, modulo: m }))}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold transition-all"
                      style={{
                        background: form.modulo === m ? "rgba(213,15,50,0.2)" : "rgba(255,255,255,0.04)",
                        border: `1px solid ${form.modulo === m ? "rgba(213,15,50,0.5)" : "rgba(255,255,255,0.08)"}`,
                        color: form.modulo === m ? "#ff355a" : "#aab5c4",
                      }}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
                {METRICS.filter(m => m.key !== "dor" && m.key !== "rounds").map(metric => (
                  <div key={metric.key}>
                    <label className="block text-xs font-bold mb-1.5" style={{ color: "#aab5c4" }}>
                      {metric.label} <span style={{ color: metric.color }}>{(form as any)[metric.key]}/10</span>
                    </label>
                    <p className="text-xs mb-2" style={{ color: "#6b7a8d" }}>{metric.desc}</p>
                    <input
                      type="range"
                      min={0}
                      max={10}
                      step={1}
                      value={(form as any)[metric.key]}
                      onChange={e => setForm(f => ({ ...f, [metric.key]: Number(e.target.value) }))}
                      className="w-full"
                      style={{ accentColor: metric.color }}
                    />
                    <div className="flex justify-between text-xs mt-1" style={{ color: "#6b7a8d" }}>
                      <span>0</span><span>10</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4 mb-5">
                <div>
                  <label className="block text-xs font-bold mb-1.5" style={{ color: "#aab5c4" }}>
                    Dor/Fadiga <span style={{ color: "#c0392b" }}>{form.dor}/10</span>
                  </label>
                  <p className="text-xs mb-2" style={{ color: "#6b7a8d" }}>Dor ou cansaço muscular sentido</p>
                  <input
                    type="range" min={0} max={10} step={1} value={form.dor}
                    onChange={e => setForm(f => ({ ...f, dor: Number(e.target.value) }))}
                    className="w-full" style={{ accentColor: "#c0392b" }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1.5" style={{ color: "#aab5c4" }}>
                    Rounds <span style={{ color: "#aab5c4" }}>{form.rounds}</span>
                  </label>
                  <p className="text-xs mb-2" style={{ color: "#6b7a8d" }}>Rounds ou séries completados</p>
                  <input
                    type="number" min={1} max={20} value={form.rounds}
                    onChange={e => setForm(f => ({ ...f, rounds: Number(e.target.value) }))}
                    className="w-full px-3 py-2 rounded-xl text-sm outline-none"
                    style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }}
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-xs font-bold mb-1.5" style={{ color: "#aab5c4" }}>
                  Anotações (opcional)
                </label>
                <textarea
                  value={form.anotacao}
                  onChange={e => setForm(f => ({ ...f, anotacao: e.target.value }))}
                  placeholder="Ex.: minha guarda caiu no round 3... velocidade melhorou... dificuldade com o low kick..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }}
                />
              </div>

              <div className="flex flex-wrap gap-3 items-center">
                <button
                  onClick={handleSave}
                  className="btn-red px-7 py-3 rounded-2xl font-bold text-base flex items-center gap-2"
                >
                  <span>💾</span>
                  <span>Salvar e Analisar</span>
                </button>
                <button
                  onClick={handleClear}
                  className="px-5 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 transition-all"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#aab5c4" }}
                >
                  <span>🔄</span>
                  <span>Zerar progresso</span>
                </button>
                {saved && (
                  <div className="text-sm font-bold flex items-center gap-2" style={{ color: "#32d98b" }}>
                    <span>✓</span> Sessão registrada!
                  </div>
                )}
              </div>

              {/* XP Preview */}
              <div className="mt-5 p-4 rounded-xl" style={{ background: "rgba(248,197,77,0.06)", border: "1px solid rgba(248,197,77,0.15)" }}>
                <div className="text-xs" style={{ color: "#aab5c4" }}>XP estimado desta sessão:</div>
                <div className="text-2xl font-black mt-1" style={{ color: "#f8c54d", fontFamily: "Impact, Arial Black, sans-serif" }}>
                  +{calcXP(form)} XP
                </div>
              </div>
            </div>
          </ScrollReveal>
        )}

        {/* ANÁLISE TAB */}
        {activeTab === "analise" && (
          <ScrollReveal animation="fadeUp" delay={0}>
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="rounded-3xl p-6" style={{ background: "rgba(16,22,33,0.9)", border: "1px solid rgba(213,15,50,0.2)" }}>
                <div className="text-sm font-bold mb-4" style={{ color: "#d50f32", textTransform: "uppercase", letterSpacing: "0.08em" }}>Análise K.O.D.E.</div>
                {showAnalise ? (
                  <div className="text-sm leading-relaxed" style={{ color: "#d9e2ee" }}>
                    {renderContent(showAnalise)}
                  </div>
                ) : sessions.length > 0 ? (
                  <div className="text-sm leading-relaxed" style={{ color: "#d9e2ee" }}>
                    {renderContent(sessions[sessions.length - 1].kodeAnalise)}
                  </div>
                ) : (
                  <div className="text-sm" style={{ color: "#aab5c4" }}>
                    Complete um treino ou registre métricas para o K.O.D.E. analisar.
                    <br /><br />
                    A análise avalia suas 8 dimensões e entrega feedback personalizado sobre fraquezas, forças e o que priorizar na próxima sessão.
                  </div>
                )}
              </div>

              <div className="rounded-3xl p-6" style={{ background: "rgba(16,22,33,0.9)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="text-sm font-bold mb-4" style={{ color: "#59bfff", textTransform: "uppercase", letterSpacing: "0.08em" }}>8 Dimensões do Lutador</div>
                <div className="space-y-3">
                  {METRICS.map(m => {
                    const val = sessions.length > 0
                      ? Math.round(sessions.slice(-5).reduce((s, e) => s + Number((e as any)[m.key]), 0) / Math.min(sessions.length, 5) * 10) / 10
                      : 0;
                    return (
                      <div key={m.key}>
                        <div className="flex justify-between text-xs mb-1">
                          <span style={{ color: "#d9e2ee" }}>{m.label}</span>
                          <span style={{ color: m.color }}>{val}/10</span>
                        </div>
                        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                          <div className="h-full rounded-full" style={{ width: `${(val / 10) * 100}%`, background: m.color, transition: "width 1s ease" }} />
                        </div>
                        <div className="text-xs mt-0.5" style={{ color: "#6b7a8d" }}>{m.desc}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </ScrollReveal>
        )}

        {/* HISTÓRICO TAB */}
        {activeTab === "historico" && (
          <ScrollReveal animation="fadeUp" delay={0}>
            <div className="rounded-3xl p-6" style={{ background: "rgba(16,22,33,0.9)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="text-sm font-bold mb-4" style={{ color: "#f8c54d", textTransform: "uppercase", letterSpacing: "0.08em" }}>Histórico Recente</div>
              {sessions.length === 0 ? (
                <div className="text-sm py-8 text-center" style={{ color: "#aab5c4" }}>
                  Nenhum registro ainda.<br />
                  <span style={{ color: "#d50f32" }}>Registre sua primeira sessão</span> para começar a rastrear sua evolução.
                </div>
              ) : (
                <div className="space-y-3">
                  {[...sessions].reverse().slice(0, 10).map((s) => (
                    <div
                      key={s.id}
                      className="p-4 rounded-2xl"
                      style={{ background: "rgba(6,8,13,0.7)", border: "1px solid rgba(255,255,255,0.06)" }}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-bold" style={{ color: "#fff" }}>{s.modulo}</span>
                            <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(248,197,77,0.15)", color: "#f8c54d" }}>+{s.xpGanho} XP</span>
                          </div>
                          <div className="text-xs" style={{ color: "#6b7a8d" }}>
                            {new Date(s.date).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                          </div>
                          {s.anotacao && (
                            <div className="text-xs mt-1 italic" style={{ color: "#aab5c4" }}>"{s.anotacao}"</div>
                          )}
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-center flex-shrink-0">
                          {[
                            { label: "Tec", val: s.tecnica, color: "#59bfff" },
                            { label: "Vel", val: s.velocidade, color: "#32d98b" },
                            { label: "Con", val: s.consistencia, color: "#f8c54d" },
                          ].map(m => (
                            <div key={m.label}>
                              <div className="text-xs font-bold" style={{ color: m.color }}>{m.val}</div>
                              <div className="text-xs" style={{ color: "#6b7a8d" }}>{m.label}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </ScrollReveal>
        )}
      </div>
    </div>
  );
}
