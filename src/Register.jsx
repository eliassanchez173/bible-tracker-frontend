import { useState } from 'react'

const API = ''

export default function Register({ onRegister, switchToLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  function handleSubmit() {
    fetch(`${API}/api/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ username, password })
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) setError(data.error)
        else onRegister(username)
      })
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2>Create Account</h2>
        <p className="subtitle">Start tracking your Bible reading</p>
        {error && <p className="error">{error}</p>}
        <label>Username
          <input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
        </label>
        <label>Password
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
        </label>
        <button onClick={handleSubmit}>Register</button>
        <p className="auth-switch">Already have an account? <span onClick={switchToLogin}>Login</span></p>
      </div>
    </div>
  )
}