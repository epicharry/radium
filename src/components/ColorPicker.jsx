import { useState } from 'react'
import { X } from 'lucide-react'

export default function ColorPicker({ label, value, onChange, allowGradient = false, disabled = false }) {
  const [isOpen, setIsOpen] = useState(false)
  const [colorType, setColorType] = useState(value?.startsWith('linear-gradient') ? 'gradient' : 'solid')

  const handleColorChange = (e) => {
    if (disabled) return
    onChange(e.target.value)
  }

  const handleGradientChange = (stops) => {
    if (disabled) return
    const gradient = `linear-gradient(${stops.direction || 'to right'}, ${stops.colors.join(', ')})`
    onChange(gradient)
  }

  return (
    <div>
      <label className="block text-sm font-medium mb-2">{label}</label>
      <div className="flex items-center gap-2">
        <div className="flex-1 flex items-center gap-2">
          <input
            type="color"
            value={value?.startsWith('linear-gradient') ? '#000000' : (value || '#000000')}
            onChange={handleColorChange}
            disabled={disabled || value?.startsWith('linear-gradient')}
            className="w-12 h-10 rounded border border-white/20 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <input
            type="text"
            value={value || ''}
            onChange={(e) => {
              if (!disabled) onChange(e.target.value)
            }}
            disabled={disabled}
            className="flex-1 px-3 py-2 bg-black/50 border border-white/20 rounded-lg focus:border-white/40 focus:outline-none transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            placeholder="#000000 or linear-gradient(...)"
          />
        </div>
        {allowGradient && (
          <button
            onClick={() => {
              if (!disabled) setIsOpen(!isOpen)
            }}
            disabled={disabled}
            className="px-3 py-2 text-xs border border-white/20 rounded-lg bg-white/5 hover:bg-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Gradient
          </button>
        )}
      </div>
      {allowGradient && isOpen && (
        <GradientBuilder value={value} onChange={handleGradientChange} onClose={() => setIsOpen(false)} />
      )}
    </div>
  )
}

function GradientBuilder({ value, onChange, onClose }) {
  const [direction, setDirection] = useState('to right')
  const [colors, setColors] = useState(['#000000', '#ffffff'])

  const addColor = () => {
    setColors([...colors, '#000000'])
  }

  const updateColor = (index, color) => {
    const newColors = [...colors]
    newColors[index] = color
    setColors(newColors)
    onChange({ direction, colors: newColors })
  }

  const removeColor = (index) => {
    if (colors.length > 2) {
      const newColors = colors.filter((_, i) => i !== index)
      setColors(newColors)
      onChange({ direction, colors: newColors })
    }
  }

  return (
    <div className="mt-2 p-4 border border-white/20 rounded-lg bg-black/50">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium">Gradient Builder</span>
        <button onClick={onClose} className="text-gray-400 hover:text-white">
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="space-y-3">
        <div>
          <label className="block text-xs mb-1">Direction</label>
          <select
            value={direction}
            onChange={(e) => {
              setDirection(e.target.value)
              onChange({ direction: e.target.value, colors })
            }}
            className="w-full px-2 py-1 bg-black/50 border border-white/20 rounded text-sm"
          >
            <option value="to right">Left to Right</option>
            <option value="to bottom">Top to Bottom</option>
            <option value="to left">Right to Left</option>
            <option value="to top">Bottom to Top</option>
            <option value="45deg">Diagonal</option>
          </select>
        </div>
        <div>
          <label className="block text-xs mb-1">Colors</label>
          <div className="space-y-2">
            {colors.map((color, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => updateColor(index, e.target.value)}
                  className="w-10 h-8 rounded border border-white/20"
                />
                <input
                  type="text"
                  value={color}
                  onChange={(e) => updateColor(index, e.target.value)}
                  className="flex-1 px-2 py-1 bg-black/50 border border-white/20 rounded text-xs"
                />
                {colors.length > 2 && (
                  <button
                    onClick={() => removeColor(index)}
                    className="px-2 py-1 text-xs text-red-400 hover:text-red-300"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={addColor}
              className="w-full px-2 py-1 text-xs border border-white/20 rounded bg-white/5 hover:bg-white/10"
            >
              + Add Color
            </button>
          </div>
        </div>
        <div className="h-12 rounded border border-white/20" style={{
          background: `linear-gradient(${direction}, ${colors.join(', ')})`
        }} />
      </div>
    </div>
  )
}


