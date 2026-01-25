'use client'

import { useState, useRef } from 'react'

interface POTUploaderProps {
  onFileLoaded: (content: string, filename: string) => void
}

export default function POTUploader({ onFileLoaded }: POTUploaderProps) {
  const [dragActive, setDragActive] = useState(false)
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = async (file: File) => {
    if (!file.name.endsWith('.pot') && !file.name.endsWith('.po')) {
      alert('Please upload a .pot or .po file')
      return
    }

    setLoading(true)
    try {
      const content = await file.text()
      onFileLoaded(content, file.name)
    } catch (error) {
      console.error('Error reading file:', error)
      alert('Error reading file. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  return (
    <div className="w-full">
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`
          border-2 border-dashed rounded-lg p-12 text-center transition-colors cursor-pointer
          ${
            dragActive
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
              : 'border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900'
          }
          ${loading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        onClick={() => !loading && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pot,.po"
          onChange={handleChange}
          disabled={loading}
          className="hidden"
        />
        <div className="space-y-4">
          <div className="text-5xl">📄</div>
          {loading ? (
            <div className="space-y-2">
              <div className="text-lg font-medium">Loading file...</div>
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          ) : (
            <>
              <div className="text-lg font-medium">
                Drag and drop your POT/PO file here, or click to select
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Supports .pot and .po files
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
