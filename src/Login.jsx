import { useState } from 'react'
import { setToken } from './auth'
import './App.css';

const API = import.meta.env.VITE_API_URL || ''

export default function Login({ onLogin, switchToRegister }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  function handleSubmit() {
    fetch(`${API}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setError(data.error)
        } else {
          setToken(data.token)
          onLogin(data.username)
        }
      })
  }
 
  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2 style={{ color: "white" }}>Welcome Back</h2>
        <p className="subtitle">Sign in to your Bible Tracker</p>
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
  
        <button onClick={handleSubmit}>Login</button>
  
        <div className="auth-switch" style={{ marginTop: "1rem" }}>
          <p className="text-sm mb-2">Don't have an account?</p>
          <button onClick={switchToRegister} style={{
            background: "#3b82f6",
            color: "#fff",
            padding: "0.5rem 1rem",
            borderRadius: "0.5rem",
            border: "none",
            cursor: "pointer",
            fontWeight: "bold"
          }}>
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
}