import { useState, useEffect } from 'react'

const slides = [
  {
    emoji: '🌌',
    title: 'Map Your World',
    subtitle: "Everyone in your life lives somewhere in your orbit. Visualize who's close, who's fading, and who matters most.",
    gradient: 'from-[#4ECDC4]/10 via-[#A78BFA]/10 to-[#FB7185]/10',
  },
  {
    emoji: '📖',
    title: 'Remember Every Moment',
    subtitle: "Log coffee chats, late-night calls, and shared trips. Build a memory of your relationships — not just messages.",
    gradient: 'from-[#FB7185]/10 via-[#FCD34D]/10 to-[#4ECDC4]/10',
  },
  {
    emoji: '💡',
    title: 'Stay Genuinely Close',
    subtitle: 'Get thoughtful reminders when connections are fading. Understand patterns before relationships drift.',
    gradient: 'from-[#A78BFA]/10 via-[#4ECDC4]/10 to-[#FF6B6B]/10',
  },
]

const particles = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  left: `${10 + Math.random() * 80}%`,
  delay: `${Math.random() * 4}s`,
  duration: `${3 + Math.random() * 4}s`,
  size: 3 + Math.random() * 5,
  color: ['#4ECDC4', '#A78BFA', '#FB7185', '#FCD34D', '#FF6B6B'][i % 5],
}))

export default function Onboarding({ onStart }) {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(1)
  const [animating, setAnimating] = useState(false)
  const slide = slides[current]

  const goTo = (idx) => {
    if (idx === current || animating) return
    setDirection(idx > current ? 1 : -1)
    setAnimating(true)
    setTimeout(() => {
      setCurrent(idx)
      setAnimating(false)
    }, 200)
  }

  return (
    <div className="min-h-screen bg-[#F5F3EF] flex flex-col relative overflow-hidden">
      {/* Animated gradient background */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${slide.gradient} animate-gradient transition-all duration-700`}
        style={{ backgroundSize: '200% 200%' }}
      />

      {/* Floating particles */}
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute rounded-full opacity-0"
          style={{
            left: p.left,
            bottom: '10%',
            width: p.size,
            height: p.size,
            background: p.color,
            animation: `particle-float ${p.duration} ${p.delay} ease-in-out infinite`,
          }}
        />
      ))}

      {/* App name */}
      <div className="relative z-10 pt-14 flex justify-center">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#4ECDC4] to-[#A78BFA] flex items-center justify-center">
            <span className="text-white text-[8px] font-bold">✦</span>
          </div>
          <span className="text-[13px] font-semibold tracking-[0.15em] text-gray-400 uppercase">Orbit</span>
        </div>
      </div>

      {/* Slide content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center relative z-10">
        <div
          key={current}
          className={`flex flex-col items-center ${animating ? 'opacity-0 scale-95' : 'animate-scale-in'}`}
          style={{ transition: 'opacity 0.2s, transform 0.2s' }}
        >
          {/* Illustration with glow ring */}
          <div className="relative mb-10">
            {/* Outer glow ring */}
            <div
              className="absolute inset-0 rounded-full animate-pulse-ring"
              style={{
                background: `radial-gradient(circle, ${['#4ECDC4', '#A78BFA', '#FB7185'][current]}20 0%, transparent 70%)`,
                transform: 'scale(2)',
              }}
            />
            {/* Secondary ring */}
            <div
              className="absolute -inset-4 rounded-full border opacity-20 animate-pulse-soft"
              style={{ borderColor: ['#4ECDC4', '#A78BFA', '#FB7185'][current] }}
            />
            <div
              className="relative w-32 h-32 rounded-full flex items-center justify-center text-6xl animate-float"
              style={{
                background: 'white',
                boxShadow: `0 8px 32px rgba(0,0,0,0.08), 0 0 60px ${['#4ECDC4', '#A78BFA', '#FB7185'][current]}15`,
              }}
            >
              {slide.emoji}
            </div>
          </div>

          <h1 className="text-2xl font-bold text-[#1A1A2E] mb-4 leading-tight">
            {slide.title}
          </h1>
          <p className="text-[15px] text-gray-500 leading-relaxed max-w-[280px]">
            {slide.subtitle}
          </p>
        </div>
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-2 mb-8 relative z-10">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className="rounded-full transition-all duration-300"
            style={{
              width: i === current ? 24 : 8,
              height: 8,
              background: i === current
                ? `linear-gradient(90deg, #4ECDC4, #A78BFA)`
                : '#D1D5DB',
            }}
          />
        ))}
      </div>

      {/* CTA */}
      <div className="px-8 pb-16 relative z-10">
        {current < slides.length - 1 ? (
          <div className="flex gap-3">
            <button
              onClick={() => goTo(slides.length - 1)}
              className="flex-1 py-4 rounded-2xl glass text-gray-500 font-medium text-[15px] card-interactive"
            >
              Skip
            </button>
            <button
              onClick={() => goTo(current + 1)}
              className="flex-2 flex-grow-[2] py-4 rounded-2xl text-white font-medium text-[15px] card-interactive"
              style={{
                background: 'linear-gradient(135deg, #1A1A2E 0%, #2D2B55 100%)',
                boxShadow: '0 8px 24px rgba(26,26,46,0.3)',
              }}
            >
              Next &rarr;
            </button>
          </div>
        ) : (
          <button
            onClick={onStart}
            className="w-full py-4 rounded-2xl text-white font-semibold text-[15px] card-interactive animate-gradient"
            style={{
              background: 'linear-gradient(135deg, #1A1A2E, #2D2B55, #4ECDC4, #1A1A2E)',
              backgroundSize: '300% 300%',
              boxShadow: '0 8px 32px rgba(26,26,46,0.35)',
            }}
          >
            Start Building Your Orbit ✦
          </button>
        )}
      </div>
    </div>
  )
}
