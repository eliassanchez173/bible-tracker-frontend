import { useState, useEffect } from 'react'

const API = ''

export default function StreakDisplay({ refresh }) {
  const [streak, setStreak] = useState(0)

  useEffect(() => {
    fetch(`${API}/api/streak`, { credentials: 'include' })
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