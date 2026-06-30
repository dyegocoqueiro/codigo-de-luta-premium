import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useState, useRef, useEffect } from "react";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import CombosPage from "@/pages/CombosPage";
import EvolutionPage from "@/pages/EvolutionPage";
import AuthPage from "@/pages/AuthPage";
import Navbar from "@/components/Navbar";
import ParticleCanvas from "@/components/ParticleCanvas";
import bgMusic from "@assets/NEFFEX_-_Fightback_(INSTRUMENTAL)_-_IXORBEATZZ_(youtube)_1782758047742.mp3";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 30000 },
  },
});

const MUSIC_KEY = "cl_music_muted_v1";
const AUTH_TOKEN_KEY = "cl_auth_token";
const AUTH_USER_KEY = "cl_auth_user";

interface AuthUser {
  id: number;
  email: string;
  name?: string | null;
  phone?: string | null;
}

function loadStoredAuth(): { token: string; user: AuthUser } | null {
  try {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    const raw = localStorage.getItem(AUTH_USER_KEY);
    if (!token || !raw) return null;
    const user = JSON.parse(raw) as AuthUser;
    return { token, user };
  } catch {
    return null;
  }
}

function AppShell() {
  const [auth, setAuth] = useState<{ token: string; user: AuthUser } | null>(loadStoredAuth);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [musicMuted, setMusicMuted] = useState(() => localStorage.getItem(MUSIC_KEY) === "1");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    const audio = new Audio(bgMusic);
    audio.loop = true;
    audio.volume = 0.28;
    audio.muted = musicMuted;
    audioRef.current = audio;

    const tryPlay = () => {
      if (startedRef.current) return;
      startedRef.current = true;
      audio.play()
        .then(() => { if (!audio.muted) setMusicPlaying(true); })
        .catch(() => {});
    };

    document.addEventListener("click", tryPlay, { once: true });
    document.addEventListener("keydown", tryPlay, { once: true });

    return () => {
      audio.pause();
      document.removeEventListener("click", tryPlay);
      document.removeEventListener("keydown", tryPlay);
    };
  }, []);

  const toggleMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!startedRef.current) {
      startedRef.current = true;
      audio.muted = false;
      audio.play()
        .then(() => { setMusicPlaying(true); setMusicMuted(false); localStorage.setItem(MUSIC_KEY, "0"); })
        .catch(() => {});
      return;
    }

    const newMuted = !audio.muted;
    audio.muted = newMuted;
    setMusicMuted(newMuted);
    setMusicPlaying(!newMuted);
    localStorage.setItem(MUSIC_KEY, newMuted ? "1" : "0");
  };

  const handleAuth = (token: string, user: AuthUser) => {
    window.scrollTo({ top: 0, behavior: "instant" });
    setAuth({ token, user });
  };

  const handleLogout = () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
    setAuth(null);
  };

  if (!auth) {
    return <AuthPage onAuth={handleAuth} />;
  }

  return (
    <div className="relative" style={{ background: "#07080b", minHeight: "100vh" }}>
      <div className="cl-scanlines" />
      <ParticleCanvas />
      <Navbar
        musicPlaying={musicPlaying}
        onMusicToggle={toggleMusic}
        user={auth.user}
        onLogout={handleLogout}
      />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/combos" component={CombosPage} />
        <Route path="/evolucao" component={EvolutionPage} />
        <Route component={NotFound} />
      </Switch>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <AppShell />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
