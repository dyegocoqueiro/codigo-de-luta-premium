import { useRef, useEffect, useState } from "react";
import { Link } from "wouter";
import logoImg from "@assets/codigo-luta-logo_1782758047742.png";
import muayThaiImg from "@assets/muay-thai-legend-bg_1782758047742.png";
import heroLutadoresImg from "@assets/codigo-luta-hero-lutadores_1782758047742.png";
import heroVideo from "@assets/codigo-luta-hero-lutadores_1782758047742.mp4";
import kodeAvatar from "@assets/kode-avatar_1782758047742.png";
import { TRAINING_MODULES, type TrainingVideo } from "../data/modules";
import { COMBOS } from "../data/combos";
import KodeChat from "../components/KodeChat";
import ProgressPanel from "../components/ProgressPanel";
import ScrollReveal from "../components/ScrollReveal";
import YouTubeModal from "../components/YouTubeModal";
import { useMultiReveal } from "../hooks/useScrollReveal";

const WEEK_SCHEDULE = [
  { week: 1, title: "Fundação 1", subtitle: "Postura e movimentos limpos", desc: "Estabelece a base: guarda, footwork, jab, direto. Diagnóstico inicial.", modules: ["Boxe"] },
  { week: 2, title: "Fundação 2", subtitle: "Defesa, esquiva e equilíbrio", desc: "Slip, bob & weave, teep, low kick. Defesa integrada ao ataque.", modules: ["Boxe", "Muay Thai"] },
  { week: 3, title: "Volume 1", subtitle: "Mais rounds e combinações", desc: "Aumenta volume de rounds. Introduz Kickboxing e Sanda.", modules: ["Kickboxing", "Sanda"] },
  { week: 4, title: "Volume 2", subtitle: "Reflexo e ritmo", desc: "Drills de reflexo, timing e variação de velocidade nos combos.", modules: ["Sanda", "Boxe"] },
  { week: 5, title: "Integração 1", subtitle: "Transições fortes", desc: "Introduz Wrestling/Sambo. Sprawl, level change, clinch.", modules: ["Sambo", "MMA"] },
  { week: 6, title: "Integração 2", subtitle: "Pressão controlada", desc: "BJJ Solo + integração completa. Ground & pound simulado.", modules: ["BJJ", "MMA"] },
  { week: 7, title: "Pico Técnico 1", subtitle: "Testes parciais", desc: "Avaliação técnica de cada módulo. Krav Maga Responsável.", modules: ["Krav Maga", "MMA"] },
  { week: 8, title: "Pico Técnico 2", subtitle: "Avaliação final", desc: "Shadow MMA completo. Avaliação final. Planejamento do próximo ciclo.", modules: ["MMA"] },
];

function ModuleCard({ mod, index, onVideoClick }: {
  mod: typeof TRAINING_MODULES[0];
  index: number;
  onVideoClick: (id: string, title: string, videos?: TrainingVideo[]) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const videos = mod.youtubeVideos?.length ? mod.youtubeVideos : [{ id: mod.youtubeId, title: mod.youtubeTitle }];
  const primaryVideo = videos[0];

  return (
    <ScrollReveal animation="fadeUp" delay={index * 80} duration={700}>
      <div
        className="module-card rounded-3xl overflow-hidden cursor-default"
        style={{ background: "rgba(16,22,33,0.85)", border: `1px solid ${mod.color}28`, height: "100%" }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        data-testid={`module-card-${mod.id}`}
      >
        {/* YouTube Thumbnail */}
        <div
          className="relative overflow-hidden cursor-pointer group"
          style={{ height: "140px" }}
          onClick={() => onVideoClick(primaryVideo.id, primaryVideo.title, videos)}
        >
          <img
            src={`https://img.youtube.com/vi/${primaryVideo.id}/hqdefault.jpg`}
            alt={primaryVideo.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            style={{ filter: "brightness(0.55) saturate(1.1)" }}
            onError={(e) => {
              (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${primaryVideo.id}/mqdefault.jpg`;
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center" style={{ background: `radial-gradient(circle, ${mod.color}30, transparent 60%)` }}>
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110"
              style={{ background: "rgba(0,0,0,0.7)", border: `2px solid ${mod.color}`, backdropFilter: "blur(4px)" }}
            >
              <svg className="w-5 h-5 ml-0.5" fill={mod.color} viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
          <div className="absolute bottom-2 left-2 right-2">
            <div className="text-xs text-white/80 truncate" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.9)" }}>
              {primaryVideo.title}
            </div>
          </div>
          <div
            className="absolute top-2 right-2 text-xs px-2 py-0.5 rounded-full font-bold"
            style={{ background: "rgba(0,0,0,0.7)", color: mod.color, border: `1px solid ${mod.color}40` }}
          >
            ▶ Ver vídeo
          </div>
        </div>

        <div className="p-5">
          <div className="flex items-start justify-between mb-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
              style={{ background: `${mod.color}18`, border: `1px solid ${mod.color}30` }}
            >
              {mod.icon}
            </div>
            <div className="text-xs rounded-full px-2.5 py-1" style={{ background: `${mod.color}15`, color: mod.color, border: `1px solid ${mod.color}25` }}>
              Módulo {index + 1}
            </div>
          </div>

          <h3 className="font-black text-lg text-white mb-1" style={{ fontFamily: "Impact, Arial Black, sans-serif", letterSpacing: "0.03em" }}>{mod.name}</h3>
          <div className="text-xs mb-3" style={{ color: mod.color }}>{mod.subtitle}</div>
          <p className="text-xs leading-relaxed mb-4" style={{ color: "#8899aa" }}>{mod.description}</p>

          <div className="text-xs mb-2" style={{ color: "#aab5c4" }}>Drills principais:</div>
          <div className="space-y-1.5">
            {mod.drills.slice(0, 2).map(d => (
              <div key={d} className="flex items-start gap-2 text-xs" style={{ color: "#8899aa" }}>
                <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1" style={{ background: mod.color }} />
                {d}
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 flex items-center justify-between" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="text-xs" style={{ color: "#aab5c4" }}>{mod.weeks}</div>
            <button
              onClick={() => onVideoClick(primaryVideo.id, primaryVideo.title, videos)}
              className="text-xs px-3 py-1 rounded-full transition-all hover:opacity-80"
              style={{ background: `${mod.color}18`, color: mod.color, border: `1px solid ${mod.color}25` }}
            >
              ▶ Assistir
            </button>
          </div>
        </div>
      </div>
    </ScrollReveal>
  );
}

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentWeek] = useState(2);
  const [ytModal, setYtModal] = useState<{ id: string; title: string; videos?: TrainingVideo[] } | null>(null);
  const { containerRef: statsContainer, visibleCount: statsVisible } = useMultiReveal(4, 100);
  const { containerRef: weekContainer, visibleCount: weekVisible } = useMultiReveal(8, 80);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const openVideo = (id: string, title: string, videos?: TrainingVideo[]) => setYtModal({ id, title, videos });
  const closeVideo = () => setYtModal(null);

  return (
    <div className="min-h-screen" style={{ background: "#07080b" }}>

      {ytModal && (
        <YouTubeModal videoId={ytModal.id} title={ytModal.title} videos={ytModal.videos} onClose={closeVideo} />
      )}

      {/* ===== HERO ===== */}
      <section id="inicio" className="relative min-h-screen flex items-center overflow-hidden" style={{ minHeight: "100svh" }}>
        <video
          ref={videoRef}
          src={heroVideo}
          autoPlay muted loop playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: 0.35, objectPosition: "center 20%", filter: "saturate(1.1) contrast(1.1) brightness(0.6)" }}
        />
        <div className="absolute inset-0" style={{
          background: "linear-gradient(90deg, rgba(7,8,11,0.95) 0%, rgba(30,5,12,0.75) 50%, rgba(7,8,11,0.6) 100%), radial-gradient(circle at 20% 50%, rgba(213,15,50,0.2), transparent 50%)"
        }} />

        <div className="absolute right-0 top-0 bottom-0 w-1/2 pointer-events-none overflow-hidden">
          <img
            src={muayThaiImg}
            alt=""
            className="absolute right-0 bottom-0 h-full object-contain object-right animate-float-fighter"
            style={{ opacity: 0.22, filter: "saturate(1.3) contrast(1.1)", mixBlendMode: "screen" }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-3 mb-6" style={{ opacity: 0, animation: "reveal-up 0.9s ease 0.3s forwards" }}>
                <img src={logoImg} alt="Logo" className="w-10 h-10 object-contain" />
                <div className="h-px flex-1" style={{ background: "linear-gradient(90deg, rgba(213,15,50,0.6), transparent)" }} />
                <span className="text-xs tracking-widest uppercase" style={{ color: "#aab5c4" }}>Sistema Híbrido Solo</span>
              </div>

              <h1
                className="font-black leading-none mb-6"
                style={{
                  fontFamily: "Impact, Arial Black, sans-serif",
                  fontSize: "clamp(3.5rem, 8vw, 6.5rem)",
                  lineHeight: 0.88,
                  opacity: 0,
                  animation: "reveal-up 1s ease 0.5s forwards",
                }}
              >
                <span className="hero-title">CÓDIGO</span>
                <br />
                <span style={{ color: "#d50f32", textShadow: "0 0 60px rgba(213,15,50,0.5)" }}>DE</span>
                <br />
                <span className="hero-title">LUTA</span>
              </h1>

              <p
                className="text-lg mb-8 leading-relaxed"
                style={{ color: "#d9e2ee", maxWidth: "520px", opacity: 0, animation: "reveal-up 0.9s ease 0.7s forwards" }}
              >
                O sistema híbrido solo mais completo do Brasil. Boxe, Muay Thai, Kickboxing, Sanda, BJJ, Sambo, Krav Maga e MMA — sem parceiro, sem academia, sem desculpa.
              </p>

              <div className="flex flex-wrap gap-3" style={{ opacity: 0, animation: "reveal-up 0.9s ease 0.9s forwards" }}>
                <button onClick={() => scrollTo("programa")} className="btn-red px-7 py-3.5 rounded-2xl font-bold text-base">
                  Começar Agora
                </button>
                <Link href="/combos">
                  <button className="btn-outline px-7 py-3.5 rounded-2xl font-bold text-base">Ver Combos</button>
                </Link>
                <Link href="/evolucao">
                  <button
                    className="px-7 py-3.5 rounded-2xl font-bold text-base transition-all hover:scale-105"
                    style={{ background: "rgba(50,217,139,0.12)", border: "1px solid rgba(50,217,139,0.3)", color: "#32d98b" }}
                  >
                    Evolução
                  </button>
                </Link>
              </div>
            </div>

            <div className="hidden lg:block relative" style={{ opacity: 0, animation: "reveal-up 1s ease 1s forwards" }}>
              <div className="relative rounded-3xl overflow-hidden" style={{ background: "rgba(16,22,33,0.7)", border: "1px solid rgba(213,15,50,0.2)", backdropFilter: "blur(10px)" }}>
                <div className="absolute top-0 left-0 right-0 h-1" style={{ background: "linear-gradient(90deg, #d50f32, #f8c54d, #d50f32)" }} />
                <div className="p-6">
                  <div className="text-xs tracking-widest uppercase mb-4" style={{ color: "#d50f32" }}>Painel do Lutador</div>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: "Semana Atual", value: "2 / 8", sub: "Fundação 2", color: "#f8c54d" },
                      { label: "XP Total", value: "350", sub: "+75 hoje", color: "#32d98b" },
                      { label: "Módulos", value: "8", sub: "artes marciais", color: "#59bfff" },
                      { label: "Combos", value: "30+", sub: "sequências", color: "#ff355a" },
                    ].map(stat => (
                      <div key={stat.label} className="rounded-2xl p-4" style={{ background: "rgba(6,8,13,0.6)", border: "1px solid rgba(255,255,255,0.06)" }}>
                        <div className="text-xs mb-1" style={{ color: "#aab5c4" }}>{stat.label}</div>
                        <div className="text-2xl font-black" style={{ color: stat.color, fontFamily: "Impact, Arial Black, sans-serif" }}>{stat.value}</div>
                        <div className="text-xs" style={{ color: "#aab5c4" }}>{stat.sub}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16 flex justify-center" style={{ opacity: 0, animation: "reveal-up 0.9s ease 1.2s forwards" }}>
            <button onClick={() => scrollTo("sistema")} className="scroll-indicator flex flex-col items-center gap-2 text-xs tracking-widest uppercase" style={{ color: "#aab5c4", background: "none", border: "none", cursor: "pointer" }}>
              <span>Descubra</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>

        <div className="light-streak top-1/3" style={{ animationDelay: "0s" }} />
        <div className="light-streak top-2/3" style={{ animationDelay: "1.5s" }} />
      </section>

      {/* ===== SISTEMA ===== */}
      <section id="sistema" className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 cl-grid-bg opacity-40" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(213,15,50,0.06), transparent 70%)" }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal animation="fadeUp">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-3 mb-4">
                <div className="h-px w-12" style={{ background: "rgba(213,15,50,0.5)" }} />
                <span className="text-xs tracking-widest uppercase" style={{ color: "#d50f32" }}>O Programa</span>
                <div className="h-px w-12" style={{ background: "rgba(213,15,50,0.5)" }} />
              </div>
              <h2 className="font-black mb-4" style={{ fontFamily: "Impact, Arial Black, sans-serif", fontSize: "clamp(2.5rem, 5vw, 4rem)", color: "#fff" }}>
                O QUE É O<br /><span style={{ color: "#d50f32" }}>CÓDIGO DE LUTA</span>
              </h2>
              <p className="text-lg max-w-2xl mx-auto" style={{ color: "#aab5c4", lineHeight: 1.7 }}>
                Um sistema de 8 semanas que integra 7 artes marciais em treinos 100% solo. Sem parceiro obrigatório. Com autocorreção por vídeo, IA de treino e biblioteca de 30+ combos.
              </p>
            </div>
          </ScrollReveal>

          <div ref={statsContainer} className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {[
              { value: "8", label: "Semanas", sub: "de programa estruturado", color: "#d50f32" },
              { value: "7", label: "Artes Marciais", sub: "integradas ao sistema", color: "#f8c54d" },
              { value: "30+", label: "Combos", sub: "na biblioteca completa", color: "#32d98b" },
              { value: "100%", label: "Solo", sub: "sem parceiro obrigatório", color: "#59bfff" },
            ].map((stat, i) => (
              <div
                key={stat.label}
                className="text-center p-6 rounded-3xl transition-all duration-700"
                style={{
                  background: "rgba(16,22,33,0.7)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  opacity: statsVisible > i ? 1 : 0,
                  transform: statsVisible > i ? "translateY(0) scale(1)" : "translateY(30px) scale(0.95)",
                }}
              >
                <div className="font-black mb-1" style={{ fontFamily: "Impact, Arial Black, sans-serif", fontSize: "3.5rem", color: stat.color, textShadow: `0 0 30px ${stat.color}60`, lineHeight: 1 }}>
                  {stat.value}
                </div>
                <div className="font-bold text-white text-sm">{stat.label}</div>
                <div className="text-xs mt-1" style={{ color: "#aab5c4" }}>{stat.sub}</div>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: "🎯", title: "Autocorreção por Vídeo", desc: "Grave-se treinando. Compare com as referências. Corrija sozinho. Seu smartphone vira seu coach." },
              { icon: "🧠", title: "IA de Treino — Kode", desc: "Coach artificial com conhecimento profundo de combate. Responde qualquer dúvida técnica em português." },
              { icon: "📊", title: "Sistema de Evolução", desc: "8 métricas de desempenho, radar chart de habilidades, XP e ranking gamificado." },
            ].map((feat, i) => (
              <ScrollReveal key={feat.title} animation="fadeUp" delay={i * 100}>
                <div
                  className="p-6 rounded-3xl group hover:scale-105 transition-all duration-300"
                  style={{ background: "rgba(16,22,33,0.7)", border: "1px solid rgba(255,255,255,0.06)" }}
                >
                  <div className="text-3xl mb-4">{feat.icon}</div>
                  <h3 className="font-bold text-white text-lg mb-2">{feat.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "#aab5c4" }}>{feat.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <div className="cl-separator" />

      {/* ===== MÓDULOS com VÍDEOS ===== */}
      <section id="modulos" className="py-24 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-96 pointer-events-none" style={{ background: "radial-gradient(circle at right, rgba(213,15,50,0.06), transparent 70%)" }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal animation="fadeUp">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-3 mb-4">
                <div className="h-px w-12" style={{ background: "rgba(248,197,77,0.5)" }} />
                <span className="text-xs tracking-widest uppercase" style={{ color: "#f8c54d" }}>8 Módulos</span>
                <div className="h-px w-12" style={{ background: "rgba(248,197,77,0.5)" }} />
              </div>
              <h2 className="font-black mb-4" style={{ fontFamily: "Impact, Arial Black, sans-serif", fontSize: "clamp(2.5rem, 5vw, 4rem)", color: "#fff" }}>
                SISTEMA<br /><span style={{ color: "#f8c54d" }}>HÍBRIDO COMPLETO</span>
              </h2>
              <p className="text-base max-w-xl mx-auto" style={{ color: "#aab5c4" }}>
                Cada módulo tem um vídeo de referência clicável. Assista, treine, evolua.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {TRAINING_MODULES.map((mod, i) => (
              <ModuleCard key={mod.id} mod={mod} index={i} onVideoClick={openVideo} />
            ))}
          </div>
        </div>
      </section>

      <div className="cl-separator" />

      {/* ===== EVOLUÇÃO ===== */}
      <section id="evolucao" className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 cl-grid-bg opacity-30" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <ScrollReveal animation="fadeUp">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-3 mb-4">
                <div className="h-px w-12" style={{ background: "rgba(50,217,139,0.5)" }} />
                <span className="text-xs tracking-widest uppercase" style={{ color: "#32d98b" }}>Gamificação</span>
                <div className="h-px w-12" style={{ background: "rgba(50,217,139,0.5)" }} />
              </div>
              <h2 className="font-black mb-4" style={{ fontFamily: "Impact, Arial Black, sans-serif", fontSize: "clamp(2.5rem, 5vw, 4rem)", color: "#fff" }}>
                EVOLUÇÃO<br /><span style={{ color: "#32d98b" }}>DO LUTADOR</span>
              </h2>
              <p className="text-base max-w-xl mx-auto" style={{ color: "#aab5c4" }}>
                8 métricas reais de desempenho. Radar de habilidades. Análise profunda do Kode. Como um RPG de combate, mas com resultados reais.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-8 items-start mb-12">
            <ScrollReveal animation="fadeLeft">
              <div className="rounded-3xl p-8" style={{ background: "rgba(16,22,33,0.85)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <div className="text-sm font-bold mb-6" style={{ color: "#32d98b", textTransform: "uppercase", letterSpacing: "0.1em" }}>Seu Progresso</div>
                <ProgressPanel />
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fadeRight">
              <div className="space-y-4">
                <div className="text-sm font-bold mb-4" style={{ color: "#f8c54d", textTransform: "uppercase", letterSpacing: "0.1em" }}>Tabela de Rankings</div>
                {[
                  { name: "Iniciante", lvl: "1–5", color: "#aab5c4", desc: "Aprende fundamentos básicos de cada arte" },
                  { name: "Guerreiro", lvl: "6–10", color: "#59bfff", desc: "Domina os combos base de todos os módulos" },
                  { name: "Lutador", lvl: "11–20", color: "#32d98b", desc: "Integra os módulos com fluidez crescente" },
                  { name: "Veterano", lvl: "21–30", color: "#f8c54d", desc: "Executa combos avançados com qualidade" },
                  { name: "Mestre", lvl: "31–40", color: "#d50f32", desc: "Shadow MMA completo e técnica afiada" },
                  { name: "Lenda", lvl: "41–50", color: "#ff355a", desc: "Domínio completo do sistema híbrido" },
                ].map((rank, i) => (
                  <ScrollReveal key={rank.name} animation="fadeRight" delay={i * 60}>
                    <div
                      className="flex items-center gap-4 p-4 rounded-2xl transition-all hover:scale-101"
                      style={{ background: "rgba(16,22,33,0.7)", border: `1px solid ${rank.color}20` }}
                    >
                      <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: rank.color, boxShadow: `0 0 10px ${rank.color}80` }} />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm" style={{ color: rank.color }}>{rank.name}</span>
                          <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: `${rank.color}15`, color: rank.color }}>Nível {rank.lvl}</span>
                        </div>
                        <div className="text-xs mt-0.5" style={{ color: "#aab5c4" }}>{rank.desc}</div>
                      </div>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </ScrollReveal>
          </div>

          {/* 8 Métricas */}
          <ScrollReveal animation="fadeUp" delay={100}>
            <div className="rounded-3xl p-8" style={{ background: "rgba(16,22,33,0.85)", border: "1px solid rgba(50,217,139,0.15)" }}>
              <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                <div>
                  <div className="text-sm font-bold mb-1" style={{ color: "#32d98b", textTransform: "uppercase", letterSpacing: "0.08em" }}>8 Dimensões do Lutador</div>
                  <div className="text-xs" style={{ color: "#aab5c4" }}>Registre cada treino e veja seu perfil evoluir</div>
                </div>
                <Link href="/evolucao">
                  <button className="btn-red px-5 py-2.5 rounded-xl font-bold text-sm">
                    Acessar Sistema Completo →
                  </button>
                </Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { icon: "⚡", label: "Energia", desc: "Disposição física", color: "#f8c54d" },
                  { icon: "🎯", label: "Técnica", desc: "Precisão dos movimentos", color: "#59bfff" },
                  { icon: "💨", label: "Velocidade", desc: "Explosividade dos golpes", color: "#32d98b" },
                  { icon: "🔥", label: "Potência", desc: "Força e impacto", color: "#ff355a" },
                  { icon: "🧠", label: "Foco Mental", desc: "Concentração no treino", color: "#9b59b6" },
                  { icon: "📈", label: "Consistência", desc: "Técnica sob cansaço", color: "#e67e22" },
                  { icon: "💪", label: "Rounds", desc: "Volume de treino", color: "#aab5c4" },
                  { icon: "🩹", label: "Dor/Fadiga", desc: "Monitoramento do corpo", color: "#c0392b" },
                ].map((m, i) => (
                  <div
                    key={m.label}
                    className="p-4 rounded-2xl text-center transition-all hover:scale-105"
                    style={{ background: "rgba(6,8,13,0.6)", border: `1px solid ${m.color}18` }}
                  >
                    <div className="text-2xl mb-2">{m.icon}</div>
                    <div className="text-sm font-bold mb-1" style={{ color: m.color }}>{m.label}</div>
                    <div className="text-xs" style={{ color: "#6b7a8d" }}>{m.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <div className="cl-separator" />

      {/* ===== COMBOS PREVIEW ===== */}
      <section id="combos-preview" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal animation="fadeUp">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
              <div>
                <div className="inline-flex items-center gap-3 mb-4">
                  <div className="h-px w-12" style={{ background: "rgba(255,53,90,0.5)" }} />
                  <span className="text-xs tracking-widest uppercase" style={{ color: "#ff355a" }}>Biblioteca</span>
                  <div className="h-px w-12" style={{ background: "rgba(255,53,90,0.5)" }} />
                </div>
                <h2 className="font-black" style={{ fontFamily: "Impact, Arial Black, sans-serif", fontSize: "clamp(2.5rem, 5vw, 4rem)", color: "#fff" }}>
                  30+ COMBOS<br /><span style={{ color: "#ff355a" }}>TÉCNICOS</span>
                </h2>
              </div>
              <Link href="/combos">
                <button className="btn-red px-6 py-3 rounded-2xl font-bold whitespace-nowrap">
                  Ver Todos os Combos
                </button>
              </Link>
            </div>
          </ScrollReveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {COMBOS.slice(0, 6).map((combo, i) => (
              <ScrollReveal key={combo.id} animation="fadeUp" delay={i * 80}>
                <div
                  className="combo-card rounded-2xl p-5"
                  style={{ background: "rgba(16,22,33,0.85)" }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="text-xs mb-1" style={{ color: "#aab5c4" }}>{combo.mix}</div>
                      <div className="font-bold text-white text-sm">{combo.title}</div>
                    </div>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{
                        background: combo.level === "Base" ? "rgba(50,217,139,0.15)" : combo.level === "Intermediário" ? "rgba(248,197,77,0.15)" : "rgba(213,15,50,0.15)",
                        color: combo.level === "Base" ? "#32d98b" : combo.level === "Intermediário" ? "#f8c54d" : "#d50f32",
                      }}
                    >
                      {combo.level}
                    </span>
                  </div>
                  <div className="text-xs font-mono py-2.5 px-3 rounded-xl mb-3 leading-relaxed" style={{ background: "rgba(0,0,0,0.4)", color: "#f8c54d", border: "1px solid rgba(248,197,77,0.1)" }}>
                    {combo.sequence}
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: "#8899aa" }}>{combo.objective}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <div className="cl-separator" />

      {/* ===== KODE AI ===== */}
      <section id="kode" className="py-24 relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: "radial-gradient(circle at 50% 50%, rgba(213,15,50,0.05), transparent 70%)" }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <ScrollReveal animation="fadeLeft">
              <div>
                <div className="inline-flex items-center gap-3 mb-6">
                  <div className="h-px w-12" style={{ background: "rgba(213,15,50,0.5)" }} />
                  <span className="text-xs tracking-widest uppercase" style={{ color: "#d50f32" }}>Inteligência Artificial</span>
                </div>
                <h2 className="font-black mb-6" style={{ fontFamily: "Impact, Arial Black, sans-serif", fontSize: "clamp(2.5rem, 5vw, 4rem)", color: "#fff", lineHeight: 0.9 }}>
                  KODE<br /><span style={{ color: "#d50f32" }}>SEU COACH</span><br />HÍBRIDO
                </h2>

                <div className="flex items-center gap-4 mb-6">
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full animate-orb" style={{ background: "rgba(213,15,50,0.3)", filter: "blur(10px)" }} />
                    <img src={kodeAvatar} alt="Kode AI" className="w-16 h-16 rounded-full object-cover relative z-10" style={{ border: "2px solid rgba(213,15,50,0.4)" }} />
                  </div>
                  <div>
                    <div className="font-bold text-white text-lg">KODE</div>
                    <div className="text-sm" style={{ color: "#32d98b" }}>Online — Pronto para treinar</div>
                  </div>
                </div>

                <div className="space-y-3">
                  {[
                    "Conhecimento profundo de Boxe, Muay Thai, BJJ, MMA e mais",
                    "Respostas em português sobre técnica, treino e condicionamento",
                    "Análise personalizada de cada sessão de treino",
                    "Orientação sobre o programa de 8 semanas",
                  ].map((item, i) => (
                    <ScrollReveal key={item} animation="fadeLeft" delay={i * 80}>
                      <div className="flex items-start gap-3 text-sm" style={{ color: "#aab5c4" }}>
                        <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5" style={{ background: "#d50f32" }} />
                        {item}
                      </div>
                    </ScrollReveal>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fadeRight">
              <div className="rounded-3xl overflow-hidden" style={{ background: "rgba(10,14,22,0.95)", border: "1px solid rgba(213,15,50,0.2)", backdropFilter: "blur(20px)" }}>
                <div className="flex items-center gap-3 px-5 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(213,15,50,0.06)" }}>
                  <img src={kodeAvatar} alt="Kode" className="w-7 h-7 rounded-full object-cover" />
                  <div>
                    <div className="text-sm font-bold text-white">Kode AI Coach</div>
                    <div className="text-xs" style={{ color: "#32d98b" }}>Sistema Código de Luta</div>
                  </div>
                  <div className="ml-auto w-2 h-2 rounded-full animate-orb" style={{ background: "#32d98b" }} />
                </div>
                <KodeChat />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <div className="cl-separator" />

      {/* ===== PROGRAMA ===== */}
      <section id="programa" className="py-24 relative">
        <div className="absolute inset-0 cl-grid-bg opacity-20" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <ScrollReveal animation="fadeUp">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-3 mb-4">
                <div className="h-px w-12" style={{ background: "rgba(89,191,255,0.5)" }} />
                <span className="text-xs tracking-widest uppercase" style={{ color: "#59bfff" }}>8 Semanas</span>
                <div className="h-px w-12" style={{ background: "rgba(89,191,255,0.5)" }} />
              </div>
              <h2 className="font-black mb-4" style={{ fontFamily: "Impact, Arial Black, sans-serif", fontSize: "clamp(2.5rem, 5vw, 4rem)", color: "#fff" }}>
                PROGRAMA<br /><span style={{ color: "#59bfff" }}>SEMANA A SEMANA</span>
              </h2>
            </div>
          </ScrollReveal>

          <div ref={weekContainer} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {WEEK_SCHEDULE.map((w, i) => (
              <div
                key={w.week}
                className="transition-all duration-700"
                style={{
                  opacity: weekVisible > i ? 1 : 0,
                  transform: weekVisible > i ? "translateY(0) scale(1)" : "translateY(40px) scale(0.95)",
                }}
              >
                <div
                  className={`rounded-2xl p-5 h-full ${w.week === currentWeek ? "scale-105" : ""}`}
                  style={{
                    background: w.week === currentWeek ? "rgba(213,15,50,0.12)" : "rgba(16,22,33,0.7)",
                    border: `1px solid ${w.week === currentWeek ? "rgba(213,15,50,0.4)" : "rgba(255,255,255,0.06)"}`,
                    boxShadow: w.week === currentWeek ? "0 0 30px rgba(213,15,50,0.15)" : "none",
                  }}
                >
                  {w.week === currentWeek && (
                    <div className="text-xs font-bold mb-3 flex items-center gap-2" style={{ color: "#d50f32" }}>
                      <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                      SEMANA ATUAL
                    </div>
                  )}
                  <div className="text-3xl font-black mb-1" style={{ fontFamily: "Impact, Arial Black, sans-serif", color: w.week === currentWeek ? "#d50f32" : "#aab5c4" }}>
                    {w.week.toString().padStart(2, "0")}
                  </div>
                  <div className="font-bold text-white text-sm mb-1">{w.title}</div>
                  <div className="text-xs mb-3" style={{ color: "#59bfff" }}>{w.subtitle}</div>
                  <p className="text-xs leading-relaxed mb-3" style={{ color: "#8899aa" }}>{w.desc}</p>
                  <div className="flex flex-wrap gap-1">
                    {w.modules.map(m => (
                      <span key={m} className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(255,255,255,0.06)", color: "#aab5c4" }}>{m}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="cl-separator" />

      {/* ===== MANUAL ===== */}
      <section id="manual" className="py-24 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ScrollReveal animation="scaleUp">
            <div className="rounded-3xl p-12 relative overflow-hidden" style={{ background: "linear-gradient(135deg, rgba(213,15,50,0.12), rgba(248,197,77,0.06))", border: "1px solid rgba(213,15,50,0.25)" }}>
              <div className="absolute inset-0 cl-grid-bg opacity-20" />
              <div className="relative">
                <div className="text-5xl mb-6">📋</div>
                <h2 className="font-black mb-4" style={{ fontFamily: "Impact, Arial Black, sans-serif", fontSize: "clamp(2rem, 4vw, 3rem)", color: "#fff" }}>
                  MANUAL HÍBRIDO SOLO<br /><span style={{ color: "#f8c54d" }}>V2 PROFISSIONAL</span>
                </h2>
                <p className="text-base mb-8 max-w-xl mx-auto" style={{ color: "#aab5c4", lineHeight: 1.7 }}>
                  O manual completo do sistema: 8 semanas detalhadas, cards técnicos, links de vídeo, QR codes e guia de equipamentos. 100% gratuito.
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <a
                    href={`${import.meta.env.BASE_URL}manual-codigo-de-luta.pdf`}
                    download="Manual_Codigo_de_Luta_V2.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-gold px-8 py-3.5 rounded-2xl font-bold text-base inline-block"
                  >
                    📄 Baixar Manual PDF
                  </a>
                  <button onClick={() => scrollTo("kode")} className="btn-outline px-8 py-3.5 rounded-2xl font-bold text-base">
                    Falar com Kode
                  </button>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="py-12 relative" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <img src={logoImg} alt="Logo" className="w-8 h-8 object-contain" />
              <div>
                <div className="font-black text-sm tracking-wider" style={{ fontFamily: "Impact, Arial Black, sans-serif", color: "#fff" }}>
                  CÓDIGO<span style={{ color: "#d50f32" }}>◆</span>LUTA
                </div>
                <div className="text-xs" style={{ color: "#aab5c4" }}>Sistema Híbrido Solo</div>
              </div>
            </div>
            <div className="flex items-center gap-6 text-xs" style={{ color: "#aab5c4" }}>
              <button onClick={() => scrollTo("sistema")} className="hover:text-white transition-colors" style={{ background: "none", border: "none", cursor: "pointer" }}>Sistema</button>
              <button onClick={() => scrollTo("modulos")} className="hover:text-white transition-colors" style={{ background: "none", border: "none", cursor: "pointer" }}>Módulos</button>
              <Link href="/evolucao" className="hover:text-white transition-colors">Evolução</Link>
              <Link href="/combos" className="hover:text-white transition-colors">Combos</Link>
              <button onClick={() => scrollTo("kode")} className="hover:text-white transition-colors" style={{ background: "none", border: "none", cursor: "pointer" }}>IA Kode</button>
            </div>
            <div className="text-xs" style={{ color: "#aab5c4" }}>Treino esportivo e defesa responsável</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
