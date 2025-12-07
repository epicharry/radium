import { useEffect } from 'react'

export default function LayoutStyles({ layout }) {
  useEffect(() => {
    if (!layout) return

    const styleId = 'dynamic-layout-styles'
    let styleElement = document.getElementById(styleId)
    
    if (!styleElement) {
      styleElement = document.createElement('style')
      styleElement.id = styleId
      document.head.appendChild(styleElement)
    }

    let css = ''
    
    const sectionOrder = ['hero', 'about', 'projects', 'skillset']
    const sortedSections = sectionOrder.sort((a, b) => {
      const orderA = layout[a]?.order ?? sectionOrder.indexOf(a)
      const orderB = layout[b]?.order ?? sectionOrder.indexOf(b)
      return orderA - orderB
    })

    sortedSections.forEach((sectionId) => {
      const sectionLayout = layout[sectionId]
      if (!sectionLayout) return

      

      const sectionSelectors = [
        `.hero-background`,
        `.dotted-pattern:has(> [data-section="${sectionId}"])`,
        `.grid-pattern:has(> [data-section="${sectionId}"])`,
        `[data-section="${sectionId}"]`
      ]
      
      sectionSelectors.forEach(selector => {
        css += `
          ${selector} {
            width: ${sectionLayout.width}% !important;
            min-height: ${sectionLayout.height}px !important;
          }
        `
      })
    })
    
    

    sortedSections.forEach((sectionId, index) => {
      const sectionLayout = layout[sectionId]
      if (!sectionLayout) return
      
      const order = sectionLayout.order ?? index
      css += `
        main > div:nth-of-type(${index + 1}) {
          order: ${order} !important;
        }
      `
    })

    css += `
      main {
        display: flex !important;
        flex-direction: column !important;
      }
      
      header, footer {
        position: relative !important;
        width: 100% !important;
        order: unset !important;
      }
      
      footer {
        margin-top: auto !important;
      }
    `

    styleElement.textContent = css

    return () => {
      const element = document.getElementById(styleId)
      if (element) {
        element.remove()
      }
    }
  }, [layout])

  return null
}

