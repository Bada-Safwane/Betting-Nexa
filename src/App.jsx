import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Login from './pages/Login'
import Home from './pages/Home'
import BettingDetails from './pages/BettingDetails'
import { getCurrentUser } from './utils/auth'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const currentUser = getCurrentUser()
    setUser(currentUser)
    setLoading(false)
  }, [])

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={user ? <Navigate to="/home" /> : <Login setUser={setUser} />} 
        />
        <Route 
          path="/home" 
          element={user ? <Home user={user} setUser={setUser} /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/bet/:matchId" 
          element={user ? <BettingDetails user={user} /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/" 
          element={<Navigate to={user ? "/home" : "/login"} />} 
        />
      </Routes>
    </Router>
  )
}

export default App
