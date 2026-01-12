import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getMatchById, teamPlayers } from '../data/matchData'
import '../styles/BettingDetails.css'

function BettingDetails({ user }) {
  const { matchId } = useParams()
  const navigate = useNavigate()
  const match = getMatchById(matchId)

  const [selectedTeam, setSelectedTeam] = useState(null)
  const [team1Prediction, setTeam1Prediction] = useState('none') // 'winner', 'loser', 'none'
  const [team2Prediction, setTeam2Prediction] = useState('none')
  const [selectedPlayer, setSelectedPlayer] = useState(null)
  const [playerScores, setPlayerScores] = useState({})

  if (!match) {
    return <div>Match not found</div>
  }

  const handleTeamSelect = (teamCode) => {
    setSelectedTeam(teamCode)
    setSelectedPlayer(null)
  }

  const handlePredictionChange = (team, prediction) => {
    if (team === 'team1') {
      setTeam1Prediction(prediction)
      if (prediction === 'winner') setTeam2Prediction('loser')
      else if (prediction === 'loser') setTeam2Prediction('winner')
    } else {
      setTeam2Prediction(prediction)
      if (prediction === 'winner') setTeam1Prediction('loser')
      else if (prediction === 'loser') setTeam1Prediction('winner')
    }
  }

  const handlePlayerSelect = (player) => {
    setSelectedPlayer(player)
  }

  const incrementScore = () => {
    if (selectedPlayer) {
      setPlayerScores(prev => ({
        ...prev,
        [selectedPlayer.id]: (prev[selectedPlayer.id] || 0) + 1
      }))
    }
  }

  const decrementScore = () => {
    if (selectedPlayer && playerScores[selectedPlayer.id] > 0) {
      setPlayerScores(prev => ({
        ...prev,
        [selectedPlayer.id]: prev[selectedPlayer.id] - 1
      }))
    }
  }

  const getTotalScore = (teamCode) => {
    const players = teamPlayers[teamCode]
    return players.reduce((sum, player) => sum + (playerScores[player.id] || 0), 0)
  }

  const handleSubmitBet = () => {
    const betData = {
      matchId,
      userId: user.id,
      team1Prediction,
      team2Prediction,
      playerScores,
      team1Score: getTotalScore(match.team1.code),
      team2Score: getTotalScore(match.team2.code),
      timestamp: new Date().toISOString()
    }
    
    // Store bet locally for now (will be sent to backend later)
    const existingBets = JSON.parse(localStorage.getItem('bets') || '[]')
    localStorage.setItem('bets', JSON.stringify([...existingBets, betData]))
    
    alert('Bet placed successfully!')
    navigate('/home')
  }

  const currentPlayers = selectedTeam ? teamPlayers[selectedTeam] : []

  return (
    <div className="betting-details-container">
      <header className="betting-header">
        <button className="back-button" onClick={() => navigate('/home')}>
          ← Back
        </button>
        <h2>Place Your Bet</h2>
      </header>

      <div className="match-header">
        <div 
          className={`team-selector ${selectedTeam === match.team1.code ? 'selected' : ''} ${team1Prediction !== 'none' ? team1Prediction : ''}`}
          onClick={() => handleTeamSelect(match.team1.code)}
        >
          <div className="flag-large">{match.team1.flag}</div>
          <div className="team-name-large">{match.team1.name}</div>
          <div className="prediction-buttons">
            <button 
              className={`pred-btn ${team1Prediction === 'winner' ? 'active winner' : ''}`}
              onClick={(e) => { e.stopPropagation(); handlePredictionChange('team1', 'winner') }}
            >
              Winner
            </button>
            <button 
              className={`pred-btn ${team1Prediction === 'loser' ? 'active loser' : ''}`}
              onClick={(e) => { e.stopPropagation(); handlePredictionChange('team1', 'loser') }}
            >
              Loser
            </button>
          </div>
          <div className="score-display">{getTotalScore(match.team1.code)}</div>
        </div>

        <div 
          className={`team-selector ${selectedTeam === match.team2.code ? 'selected' : ''} ${team2Prediction !== 'none' ? team2Prediction : ''}`}
          onClick={() => handleTeamSelect(match.team2.code)}
        >
          <div className="flag-large">{match.team2.flag}</div>
          <div className="team-name-large">{match.team2.name}</div>
          <div className="prediction-buttons">
            <button 
              className={`pred-btn ${team2Prediction === 'winner' ? 'active winner' : ''}`}
              onClick={(e) => { e.stopPropagation(); handlePredictionChange('team2', 'winner') }}
            >
              Winner
            </button>
            <button 
              className={`pred-btn ${team2Prediction === 'loser' ? 'active loser' : ''}`}
              onClick={(e) => { e.stopPropagation(); handlePredictionChange('team2', 'loser') }}
            >
              Loser
            </button>
          </div>
          <div className="score-display">{getTotalScore(match.team2.code)}</div>
        </div>
      </div>

      {selectedTeam && (
        <div className="field-section">
          <div className="football-field">
            <div className="field-line top"></div>
            <div className="field-line middle"></div>
            <div className="field-line bottom"></div>
            <div className="center-circle"></div>
            
            <div className="players-list">
              {currentPlayers.map(player => (
                <div 
                  key={player.id}
                  className={`player-item ${selectedPlayer?.id === player.id ? 'selected' : ''}`}
                  onClick={() => handlePlayerSelect(player)}
                >
                  <div className="player-number">{player.number}</div>
                  <div className="player-info">
                    <div className="player-name">{player.name}</div>
                    <div className="player-position">{player.position}</div>
                  </div>
                  {playerScores[player.id] > 0 && (
                    <div className="player-score">⚽ {playerScores[player.id]}</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {selectedPlayer && (
            <div className="score-controls">
              <div className="selected-player-info">
                <span>{selectedPlayer.name}</span>
                <span className="player-goals">Goals: {playerScores[selectedPlayer.id] || 0}</span>
              </div>
              <div className="score-buttons">
                <button className="score-btn decrement" onClick={decrementScore}>−</button>
                <button className="score-btn increment" onClick={incrementScore}>+</button>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="submit-section">
        <div className="final-score">
          <span>{match.team1.code}: {getTotalScore(match.team1.code)}</span>
          <span className="separator">-</span>
          <span>{match.team2.code}: {getTotalScore(match.team2.code)}</span>
        </div>
        <button 
          className="submit-bet-btn" 
          onClick={handleSubmitBet}
          disabled={team1Prediction === 'none' || team2Prediction === 'none'}
        >
          Place Bet
        </button>
      </div>
    </div>
  )
}

export default BettingDetails
