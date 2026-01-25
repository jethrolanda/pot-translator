'use client'

import { useState, useEffect } from 'react'
import { POTEntry } from '@/lib/pot-parser'

interface TranslationEditorProps {
  entries: POTEntry[]
  translations: Record<string, string>
  onTranslationChange: (key: string, value: string) => void
  language: string
}

export default function TranslationEditor({
  entries,
  translations,
  onTranslationChange,
  language,
}: TranslationEditorProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredEntries, setFilteredEntries] = useState(entries)

  useEffect(() => {
    if (!searchTerm) {
      setFilteredEntries(entries)
      return
    }

    const filtered = entries.filter((entry) => {
      const key = entry.msgctxt ? `${entry.msgctxt}\u0004${entry.msgid}` : entry.msgid
      const searchLower = searchTerm.toLowerCase()
      return (
        entry.msgid.toLowerCase().includes(searchLower) ||
        (entry.msgctxt && entry.msgctxt.toLowerCase().includes(searchLower)) ||
        (translations[key] && translations[key].toLowerCase().includes(searchLower))
      )
    })
    setFilteredEntries(filtered)
  }, [searchTerm, entries, translations])

  const getTranslationKey = (entry: POTEntry): string => {
    return entry.msgctxt ? `${entry.msgctxt}\u0004${entry.msgid}` : entry.msgid
  }

  const translatedCount = entries.filter((entry) => {
    const key = getTranslationKey(entry)
    return translations[key] && translations[key] !== entry.msgid
  }).length

  return (
    <div className="space-y-4">
      {/* Stats and Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {translatedCount} of {entries.length} entries translated
        </div>
        <input
          type="text"
          placeholder="Search entries..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64"
        />
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${(translatedCount / entries.length) * 100}%` }}
        />
      </div>

      {/* Entries List */}
      <div className="space-y-4 max-h-[600px] overflow-y-auto">
        {filteredEntries.map((entry, index) => {
          const key = getTranslationKey(entry)
          const translation = translations[key] || entry.msgid

          return (
            <div
              key={index}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800"
            >
              {/* Context */}
              {entry.msgctxt && (
                <div className="mb-2">
                  <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">
                    Context
                  </div>
                  <div className="text-sm text-gray-700 dark:text-gray-300 font-mono bg-gray-50 dark:bg-gray-900 p-2 rounded">
                    {entry.msgctxt}
                  </div>
                </div>
              )}

              {/* Original Text */}
              <div className="mb-3">
                <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">
                  Original ({language === 'en' ? 'Source' : 'English'})
                </div>
                <div className="text-sm text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-900 p-3 rounded border border-gray-200 dark:border-gray-700">
                  {entry.msgid}
                </div>
              </div>

              {/* Translation */}
              <div>
                <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">
                  Translation
                </div>
                <textarea
                  value={translation}
                  onChange={(e) => onTranslationChange(key, e.target.value)}
                  className="w-full text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-950 p-3 rounded border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px] font-mono"
                  placeholder="Enter translation..."
                />
              </div>

              {/* References */}
              {entry.references && entry.references.length > 0 && (
                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  References: {entry.references.join(', ')}
                </div>
              )}

              {/* Comments */}
              {entry.comments && entry.comments.length > 0 && (
                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 italic">
                  {entry.comments.map((comment, i) => (
                    <div key={i}>{comment}</div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {filteredEntries.length === 0 && (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          No entries found matching "{searchTerm}"
        </div>
      )}
    </div>
  )
}
