import { useEffect, useRef } from 'react'

export default function GlitchEffect() {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const glitch = () => {
      const intensity = Math.random() * 2
      const duration = 50 + Math.random() * 100

      container.style.transform = `translate(${Math.random() * intensity}px, ${Math.random() * intensity}px)`
      container.style.filter = `hue-rotate(${Math.random() * 20}deg)`

      setTimeout(() => {
        container.style.transform = ''
        container.style.filter = ''
      }, duration)
    }

    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        glitch()
      }
    }, 2000 + Math.random() * 3000)

    return () => {
      clearInterval(interval)
    }
  }, [])

  return (
    <style>{`
      @keyframes glitch {
        0%, 100% { clip-path: inset(0 0 100% 0); }
        20% { clip-path: inset(0 0 50% 0); }
        40% { clip-path: inset(50% 0 0 0); }
        60% { clip-path: inset(0 0 25% 0); }
        80% { clip-path: inset(25% 0 0 0); }
      }
      
      .glitch-effect {
        animation: glitch 0.3s infinite;
      }
      
      @media (prefers-reduced-motion: reduce) {
        .glitch-effect {
          animation: none;
        }
      }
    `}</style>
  )
}


