import Flag from './Flag'
import '../styles/MatchCard.css'

function MatchCard({ match, onClick }) {
  const { team1, team2, stats } = match

  return (
    <div className="match-card" onClick={onClick}>
      <div className="match-teams">
        <div className="team">
          <Flag code={team1.flagCode} size="large" />
          <div className="team-name">{team1.name}</div>
        </div>
        <div className="vs">VS</div>
        <div className="team">
          <Flag code={team2.flagCode} size="large" />
          <div className="team-name">{team2.name}</div>
        </div>
      </div>

      <div className="match-stats">
        <h3>Betting Statistics</h3>
        <div className="stat-row">
          <span className="stat-label">{team1.name} Win</span>
          <div className="stat-bar">
            <div 
              className="stat-fill team1" 
              style={{ width: `${stats.team1WinPercentage}%` }}
            ></div>
          </div>
          <span className="stat-value">{stats.team1WinPercentage}%</span>
        </div>
        <div className="stat-row">
          <span className="stat-label">{team2.name} Win</span>
          <div className="stat-bar">
            <div 
              className="stat-fill team2" 
              style={{ width: `${stats.team2WinPercentage}%` }}
            ></div>
          </div>
          <span className="stat-value">{stats.team2WinPercentage}%</span>
        </div>
        <div className="stat-row">
          <span className="stat-label">Draw</span>
          <div className="stat-bar">
            <div 
              className="stat-fill draw" 
              style={{ width: `${stats.drawPercentage}%` }}
            ></div>
          </div>
          <span className="stat-value">{stats.drawPercentage}%</span>
        </div>
        <div className="top-scorer">
          <span>Top Predicted Scorer: <strong>{stats.topScorer}</strong></span>
        </div>
      </div>
    </div>
  )
}

export default MatchCard
