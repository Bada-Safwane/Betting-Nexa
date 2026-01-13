import React, { useState, useEffect } from 'react'

function AdminMatchResultForm({
  showForm,
  match,
  countryFlags,
  onCancel,
  onSubmit,
}) {
  const [winnerTeam, setWinnerTeam] = useState(null)
  const [winnerScore, setWinnerScore] = useState(0)
  const [looserScore, setLooserScore] = useState(0)
  const [playerScores, setPlayerScores] = useState({})

  useEffect(() => {
    if (match && showForm) {
      // Initialiser avec les valeurs existantes si le match a déjà un résultat
      if (match.winner?.team) {
        setWinnerTeam(match.winner.team)
        setWinnerScore(match.winner.score || 0)
        setLooserScore(match.looser_score || 0)
        
        // Initialiser les scores des joueurs
        const initialScores = {}
        if (match.winner.goalers && Array.isArray(match.winner.goalers)) {
          match.winner.goalers.forEach(goaler => {
            if (goaler.player) {
              initialScores[goaler.player] = goaler.score || 0
            }
          })
        }
        setPlayerScores(initialScores)
      } else {
        // Réinitialiser si pas de résultat
        setWinnerTeam(null)
        setWinnerScore(0)
        setLooserScore(0)
        setPlayerScores({})
      }
    }
  }, [match, showForm])

  if (!showForm || !match) return null

  const team1Name = match.team1?.country || 'Team 1'
  const team2Name = match.team2?.country || 'Team 2'
  const team1Flag = countryFlags[team1Name]?.flag || countryFlags[match.team1?.code]?.flag || '🏳️'
  const team2Flag = countryFlags[team2Name]?.flag || countryFlags[match.team2?.code]?.flag || '🏳️'

  // Obtenir les joueurs de l'équipe gagnante
  const winningTeamPlayers = winnerTeam === 1 
    ? (match.team1?.players || [])
    : winnerTeam === 2 
    ? (match.team2?.players || [])
    : []

  // Calculer le total des buts des joueurs
  const getTotalPlayerGoals = () => {
    return Object.values(playerScores).reduce((sum, score) => sum + (score || 0), 0)
  }

  const incrementScore = (playerName) => {
    const currentScore = playerScores[playerName] || 0
    setPlayerScores({ ...playerScores, [playerName]: currentScore + 1 })
  }

  const decrementScore = (playerName) => {
    const currentScore = playerScores[playerName] || 0
    if (currentScore > 0) {
      setPlayerScores({ ...playerScores, [playerName]: currentScore - 1 })
    } else {
      // Retirer le joueur si le score est à 0
      const newScores = { ...playerScores }
      delete newScores[playerName]
      setPlayerScores(newScores)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!winnerTeam) {
      alert('Veuillez sélectionner le gagnant')
      return
    }

    if (winnerScore === 0) {
      alert('Le score du gagnant doit être supérieur à 0')
      return
    }

    const totalPlayerGoals = getTotalPlayerGoals()
    if (totalPlayerGoals !== winnerScore) {
      alert(`Le total des buts des joueurs (${totalPlayerGoals}) doit correspondre au score du gagnant (${winnerScore})`)
      return
    }

    // Formater les goalers
    const goalers = Object.entries(playerScores)
      .filter(([_, score]) => score > 0)
      .map(([player, score]) => ({
        player: player,
        score: score
      }))

    const resultData = {
      winnerTeam,
      winnerScore,
      looserScore,
      goalers
    }

    onSubmit(resultData)
  }

  return (
    <div className="mb-8 w-full space-y-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:space-y-8 sm:p-6 sm:p-10">
      <div className="text-center">
        <h2 className="text-xl font-bold tracking-tight text-[#140B2E] sm:text-2xl">
          Définir le résultat du match
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          {team1Name} vs {team2Name}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
        {/* Sélection du gagnant */}
        <div className="space-y-4">
          <label className="block text-xs font-semibold uppercase tracking-[0.35em] text-slate-600 sm:text-sm">
            Gagnant
          </label>
          <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-center sm:gap-6">
            <button
              type="button"
              onClick={() => {
                setWinnerTeam(1)
                setPlayerScores({}) // Réinitialiser les scores des joueurs
              }}
              className={`flex min-w-0 flex-1 flex-col items-center gap-3 rounded-xl border-2 p-4 transition sm:gap-4 sm:rounded-2xl sm:p-6 ${
                winnerTeam === 1
                  ? 'border-[#2C005A] bg-[#2C005A]/10'
                  : 'border-slate-300 bg-slate-50 hover:border-[#2C005A]/50 hover:bg-slate-100'
              }`}
            >
              <div className="text-4xl sm:text-5xl">{team1Flag}</div>
              <div className="truncate text-base font-semibold text-[#140B2E] sm:text-lg">
                {team1Name}
              </div>
            </button>

            <span className="shrink-0 text-xs font-semibold uppercase tracking-[0.6em] text-slate-400 sm:text-sm">
              VS
            </span>

            <button
              type="button"
              onClick={() => {
                setWinnerTeam(2)
                setPlayerScores({}) // Réinitialiser les scores des joueurs
              }}
              className={`flex min-w-0 flex-1 flex-col items-center gap-3 rounded-xl border-2 p-4 transition sm:gap-4 sm:rounded-2xl sm:p-6 ${
                winnerTeam === 2
                  ? 'border-[#2C005A] bg-[#2C005A]/10'
                  : 'border-slate-300 bg-slate-50 hover:border-[#2C005A]/50 hover:bg-slate-100'
              }`}
            >
              <div className="text-4xl sm:text-5xl">{team2Flag}</div>
              <div className="truncate text-base font-semibold text-[#140B2E] sm:text-lg">
                {team2Name}
              </div>
            </button>
          </div>
        </div>

        {/* Scores */}
        {winnerTeam && (
          <>
            <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
              {/* Score du gagnant */}
              <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:p-6">
                <label className="block text-center text-xs font-semibold uppercase tracking-[0.35em] text-slate-600 sm:text-sm">
                  Score du gagnant
                </label>
                <div className="flex items-center justify-center gap-3 sm:gap-4">
                  <button
                    type="button"
                    onClick={() => setWinnerScore(Math.max(0, winnerScore - 1))}
                    className="flex size-10 items-center justify-center rounded-lg border border-slate-300 bg-white text-xl font-semibold text-[#140B2E] transition hover:bg-slate-50 hover:border-[#2C005A] sm:size-12 sm:text-2xl"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    min="0"
                    value={winnerScore}
                    onChange={(e) => setWinnerScore(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-20 rounded-lg border border-slate-300 bg-white px-3 py-2 text-center text-2xl font-bold text-[#140B2E] focus:border-[#2C005A] focus:outline-none focus:ring-2 focus:ring-[#2C005A]/30 sm:w-24 sm:px-4 sm:py-3 sm:text-3xl"
                  />
                  <button
                    type="button"
                    onClick={() => setWinnerScore(winnerScore + 1)}
                    className="flex size-10 items-center justify-center rounded-lg border border-slate-300 bg-white text-xl font-semibold text-[#140B2E] transition hover:bg-slate-50 hover:border-[#2C005A] sm:size-12 sm:text-2xl"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Score du perdant */}
              <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:p-6">
                <label className="block text-center text-xs font-semibold uppercase tracking-[0.35em] text-slate-600 sm:text-sm">
                  Score du perdant
                </label>
                <div className="flex items-center justify-center gap-3 sm:gap-4">
                  <button
                    type="button"
                    onClick={() => setLooserScore(Math.max(0, looserScore - 1))}
                    className="flex size-10 items-center justify-center rounded-lg border border-slate-300 bg-white text-xl font-semibold text-[#140B2E] transition hover:bg-slate-50 hover:border-[#2C005A] sm:size-12 sm:text-2xl"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    min="0"
                    value={looserScore}
                    onChange={(e) => setLooserScore(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-20 rounded-lg border border-slate-300 bg-white px-3 py-2 text-center text-2xl font-bold text-[#140B2E] focus:border-[#2C005A] focus:outline-none focus:ring-2 focus:ring-[#2C005A]/30 sm:w-24 sm:px-4 sm:py-3 sm:text-3xl"
                  />
                  <button
                    type="button"
                    onClick={() => setLooserScore(looserScore + 1)}
                    className="flex size-10 items-center justify-center rounded-lg border border-slate-300 bg-white text-xl font-semibold text-[#140B2E] transition hover:bg-slate-50 hover:border-[#2C005A] sm:size-12 sm:text-2xl"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Joueurs qui ont marqué */}
            {winnerScore > 0 && (
              <div className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:p-6">
                <div className="flex flex-col gap-2 text-center text-xs sm:flex-row sm:justify-between sm:text-sm">
                  <span className="font-semibold text-[#140B2E]">
                    {winnerTeam === 1 ? team1Name : team2Name} gagne avec {winnerScore} but(s)
                  </span>
                  <span className="text-slate-600">
                    Total buts joueurs :{' '}
                    <span className={`font-semibold ${getTotalPlayerGoals() === winnerScore ? 'text-emerald-600' : 'text-red-600'}`}>
                      {getTotalPlayerGoals()}/{winnerScore}
                    </span>
                  </span>
                </div>

                <div className="space-y-3">
                  {winningTeamPlayers.length === 0 ? (
                    <p className="text-center text-sm text-slate-500">
                      Aucun joueur défini pour cette équipe
                    </p>
                  ) : (
                    winningTeamPlayers.map((player, index) => {
                      const playerName = `${player.first_name} ${player.last_name}`.trim()
                      const playerScore = playerScores[playerName] || 0
                      
                      return (
                        <div
                          key={index}
                          className="flex min-w-0 items-center gap-3 rounded-lg border border-slate-200 bg-white p-3 sm:gap-4 sm:p-4"
                        >
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-[#140B2E] sm:text-base">
                              {playerName}
                            </p>
                          </div>
                          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                            <button
                              type="button"
                              onClick={() => decrementScore(playerName)}
                              disabled={playerScore === 0}
                              className="flex size-8 items-center justify-center rounded-lg border border-slate-300 bg-white text-lg font-semibold text-[#140B2E] transition hover:bg-slate-50 hover:border-[#2C005A] disabled:opacity-30 disabled:cursor-not-allowed sm:size-10 sm:text-xl"
                            >
                              −
                            </button>
                            <span className="w-8 text-center text-lg font-bold text-[#2C005A] sm:w-10 sm:text-xl">
                              {playerScore}
                            </span>
                            <button
                              type="button"
                              onClick={() => incrementScore(playerName)}
                              className="flex size-8 items-center justify-center rounded-lg border border-slate-300 bg-white text-lg font-semibold text-[#140B2E] transition hover:bg-slate-50 hover:border-[#2C005A] sm:size-10 sm:text-xl"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>
              </div>
            )}
          </>
        )}

        {/* Boutons */}
        <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-[#140B2E] transition hover:bg-slate-50 hover:border-[#2C005A] sm:rounded-xl sm:px-6 sm:py-4 sm:text-sm"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={!winnerTeam || winnerScore === 0 || getTotalPlayerGoals() !== winnerScore}
            className="flex-1 rounded-lg bg-[#2C005A] px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-[#3A008A] disabled:opacity-50 disabled:cursor-not-allowed sm:rounded-xl sm:px-6 sm:py-4 sm:text-sm"
          >
            {getTotalPlayerGoals() !== winnerScore && winnerScore > 0
              ? `Valider (${getTotalPlayerGoals()}/${winnerScore} buts)`
              : 'Valider le résultat'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AdminMatchResultForm
