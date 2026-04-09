import { useState, useEffect } from 'react'
import { getAuthHeaders } from './auth'

const API = import.meta.env.VITE_API_URL || ''

export default function StreakDisplay({ refresh }) {
  const [streak, setStreak] = useState(0)

  useEffect(() => {
    fetch(`${API}/api/streak`, { headers: getAuthHeaders() })
      .then(res => res.json())
      .then(data => {
        if (data.streak !== undefined) setStreak(data.streak)
      })
  }, [refresh])

  return (
    <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
      <div className="streak-number">{streak}</div>
      <div className="streak-label">day{streak !== 1 ? 's' : ''} in a row</div>
    </div>
  )
}