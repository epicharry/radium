import { useRef, useEffect } from 'react'

export default function HiddenAudioPlayer({ audioUrl, isEnabled, autoPlay = false }) {
  const audioRef = useRef(null)

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.5
      audioRef.current.loop = true
    }
  }, [])

  useEffect(() => {
    if (audioRef.current && isEnabled && audioUrl && autoPlay) {
      const playPromise = audioRef.current.play()
      if (playPromise !== undefined) {
        playPromise.catch(err => {
          console.error('Error playing audio:', err)
        })
      }
    } else if (audioRef.current) {
      audioRef.current.pause()
    }
  }, [isEnabled, audioUrl, autoPlay])

  if (!isEnabled || !audioUrl) return null

  return <audio ref={audioRef} src={audioUrl} style={{ display: 'none' }} />
}


