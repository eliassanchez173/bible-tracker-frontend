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

const BOOK_CHAPTERS = {
  'Genesis': 50, 'Exodus': 40, 'Leviticus': 27, 'Numbers': 36, 'Deuteronomy': 34,
  'Joshua': 24, 'Judges': 21, 'Ruth': 4, '1 Samuel': 31, '2 Samuel': 24,
  '1 Kings': 22, '2 Kings': 25, '1 Chronicles': 29, '2 Chronicles': 36,
  'Ezra': 10, 'Nehemiah': 13, 'Esther': 10, 'Job': 42, 'Psalms': 150,
  'Proverbs': 31, 'Ecclesiastes': 12, 'Song of Solomon': 8, 'Isaiah': 66,
  'Jeremiah': 52, 'Lamentations': 5, 'Ezekiel': 48, 'Daniel': 12, 'Hosea': 14,
  'Joel': 3, 'Amos': 9, 'Obadiah': 1, 'Jonah': 4, 'Micah': 7, 'Nahum': 3,
  'Habakkuk': 3, 'Zephaniah': 3, 'Haggai': 2, 'Zechariah': 14, 'Malachi': 4,
  'Matthew': 28, 'Mark': 16, 'Luke': 24, 'John': 21, 'Acts': 28, 'Romans': 16,
  '1 Corinthians': 16, '2 Corinthians': 13, 'Galatians': 6, 'Ephesians': 6,
  'Philippians': 4, 'Colossians': 4, '1 Thessalonians': 5, '2 Thessalonians': 3,
  '1 Timothy': 6, '2 Timothy': 4, 'Titus': 3, 'Philemon': 1, 'Hebrews': 13,
  'James': 5, '1 Peter': 5, '2 Peter': 3, '1 John': 5, '2 John': 1,
  '3 John': 1, 'Jude': 1, 'Revelation': 22
}

const TOTAL_CHAPTERS = 1189

export default function ProgressChart({ refresh }) {
  const [chartData, setChartData] = useState(null)
  const [overallPercent, setOverallPercent] = useState(0)

  useEffect(() => {
    fetch(`${API}/api/progress`, { headers: getAuthHeaders() })
      .then(res => res.json())
      .then(data => {
        if (!Array.isArray(data) || data.length === 0) return
        const totalRead = data.reduce((sum, row) => sum + row.count, 0)
        setOverallPercent(((totalRead / TOTAL_CHAPTERS) * 100).toFixed(1))
        const labels = data.map(row => row.book)
        const percentages = data.map(row => {
          const totalInBook = BOOK_CHAPTERS[row.book] || 1
          return ((row.count / totalInBook) * 100).toFixed(1)
        })
        setChartData({
          labels,
          datasets: [{
            label: '% of Book Read',
            data: percentages,
            backgroundColor: 'rgba(56, 189, 248, 0.6)',
            borderColor: 'rgba(56, 189, 248, 1)',
            borderWidth: 1
          }]
        })
      })
  }, [refresh])

  if (!chartData) return <p>Log some readings to see your progress chart.</p>

  return (
    <div>
      <h2>Bible Progress</h2>
      <p>Overall: <strong>{overallPercent}%</strong> of the entire Bible read</p>
      <h3>Progress by Book</h3>
      <Bar
        data={chartData}
        options={{
          indexAxis: 'y',
          responsive: true,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: context => `${context.raw}% complete`
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
  )
}