"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Sparkles } from "lucide-react";

// ── Slide data ────────────────────────────────────────────────────────────────
const SLIDES = [
  {
    emoji: "🌌",
    title: "Map Your World",
    subtitle:
      "Everyone in your life lives somewhere in your orbit. Visualize who's close, who's fading, and who matters most.",
    accent: "#6366f1",
    bg: "from-indigo-400/10 via-violet-400/5 to-purple-400/10",
    feature: "Relationship Graph",
  },
  {
    emoji: "📖",
    title: "Remember Every Moment",
    subtitle:
      "Log coffee chats, late-night calls, and shared trips. Build a living memory of your relationships — not just messages.",
    accent: "#7c3aed",
    bg: "from-violet-500/10 via-purple-400/5 to-fuchsia-400/10",
    feature: "Memory Map",
  },
  {
    emoji: "💡",
    title: "Stay Genuinely Close",
    subtitle:
      "Get thoughtful reminders when connections are fading. Understand patterns before relationships drift.",
    accent: "#8b5cf6",
    bg: "from-purple-400/10 via-indigo-500/5 to-violet-600/10",
    feature: "Smart Reminders",
  },
];

// Stable particles (computed once, not on every render)
const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  left: `${6 + ((i * 83) % 88)}%`,
  delay:  `${((i * 37) % 40) / 10}s`,
  duration: `${35 + ((i * 29) % 25) / 10}s`,
  size: 3 + (i % 5),
  color: ["#6366f1", "#8b5cf6", "#a78bfa", "#c4b5fd", "#7c3aed"][i % 5],
}));

// ── Component ─────────────────────────────────────────────────────────────────
export default function OnboardingPage() {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [fading, setFading] = useState(false);
  const slide = SLIDES[current];

  // Inject custom keyframes
  useEffect(() => {
    const style = document.createElement("style");
    style.id = "ob-styles";
    style.textContent = `
      @keyframes ob-float {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        33% { transform: translateY(-14px) rotate(1deg); }
        66% { transform: translateY(-7px) rotate(-1deg); }
      }
      @keyframes ob-particle {
        0%   { transform: translateY(0) scale(0.4); opacity: 0; }
        15%  { opacity: 0.7; }
        85%  { opacity: 0.3; }
        100% { transform: translateY(-75vh) scale(0.8); opacity: 0; }
      }
      @keyframes ob-spin   { to { transform: rotate(360deg);  } }
      @keyframes ob-unspin { to { transform: rotate(-360deg); } }
      @keyframes ob-pulse-ring {
        0%   { transform: scale(1);   opacity: 0.35; }
        100% { transform: scale(1.7); opacity: 0; }
      }
      @keyframes ob-shimmer {
        0%, 100% { background-position: 0% 50%;   }
        50%       { background-position: 100% 50%; }
      }
      @keyframes ob-fade-up {
        from { opacity: 0; transform: translateY(18px); }
        to   { opacity: 1; transform: translateY(0);    }
      }
    `;
    document.head.appendChild(style);
    return () => document.getElementById("ob-styles")?.remove();
  }, []);

  const goTo = (idx: number) => {
    if (idx === current || fading) return;
    setFading(true);
    setTimeout(() => { setCurrent(idx); setFading(false); }, 230);
  };

  return (
    <div className="min-h-screen overflow-hidden relative flex flex-col select-none">

      {/* ── Animated background ── */}
      <div className={`absolute inset-0 bg-gradient-to-br ${slide.bg} transition-all duration-700`} />
      {/* Deep radial glow behind illustration */}
      <div
        className="absolute pointer-events-none transition-all duration-700"
        style={{
          top: "50%", left: "35%",
          transform: "translate(-50%, -50%)",
          width: 700, height: 700,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${slide.accent}12 0%, transparent 65%)`,
        }}
      />

      {/* ── Floating particles ── */}
      {PARTICLES.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: p.left, bottom: "2%",
            width: p.size, height: p.size,
            background: p.color,
            animation: `ob-particle ${p.duration} ${p.delay} ease-in-out infinite`,
          }}
        />
      ))}

      {/* ── Header ── */}
      <header className="relative z-10 flex items-center justify-between px-8 pt-7 pb-2">
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center shadow-lg"
            style={{ background: "linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)" }}
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2 C12 2 13.2 8.8 16 12 C13.2 15.2 12 22 12 22 C12 22 10.8 15.2 8 12 C10.8 8.8 12 2 12 2Z" fill="white" />
              <path d="M2 12 C2 12 8.8 13.2 12 16 C15.2 13.2 22 12 22 12 C22 12 15.2 10.8 12 8 C8.8 10.8 2 12 2 12Z" fill="white" fillOpacity="0.85" />
            </svg>
          </div>
          <span className="font-bold text-sm tracking-wide text-slate-700">Orbit</span>
        </div>
        <button
          onClick={() => router.push("/dashboard")}
          className="text-xs font-medium text-slate-400 hover:text-slate-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-slate-100"
        >
          Skip tour →
        </button>
      </header>

      {/* ── Main slide area ── */}
      <div className="flex-1 flex items-center justify-center px-6 py-4 relative z-10">
        <div
          className="w-full max-w-5xl flex flex-col lg:flex-row items-center gap-10 lg:gap-20"
          style={{
            opacity: fading ? 0 : 1,
            transform: fading ? "scale(0.97) translateY(10px)" : "scale(1) translateY(0)",
            transition: "opacity 0.23s ease, transform 0.23s ease",
          }}
        >

          {/* ── Illustration ── */}
          <div className="relative flex items-center justify-center shrink-0" style={{ width: 260, height: 260 }}>
            {/* Outermost dashed orbit */}
            <div
              className="absolute rounded-full border-dashed border"
              style={{
                width: 248, height: 248,
                borderColor: `${slide.accent}22`,
                animation: "ob-spin 28s linear infinite",
              }}
            />
            {/* Mid solid orbit */}
            <div
              className="absolute rounded-full border"
              style={{
                width: 188, height: 188,
                borderColor: `${slide.accent}30`,
                animation: "ob-unspin 18s linear infinite",
              }}
            />
            {/* Inner orbit */}
            <div
              className="absolute rounded-full border"
              style={{
                width: 138, height: 138,
                borderColor: `${slide.accent}40`,
                animation: "ob-spin 12s linear infinite",
              }}
            />

            {/* Pulse rings */}
            <div className="absolute rounded-full" style={{ width: 108, height: 108, background: `${slide.accent}0e`, animation: "ob-pulse-ring 2.4s ease-out infinite" }} />
            <div className="absolute rounded-full" style={{ width: 108, height: 108, background: `${slide.accent}0a`, animation: "ob-pulse-ring 2.4s 0.8s ease-out infinite" }} />

            {/* Emoji circle */}
            <div
              className="relative w-28 h-28 rounded-full flex items-center justify-center text-6xl"
              style={{
                background: "white",
                boxShadow: `0 16px 48px rgba(0,0,0,0.1), 0 0 100px ${slide.accent}25`,
                animation: "ob-float 5s ease-in-out infinite",
                zIndex: 10,
              }}
            >
              {slide.emoji}
            </div>

            {/* Orbiting dot on outer ring */}
            <div
              className="absolute"
              style={{ width: 248, height: 248, animation: "ob-spin 28s linear infinite" }}
            >
              <div
                className="absolute w-3 h-3 rounded-full shadow"
                style={{
                  background: slide.accent,
                  top: 0, left: "50%",
                  transform: "translate(-50%, -50%)",
                  opacity: 0.85,
                  boxShadow: `0 0 10px ${slide.accent}80`,
                }}
              />
            </div>
            {/* Orbiting dot on mid ring */}
            <div
              className="absolute"
              style={{ width: 188, height: 188, animation: "ob-unspin 18s linear infinite" }}
            >
              <div
                className="absolute w-2 h-2 rounded-full"
                style={{
                  background: slide.accent,
                  bottom: 0, left: "50%",
                  transform: "translate(-50%, 50%)",
                  opacity: 0.6,
                }}
              />
            </div>
          </div>

          {/* ── Text content ── */}
          <div
            className="flex flex-col items-center lg:items-start text-center lg:text-left max-w-lg"
            key={current}
            style={{ animation: "ob-fade-up 0.35s ease both" }}
          >
            {/* Feature pill */}
            <div
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-5 self-center lg:self-start"
              style={{ background: `${slide.accent}15`, color: slide.accent }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: slide.accent }} />
              {slide.feature}
            </div>

            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 leading-tight tracking-tight mb-4">
              {slide.title}
            </h1>
            <p className="text-base md:text-lg text-slate-500 leading-relaxed">
              {slide.subtitle}
            </p>

            {/* Dots */}
            <div className="flex items-center gap-2.5 mt-9 mb-7 self-center lg:self-start">
              {SLIDES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className="rounded-full transition-all duration-300"
                  style={{
                    width: i === current ? 30 : 8,
                    height: 8,
                    background: i === current
                      ? "linear-gradient(90deg,#6366f1,#8b5cf6)"
                      : "#e2e8f0",
                  }}
                />
              ))}
            </div>

            {/* CTA buttons */}
            {current < SLIDES.length - 1 ? (
              <div className="flex items-center gap-3 self-center lg:self-start">
                <button
                  onClick={() => goTo(SLIDES.length - 1)}
                  className="px-6 py-3 rounded-xl text-sm font-medium text-slate-400 hover:text-slate-600 border border-slate-200 hover:bg-slate-50 transition-all"
                >
                  Skip
                </button>
                <button
                  onClick={() => goTo(current + 1)}
                  className="flex items-center gap-2 px-7 py-3 rounded-xl text-white text-sm font-semibold transition-all hover:-translate-y-0.5 active:translate-y-0"
                  style={{
                    background: "linear-gradient(135deg,#6366f1,#7c3aed)",
                    boxShadow: "0 6px 24px rgba(99,102,241,0.38)",
                  }}
                >
                  Next
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => router.push("/dashboard")}
                className="flex items-center gap-2.5 px-9 py-3.5 rounded-xl text-white text-sm font-semibold self-center lg:self-start transition-all hover:-translate-y-0.5 active:translate-y-0"
                style={{
                  background: "linear-gradient(135deg,#4f46e5,#7c3aed,#8b5cf6,#4f46e5)",
                  backgroundSize: "300% 300%",
                  boxShadow: "0 8px 32px rgba(99,102,241,0.42)",
                  animation: "ob-shimmer 3s ease infinite",
                }}
              >
                <Sparkles className="w-4 h-4" />
                Start Building Your Orbit
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Footer feature strip ── */}
      <footer className="relative z-10 flex justify-center gap-8 px-8 py-5 text-xs text-slate-400">
        {[
          { icon: "✦", label: "Relationship Graph",  color: "#6366f1" },
          { icon: "✦", label: "Memory Map",          color: "#7c3aed" },
          { icon: "✦", label: "Smart Reminders",     color: "#8b5cf6" },
          { icon: "✦", label: "Closeness Scoring",   color: "#a78bfa" },
        ].map((f) => (
          <span key={f.label} className="flex items-center gap-1.5 hidden sm:flex">
            <span style={{ color: f.color }}>{f.icon}</span>
            {f.label}
          </span>
        ))}
      </footer>
    </div>
  );
}
