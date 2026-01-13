import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../utils/api'
import '../styles/Login.css'

function Login({ setUser }) {
  const [username, setUsername] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const trimmed = username.trim()
    if (!trimmed) {
      setError("Veuillez saisir un nom d'utilisateur")
      return
    }

    try {
      setLoading(true)
      const user = await login(trimmed)
      setUser(user)
      navigate('/home')
    } catch (err) {
      setError(err.message || 'Erreur lors de la connexion')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Betting Nexa</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Entrez votre nom d'utilisateur"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="login-input"
            autoFocus
          />
          {error && <div className="login-error">{error}</div>}
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Connexion...' : 'Continuer'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login
