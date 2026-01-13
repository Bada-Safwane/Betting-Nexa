import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { logout, getAllMatches } from '../utils/api'
import MatchCard from '../components/MatchCard'
import '../styles/Home.css'

function Home({ user, setUser }) {
  const navigate = useNavigate()
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadMatches = async () => {
      try {
        setLoading(true)
        const data = await getAllMatches()
        setMatches(Array.isArray(data) ? data : [])
        setError('')
      } catch (err) {
        console.error('Erreur lors du chargement des matchs:', err)
        setError(err.message || 'Erreur lors du chargement des matchs')
        setMatches([])
      } finally {
        setLoading(false)
      }
    }

    loadMatches()
  }, [])

  const handleLogout = () => {
    logout()
    setUser(null)
    navigate('/login')
  }

  const handleMatchClick = (matchId) => {
    navigate(`/bet/${matchId}`)
  }

  return (
    <div className="home-container">
      <header className="home-header">
        <div className="user-info">
          <span className="user-name">{user.username}</span>
        </div>
        <button className="logout-button" onClick={handleLogout} aria-label="Logout">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <polyline points="16 17 21 12 16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </header>

      <main className="home-main">
        <h1 className="home-title">CAN 2026 - Matchs</h1>

        {error && <div className="home-error">{error}</div>}

        {loading ? (
          <div className="home-loading">Chargement des matchs...</div>
        ) : (
          <div className="matches-container">
            {matches.map(match => (
              <MatchCard 
                key={match._id} 
                match={match} 
                onClick={() => handleMatchClick(match._id)}
              />
            ))}
            {matches.length === 0 && !error && (
              <div className="home-empty">Aucun match disponible pour le moment.</div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}

export default Home
