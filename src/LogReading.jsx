import { useState } from 'react'

const API = import.meta.env.VITE_API_URL || ''

const BOOKS = [
  'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy',
  'Joshua', 'Judges', 'Ruth', '1 Samuel', '2 Samuel',
  '1 Kings', '2 Kings', '1 Chronicles', '2 Chronicles',
  'Ezra', 'Nehemiah', 'Esther', 'Job', 'Psalms', 'Proverbs',
  'Ecclesiastes', 'Song of Solomon', 'Isaiah', 'Jeremiah',
  'Lamentations', 'Ezekiel', 'Daniel', 'Hosea', 'Joel', 'Amos',
  'Obadiah', 'Jonah', 'Micah', 'Nahum', 'Habakkuk', 'Zephaniah',
  'Haggai', 'Zechariah', 'Malachi', 'Matthew', 'Mark', 'Luke',
  'John', 'Acts', 'Romans', '1 Corinthians', '2 Corinthians',
  'Galatians', 'Ephesians', 'Philippians', 'Colossians',
  '1 Thessalonians', '2 Thessalonians', '1 Timothy', '2 Timothy',
  'Titus', 'Philemon', 'Hebrews', 'James', '1 Peter', '2 Peter',
  '1 John', '2 John', '3 John', 'Jude', 'Revelation'
]

export default function LogReading({ onLogged }) {
  const [book, setBook] = useState('Genesis')
  const [chapter, setChapter] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [notes, setNotes] = useState('')
  const [message, setMessage] = useState('')

  function handleSubmit() {
    if (!chapter) {
      setMessage('Please enter a chapter number')
      return
    }

    fetch(`${API}/api/log`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ book, chapter: parseInt(chapter), date, notes })
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setMessage(data.error)
        } else {
          setMessage('Reading logged!')
          setChapter('')
          setNotes('')
          if (onLogged) onLogged()
        }
      })
  }

  return (
    <div className="card">
      <h2>Log a Reading</h2>
      {message && <p className={message === 'Reading logged!' ? 'success' : 'error'}>{message}</p>}
      <label>Book
        <select value={book} onChange={e => setBook(e.target.value)}>
          {BOOKS.map(b => <option key={b} value={b}>{b}</option>)}
        </select>
      </label>
      <label>Chapter
        <input type="number" placeholder="e.g. 3" value={chapter} onChange={e => setChapter(e.target.value)} />
      </label>
      <label>Date
        <input type="date" value={date} onChange={e => setDate(e.target.value)} />
      </label>
      <label>Notes (optional)
        <textarea placeholder="What stood out to you?" value={notes} onChange={e => setNotes(e.target.value)} rows={3} />
      </label>
      <div className="form-actions">
        <button onClick={handleSubmit}>Log Reading</button>
      </div>
    </div>
  )
}