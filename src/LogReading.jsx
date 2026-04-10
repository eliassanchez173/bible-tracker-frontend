import { useState } from 'react'
import { getAuthHeaders } from './auth'

const API = import.meta.env.VITE_API_URL || ''

const BOOKS = [
  { name: 'Genesis', chapters: 50 }, { name: 'Exodus', chapters: 40 },
  { name: 'Leviticus', chapters: 27 }, { name: 'Numbers', chapters: 36 },
  { name: 'Deuteronomy', chapters: 34 }, { name: 'Joshua', chapters: 24 },
  { name: 'Judges', chapters: 21 }, { name: 'Ruth', chapters: 4 },
  { name: '1 Samuel', chapters: 31 }, { name: '2 Samuel', chapters: 24 },
  { name: '1 Kings', chapters: 22 }, { name: '2 Kings', chapters: 25 },
  { name: '1 Chronicles', chapters: 29 }, { name: '2 Chronicles', chapters: 36 },
  { name: 'Ezra', chapters: 10 }, { name: 'Nehemiah', chapters: 13 },
  { name: 'Esther', chapters: 10 }, { name: 'Job', chapters: 42 },
  { name: 'Psalms', chapters: 150 }, { name: 'Proverbs', chapters: 31 },
  { name: 'Ecclesiastes', chapters: 12 }, { name: 'Song of Solomon', chapters: 8 },
  { name: 'Isaiah', chapters: 66 }, { name: 'Jeremiah', chapters: 52 },
  { name: 'Lamentations', chapters: 5 }, { name: 'Ezekiel', chapters: 48 },
  { name: 'Daniel', chapters: 12 }, { name: 'Hosea', chapters: 14 },
  { name: 'Joel', chapters: 3 }, { name: 'Amos', chapters: 9 },
  { name: 'Obadiah', chapters: 1 }, { name: 'Jonah', chapters: 4 },
  { name: 'Micah', chapters: 7 }, { name: 'Nahum', chapters: 3 },
  { name: 'Habakkuk', chapters: 3 }, { name: 'Zephaniah', chapters: 3 },
  { name: 'Haggai', chapters: 2 }, { name: 'Zechariah', chapters: 14 },
  { name: 'Malachi', chapters: 4 }, { name: 'Matthew', chapters: 28 },
  { name: 'Mark', chapters: 16 }, { name: 'Luke', chapters: 24 },
  { name: 'John', chapters: 21 }, { name: 'Acts', chapters: 28 },
  { name: 'Romans', chapters: 16 }, { name: '1 Corinthians', chapters: 16 },
  { name: '2 Corinthians', chapters: 13 }, { name: 'Galatians', chapters: 6 },
  { name: 'Ephesians', chapters: 6 }, { name: 'Philippians', chapters: 4 },
  { name: 'Colossians', chapters: 4 }, { name: '1 Thessalonians', chapters: 5 },
  { name: '2 Thessalonians', chapters: 3 }, { name: '1 Timothy', chapters: 6 },
  { name: '2 Timothy', chapters: 4 }, { name: 'Titus', chapters: 3 },
  { name: 'Philemon', chapters: 1 }, { name: 'Hebrews', chapters: 13 },
  { name: 'James', chapters: 5 }, { name: '1 Peter', chapters: 5 },
  { name: '2 Peter', chapters: 3 }, { name: '1 John', chapters: 5 },
  { name: '2 John', chapters: 1 }, { name: '3 John', chapters: 1 },
  { name: 'Jude', chapters: 1 }, { name: 'Revelation', chapters: 22 }
]

export default function LogReading({ onLogged }) {
  const [book, setBook] = useState(BOOKS[0])
  const [mode, setMode] = useState('single') // 'single', 'range', 'whole'
  const [chapter, setChapter] = useState('')
  const [rangeStart, setRangeStart] = useState('')
  const [rangeEnd, setRangeEnd] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [notes, setNotes] = useState('')
  const [message, setMessage] = useState('')

  function handleBookChange(e) {
    const selected = BOOKS.find(b => b.name === e.target.value)
    setBook(selected)
    setChapter('')
    setRangeStart('')
    setRangeEnd('')
    setMessage('')
  }

  function buildChapters() {
    if (mode === 'single') {
      const ch = parseInt(chapter)
      if (isNaN(ch)) return null
      return [ch]
    }
    if (mode === 'range') {
      const start = parseInt(rangeStart)
      const end = parseInt(rangeEnd)
      if (isNaN(start) || isNaN(end) || start > end) return null
      if (end > book.chapters) return null
      return Array.from({ length: end - start + 1 }, (_, i) => start + i)
    }
    if (mode === 'whole') {
      return Array.from({ length: book.chapters }, (_, i) => i + 1)
    }
    return null
  }

  function handleSubmit() {
    const chapters = buildChapters()

    if (!chapters) {
      setMessage('Please enter valid chapter information')
      return
    }

    fetch(`${API}/api/log`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        book: book.name,
        chapter: chapters,
        date,
        notes
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setMessage(data.error)
        } else {
          setMessage(data.message)
          setChapter('')
          setRangeStart('')
          setRangeEnd('')
          setNotes('')
          if (onLogged) onLogged()
        }
      })
  }

  return (
    <div className="card">
      <h2>Log a Reading</h2>
      {message && (
        <p className={message.includes('logged') ? 'success' : 'error'}>{message}</p>
      )}

      <label>Book
        <select value={book.name} onChange={handleBookChange}>
          {BOOKS.map(b => <option key={b.name} value={b.name}>{b.name}</option>)}
        </select>
      </label>

      <label>Mode
        <select value={mode} onChange={e => { setMode(e.target.value); setMessage('') }}>
          <option value="single">Single Chapter</option>
          <option value="range">Chapter Range</option>
          <option value="whole">Whole Book</option>
        </select>
      </label>

      {mode === 'single' && (
        <label>Chapter
          <input
            type="number"
            placeholder={`1 - ${book.chapters}`}
            value={chapter}
            onChange={e => setChapter(e.target.value)}
          />
        </label>
      )}

      {mode === 'range' && (
        <div style={{ display: 'flex', gap: '12px' }}>
          <label style={{ flex: 1 }}>From
            <input
              type="number"
              placeholder="1"
              value={rangeStart}
              onChange={e => setRangeStart(e.target.value)}
            />
          </label>
          <label style={{ flex: 1 }}>To
            <input
              type="number"
              placeholder={`${book.chapters}`}
              value={rangeEnd}
              onChange={e => setRangeEnd(e.target.value)}
            />
          </label>
        </div>
      )}

      {mode === 'whole' && (
        <p style={{ color: 'var(--muted)', marginTop: '12px', fontSize: '14px' }}>
          This will log all {book.chapters} chapters of {book.name}.
        </p>
      )}

      <label>Date
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
        />
      </label>

      <label>Notes (optional)
        <textarea
          placeholder="What stood out to you?"
          value={notes}
          onChange={e => setNotes(e.target.value)}
          rows={3}
        />
      </label>

      <div className="form-actions">
        <button onClick={handleSubmit}>Log Reading</button>
      </div>
    </div>
  )
}