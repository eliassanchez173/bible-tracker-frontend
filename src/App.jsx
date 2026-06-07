// src/BibleReader.jsx
import { useState } from 'react'
import { getAuthHeaders } from './auth'

const API = import.meta.env.VITE_API_URL || ''

const BOOKS = [
  'Genesis','Exodus','Leviticus','Numbers','Deuteronomy','Joshua','Judges','Ruth',
  '1 Samuel','2 Samuel','1 Kings','2 Kings','1 Chronicles','2 Chronicles','Ezra',
  'Nehemiah','Esther','Job','Psalms','Proverbs','Ecclesiastes','Song of Solomon',
  'Isaiah','Jeremiah','Lamentations','Ezekiel','Daniel','Hosea','Joel','Amos',
  'Obadiah','Jonah','Micah','Nahum','Habakkuk','Zephaniah','Haggai','Zechariah',
  'Malachi','Matthew','Mark','Luke','John','Acts','Romans','1 Corinthians',
  '2 Corinthians','Galatians','Ephesians','Philippians','Colossians',
  '1 Thessalonians','2 Thessalonians','1 Timothy','2 Timothy','Titus','Philemon',
  'Hebrews','James','1 Peter','2 Peter','1 John','2 John','3 John','Jude','Revelation'
]

export default function BibleReader({ onLogged }) {
  const [book, setBook] = useState('John')
  const [chapter, setChapter] = useState(1)
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [logMessage, setLogMessage] = useState('')

  async function fetchChapter() {
    setLoading(true)
    setError('')
    setText('')
    setLogMessage('')
    try {
      const res = await fetch(`${API}/get_chapter_text?book=${encodeURIComponent(book)}&chapter=${chapter}`)
      const data = await res.json()
      if (data.error) setError(data.error)
      else setText(data.text)
    } catch {
      setError('Failed to load chapter.')
    }
    setLoading(false)
  }

  async function logThisChapter() {
    const today = new Date().toISOString().split('T')[0]
    const res = await fetch(`${API}/api/log`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify({ book, chapter, date: today, notes: '' })
    })
    const data = await res.json()
    setLogMessage(data.message || 'Logged!')
    if (onLogged) onLogged()
  }

  return (
    <div className="bible-reader">
      <h2>Read a Chapter</h2>
      <div className="reader-controls">
        <select value={book} onChange={e => setBook(e.target.value)}>
          {BOOKS.map(b => <option key={b}>{b}</option>)}
        </select>
        <input
          type="number"
          min={1}
          max={150}
          value={chapter}
          onChange={e => setChapter(Number(e.target.value))}
        />
        <button onClick={fetchChapter}>Load</button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}

      {text && (
        <>
          <div className="chapter-text" style={{ whiteSpace: 'pre-wrap', fontFamily: 'Georgia, serif', lineHeight: '1.9', marginTop: '1rem' }}>
            {text}
          </div>
          <button onClick={logThisChapter} style={{ marginTop: '1rem' }}>
            ✅ Mark as Read
          </button>
          {logMessage && <p style={{ color: 'green' }}>{logMessage}</p>}
        </>
      )}
    </div>
  )
}