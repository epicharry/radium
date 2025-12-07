import ColorPicker from './ColorPicker'
import FontSelector from './FontSelector'

export default function StyleSection({ 
  section, 
  styles, 
  onUpdate, 
  title,
  disabled = false
}) {
  const updateStyle = (key, value) => {
    if (disabled) return
    onUpdate({
      ...styles,
      [key]: value
    })
  }

  return (
    <div className={`space-y-4 ${disabled ? 'pointer-events-none opacity-50' : ''}`}>
      <h3 className="text-lg font-semibold mb-4">{title} Styling</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ColorPicker
          label="Background Color"
          value={styles.background_color || ''}
          onChange={(val) => updateStyle('background_color', val)}
          allowGradient={true}
          disabled={disabled}
        />
        
        <div>
          <label className="block text-sm font-medium mb-2">Background Opacity</label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={styles.background_opacity || 1}
              onChange={(e) => updateStyle('background_opacity', parseFloat(e.target.value))}
              disabled={disabled}
              className="flex-1"
            />
            <span className="text-sm text-gray-400 w-12">{(styles.background_opacity || 1).toFixed(1)}</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Background Blur</label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min="0"
              max="50"
              step="1"
              value={styles.background_blur || 0}
              onChange={(e) => updateStyle('background_blur', parseInt(e.target.value))}
              disabled={disabled}
              className="flex-1"
            />
            <span className="text-sm text-gray-400 w-12">{styles.background_blur || 0}px</span>
          </div>
        </div>

        <ColorPicker
          label="Title Color"
          value={styles.title_color || '#ffffff'}
          onChange={(val) => updateStyle('title_color', val)}
          disabled={disabled}
        />

        <FontSelector
          label="Title Font"
          value={styles.title_font || 'font-mono'}
          onChange={(val) => updateStyle('title_font', val)}
          disabled={disabled}
        />

        <div>
          <label className="block text-sm font-medium mb-2">Title Size</label>
          <select
            value={styles.title_size || 'text-4xl'}
            onChange={(e) => updateStyle('title_size', e.target.value)}
            disabled={disabled}
            className="w-full px-4 py-2 bg-black/50 border border-white/20 rounded-lg focus:border-white/40 focus:outline-none transition-colors"
          >
            <option value="text-xs">Extra Small</option>
            <option value="text-sm">Small</option>
            <option value="text-base">Base</option>
            <option value="text-lg">Large</option>
            <option value="text-xl">XL</option>
            <option value="text-2xl">2XL</option>
            <option value="text-3xl">3XL</option>
            <option value="text-4xl">4XL</option>
            <option value="text-5xl">5XL</option>
            <option value="text-6xl">6XL</option>
            <option value="text-7xl">7XL</option>
            <option value="text-8xl">8XL</option>
          </select>
        </div>

        {styles.subtitle_color !== undefined && (
          <>
            <ColorPicker
              label="Subtitle Color"
              value={styles.subtitle_color || '#ffffff'}
              onChange={(val) => updateStyle('subtitle_color', val)}
              disabled={disabled}
            />
            <FontSelector
              label="Subtitle Font"
              value={styles.subtitle_font || 'font-mono'}
              onChange={(val) => updateStyle('subtitle_font', val)}
              disabled={disabled}
            />
            <div>
              <label className="block text-sm font-medium mb-2">Subtitle Size</label>
              <select
                value={styles.subtitle_size || 'text-2xl'}
                onChange={(e) => updateStyle('subtitle_size', e.target.value)}
                disabled={disabled}
                className="w-full px-4 py-2 bg-black/50 border border-white/20 rounded-lg focus:border-white/40 focus:outline-none transition-colors"
              >
                <option value="text-sm">Small</option>
                <option value="text-base">Base</option>
                <option value="text-lg">Large</option>
                <option value="text-xl">XL</option>
                <option value="text-2xl">2XL</option>
                <option value="text-3xl">3XL</option>
              </select>
            </div>
          </>
        )}

        {styles.description_color !== undefined && (
          <>
            <ColorPicker
              label="Description Color"
              value={styles.description_color || '#d1d5db'}
              onChange={(val) => updateStyle('description_color', val)}
              disabled={disabled}
            />
            <FontSelector
              label="Description Font"
              value={styles.description_font || 'font-mono'}
              onChange={(val) => updateStyle('description_font', val)}
              disabled={disabled}
            />
            <div>
              <label className="block text-sm font-medium mb-2">Description Size</label>
              <select
                value={styles.description_size || 'text-base'}
                onChange={(e) => updateStyle('description_size', e.target.value)}
                disabled={disabled}
                className="w-full px-4 py-2 bg-black/50 border border-white/20 rounded-lg focus:border-white/40 focus:outline-none transition-colors"
              >
                <option value="text-xs">Extra Small</option>
                <option value="text-sm">Small</option>
                <option value="text-base">Base</option>
                <option value="text-lg">Large</option>
                <option value="text-xl">XL</option>
              </select>
            </div>
          </>
        )}

        {styles.card_background !== undefined && (
          <>
            <ColorPicker
              label="Card Background"
              value={styles.card_background || 'rgba(255, 255, 255, 0.05)'}
              onChange={(val) => updateStyle('card_background', val)}
              allowGradient={true}
              disabled={disabled}
            />
            <ColorPicker
              label="Card Border Color"
              value={styles.card_border || 'rgba(255, 255, 255, 0.1)'}
              onChange={(val) => updateStyle('card_border', val)}
              disabled={disabled}
            />
            <div>
              <label className="block text-sm font-medium mb-2">Card Blur</label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="0"
                  max="50"
                  step="1"
                  value={styles.card_blur || 10}
                  onChange={(e) => updateStyle('card_blur', parseInt(e.target.value))}
                  disabled={disabled}
                  className="flex-1"
                />
                <span className="text-sm text-gray-400 w-12">{styles.card_blur || 10}px</span>
              </div>
            </div>
          </>
        )}

        {styles.project_title_color !== undefined && (
          <>
            <ColorPicker
              label="Project Title Color"
              value={styles.project_title_color || '#ffffff'}
              onChange={(val) => updateStyle('project_title_color', val)}
              disabled={disabled}
            />
            <ColorPicker
              label="Project Description Color"
              value={styles.project_description_color || '#d1d5db'}
              onChange={(val) => updateStyle('project_description_color', val)}
              disabled={disabled}
            />
          </>
        )}

        {styles.skill_background !== undefined && (
          <>
            <ColorPicker
              label="Skill Background"
              value={styles.skill_background || 'rgba(255, 255, 255, 0.05)'}
              onChange={(val) => updateStyle('skill_background', val)}
              allowGradient={true}
              disabled={disabled}
            />
            <ColorPicker
              label="Skill Border"
              value={styles.skill_border || 'rgba(255, 255, 255, 0.1)'}
              onChange={(val) => updateStyle('skill_border', val)}
              disabled={disabled}
            />
            <ColorPicker
              label="Skill Text Color"
              value={styles.skill_color || '#ffffff'}
              onChange={(val) => updateStyle('skill_color', val)}
              disabled={disabled}
            />
          </>
        )}

        {styles.text_color !== undefined && (
          <ColorPicker
            label="Text Color"
            value={styles.text_color || '#ffffff'}
            onChange={(val) => updateStyle('text_color', val)}
            disabled={disabled}
          />
        )}

        {styles.active_color !== undefined && (
          <ColorPicker
            label="Active Color"
            value={styles.active_color || '#ffffff'}
            onChange={(val) => updateStyle('active_color', val)}
            disabled={disabled}
          />
        )}

        {styles.hover_color !== undefined && (
          <ColorPicker
            label="Hover Color"
            value={styles.hover_color || '#ffffff'}
            onChange={(val) => updateStyle('hover_color', val)}
            disabled={disabled}
          />
        )}

        {styles.border_color !== undefined && (
          <ColorPicker
            label="Border Color"
            value={styles.border_color || 'rgba(255, 255, 255, 0.1)'}
            onChange={(val) => updateStyle('border_color', val)}
            disabled={disabled}
          />
        )}
      </div>
    </div>
  )
}

