'use client'

import { useState } from 'react'
import POTUploader from '@/components/POTUploader'
import TranslationEditor from '@/components/TranslationEditor'
import { parsePOTFile, generatePOFile, POTFile } from '@/lib/pot-parser'

export default function Home() {
  const [potFile, setPotFile] = useState<POTFile | null>(null)
  const [translations, setTranslations] = useState<Record<string, string>>({})
  const [language, setLanguage] = useState('es')
  const [filename, setFilename] = useState('')

  const handleFileLoaded = (content: string, file: string) => {
    try {
      const parsed = parsePOTFile(content)
      setPotFile(parsed)
      setFilename(file.replace(/\.(pot|po)$/i, ''))
      
      // Initialize translations with original text
      const initialTranslations: Record<string, string> = {}
      parsed.entries.forEach((entry) => {
        const key = entry.msgctxt ? `${entry.msgctxt}\u0004${entry.msgid}` : entry.msgid
        initialTranslations[key] = entry.msgid
      })
      setTranslations(initialTranslations)
    } catch (error) {
      console.error('Error parsing POT file:', error)
      alert('Error parsing POT file. Please check the file format.')
    }
  }

  const handleTranslationChange = (key: string, value: string) => {
    setTranslations((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleExport = () => {
    if (!potFile) return

    const poContent = generatePOFile(potFile, translations, language)
    const blob = new Blob([poContent], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${filename}-${language}.po`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleReset = () => {
    setPotFile(null)
    setTranslations({})
    setFilename('')
  }

  const commonLanguages = [
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'ru', name: 'Russian' },
    { code: 'ja', name: 'Japanese' },
    { code: 'zh', name: 'Chinese' },
    { code: 'ar', name: 'Arabic' },
    { code: 'hi', name: 'Hindi' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            POT File Translator
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Upload a POT file, translate entries, and generate PO files for WordPress plugins
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 space-y-6">
          {!potFile ? (
            <POTUploader onFileLoaded={handleFileLoaded} />
          ) : (
            <>
              {/* File Info and Controls */}
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-4">
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Loaded File</div>
                  <div className="font-medium text-gray-900 dark:text-white">{filename}.pot</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {potFile.entries.length} entries
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {commonLanguages.map((lang) => (
                      <option key={lang.code} value={lang.code}>
                        {lang.name}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={handleExport}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                  >
                    Export PO File
                  </button>
                  <button
                    onClick={handleReset}
                    className="px-6 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg font-medium transition-colors"
                  >
                    Load New File
                  </button>
                </div>
              </div>

              {/* Translation Editor */}
              <TranslationEditor
                entries={potFile.entries}
                translations={translations}
                onTranslationChange={handleTranslationChange}
                language={language}
              />
            </>
          )}
        </div>

        {/* Info Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-4 shadow">
            <div className="text-2xl mb-2">📤</div>
            <h3 className="font-semibold mb-1">Upload POT File</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Upload your WordPress plugin POT file to get started
            </p>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-lg p-4 shadow">
            <div className="text-2xl mb-2">✏️</div>
            <h3 className="font-semibold mb-1">Translate Entries</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Edit translations for each string in your preferred language
            </p>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-lg p-4 shadow">
            <div className="text-2xl mb-2">💾</div>
            <h3 className="font-semibold mb-1">Export PO File</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Download the translated PO file ready for WordPress
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
