export default function FontSelector({ label, value, onChange, disabled = false }) {
  const fonts = [
    { name: 'System Default', value: 'font-mono' },
    { name: 'Inter', value: 'font-sans' },
    { name: 'Monospace', value: 'font-mono' },
    { name: 'Serif', value: 'font-serif' }
  ]

  return (
    <div>
      <label className="block text-sm font-medium mb-2">{label}</label>
      <select
        value={value || 'font-mono'}
        onChange={(e) => {
          if (!disabled) onChange(e.target.value)
        }}
        disabled={disabled}
        className="w-full px-4 py-2 bg-black/50 border border-white/20 rounded-lg focus:border-white/40 focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {fonts.map(font => (
          <option key={font.value} value={font.value}>{font.name}</option>
        ))}
      </select>
    </div>
  )
}


