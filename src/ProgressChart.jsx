import { useState, useEffect } from 'react'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { getAuthHeaders } from './auth'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const API = import.meta.env.VITE_API_URL || ''

const BOOK_ORDER = [
  { name: 'Genesis', chapters: 50 },
  { name: 'Exodus', chapters: 40 },
  { name: 'Leviticus', chapters: 27 },
  { name: 'Numbers', chapters: 36 },
  { name: 'Deuteronomy', chapters: 34 },
  { name: 'Joshua', chapters: 24 },
  { name: 'Judges', chapters: 21 },
  { name: 'Ruth', chapters: 4 },
  { name: '1 Samuel', chapters: 31 },
  { name: '2 Samuel', chapters: 24 },
  { name: '1 Kings', chapters: 22 },
  { name: '2 Kings', chapters: 25 },
  { name: '1 Chronicles', chapters: 29 },
  { name: '2 Chronicles', chapters: 36 },
  { name: 'Ezra', chapters: 10 },
  { name: 'Nehemiah', chapters: 13 },
  { name: 'Esther', chapters: 10 },
  { name: 'Job', chapters: 42 },
  { name: 'Psalms', chapters: 150 },
  { name: 'Proverbs', chapters: 31 },
  { name: 'Ecclesiastes', chapters: 12 },
  { name: 'Song of Solomon', chapters: 8 },
  { name: 'Isaiah', chapters: 66 },
  { name: 'Jeremiah', chapters: 52 },
  { name: 'Lamentations', chapters: 5 },
  { name: 'Ezekiel', chapters: 48 },
  { name: 'Daniel', chapters: 12 },
  { name: 'Hosea', chapters: 14 },
  { name: 'Joel', chapters: 3 },
  { name: 'Amos', chapters: 9 },
  { name: 'Obadiah', chapters: 1 },
  { name: 'Jonah', chapters: 4 },
  { name: 'Micah', chapters: 7 },
  { name: 'Nahum', chapters: 3 },
  { name: 'Habakkuk', chapters: 3 },
  { name: 'Zephaniah', chapters: 3 },
  { name: 'Haggai', chapters: 2 },
  { name: 'Zechariah', chapters: 14 },
  { name: 'Malachi', chapters: 4 },
  { name: 'Matthew', chapters: 28 },
  { name: 'Mark', chapters: 16 },
  { name: 'Luke', chapters: 24 },
  { name: 'John', chapters: 21 },
  { name: 'Acts', chapters: 28 },
  { name: 'Romans', chapters: 16 },
  { name: '1 Corinthians', chapters: 16 },
  { name: '2 Corinthians', chapters: 13 },
  { name: 'Galatians', chapters: 6 },
  { name: 'Ephesians', chapters: 6 },
  { name: 'Philippians', chapters: 4 },
  { name: 'Colossians', chapters: 4 },
  { name: '1 Thessalonians', chapters: 5 },
  { name: '2 Thessalonians', chapters: 3 },
  { name: '1 Timothy', chapters: 6 },
  { name: '2 Timothy', chapters: 4 },
  { name: 'Titus', chapters: 3 },
  { name: 'Philemon', chapters: 1 },
  { name: 'Hebrews', chapters: 13 },
  { name: 'James', chapters: 5 },
  { name: '1 Peter', chapters: 5 },
  { name: '2 Peter', chapters: 3 },
  { name: '1 John', chapters: 5 },
  { name: '2 John', chapters: 1 },
  { name: '3 John', chapters: 1 },
  { name: 'Jude', chapters: 1 },
  { name: 'Revelation', chapters: 22 }
]

const TOTAL_CHAPTERS = 1189

export default function ProgressChart({ refresh }) {
  const [bookData, setBookData] = useState([])
  const [overallPercent, setOverallPercent] = useState(0)

  useEffect(() => {
    fetch(`${API}/api/progress`, { headers: getAuthHeaders() })
      .then(res => res.json())
      .then(data => {
        if (!Array.isArray(data)) return

        // Build a lookup from API response
        const lookup = {}
        data.forEach(row => { lookup[row.book] = row.count })

        // Sort by Bible order, only include books with at least 1 chapter logged
        const ordered = BOOK_ORDER
          .filter(b => lookup[b.name])
          .map(b => ({
            name: b.name,
            total: b.chapters,
            read: lookup[b.name],
            percent: ((lookup[b.name] / b.chapters) * 100).toFixed(1),
            complete: lookup[b.name] >= b.chapters
          }))

        const totalRead = data.reduce((sum, row) => sum + row.count, 0)
        setOverallPercent(((totalRead / TOTAL_CHAPTERS) * 100).toFixed(1))
        setBookData(ordered)
      })
  }, [refresh])

  if (bookData.length === 0) return <p>Log some readings to see your progress.</p>

  const completedBooks = bookData.filter(b => b.complete)
  const inProgressBooks = bookData.filter(b => !b.complete)

  const chartData = inProgressBooks.length > 0 ? {
    labels: inProgressBooks.map(b => b.name),
    datasets: [{
      label: '% of Book Read',
      data: inProgressBooks.map(b => b.percent),
      backgroundColor: 'rgba(56, 189, 248, 0.6)',
      borderColor: 'rgba(56, 189, 248, 1)',
      borderWidth: 1
    }]
  } : null

  return (
    <div>
      <h2>Bible Progress</h2>
      <p style={{ color: 'var(--muted)', marginBottom: '24px' }}>
        Overall: <strong style={{ color: 'var(--text)' }}>{overallPercent}%</strong> of the entire Bible read
      </p>

      {completedBooks.length > 0 && (
        <div className="card" style={{ marginBottom: '24px' }}>
          <h3 style={{ marginBottom: '14px' }}>✅ Completed Books ({completedBooks.length})</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {completedBooks.map(b => (
              <div
                key={b.name}
                style={{
                  background: 'rgba(74, 222, 128, 0.1)',
                  border: '1px solid rgba(74, 222, 128, 0.3)',
                  borderRadius: '8px',
                  padding: '6px 12px',
                  fontSize: '14px',
                  color: 'var(--success)',
                  fontWeight: '600'
                }}
              >
                ✓ {b.name}
              </div>
            ))}
          </div>
        </div>
      )}

      {chartData && (
        <div className="card">
          <h3 style={{ marginBottom: '16px' }}>In Progress</h3>
          <Bar
            data={chartData}
            options={{
              indexAxis: 'y',
              responsive: true,
              plugins: {
                legend: { display: false },
                tooltip: {
                  callbacks: {
                    label: context => {
                      const book = inProgressBooks[context.dataIndex]
                      return `${context.raw}% — ${book.read} of ${book.total} chapters`
                    }
                  }
                }
              },
              scales: {
                x: {
                  beginAtZero: true,
                  max: 100,
                  ticks: { callback: value => `${value}%` }
                }
              }
            }}
          />
        </div>
      )}
    </div>
  )
}