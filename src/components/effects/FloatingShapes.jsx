import { useEffect, useRef } from 'react'

export default function FloatingShapes() {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const shapes = ['circle', 'square', 'triangle']
    const shapeCount = 15

    const createShape = () => {
      const shape = document.createElement('div')
      const shapeType = shapes[Math.floor(Math.random() * shapes.length)]
      const size = Math.random() * 60 + 20
      const startX = Math.random() * 100
      const duration = Math.random() * 20 + 10
      const delay = Math.random() * 5

      shape.style.position = 'absolute'
      shape.style.width = `${size}px`
      shape.style.height = `${size}px`
      shape.style.left = `${startX}%`
      shape.style.bottom = '-100px'
      shape.style.opacity = Math.random() * 0.5 + 0.2
      shape.style.pointerEvents = 'none'
      shape.style.zIndex = '2'

      if (shapeType === 'circle') {
        shape.style.borderRadius = '50%'
        shape.style.background = `rgba(255, 140, 0, ${Math.random() * 0.3 + 0.1})`
      } else if (shapeType === 'square') {
        shape.style.transform = 'rotate(45deg)'
        shape.style.background = `rgba(255, 140, 0, ${Math.random() * 0.3 + 0.1})`
      } else {
        shape.style.width = '0'
        shape.style.height = '0'
        shape.style.borderLeft = `${size / 2}px solid transparent`
        shape.style.borderRight = `${size / 2}px solid transparent`
        shape.style.borderBottom = `${size}px solid rgba(255, 140, 0, ${Math.random() * 0.3 + 0.1})`
      }

      shape.style.animation = `float-up ${duration}s linear ${delay}s infinite`
      container.appendChild(shape)

      setTimeout(() => {
        if (shape.parentNode) {
          shape.parentNode.removeChild(shape)
        }
      }, (duration + delay) * 1000)
    }

    const styleId = 'floating-shapes-style'
    let styleElement = document.getElementById(styleId)
    
    if (!styleElement) {
      styleElement = document.createElement('style')
      styleElement.id = styleId
      document.head.appendChild(styleElement)
    }

    styleElement.textContent = `
      @keyframes float-up {
        0% {
          transform: translateY(0) rotate(0deg);
          opacity: 0;
        }
        10% {
          opacity: 1;
        }
        90% {
          opacity: 1;
        }
        100% {
          transform: translateY(-100vh) rotate(360deg);
          opacity: 0;
        }
      }
    `

    for (let i = 0; i < shapeCount; i++) {
      setTimeout(() => createShape(), i * 1000)
    }

    const interval = setInterval(() => {
      createShape()
    }, 2000)

    return () => {
      clearInterval(interval)
      const styleEl = document.getElementById(styleId)
      if (styleEl) {
        styleEl.remove()
      }
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-[2] overflow-hidden"
    />
  )
}


