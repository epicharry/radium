import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

const getVSCodeThemeStyles = (theme) => {
  const themes = {
    dark: {
      background: '#1e1e1e',
      foreground: '#d4d4d4',
      keyword: '#569cd6',
      string: '#ce9178',
      comment: '#6a9955',
      function: '#dcdcaa',
      number: '#b5cea8',
      operator: '#d4d4d4',
      border: '#3e3e42'
    },
    light: {
      background: '#ffffff',
      foreground: '#000000',
      keyword: '#0000ff',
      string: '#a31515',
      comment: '#008000',
      function: '#795e26',
      number: '#098658',
      operator: '#000000',
      border: '#e1e4e8'
    },
    monokai: {
      background: '#272822',
      foreground: '#f8f8f2',
      keyword: '#f92672',
      string: '#e6db74',
      comment: '#75715e',
      function: '#a6e22e',
      number: '#ae81ff',
      operator: '#f8f8f2',
      border: '#49483e'
    },
    dracula: {
      background: '#282a36',
      foreground: '#f8f8f2',
      keyword: '#ff79c6',
      string: '#f1fa8c',
      comment: '#6272a4',
      function: '#50fa7b',
      number: '#bd93f9',
      operator: '#ff79c6',
      border: '#44475a'
    },
    'one-dark': {
      background: '#282c34',
      foreground: '#abb2bf',
      keyword: '#c678dd',
      string: '#98c379',
      comment: '#5c6370',
      function: '#61afef',
      number: '#d19a66',
      operator: '#56b6c2',
      border: '#3e4451'
    }
  }
  return themes[theme] || themes.dark
}

const getTerminalThemeStyles = (theme) => {
  const themes = {
    powershell: {
      background: '#012456',
      foreground: '#ffffff',
      prompt: '#4ec9b0',
      command: '#ce9178'
    },
    bash: {
      background: '#2d2d2d',
      foreground: '#e0e0e0',
      prompt: '#4ec9b0',
      command: '#f8f8f2'
    },
    zsh: {
      background: '#1a1a1a',
      foreground: '#c5c8c6',
      prompt: '#81a2be',
      command: '#b5bd68'
    },
    fish: {
      background: '#1a1a1a',
      foreground: '#ffffff',
      prompt: '#66d9ef',
      command: '#a6e22e'
    }
  }
  return themes[theme] || themes.bash
}

const highlightCode = (code, language, theme) => {
  if (!code) return code
  
  const themeColors = getVSCodeThemeStyles(theme)
  
  const patterns = {
    javascript: [
      { regex: /(\b(function|const|let|var|if|else|for|while|return|class|extends|import|export|from|default|async|await|new|this|typeof|instanceof)\b)/g, color: themeColors.keyword },
      { regex: /(["'`])(?:(?=(\\?))\2.)*?\1/g, color: themeColors.string },
      { regex: /(\/\/.*$)/gm, color: themeColors.comment },
      { regex: /(\/\*[\s\S]*?\*\/)/g, color: themeColors.comment },
      { regex: /(\b\d+\.?\d*\b)/g, color: themeColors.number },
      { regex: /([{}()\[\];,.<>+\-*/%=!&|?:])/g, color: themeColors.operator },
      { regex: /(\b\w+)(\s*\()/g, color: themeColors.function }
    ],
    typescript: [
      { regex: /(\b(function|const|let|var|if|else|for|while|return|class|extends|import|export|from|default|async|await|new|this|typeof|instanceof|interface|type|enum|namespace|public|private|protected|readonly|static)\b)/g, color: themeColors.keyword },
      { regex: /(["'`])(?:(?=(\\?))\2.)*?\1/g, color: themeColors.string },
      { regex: /(\/\/.*$)/gm, color: themeColors.comment },
      { regex: /(\/\*[\s\S]*?\*\/)/g, color: themeColors.comment },
      { regex: /(\b\d+\.?\d*\b)/g, color: themeColors.number },
      { regex: /([{}()\[\];,.<>+\-*/%=!&|?:])/g, color: themeColors.operator },
      { regex: /(\b\w+)(\s*\()/g, color: themeColors.function }
    ],
    python: [
      { regex: /(\b(def|class|if|else|elif|for|while|return|import|from|as|try|except|finally|with|lambda|yield|async|await|True|False|None)\b)/g, color: themeColors.keyword },
      { regex: /(["'`])(?:(?=(\\?))\2.)*?\1/g, color: themeColors.string },
      { regex: /(#.*$)/gm, color: themeColors.comment },
      { regex: /(\b\d+\.?\d*\b)/g, color: themeColors.number },
      { regex: /([{}()\[\];,.<>+\-*/%=!&|?:])/g, color: themeColors.operator },
      { regex: /(\b\w+)(\s*\()/g, color: themeColors.function }
    ]
  }
  
  let highlighted = code
  const langPatterns = patterns[language] || patterns.javascript
  
  langPatterns.forEach(({ regex, color }) => {
    highlighted = highlighted.replace(regex, `<span style="color: ${color}">$1</span>`)
  })
  
  return highlighted
}

export default function CodeSnippets({ config, ideFeatures }) {
  const [copiedIndex, setCopiedIndex] = useState(-1)
  
  const snippets = ideFeatures?.code_snippets_list || []
  const vsCodeTheme = ideFeatures?.vs_code_theme || 'dark'
  const font = ideFeatures?.editor_font || ''
  
  if (!snippets || snippets.length === 0) {
    return null
  }
  
  const themeStyles = getVSCodeThemeStyles(vsCodeTheme)
  
  const handleCopy = async (code, index) => {
    try {
      await navigator.clipboard.writeText(code)
      setCopiedIndex(index)
      setTimeout(() => setCopiedIndex(-1), 2000)
    } catch (error) {
      console.error('Failed to copy code:', error)
    }
  }
  
  return (
    <section id="code-snippets" className="min-h-screen py-20 sm:py-24 lg:py-32 overflow-x-hidden w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-12 text-center">Code Snippets</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {snippets.map((snippet, index) => {
            const codeStyle = {
              backgroundColor: themeStyles.background,
              color: themeStyles.foreground,
              border: `1px solid ${themeStyles.border}`,
              fontFamily: font ? `"${font}", monospace` : 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace'
            }
            
            return (
              <div key={snippet.id || index} className="relative">
                <div className="rounded-lg overflow-hidden shadow-lg" style={codeStyle}>
                  <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: themeStyles.border, backgroundColor: themeStyles.background }}>
                    <div className="flex items-center gap-3">
                      <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      </div>
                      <span className="text-sm opacity-70" style={{ color: themeStyles.foreground }}>
                        {snippet.title || `Snippet ${index + 1}`}
                      </span>
                      {snippet.language && (
                        <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: themeStyles.border, color: themeStyles.foreground }}>
                          {snippet.language}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => handleCopy(snippet.code, index)}
                      className="p-1.5 hover:bg-white/10 rounded transition-colors"
                      style={{ color: themeStyles.foreground }}
                      title="Copy code"
                    >
                      {copiedIndex === index ? (
                        <Check className="w-4 h-4 text-green-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  <div className="p-4 overflow-x-auto">
                    <pre className="m-0 text-sm leading-relaxed" style={{ fontFamily: codeStyle.fontFamily }}>
                      <code
                        dangerouslySetInnerHTML={{
                          __html: highlightCode(snippet.code, snippet.language, vsCodeTheme)
                        }}
                      />
                    </pre>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

