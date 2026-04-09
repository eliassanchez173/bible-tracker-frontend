export function getToken() {
    return localStorage.getItem('token')
  }
  
  export function setToken(token) {
    localStorage.setItem('token', token)
  }
  
  export function removeToken() {
    localStorage.removeItem('token')
  }
  
  export function getAuthHeaders() {
    const token = getToken()
    return {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    }
  }