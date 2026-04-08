import { useState, useEffect, useRef } from 'react'

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

const TRANSLATIONS = [
  { label: 'King James Version', value: 'kjv' },
  { label: 'American Standard Version', value: 'asv' }
]

const API = import.meta.env.VITE_API_URL || ''

export default function BibleReader({ onLogged }) {
  const [book, setBook] = useState(BOOKS[0])
  const [chapter, setChapter] = useState(1)
  const [translation, setTranslation] = useState('kjv')
  const [verses, setVerses] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [logged, setLogged] = useState(false)
  const [logMessage, setLogMessage] = useState('')
  const topRef = useRef(null)

  useEffect(() => {
    fetchChapter()
  }, [book, chapter, translation])

  useEffect(() => {
    setLogged(false)
    setLogMessage('')
  }, [book, chapter])

  function fetchChapter() {
    setLoading(true)
    setError('')
    setVerses([])
    const bookName = book.name.replace(/ /g, '+')
    fetch(`https://bible-api.com/${bookName}+${chapter}?translation=${translation}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setError('Could not load this chapter.')
        } else {
          setVerses(data.verses)
        }
        setLoading(false)
      })
      .catch(() => {
        setError('Network error. Please try again.')
        setLoading(false)
      })
  }

  function handleBookChange(e) {
    const selected = BOOKS.find(b => b.name === e.target.value)
    setBook(selected)
    setChapter(1)
  }

  function goToChapter(num) {
    setChapter(num)
    topRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  function handleLog() {
    const today = new Date().toISOString().split('T')[0]
    fetch(`${API}/api/log`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ book: book.name, chapter, date: today, notes: '' })
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setLogMessage(data.error)
        } else {
          setLogged(true)
          setLogMessage('Chapter logged!')
          if (onLogged) onLogged()
        }
      })
  }

  return (
    <div ref={topRef}>
      <div className="card" style={{ marginBottom: '16px' }}>
        <h2>Read the Bible</h2>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '12px' }}>
          <div style={{ flex: 1, minWidth: '160px' }}>
            <label>Book
              <select value={book.name} onChange={handleBookChange}>
                {BOOKS.map(b => <option key={b.name} value={b.name}>{b.name}</option>)}
              </select>
            </label>
          </div>
          <div style={{ minWidth: '120px' }}>
            <label>Translation
              <select value={translation} onChange={e => setTranslation(e.target.value)}>
                {TRANSLATIONS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </label>
          </div>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '14px' }}>
          {Array.from({ length: book.chapters }, (_, i) => i + 1).map(num => (
            <button
              key={num}
              onClick={() => goToChapter(num)}
              style={{
                padding: '4px 10px',
                fontSize: '13px',
                background: num === chapter ? 'var(--accent)' : 'transparent',
                border: '1px solid var(--border)',
                color: num === chapter ? '#0f172a' : 'var(--muted)',
                borderRadius: '6px',
                fontWeight: num === chapter ? '700' : '400'
              }}
            >
              {num}
            </button>
          ))}
        </div>
      </div>

      <div className="card">
        {loading && <p style={{ color: 'var(--muted)' }}>Loading...</p>}
        {error && <p className="error">{error}</p>}

        {!loading && verses.length > 0 && (
          <>
            <h3 style={{ marginBottom: '16px', color: 'var(--accent)' }}>
              {book.name} {chapter} — {TRANSLATIONS.find(t => t.value === translation)?.label}
            </h3>

            <div style={{ lineHeight: '2', fontSize: '16px' }}>
              {verses.map(v => (
                <span key={v.verse}>
                  <sup style={{ color: 'var(--accent)', fontSize: '11px', marginRight: '3px' }}>
                    {v.verse}
                  </sup>
                  {v.text}{' '}
                </span>
              ))}
            </div>

            <div style={{ marginTop: '32px', display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
              {chapter > 1 && (
                <button
                  onClick={() => goToChapter(chapter - 1)}
                  style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--text)' }}
                >
                  ← Previous
                </button>
              )}

              {chapter < book.chapters && (
                <button
                  onClick={() => goToChapter(chapter + 1)}
                  style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--text)' }}
                >
                  Next →
                </button>
              )}

              <button
                onClick={handleLog}
                disabled={logged}
                style={{
                  marginLeft: 'auto',
                  background: logged ? 'transparent' : 'var(--accent)',
                  border: logged ? '1px solid var(--border)' : 'none',
                  color: logged ? 'var(--success)' : '#0f172a'
                }}
              >
                {logged ? '✓ Logged' : 'Mark as Read'}
              </button>
            </div>

            {logMessage && (
              <p className={logged ? 'success' : 'error'} style={{ marginTop: '8px' }}>
                {logMessage}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  )
}