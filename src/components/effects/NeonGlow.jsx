import { useEffect } from 'react'

export default function NeonGlow() {
  useEffect(() => {
    const styleId = 'neon-glow-effect'
    let styleElement = document.getElementById(styleId)
    
    if (!styleElement) {
      styleElement = document.createElement('style')
      styleElement.id = styleId
      document.head.appendChild(styleElement)
    }

    styleElement.textContent = `
      @keyframes neon-pulse {
        0%, 100% {
          text-shadow: 
            0 0 5px #ff8c00,
            0 0 10px #ff8c00,
            0 0 15px #ff8c00,
            0 0 20px #ff8c00,
            0 0 35px #ff8c00,
            0 0 40px #ff8c00;
        }
        50% {
          text-shadow: 
            0 0 2px #ff8c00,
            0 0 5px #ff8c00,
            0 0 8px #ff8c00,
            0 0 12px #ff8c00,
            0 0 18px #ff8c00,
            0 0 25px #ff8c00;
        }
      }
      
      .neon-glow-effect h1,
      .neon-glow-effect h2,
      .neon-glow-effect h3 {
        animation: neon-pulse 2s ease-in-out infinite;
      }
      
      .neon-glow-effect {
        box-shadow: 
          0 0 10px rgba(255, 140, 0, 0.3),
          0 0 20px rgba(255, 140, 0, 0.2),
          0 0 30px rgba(255, 140, 0, 0.1),
          inset 0 0 10px rgba(255, 140, 0, 0.1);
      }
    `

    return () => {
      const element = document.getElementById(styleId)
      if (element) {
        element.remove()
      }
    }
  }, [])

  return null
}


