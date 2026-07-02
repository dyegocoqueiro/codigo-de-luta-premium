import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import logoImg from "@assets/codigo-luta-logo_1782758047742.png";
import { buildSupportMailto } from "../lib/support";

interface AuthUser {
  id: number;
  email: string;
  name?: string | null;
}

interface NavbarProps {
  musicPlaying: boolean;
  onMusicToggle: () => void;
  user?: AuthUser;
  onLogout?: () => void;
}

export default function Navbar({ musicPlaying, onMusicToggle, user, onLogout }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/#sistema", label: "Sistema" },
    { href: "/#modulos", label: "Módulos" },
    { href: "/evolucao", label: "Evolução" },
    { href: "/combos", label: "Combos" },
    { href: "/#kode", label: "IA Kode" },
  ];

  const handleNavClick = (href: string) => {
    setMenuOpen(false);
    if (href.startsWith("/#")) {
      const id = href.slice(2);
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const displayName = user?.name || user?.email?.split("@")[0] || "Lutador";

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? "rgba(7,8,11,0.96)" : "linear-gradient(180deg, rgba(7,8,11,0.9), transparent)",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(213,15,50,0.15)" : "none",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 relative">
              <div className="absolute inset-0 bg-red-600 rounded-full blur-lg opacity-40 group-hover:opacity-70 transition-opacity" />
              <img src={logoImg} alt="Código de Luta" className="w-9 h-9 object-contain relative z-10" />
            </div>
            <div className="hidden sm:block">
              <div className="text-white font-black text-sm tracking-wider" style={{ fontFamily: "Impact, Arial Black, sans-serif" }}>
                CÓDIGO<span style={{ color: "#d50f32" }}>◆</span>LUTA
              </div>
              <div className="text-xs text-gray-500 tracking-widest uppercase -mt-0.5">sistema híbrido solo</div>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              link.href.startsWith("/#") ? (
                <button
                  key={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className="px-3 py-1.5 text-sm text-gray-300 hover:text-white transition-colors rounded-lg hover:bg-white/5"
                  style={{ background: "none", border: "none", cursor: "pointer" }}
                >
                  {link.label}
                </button>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 text-sm transition-colors rounded-lg hover:bg-white/5 ${
                    location === link.href ? "text-white font-semibold" : "text-gray-300 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              )
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={onMusicToggle}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold tracking-wider transition-all"
              style={{
                border: "1px solid rgba(248,197,77,0.3)",
                background: musicPlaying ? "rgba(248,197,77,0.15)" : "rgba(248,197,77,0.05)",
                color: "#f8c54d",
              }}
            >
              <span>{musicPlaying ? "♪" : "♩"}</span>
              <span className="hidden sm:inline">Música</span>
            </button>

            {user && (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(o => !o)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all"
                  style={{
                    border: "1px solid rgba(213,15,50,0.3)",
                    background: "rgba(213,15,50,0.08)",
                    color: "#fff",
                  }}
                >
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-black"
                    style={{ background: "#d50f32", color: "#fff" }}
                  >
                    {displayName[0].toUpperCase()}
                  </div>
                  <span className="hidden sm:inline max-w-24 truncate">{displayName}</span>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {userMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                    <div
                      className="absolute right-0 top-full mt-2 w-56 rounded-2xl overflow-hidden z-50"
                      style={{ background: "rgba(12,16,24,0.98)", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 20px 60px rgba(0,0,0,0.6)" }}
                    >
                      <div className="px-4 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                        <div className="text-xs font-bold text-white">{displayName}</div>
                        <div className="text-xs mt-0.5 truncate" style={{ color: "#aab5c4" }}>{user.email}</div>
                      </div>
                      <div className="p-2">
                        <Link href="/evolucao" onClick={() => setUserMenuOpen(false)}>
                          <div className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm cursor-pointer hover:bg-white/5 transition-colors" style={{ color: "#aab5c4" }}>
                            <span>📊</span> Minha Evolução
                          </div>
                        </Link>
                        <a
                          href={buildSupportMailto("Dúvida no Código de Luta")}
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm cursor-pointer hover:bg-white/5 transition-colors"
                          style={{ color: "#f8c54d" }}
                        >
                          <span>✉️</span> Ajuda / Dúvidas
                        </a>
                        <button
                          onClick={() => { setUserMenuOpen(false); onLogout?.(); }}
                          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-colors hover:bg-red-500/10"
                          style={{ color: "#ff6b6b", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}
                        >
                          <span>🚪</span> Sair
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            <button
              className="md:hidden p-2 text-gray-300 hover:text-white"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                }
              </svg>
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-white/10" style={{ background: "rgba(7,8,11,0.98)" }}>
          <div className="px-4 py-3 flex flex-col gap-1">
            {navLinks.map((link) => (
              link.href.startsWith("/#") ? (
                <button
                  key={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className="text-left px-3 py-2 text-sm text-gray-300 hover:text-white rounded-lg hover:bg-white/5"
                  style={{ background: "none", border: "none", cursor: "pointer" }}
                >
                  {link.label}
                </button>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="px-3 py-2 text-sm text-gray-300 hover:text-white rounded-lg hover:bg-white/5"
                >
                  {link.label}
                </Link>
              )
            ))}
            {user && (
              <>
              <a
                href={buildSupportMailto("Dúvida no Código de Luta")}
                className="px-3 py-2 text-sm rounded-lg hover:bg-white/5"
                style={{ color: "#f8c54d" }}
              >
                ✉️ Ajuda / Dúvidas
              </a>
              <button
                onClick={() => { setMenuOpen(false); onLogout?.(); }}
                className="text-left px-3 py-2 text-sm rounded-lg hover:bg-red-500/10"
                style={{ color: "#ff6b6b", background: "none", border: "none", cursor: "pointer" }}
              >
                🚪 Sair
              </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
