export interface TrainingModule {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  weeks: string;
  drills: string[];
  color: string;
  glowColor: string;
  icon: string;
  week: number;
  youtubeId: string;
  youtubeTitle: string;
}

export const TRAINING_MODULES: TrainingModule[] = [
  {
    id: "boxe",
    name: "Boxe",
    subtitle: "Base, Esquiva e Precisão",
    description: "Fundamentos do boxe moderno: postura, jab, direto, gancho, uppercut e sistema defensivo completo com slip, bob & weave e parry.",
    weeks: "Semanas 1-2",
    drills: ["Jab de espelho × 200", "Combo 1-2-3 no saco", "Slip drill 3 × 3min", "Shadowbox boxing puro"],
    color: "#59bfff",
    glowColor: "rgba(89,191,255,0.4)",
    icon: "👊",
    week: 1,
    youtubeId: "T_T6gT2HjNc",
    youtubeTitle: "Fundamentos do Boxe — Técnica de jab e direto",
  },
  {
    id: "muaythai",
    name: "Muay Thai",
    subtitle: "Impacto, Pernas e Pressão",
    description: "A arte dos 8 membros. Teep, roundhouse, low kick, clinch knees e cotoveladas. O sistema mais completo de striking em pé.",
    weeks: "Semanas 1-3",
    drills: ["50 teeps por lado", "100 roundhouses no saco", "Clinch knee × 5 séries", "Low kick drill 4 × 2min"],
    color: "#d50f32",
    glowColor: "rgba(213,15,50,0.4)",
    icon: "🦵",
    week: 2,
    youtubeId: "Gt5_jnE-kac",
    youtubeTitle: "Muay Thai — Teep, roundhouse e clinch",
  },
  {
    id: "kickboxing",
    name: "Kickboxing",
    subtitle: "Velocidade e Variação",
    description: "Boxing com kicks. Side kick, back kick, spinning kicks. Combinações explosivas que misturam punhos e pernas com fluidez.",
    weeks: "Semanas 2-4",
    drills: ["Side kick × 30 por lado", "Combo boxing + kick 3min", "Spinning drill câmara lenta", "Cardio kickboxing 5 rounds"],
    color: "#f8c54d",
    glowColor: "rgba(248,197,77,0.4)",
    icon: "⚡",
    week: 3,
    youtubeId: "xGMa_G6Oa2g",
    youtubeTitle: "Kickboxing — Combinações de socos e chutes",
  },
  {
    id: "sanda",
    name: "Sanda",
    subtitle: "Ângulos, Ritmo e Projeções",
    description: "O boxe chinês: ginga constante, projeções rápidas, chutes velozes e ângulos imprevisíveis. Treino anti-linear.",
    weeks: "Semanas 2-4",
    drills: ["Ginga 5min contínua", "Chute frontal rápido × 50", "Combo Sanda simulado", "Drill de ângulos"],
    color: "#32d98b",
    glowColor: "rgba(50,217,139,0.4)",
    icon: "🌪️",
    week: 4,
    youtubeId: "0bka1ZkiGiM",
    youtubeTitle: "Sanda — Técnicas e fundamentos do boxe chinês",
  },
  {
    id: "sambo",
    name: "Sambo + Wrestling",
    subtitle: "Entradas, Sprawl e Transição",
    description: "Controle de luta agarrada: sprawl anti-takedown, level change, clinch wrestling. A base do MMA moderno.",
    weeks: "Semanas 3-5",
    drills: ["Sprawl × 20 repetições", "Level change drill", "Clinch work 3min", "Technical stand-up × 15"],
    color: "#e67e22",
    glowColor: "rgba(230,126,34,0.4)",
    icon: "🤼",
    week: 5,
    youtubeId: "VHrJqjqGmDg",
    youtubeTitle: "Wrestling para MMA — Sprawl e anti-takedown",
  },
  {
    id: "bjj",
    name: "BJJ Solo",
    subtitle: "Chão, Escapes e Base",
    description: "Jiu-Jitsu brasileiro sem parceiro. Shrimp, bridge, guard recovery, granby roll. O chão é seu ambiente também.",
    weeks: "Semanas 3-6",
    drills: ["Shrimp × 20 por lado", "Technical stand-up × 15", "Upa bridge × 15", "Circuito BJJ 5min"],
    color: "#9b59b6",
    glowColor: "rgba(155,89,182,0.4)",
    icon: "🥋",
    week: 6,
    youtubeId: "VQ9Z7K4cQBs",
    youtubeTitle: "BJJ Solo Drills — Shrimp, bridge e guard recovery",
  },
  {
    id: "kravmaga",
    name: "Krav Maga",
    subtitle: "Prevenção, Distância e Saída",
    description: "Defesa responsável: consciência situacional, deescalada verbal, resposta mínima e saída imediata. Real e responsável.",
    weeks: "Semanas 5-7",
    drills: ["Drill de consciência situacional", "Simulação de saída de linha", "Resposta mínima × 10 cenários", "Protocolo pós-incidente"],
    color: "#c0392b",
    glowColor: "rgba(192,57,43,0.4)",
    icon: "🛡️",
    week: 7,
    youtubeId: "FXgjU4gWLbg",
    youtubeTitle: "Krav Maga — Defesa pessoal responsável",
  },
  {
    id: "mma",
    name: "MMA Integrado",
    subtitle: "Juntar Tudo Sem Parceiro",
    description: "Shadow MMA de 3min: boxing → kicks → clinch → ground → stand-up. A síntese do sistema híbrido completo.",
    weeks: "Semanas 6-8",
    drills: ["Shadow MMA 3min completo", "Transição 5 módulos", "Round de integração", "Protocolo de avaliação final"],
    color: "#ff355a",
    glowColor: "rgba(255,53,90,0.4)",
    icon: "⚔️",
    week: 8,
    youtubeId: "RkmQoUlJb0I",
    youtubeTitle: "MMA Integrado — Shadow MMA e transições completas",
  },
];

export interface FighterRank {
  name: string;
  minLevel: number;
  maxLevel: number;
  color: string;
}

export const FIGHTER_RANKS: FighterRank[] = [
  { name: "Iniciante", minLevel: 1, maxLevel: 5, color: "#aab5c4" },
  { name: "Guerreiro", minLevel: 6, maxLevel: 10, color: "#59bfff" },
  { name: "Lutador", minLevel: 11, maxLevel: 20, color: "#32d98b" },
  { name: "Veterano", minLevel: 21, maxLevel: 30, color: "#f8c54d" },
  { name: "Mestre", minLevel: 31, maxLevel: 40, color: "#d50f32" },
  { name: "Lenda", minLevel: 41, maxLevel: 50, color: "#ff355a" },
];

export function getRank(level: number): FighterRank {
  return FIGHTER_RANKS.find(r => level >= r.minLevel && level <= r.maxLevel) ?? FIGHTER_RANKS[0];
}

export const XP_PER_LEVEL = 500;
export function getLevelFromXP(xp: number): { level: number; currentXP: number; nextLevelXP: number } {
  const level = Math.floor(xp / XP_PER_LEVEL) + 1;
  const currentXP = xp % XP_PER_LEVEL;
  return { level: Math.min(level, 50), currentXP, nextLevelXP: XP_PER_LEVEL };
}
