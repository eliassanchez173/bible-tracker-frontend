import { useState } from 'react'
import { setToken } from './auth'
import './App.css';

const API = import.meta.env.VITE_API_URL || ''

export default function Register({ onRegister, switchToLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  function handleSubmit() {
    fetch(`${API}/api/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setError(data.error)
        } else {
          // Auto login after register
          fetch(`${API}/api/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
          })
            .then(res => res.json())
            .then(loginData => {
              if (loginData.token) {
                setToken(loginData.token)
                onRegister(loginData.username)
              }
            })
        }
      })
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2 style={{ color: "white" }}>Create Account</h2>
        <p className="subtitle">Start tracking your Bible reading</p>
        {error && <p className="error">{error}</p>}
  
        <label>
          Username
          <input
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
        </label>
  
        <label>
          Password
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </label>
  
        <button onClick={handleSubmit}>Register</button>
  
        <div className="auth-switch" style={{ marginTop: "1rem" }}>
          <p className="text-sm mb-2">Already have an account?</p>
          <button onClick={switchToLogin} style={{
            background: "#3b82f6",
            color: "#fff",
            padding: "0.5rem 1rem",
            borderRadius: "0.5rem",
            border: "none",
            cursor: "pointer",
            fontWeight: "bold"
          }}>
            Login
          </button>
        </div>
      </div>
    </div>
  );
}