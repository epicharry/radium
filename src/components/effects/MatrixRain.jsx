import { useEffect, useRef } from 'react'

export default function MatrixRain() {
  const canvasRef = useRef(null)
  const animationFrameRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    const fontSize = 14
    const columns = Math.floor(window.innerWidth / fontSize)
    const drops = []

    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * -100
    }

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.fillStyle = '#00ff00'
      ctx.font = `${fontSize}px monospace`

      for (let i = 0; i < drops.length; i++) {
        const text = String.fromCharCode(0x30a0 + Math.random() * 96)
        const x = i * fontSize
        const y = drops[i] * fontSize

        ctx.fillStyle = `rgba(0, 255, 0, ${Math.random() * 0.5 + 0.3})`
        ctx.fillText(text, x, y)

        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }

        drops[i]++
      }

      animationFrameRef.current = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[2] opacity-30"
      style={{ mixBlendMode: 'screen' }}
    />
  )
}

