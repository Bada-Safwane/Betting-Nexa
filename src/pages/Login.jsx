import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../utils/auth'
import '../styles/Login.css'

function Login({ setUser }) {
  const [firstName, setFirstName] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (firstName.trim()) {
      const user = login(firstName.trim())
      setUser(user)
      navigate('/home')
    }
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Betting Nexa</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter your first name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="login-input"
            autoFocus
          />
          <button type="submit" className="login-button">
            Continue
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login
