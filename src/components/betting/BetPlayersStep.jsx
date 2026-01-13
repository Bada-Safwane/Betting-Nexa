import React from 'react'

function BetPlayersStep({
  step,
  winnerTeam,
  winnerScore,
  team1Name,
  team2Name,
  winningTeamPlayers,
  selectedPlayer,
  playerScores,
  getTotalPlayerGoals,
  onSelectPlayer,
  onIncrementScore,
  onDecrementScore,
  onBack,
  onSubmit,
}) {
  if (step !== 3 || !winnerTeam) return null

  return (
    <div className="w-full space-y-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:space-y-8 sm:p-6 sm:p-10">
      <div className="text-center">
        <p className="text-xs uppercase tracking-[0.35em] text-[#2C005A]">Étape 3</p>
        <h3 className="mt-2 text-xl font-bold tracking-tight text-[#140B2E] sm:text-2xl sm:text-3xl">
          Joueurs qui ont marqué
        </h3>
      </div>
      <div className="space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-4 sm:space-y-4 sm:p-6">
        <div className="flex flex-col gap-2 text-center text-xs sm:flex-row sm:justify-between sm:text-sm">
          <span className="font-semibold text-[#140B2E]">
            {winnerTeam === 1 ? team1Name : team2Name} gagne avec {winnerScore} but(s)
          </span>
          <span className="text-slate-600">
            Total buts joueurs :{' '}
            <span className="font-semibold text-[#2C005A]">{getTotalPlayerGoals()}</span>
          </span>
        </div>
      </div>

      <div className="space-y-4 sm:space-y-6">
        <div className="grid min-w-0 grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3">
          {Array.isArray(winningTeamPlayers) &&
            winningTeamPlayers.map(player => {
              if (!player || !player.id) return null
              const playerId = player.mongoId ? player.mongoId.toString() : player.id
              const isSelected = selectedPlayer?.id === player.id
              return (
                <button
                  key={player.id}
                  onClick={() => onSelectPlayer(player)}
                  className={`flex min-w-0 items-center gap-3 rounded-lg border p-3 text-left transition sm:gap-4 sm:rounded-xl sm:p-4 ${
                    isSelected
                      ? 'border-[#2C005A] bg-[#2C005A]/10'
                      : 'border-slate-200 bg-slate-50 hover:border-[#2C005A]/50 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white text-xs font-semibold text-[#140B2E] shadow-sm sm:size-10 sm:text-sm">
                    {player.number || ''}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-semibold text-[#140B2E] sm:text-base">
                      {player.name || 'Unknown'}
                    </div>
                    <div className="text-xs text-slate-600">{player.position || 'Player'}</div>
                  </div>
                  {playerScores[playerId] > 0 && (
                    <div className="flex shrink-0 items-center gap-1.5 rounded-lg bg-[#2C005A]/20 px-2 py-1 text-xs font-semibold text-[#2C005A] sm:px-3 sm:text-sm">
                      ⚽ {playerScores[playerId]}
                    </div>
                  )}
                </button>
              )
            })}
        </div>

        {selectedPlayer && selectedPlayer.id && (
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 sm:rounded-xl sm:p-6">
            <div className="mb-3 flex flex-col gap-3 sm:mb-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-[#140B2E] sm:text-base">
                  {selectedPlayer.name || 'Unknown Player'}
                </p>
                <p className="mt-1 text-xs text-slate-600 sm:text-sm">
                  Buts:{' '}
                  <span className="font-semibold text-[#2C005A]">
                    {(() => {
                      const playerId = selectedPlayer.mongoId
                        ? selectedPlayer.mongoId.toString()
                        : selectedPlayer.id
                      return playerScores[playerId] || 0
                    })()}
                  </span>
                </p>
              </div>
              <div className="flex gap-2 sm:gap-3">
                <button
                  onClick={onDecrementScore}
                  className="flex size-9 items-center justify-center rounded-lg border border-slate-300 bg-white text-lg font-semibold text-[#140B2E] transition hover:bg-slate-50 hover:border-[#2C005A] sm:size-10 sm:text-xl"
                >
                  −
                </button>
                <button
                  onClick={onIncrementScore}
                  className="flex size-9 items-center justify-center rounded-lg border border-slate-300 bg-white text-lg font-semibold text-[#140B2E] transition hover:bg-slate-50 hover:border-[#2C005A] sm:size-10 sm:text-xl"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
        <button
          onClick={onBack}
          className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-[#140B2E] transition hover:bg-slate-50 hover:border-[#2C005A] sm:rounded-xl sm:px-6 sm:py-4 sm:text-sm"
        >
          ← Retour
        </button>
        <button
          className="flex-1 rounded-lg bg-[#2C005A] px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-[#3A008A] disabled:opacity-50 sm:rounded-xl sm:px-6 sm:py-4 sm:text-sm"
          onClick={onSubmit}
          disabled={getTotalPlayerGoals() !== winnerScore}
        >
          {getTotalPlayerGoals() !== winnerScore
            ? `Placer le pari (${getTotalPlayerGoals()}/${winnerScore} buts)`
            : 'Placer le pari'}
        </button>
      </div>
    </div>
  )
}

export default BetPlayersStep
