import { useState, useEffect } from 'react'
import Login from './Login'
import Register from './Register'
import LogReading from './LogReading'
import ReadingHistory from './ReadingHistory'
import StreakDisplay from './StreakDisplay'
import ProgressChart from './ProgressChart'
import Navbar from './Navbar'
import BibleReader from './BibleReader'

const API = import.meta.env.VITE_API_URL || ''

export default function App() {
  const [user, setUser] = useState(localStorage.getItem('username'))
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState('login')
  const [view, setView] = useState('log')
  const [refresh, setRefresh] = useState(0)

  useEffect(() => {
    fetch(`${API}/api/me`, { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (data.username) {
          setUser(data.username)
          localStorage.setItem('username', data.username)
        } else {
          setUser(null)
          localStorage.removeItem('username')
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  function handleLogin(username) {
    localStorage.setItem('username', username)
    setUser(username)
  }

  function handleLogout() {
    localStorage.removeItem('username')
    setUser(null)
  }

  function handleLogged() {
    setRefresh(r => r + 1)
    setView('history')
  }

  if (loading) return <p>Loading...</p>

  if (!user) {
    if (page === 'login') {
      return <Login onLogin={handleLogin} switchToRegister={() => setPage('register')} />
    }
    return <Register onRegister={handleLogin} switchToLogin={() => setPage('login')} />
  }

  return (
    <div className="app">
      <Navbar user={user} onLogout={handleLogout} />
      <div className="tab-nav">
        <button className={`tab-btn ${view === 'log' ? 'active' : ''}`} onClick={() => setView('log')}>Log Reading</button>
        <button className={`tab-btn ${view === 'read' ? 'active' : ''}`} onClick={() => setView('read')}>Read</button>
        <button className={`tab-btn ${view === 'streak' ? 'active' : ''}`} onClick={() => setView('streak')}>Streak</button>
        <button className={`tab-btn ${view === 'history' ? 'active' : ''}`} onClick={() => setView('history')}>History</button>
        <button className={`tab-btn ${view === 'progress' ? 'active' : ''}`} onClick={() => setView('progress')}>Progress</button>
      </div>
      <div className="main-content">
        {view === 'log' && <LogReading onLogged={handleLogged} />}
        {view === 'read' && <BibleReader onLogged={handleLogged} />}
        {view === 'streak' && <StreakDisplay refresh={refresh} />}
        {view === 'history' && <ReadingHistory refresh={refresh} />}
        {view === 'progress' && <ProgressChart refresh={refresh} />}
      </div>
    </div>
  )
}