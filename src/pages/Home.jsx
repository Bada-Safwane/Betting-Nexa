import { useNavigate } from 'react-router-dom'
import { logout } from '../utils/auth'
import MatchCard from '../components/MatchCard'
import { matches } from '../data/matchData'
import '../styles/Home.css'

function Home({ user, setUser }) {
  const navigate = useNavigate()

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
          <span className="user-name">{user.firstName}</span>
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
        <h1 className="home-title">CAN 2026 Semi Finals</h1>
        <div className="matches-container">
          {matches.map(match => (
            <MatchCard 
              key={match.id} 
              match={match} 
              onClick={() => handleMatchClick(match.id)}
            />
          ))}
        </div>
      </main>
    </div>
  )
}

export default Home
