import { useState, useEffect } from 'react'
import { getAuthHeaders } from './auth'

const API = import.meta.env.VITE_API_URL || ''

export default function ReadingHistory({ refresh }) {
  const [logs, setLogs] = useState([])

  useEffect(() => {
    fetch(`${API}/api/logs`, { headers: getAuthHeaders() })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setLogs(data)
      })
  }, [refresh])

  function handleDelete(id) {
    fetch(`${API}/api/log/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    })
      .then(res => res.json())
      .then(() => {
        setLogs(logs.filter(log => log.id !== id))
      })
  }

  if (logs.length === 0) return <p style={{ color: 'var(--muted)' }}>No readings logged yet.</p>

  return (
    <div>
      <h2>Reading History</h2>
      {logs.map(log => (
        <div key={log.id} className="log-item">
          <div className="log-item-left">
            <h3>{log.book} — Chapter {log.chapter}</h3>
            <p>{log.date}{log.notes ? ` • ${log.notes}` : ''}</p>
          </div>
          <button onClick={() => handleDelete(log.id)}>Delete</button>
        </div>
      ))}
    </div>
  )
}