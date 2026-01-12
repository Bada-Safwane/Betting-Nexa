import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getMatchById, teamPlayers } from '../data/matchData'
import Flag from '../components/Flag'
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

  const getPlayerPosition = (index) => {
    // Formation: 4-3-3 (GK, 4 defenders, 3 midfielders, 3 forwards)
    const positions = [
      { top: '90%', left: '50%' },  // Goalkeeper
      { top: '75%', left: '15%' },  // Defender left
      { top: '75%', left: '38%' },  // Defender center-left
      { top: '75%', left: '62%' },  // Defender center-right
      { top: '75%', left: '85%' },  // Defender right
      { top: '50%', left: '25%' },  // Midfielder left
      { top: '50%', left: '50%' },  // Midfielder center
      { top: '50%', left: '75%' },  // Midfielder right
      { top: '20%', left: '25%' },  // Forward left
      { top: '15%', left: '50%' },  // Forward center
      { top: '20%', left: '75%' },  // Forward right
    ]
    return positions[index] || { top: '50%', left: '50%' }
  }

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
          <Flag code={match.team1.flagCode} size="xlarge" />
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
          <Flag code={match.team2.flagCode} size="xlarge" />
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
            
            <div className="players-formation">
              {currentPlayers.slice(0, 11).map((player, index) => {
                const position = getPlayerPosition(index)
                return (
                  <div 
                    key={player.id}
                    className={`player-dot ${selectedPlayer?.id === player.id ? 'selected' : ''}`}
                    style={{ top: position.top, left: position.left }}
                    onClick={() => handlePlayerSelect(player)}
                  >
                    <div className="player-circle">
                      <span className="player-num">{player.number}</span>
                      {playerScores[player.id] > 0 && (
                        <div className="goal-badge">{playerScores[player.id]}</div>
                      )}
                    </div>
                    <div className="player-label">{player.name}</div>
                  </div>
                )
              })}
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
