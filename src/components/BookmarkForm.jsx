// components/BookmarkForm.js
// THE ADD FORM - Like a form at a library to add new books

'use client'

import { createClient } from '@/lib/supabase-browser'
import { useState } from 'react'


export default function BookmarkForm({ userId }) {
 // State – remembering things
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const supabase = createClient()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!url.trim() || !title.trim()) {
      setError('Please fill in all fields')
      return
    }

    setLoading(true)
    setError('')

    try {
      let formattedUrl = url.trim()

      if (
        !formattedUrl.startsWith('http://') &&
        !formattedUrl.startsWith('https://')
      ) {
        formattedUrl = 'https://' + formattedUrl
      }

      const { error: insertError } = await supabase
        .from('bookmarks')
        .insert([
          {
            url: formattedUrl,
            title: title.trim(),
            user_id: userId,
          },
        ])

      if (insertError) throw insertError

      setUrl('')
      setTitle('')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }


  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* URL Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Website URL
        </label>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        />
        <p className="text-xs text-gray-500 mt-1">
          Tip: You don't need to type https://, we'll add it for you
        </p>
      </div>

      {/* Title Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="My Favorite Website"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <span className="animate-spin">⏳</span>
            Adding...
          </>
        ) : (
          '+ Add Bookmark'
        )}
      </button>
    </form>
  )
}