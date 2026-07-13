import { FIGHTER_RANKS, TRAINING_MODULES, getLevelFromXP, getRank } from "../data/modules";
import { useEffect, useState } from "react";
import { userScopedStorageKey } from "../lib/support";
import { loadCloudProgress, saveCloudProgress } from "../lib/cloudBackend";

const LOCAL_KEY = "cl_progress_v1";

interface LocalProgress {
  xp: number;
  streak: number;
  completedModules: string[];
  currentWeek: number;
  totalSessions: number;
  lastSession: string;
}

const DEFAULT_PROGRESS: LocalProgress = {
  xp: 0,
  streak: 0,
  completedModules: [],
  currentWeek: 1,
  totalSessions: 0,
  lastSession: "",
};

export function useLocalProgress() {
  const storageKey = userScopedStorageKey(LOCAL_KEY);
  const [progress, setProgress] = useState<LocalProgress>(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      return stored ? JSON.parse(stored) : DEFAULT_PROGRESS;
    } catch {
      return DEFAULT_PROGRESS;
    }
  });

  useEffect(() => {
    let active = true;

    loadCloudProgress<LocalProgress>()
      .then((cloudProgress) => {
        if (!active || !cloudProgress) return;
        const next = { ...DEFAULT_PROGRESS, ...cloudProgress };
        setProgress(next);
        localStorage.setItem(storageKey, JSON.stringify(next));
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, [storageKey]);

  const updateProgress = (delta: Partial<LocalProgress>) => {
    setProgress(prev => {
      const next = { ...prev, ...delta };
      localStorage.setItem(storageKey, JSON.stringify(next));
      saveCloudProgress(next).catch(() => {});
      return next;
    });
  };

  const addXP = (amount: number) => {
    updateProgress({ xp: progress.xp + amount, totalSessions: progress.totalSessions + 1 });
  };

  return { progress, updateProgress, addXP };
}

interface ProgressRingProps {
  value: number;
  max: number;
  size: number;
  color: string;
  label: string;
}

export function ProgressRing({ value, max, size, color, label }: ProgressRingProps) {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const pct = Math.min(value / max, 1);
  const dash = circ * pct;

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={6} />
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none"
          stroke={color}
          strokeWidth={6}
          strokeDasharray={`${dash} ${circ - dash}`}
          strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 4px ${color})`, transition: "stroke-dasharray 1s ease" }}
        />
      </svg>
      <span className="text-xs text-gray-400">{label}</span>
    </div>
  );
}

export default function ProgressPanel() {
  const { progress, addXP } = useLocalProgress();
  const [saving, setSaving] = useState(false);
  const { level, currentXP, nextLevelXP } = getLevelFromXP(progress.xp);
  const rank = getRank(level);
  const xpPercent = (currentXP / nextLevelXP) * 100;

  const handleTrainToday = () => {
    if (saving) return;
    setSaving(true);
    addXP(75);
    window.setTimeout(() => setSaving(false), 250);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs tracking-widest uppercase mb-1" style={{ color: "#aab5c4" }}>
            Rank Atual
          </div>
          <div className="text-2xl font-black" style={{ color: rank.color, fontFamily: "Impact, Arial Black, sans-serif" }}>
            {rank.name}
          </div>
          <div className="text-sm text-gray-400">Nível {level} • {progress.totalSessions} sessões</div>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-2 justify-end">
            <span className="fire-icon text-xl">🔥</span>
            <div>
              <div className="text-2xl font-black text-white">{progress.streak}</div>
              <div className="text-xs text-gray-400">dias seguidos</div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="flex justify-between text-xs mb-1.5">
          <span style={{ color: "#aab5c4" }}>Experiência</span>
          <span style={{ color: "#f8c54d" }}>{currentXP} / {nextLevelXP} XP</span>
        </div>
        <div className="h-3 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
          <div
            className="h-full rounded-full xp-bar-fill transition-all duration-1000"
            style={{
              width: `${xpPercent}%`,
              background: "linear-gradient(90deg, #d50f32, #ff355a, #f8c54d)",
            }}
          />
        </div>
        <div className="text-xs text-gray-500 mt-1">
          {nextLevelXP - currentXP} XP para o nível {level + 1}
        </div>
      </div>

      <div>
        <div className="text-xs tracking-widest uppercase mb-3" style={{ color: "#aab5c4" }}>
          Progresso dos Módulos
        </div>
        <div className="flex gap-4 flex-wrap">
          {TRAINING_MODULES.slice(0, 6).map(mod => (
            <ProgressRing
              key={mod.id}
              value={progress.completedModules.includes(mod.id) ? 1 : 0}
              max={1}
              size={52}
              color={mod.color}
              label={mod.name.slice(0, 6)}
            />
          ))}
        </div>
      </div>

      <div
        className="rounded-xl p-4 flex items-center justify-between"
        style={{
          background: "rgba(213,15,50,0.08)",
          border: "1px solid rgba(213,15,50,0.2)",
        }}
      >
        <div>
          <div className="text-sm font-bold text-white">Semana {progress.currentWeek} / 12</div>
          <div className="text-xs text-gray-400">Programa de 3 meses em andamento</div>
        </div>
        <button
          onClick={handleTrainToday}
          disabled={saving}
          className="btn-red px-4 py-2 rounded-xl text-sm font-bold"
          data-testid="train-today-btn"
        >
          {saving ? "Salvando..." : "+ 75 XP Hoje"}
        </button>
      </div>
    </div>
  );
}
