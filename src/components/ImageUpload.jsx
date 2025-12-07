import { useState } from 'react'
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react'

export default function ImageUpload({ 
  label, 
  value, 
  onChange, 
  onUpload,
  onDelete,
  field,
  className = '' 
}) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState(null)

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      onChange?.(null, 'Image size must be less than 5MB')
      return
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      onChange?.(null, 'Please upload a valid image (JPEG, PNG, GIF, or WebP)')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target.result)
    }
    reader.readAsDataURL(file)

    if (onUpload) {
      setUploading(true)
      try {
        await onUpload(field, file)
      } catch (error) {
        onChange?.(null, error.message)
        setPreview(null)
      } finally {
        setUploading(false)
      }
    } else {
      onChange?.(file, null)
    }

    e.target.value = ''
  }

  const handleRemove = async () => {
    setPreview(null)
    if (onDelete && value) {
      try {
        await onDelete(field, value)
      } catch (error) {
        console.error('Error deleting image:', error)
      }
    }
    onChange?.(null, null)
  }

  return (
    <div className={className}>
      <label className="block text-sm font-medium mb-2">{label}</label>
      <div className="flex items-center gap-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          id={`upload-${field}`}
          disabled={uploading}
        />
        <label
          htmlFor={`upload-${field}`}
          className={`flex items-center gap-2 px-4 py-2 border border-white/20 rounded-lg bg-white/5 hover:bg-white/10 cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {uploading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Uploading...</span>
            </>
          ) : (
            <>
              <Upload className="w-4 h-4" />
              <span>Upload</span>
            </>
          )}
        </label>
        
        {(preview || value) && (
          <div className="relative group">
            <img 
              src={preview || value} 
              alt={label} 
              className="w-20 h-20 object-cover rounded-lg border border-white/20"
            />
            <button
              onClick={handleRemove}
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500/80 hover:bg-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}
        
        {!preview && !value && (
          <div className="w-20 h-20 border-2 border-dashed border-white/20 rounded-lg flex items-center justify-center">
            <ImageIcon className="w-6 h-6 text-gray-500" />
          </div>
        )}
      </div>
    </div>
  )
}

