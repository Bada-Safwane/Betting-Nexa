import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getMatchById, submitBet } from '../utils/api'
import Flag from '../components/Flag'
import '../styles/BettingDetails.css'

function BettingDetails({ user }) {
  const { matchId } = useParams()
  const navigate = useNavigate()

  const [match, setMatch] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [selectedTeam, setSelectedTeam] = useState(null)
  const [team1Prediction, setTeam1Prediction] = useState('none') // 'winner', 'loser', 'none'
  const [team2Prediction, setTeam2Prediction] = useState('none')
  const [team1Score, setTeam1Score] = useState(0)
  const [team2Score, setTeam2Score] = useState(0)
  const [selectedPlayer, setSelectedPlayer] = useState(null)
  const [playerScores, setPlayerScores] = useState({})

  useEffect(() => {
    const loadMatch = async () => {
      try {
        setLoading(true)
        const data = await getMatchById(matchId)
        setMatch(data)
        setError('')
      } catch (err) {
        console.error('Erreur lors du chargement du match:', err)
        setError(err.message || 'Erreur lors du chargement du match')
      } finally {
        setLoading(false)
      }
    }

    loadMatch()
  }, [matchId])

  if (loading) {
    return <div className="betting-details-container">Chargement du match...</div>
  }

  if (error || !match) {
    return <div className="betting-details-container">Match introuvable</div>
  }

  const handleTeamSelect = (teamIndex) => {
    setSelectedTeam(teamIndex)
    setSelectedPlayer(null)
  }

  const handlePredictionChange = (team, prediction) => {
    if (team === 'team1') {
      setTeam1Prediction(prediction)
      if (prediction === 'winner') {
        setTeam2Prediction('loser')
        setSelectedTeam(1) // afficher le terrain dès qu'on choisit gagnant
      } else if (prediction === 'loser') {
        setTeam2Prediction('winner')
      }
    } else {
      setTeam2Prediction(prediction)
      if (prediction === 'winner') {
        setTeam1Prediction('loser')
        setSelectedTeam(2) // afficher le terrain dès qu'on choisit gagnant
      } else if (prediction === 'loser') {
        setTeam1Prediction('winner')
      }
    }
  }

  const backendPlayersByTeam = (teamIndex) => {
    const team = teamIndex === 1 ? match.team1 : match.team2
    if (!team || !Array.isArray(team.players)) return []
    return team.players.map((p) => ({
      id: p._id,
      name: `${p.first_name || ''} ${p.last_name || ''}`.trim() || 'Joueur',
      number: '',
    }))
  }

  const handlePlayerSelect = (player) => {
    setSelectedPlayer(player)
  }

  const incrementScore = () => {
    if (selectedPlayer) {
      setPlayerScores((prev) => ({
        ...prev,
        [selectedPlayer.id]: (prev[selectedPlayer.id] || 0) + 1,
      }))
    }
  }

  const decrementScore = () => {
    if (selectedPlayer && (playerScores[selectedPlayer.id] || 0) > 0) {
      setPlayerScores((prev) => ({
        ...prev,
        [selectedPlayer.id]: Math.max(0, (prev[selectedPlayer.id] || 0) - 1),
      }))
    }
  }

  const getTotalScoreForTeam = (teamIndex) => {
    const players = backendPlayersByTeam(teamIndex)
    return players.reduce((sum, player) => sum + (playerScores[player.id] || 0), 0)
  }

  const handleSubmitBet = async () => {
    if (team1Prediction === 'none' || team2Prediction === 'none') return

    const winnerTeam = team1Prediction === 'winner' ? 1 : 2

    const betData = {
      winnerTeam,
      team1Score,
      team2Score,
      playerScores,
    }

    try {
      await submitBet(matchId, betData)
      alert('Pari enregistré avec succès !')
      navigate('/home')
    } catch (err) {
      console.error('Erreur lors de la soumission du pari:', err)
      alert(err.message || 'Erreur lors de la soumission du pari')
    }
  }

  const currentPlayers = selectedTeam ? backendPlayersByTeam(selectedTeam) : []

  const getPlayerPosition = (index) => {
    const positions = [
      { top: '90%', left: '50%' },
      { top: '75%', left: '15%' },
      { top: '75%', left: '38%' },
      { top: '75%', left: '62%' },
      { top: '75%', left: '85%' },
      { top: '50%', left: '25%' },
      { top: '50%', left: '50%' },
      { top: '50%', left: '75%' },
      { top: '20%', left: '25%' },
      { top: '15%', left: '50%' },
      { top: '20%', left: '75%' },
    ]
    return positions[index] || { top: '50%', left: '50%' }
  }

  const mapCountryToFlagCode = (country) => {
    const map = {
      Egypt: 'eg',
      Senegal: 'sn',
      Nigeria: 'ng',
      Morocco: 'ma',
      EGY: 'eg',
      SEN: 'sn',
      NGA: 'ng',
      MAR: 'ma',
    }
    return map[country] || 'eg'
  }

  const team1Name = match.team1?.country || 'Équipe 1'
  const team2Name = match.team2?.country || 'Équipe 2'
  const team1FlagCode = mapCountryToFlagCode(team1Name)
  const team2FlagCode = mapCountryToFlagCode(team2Name)

  return (
    <div className="betting-details-container">
      <header className="betting-header">
        <button className="back-button" onClick={() => navigate('/home')}>
          ← Retour
        </button>
        <h2>Placez votre pari</h2>
      </header>

      <div className="match-header">
        <div
          className={`team-selector ${selectedTeam === 1 ? 'selected' : ''} ${
            team1Prediction !== 'none' ? team1Prediction : ''
          }`}
          onClick={() => handleTeamSelect(1)}
        >
          <Flag code={team1FlagCode} size="xlarge" />
          <div className="team-name-large">{team1Name}</div>
          <div className="prediction-buttons">
            <button
              className={`pred-btn ${team1Prediction === 'winner' ? 'active winner' : ''}`}
              onClick={(e) => {
                e.stopPropagation()
                handlePredictionChange('team1', 'winner')
              }}
            >
              Gagnant
            </button>
            <button
              className={`pred-btn ${team1Prediction === 'loser' ? 'active loser' : ''}`}
              onClick={(e) => {
                e.stopPropagation()
                handlePredictionChange('team1', 'loser')
              }}
            >
              Perdant
            </button>
          </div>
          <div className="team-score-controls">
            <button
              className="score-btn decrement"
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                setTeam1Score((s) => Math.max(0, s - 1))
              }}
            >
              −
            </button>
            <div className="score-display">{team1Score}</div>
            <button
              className="score-btn increment"
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                setTeam1Score((s) => s + 1)
              }}
            >
              +
            </button>
          </div>
        </div>

        <div
          className={`team-selector ${selectedTeam === 2 ? 'selected' : ''} ${
            team2Prediction !== 'none' ? team2Prediction : ''
          }`}
          onClick={() => handleTeamSelect(2)}
        >
          <Flag code={team2FlagCode} size="xlarge" />
          <div className="team-name-large">{team2Name}</div>
          <div className="prediction-buttons">
            <button
              className={`pred-btn ${team2Prediction === 'winner' ? 'active winner' : ''}`}
              onClick={(e) => {
                e.stopPropagation()
                handlePredictionChange('team2', 'winner')
              }}
            >
              Gagnant
            </button>
            <button
              className={`pred-btn ${team2Prediction === 'loser' ? 'active loser' : ''}`}
              onClick={(e) => {
                e.stopPropagation()
                handlePredictionChange('team2', 'loser')
              }}
            >
              Perdant
            </button>
          </div>
          <div className="team-score-controls">
            <button
              className="score-btn decrement"
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                setTeam2Score((s) => Math.max(0, s - 1))
              }}
            >
              −
            </button>
            <div className="score-display">{team2Score}</div>
            <button
              className="score-btn increment"
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                setTeam2Score((s) => s + 1)
              }}
            >
              +
            </button>
          </div>
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
                const goals = playerScores[player.id] || 0
                return (
                  <div
                    key={player.id}
                    className={`player-dot ${selectedPlayer?.id === player.id ? 'selected' : ''}`}
                    style={{ top: position.top, left: position.left }}
                    onClick={() => handlePlayerSelect(player)}
                  >
                    <div className="player-circle">
                      <span className="player-num">{player.number}</span>
                      {goals > 0 && <div className="goal-badge">{goals}</div>}
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
                <span className="player-goals">
                  Buts: {playerScores[selectedPlayer.id] || 0}
                </span>
              </div>
              <div className="score-buttons">
                <button className="score-btn decrement" onClick={decrementScore}>
                  −
                </button>
                <button className="score-btn increment" onClick={incrementScore}>
                  +
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="submit-section">
        <div className="final-score">
          <span>
            {team1Name}: {team1Score}
          </span>
          <span className="separator">-</span>
          <span>
            {team2Name}: {team2Score}
          </span>
        </div>
        <button
          className="submit-bet-btn"
          onClick={handleSubmitBet}
          disabled={team1Prediction === 'none' || team2Prediction === 'none'}
        >
          Placer le pari
        </button>
      </div>
    </div>
  )
}

export default BettingDetails
