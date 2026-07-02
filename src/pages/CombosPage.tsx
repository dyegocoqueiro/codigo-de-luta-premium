import { useState, useMemo } from "react";
import { Link } from "wouter";
import { COMBOS, CATEGORIES, LEVELS, MODULE_COLORS } from "../data/combos";
import logoImg from "@assets/codigo-luta-logo_1782758047742.png";
import { userScopedStorageKey } from "../lib/support";

const VISIBLE_STEP = 18;

export default function CombosPage() {
  const [category, setCategory] = useState("Todos");
  const [level, setLevel] = useState("Todos");
  const [search, setSearch] = useState("");
  const [visible, setVisible] = useState(VISIBLE_STEP);
  const [studied, setStudied] = useState<Set<number>>(() => {
    try {
      const raw = localStorage.getItem(userScopedStorageKey("cl_studied_combos"));
      return raw ? new Set(JSON.parse(raw)) : new Set();
    } catch { return new Set(); }
  });
  const [expanded, setExpanded] = useState<number | null>(null);

  const filtered = useMemo(() => {
    return COMBOS.filter(c => {
      const matchCat = category === "Todos" || c.category === category;
      const matchLvl = level === "Todos" || c.level === level;
      const q = search.toLowerCase();
      const matchSearch = !q || [c.title, c.mix, c.category, c.sequence, c.objective].join(" ").toLowerCase().includes(q);
      return matchCat && matchLvl && matchSearch;
    });
  }, [category, level, search]);

  const shown = filtered.slice(0, visible);

  const markStudied = (id: number) => {
    setStudied(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      localStorage.setItem(userScopedStorageKey("cl_studied_combos"), JSON.stringify([...next]));
      return next;
    });
  };

  const levelColor = (lvl: string) => {
    if (lvl === "Base") return "#32d98b";
    if (lvl === "Intermediário") return "#f8c54d";
    return "#d50f32";
  };

  return (
    <div className="min-h-screen pt-16" style={{ background: "#07080b" }}>
      <div className="absolute inset-0 cl-grid-bg opacity-20 pointer-events-none" />

      {/* Header */}
      <div className="relative py-16 overflow-hidden" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="absolute inset-0" style={{ background: "radial-gradient(circle at 50% 0%, rgba(213,15,50,0.1), transparent 60%)" }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/">
              <button className="flex items-center gap-2 text-sm transition-colors" style={{ color: "#aab5c4", background: "none", border: "none", cursor: "pointer" }} data-testid="back-home-btn">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Voltar
              </button>
            </Link>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <img src={logoImg} alt="Logo" className="w-10 h-10 object-contain" />
            <div>
              <div className="inline-flex items-center gap-2 mb-1">
                <span className="text-xs tracking-widest uppercase" style={{ color: "#d50f32" }}>Biblioteca Técnica</span>
              </div>
              <h1 className="font-black" style={{ fontFamily: "Impact, Arial Black, sans-serif", fontSize: "clamp(2rem, 5vw, 3.5rem)", color: "#fff", lineHeight: 1 }}>
                COMBOS &<br /><span style={{ color: "#d50f32" }}>SEQUÊNCIAS</span>
              </h1>
            </div>
          </div>
          <p className="text-base" style={{ color: "#aab5c4", maxWidth: "500px" }}>
            {COMBOS.length} sequências técnicas para treino solo — filtre por estilo, nível ou busque por técnica.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="sticky top-16 z-40 py-4" style={{ background: "rgba(7,8,11,0.95)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: "#aab5c4" }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={e => { setSearch(e.target.value); setVisible(VISIBLE_STEP); }}
                placeholder="Buscar por técnica, estilo, sequência..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }}
                data-testid="combos-search"
              />
            </div>

            <div className="flex gap-2 flex-wrap">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => { setCategory(cat); setVisible(VISIBLE_STEP); }}
                  className="px-3 py-2 rounded-xl text-xs font-bold transition-all"
                  style={{
                    background: category === cat ? "#d50f32" : "rgba(255,255,255,0.05)",
                    color: category === cat ? "#fff" : "#aab5c4",
                    border: `1px solid ${category === cat ? "#d50f32" : "rgba(255,255,255,0.1)"}`,
                  }}
                  data-testid={`filter-cat-${cat}`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              {LEVELS.map(lvl => (
                <button
                  key={lvl}
                  onClick={() => { setLevel(lvl); setVisible(VISIBLE_STEP); }}
                  className="px-3 py-2 rounded-xl text-xs font-bold transition-all"
                  style={{
                    background: level === lvl ? levelColor(lvl) : "rgba(255,255,255,0.05)",
                    color: level === lvl ? (lvl === "Todos" ? "#fff" : "#07080b") : "#aab5c4",
                    border: `1px solid ${level === lvl ? levelColor(lvl) : "rgba(255,255,255,0.1)"}`,
                  }}
                  data-testid={`filter-lvl-${lvl}`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-2 text-xs" style={{ color: "#aab5c4" }}>
            Exibindo <span style={{ color: "#f8c54d" }}>{Math.min(visible, filtered.length)}</span> de <span style={{ color: "#f8c54d" }}>{filtered.length}</span> combos
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filtered.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-4xl mb-4">🔍</div>
            <div className="text-lg font-bold text-white mb-2">Nenhum combo encontrado</div>
            <div className="text-sm" style={{ color: "#aab5c4" }}>Tente outros filtros ou termos de busca</div>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {shown.map(combo => {
              const isStudied = studied.has(combo.id);
              const isExpanded = expanded === combo.id;
              const color = MODULE_COLORS[combo.category] ?? "#aab5c4";

              return (
                <div
                  key={combo.id}
                  className="combo-card rounded-2xl overflow-hidden"
                  style={{ background: "rgba(16,22,33,0.9)" }}
                  data-testid={`combo-card-${combo.id}`}
                >
                  <div className="h-1" style={{ background: `linear-gradient(90deg, ${color}, transparent)` }} />
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="text-xs mb-1" style={{ color: "#aab5c4" }}>#{combo.id} • {combo.mix}</div>
                        <div className="font-bold text-white">{combo.title}</div>
                      </div>
                      <div className="flex flex-col gap-1.5 items-end">
                        <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: `${levelColor(combo.level)}18`, color: levelColor(combo.level) }}>
                          {combo.level}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(255,255,255,0.06)", color: "#aab5c4" }}>
                          {combo.distance}
                        </span>
                      </div>
                    </div>

                    <div
                      className="text-xs font-mono py-2.5 px-3 rounded-xl mb-3 leading-relaxed"
                      style={{ background: "rgba(0,0,0,0.5)", color: "#f8c54d", border: "1px solid rgba(248,197,77,0.12)" }}
                    >
                      {combo.sequence}
                    </div>

                    <p className="text-xs leading-relaxed mb-4" style={{ color: "#8899aa" }}>{combo.objective}</p>

                    {isExpanded && (
                      <div className="space-y-3 mb-4 text-xs" style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "12px" }}>
                        <div>
                          <div className="font-bold mb-1" style={{ color: "#59bfff" }}>Solo Drill:</div>
                          <div style={{ color: "#aab5c4", lineHeight: 1.6 }}>{combo.soloDrill}</div>
                        </div>
                        <div>
                          <div className="font-bold mb-1" style={{ color: "#32d98b" }}>Ponto-chave:</div>
                          <div style={{ color: "#aab5c4" }}>{combo.key}</div>
                        </div>
                        <div>
                          <div className="font-bold mb-1" style={{ color: "#f8c54d" }}>Segurança:</div>
                          <div style={{ color: "#aab5c4" }}>{combo.safety}</div>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <button
                        onClick={() => setExpanded(isExpanded ? null : combo.id)}
                        className="flex-1 py-2 rounded-xl text-xs font-bold transition-all btn-outline"
                        data-testid={`combo-expand-${combo.id}`}
                      >
                        {isExpanded ? "Fechar" : "Ver Drill"}
                      </button>
                      <button
                        onClick={() => markStudied(combo.id)}
                        className="px-3 py-2 rounded-xl text-xs font-bold transition-all"
                        style={{
                          background: isStudied ? "rgba(50,217,139,0.15)" : "rgba(255,255,255,0.05)",
                          color: isStudied ? "#32d98b" : "#aab5c4",
                          border: `1px solid ${isStudied ? "rgba(50,217,139,0.3)" : "rgba(255,255,255,0.08)"}`,
                        }}
                        data-testid={`combo-studied-${combo.id}`}
                      >
                        {isStudied ? "Estudado" : "Marcar"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {visible < filtered.length && (
          <div className="flex justify-center mt-10">
            <button
              onClick={() => setVisible(v => v + VISIBLE_STEP)}
              className="btn-red px-8 py-3 rounded-2xl font-bold"
              data-testid="load-more-combos"
            >
              Carregar mais combos ({filtered.length - visible} restantes)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
