import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

let SplitText = null
let ScrambleTextPlugin = null

const loadGSAPPlugins = async () => {
  try {
    const splitTextModule = await import('gsap/SplitText')
    SplitText = splitTextModule.SplitText || splitTextModule.default
    
    const scrambleTextModule = await import('gsap/ScrambleTextPlugin')
    ScrambleTextPlugin = scrambleTextModule.ScrambleTextPlugin || scrambleTextModule.default
    
    if (SplitText) gsap.registerPlugin(SplitText)
    if (ScrambleTextPlugin) gsap.registerPlugin(ScrambleTextPlugin)
  } catch (error) {
    console.warn('GSAP premium plugins not available, using fallback', error)
  }
}

export default function ScrambleText({ 
  radius = 100, 
  duration = 1.2, 
  speed = 0.5, 
  scrambleChars = '.:',
  className = '',
  style = {},
  children 
}) {
  const rootRef = useRef(null)
  const splitTextRef = useRef(null)
  const handleMoveRef = useRef(null)

  useEffect(() => {
    let isMounted = true
    let splitText = null
    let handleMove = null

    const initializeScrambleText = async () => {
      if (!rootRef.current || !isMounted) return

      await loadGSAPPlugins()

      const pElement = rootRef.current.querySelector('p')
      if (!pElement || !isMounted) return

      if (!SplitText) {
        const originalText = pElement.textContent
        const chars = originalText.split('')
        pElement.innerHTML = chars.map((char, index) => {
          if (char === ' ') {
            return '<span style="display: inline; white-space: pre;"> </span>'
          }
          if (char === '\n') {
            return '<br>'
          }
          const escapedChar = char.replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
          return `<span class="inline will-change-transform" data-original="${escapedChar}" data-index="${index}" style="display: inline;">${char}</span>`
        }).join('')
        
        const charElements = Array.from(pElement.querySelectorAll('span[data-original]'))
        const activeScrambles = new Map()
        
        handleMove = (e) => {
          if (!isMounted) return
          
          charElements.forEach((el) => {
            const c = el
            const { left, top, width, height } = c.getBoundingClientRect()
            const dx = e.clientX - (left + width / 2)
            const dy = e.clientY - (top + height / 2)
            const dist = Math.hypot(dx, dy)

            if (dist < radius) {
              const originalChar = c.dataset.original || c.textContent
              const intensity = 1 - dist / radius
              const scrambleCharsArray = scrambleChars.split('')
              
              if (activeScrambles.has(c)) {
                clearInterval(activeScrambles.get(c).interval)
                clearTimeout(activeScrambles.get(c).timeout)
              }
              
              let frame = 0
              const maxFrames = Math.floor(duration * intensity * 1000 / (speed * 50))
              
              const interval = setInterval(() => {
                if (!isMounted || frame >= maxFrames) {
                  clearInterval(interval)
                  if (isMounted) {
                    c.textContent = originalChar
                    activeScrambles.delete(c)
                  }
                  return
                }
                
                c.textContent = scrambleCharsArray[Math.floor(Math.random() * scrambleCharsArray.length)]
                frame++
              }, speed * 50)
              
              const timeout = setTimeout(() => {
                if (isMounted) {
                  clearInterval(interval)
                  c.textContent = originalChar
                  activeScrambles.delete(c)
                }
              }, duration * intensity * 1000)
              
              activeScrambles.set(c, { interval, timeout })
            } else {
              if (activeScrambles.has(c)) {
                clearInterval(activeScrambles.get(c).interval)
                clearTimeout(activeScrambles.get(c).timeout)
                c.textContent = c.dataset.original || c.textContent
                activeScrambles.delete(c)
              }
            }
          })
        }
      } else {
        splitText = new SplitText(pElement, {
          type: 'chars',
          charsClass: 'inline will-change-transform'
        })
        
        splitText.chars.forEach(el => {
          const c = el
          c.style.display = 'inline'
        })

        splitText.chars.forEach(el => {
          const c = el
          gsap.set(c, { attr: { 'data-content': c.innerHTML } })
        })

        handleMove = (e) => {
          if (!splitText || !isMounted) return

          splitText.chars.forEach(el => {
            const c = el
            const { left, top, width, height } = c.getBoundingClientRect()
            const dx = e.clientX - (left + width / 2)
            const dy = e.clientY - (top + height / 2)
            const dist = Math.hypot(dx, dy)

            if (dist < radius) {
              gsap.to(c, {
                overwrite: true,
                duration: duration * (1 - dist / radius),
                scrambleText: {
                  text: c.dataset.content || '',
                  chars: scrambleChars,
                  speed: speed
                },
                ease: 'none'
              })
            }
          })
        }
      }

      if (rootRef.current && handleMove) {
        rootRef.current.addEventListener('pointermove', handleMove)
        handleMoveRef.current = handleMove
        splitTextRef.current = splitText
      }
    }

    initializeScrambleText()

    return () => {
      isMounted = false
      if (rootRef.current && handleMoveRef.current) {
        rootRef.current.removeEventListener('pointermove', handleMoveRef.current)
      }
      if (splitTextRef.current) {
        splitTextRef.current.revert()
      }
      if (rootRef.current) {
        const charElements = rootRef.current.querySelectorAll('span[data-original]')
        charElements.forEach(el => {
          if (el.dataset.original) {
            el.textContent = el.dataset.original
          }
        })
      }
    }
  }, [radius, duration, speed, scrambleChars])

  return (
    <div ref={rootRef} className="scramble-text" style={style}>
      <p className={className}>{children}</p>
    </div>
  )
}

