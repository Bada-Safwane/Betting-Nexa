import Flag from './Flag'
import '../styles/MatchCard.css'

function MatchCard({ match, onClick }) {
  // Supporte les anciens matchs mockés et les matchs venant du backend
  const isBackendMatch = !!match.team1 && !!match.team2 && !match.team1.flagCode

  const getTeamInfo = (team, index) => {
    if (!isBackendMatch) {
      return {
        name: team.name,
        flagCode: team.flagCode,
      }
    }

    const country = team.country || (index === 1 ? 'Team 1' : 'Team 2')
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

    const flagCode = map[country] || 'eg'

    return {
      name: country,
      flagCode,
    }
  }

  const team1Info = getTeamInfo(match.team1, 1)
  const team2Info = getTeamInfo(match.team2, 2)

  // Calcul basique des stats à partir des paris backend (si disponibles)
  let stats = match.stats
  if (isBackendMatch) {
    const t1 = match.team1?.bettings_winners?.length || 0
    const t2 = match.team2?.bettings_winners?.length || 0
    const total = t1 + t2
    const team1WinPercentage = total > 0 ? Math.round((t1 / total) * 100) : 0
    const team2WinPercentage = total > 0 ? Math.round((t2 / total) * 100) : 0
    const drawPercentage = Math.max(0, 100 - team1WinPercentage - team2WinPercentage)
    stats = {
      team1WinPercentage,
      team2WinPercentage,
      drawPercentage,
      topScorer: '—',
    }
  }

  return (
    <div className="match-card" onClick={onClick}>
      <div className="match-teams">
        <div className="team">
          <Flag code={team1Info.flagCode} size="large" />
          <div className="team-name">{team1Info.name}</div>
        </div>
        <div className="vs">VS</div>
        <div className="team">
          <Flag code={team2Info.flagCode} size="large" />
          <div className="team-name">{team2Info.name}</div>
        </div>
      </div>

      {stats && (
        <div className="match-stats">
          <h3>Statistiques des paris</h3>
          <div className="stat-row">
            <span className="stat-label">{team1Info.name} gagnant</span>
            <div className="stat-bar">
              <div
                className="stat-fill team1"
                style={{ width: `${stats.team1WinPercentage}%` }}
              ></div>
            </div>
            <span className="stat-value">{stats.team1WinPercentage}%</span>
          </div>
          <div className="stat-row">
            <span className="stat-label">{team2Info.name} gagnant</span>
            <div className="stat-bar">
              <div
                className="stat-fill team2"
                style={{ width: `${stats.team2WinPercentage}%` }}
              ></div>
            </div>
            <span className="stat-value">{stats.team2WinPercentage}%</span>
          </div>
          <div className="top-scorer">
            <span>Buteur le plus prédit : <strong>{stats.topScorer}</strong></span>
          </div>
        </div>
      )}
    </div>
  )
}

export default MatchCard
