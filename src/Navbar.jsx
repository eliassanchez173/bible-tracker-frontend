const API = ''

export default function Navbar({ user, onLogout }) {
  function handleLogout() {
    fetch(`${API}/api/logout`, { method: 'POST', credentials: 'include' })
      .then(() => onLogout())
  }

  return (
    <nav className="navbar">
      <div className="navbar-brand">📖 Bible Tracker</div>
      <div className="navbar-right">
        <span className="navbar-user">{user}</span>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  )
}