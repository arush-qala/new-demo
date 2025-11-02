import { useRef, useEffect } from 'react'
import { useThree } from '@react-three/fiber'

type VideoRecorderProps = {
  isRecording: boolean
  onStop: (blob: Blob) => void
}

export const VideoRecorder: React.FC<VideoRecorderProps> = ({ isRecording, onStop }) => {
  const { gl } = useThree()
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const streamRef = useRef<MediaStream | null>(null)

  useEffect(() => {
    if (isRecording) {
      startRecording()
    } else {
      stopRecording()
    }

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
    }
  }, [isRecording])

  const startRecording = async () => {
    try {
      // Capture the canvas as a stream
      const canvas = gl.domElement
      const stream = canvas.captureStream(30) // 30 fps
      streamRef.current = stream

      // Create MediaRecorder
      const options = {
        mimeType: 'video/webm;codecs=vp9',
        videoBitsPerSecond: 2500000, // 2.5 Mbps
      }

      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        options.mimeType = 'video/webm;codecs=vp8'
      }
      
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        options.mimeType = 'video/webm'
      }

      const mediaRecorder = new MediaRecorder(stream, options)
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' })
        onStop(blob)
      }

      mediaRecorder.start(100) // Collect data every 100ms
    } catch (error) {
      console.error('Error starting video recording:', error)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop()
    }
  }

  return null // This component doesn't render anything
}

