import React from 'react'

function AdminMatchList({ matches, onEdit, onDelete, onSetResult, countryFlags }) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold tracking-tight text-[#140B2E] sm:text-2xl">Matchs existants</h2>
      {!Array.isArray(matches) || matches.length === 0 ? (
        <p className="text-slate-600">Aucun match disponible</p>
      ) : (
        <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {matches.map(match => {
            if (!match || !match._id) return null
            const team1Name = match.team1?.country || 'Team 1'
            const team2Name = match.team2?.country || 'Team 2'
            const team1Flag = countryFlags[team1Name]?.flag || countryFlags[match.team1?.code]?.flag || '🏳️'
            const team2Flag = countryFlags[team2Name]?.flag || countryFlags[match.team2?.code]?.flag || '🏳️'

            return (
              <div
                key={match._id}
                className="flex min-w-0 flex-col space-y-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
              >
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex min-w-0 items-center justify-between gap-2 sm:gap-4">
                    <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
                      <span className="text-2xl sm:text-3xl">{team1Flag}</span>
                      <span className="truncate text-sm font-semibold text-[#140B2E] sm:text-base">
                        {team1Name}
                      </span>
                    </div>
                    <span className="shrink-0 text-[0.65rem] font-semibold uppercase tracking-[0.6em] text-slate-400 sm:text-xs">
                      VS
                    </span>
                    <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
                      <span className="text-2xl sm:text-3xl">{team2Flag}</span>
                      <span className="truncate text-sm font-semibold text-[#140B2E] sm:text-base">
                        {team2Name}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs sm:gap-3 sm:p-4 sm:text-sm">
                    <div>
                      <p className="text-[0.65rem] uppercase tracking-[0.35em] text-slate-500 sm:text-xs">
                        Joueurs É1
                      </p>
                      <p className="mt-1 text-base font-semibold text-[#140B2E] sm:text-lg">
                        {match.team1?.players?.length || 0}
                      </p>
                    </div>
                    <div>
                      <p className="text-[0.65rem] uppercase tracking-[0.35em] text-slate-500 sm:text-xs">
                        Joueurs É2
                      </p>
                      <p className="mt-1 text-base font-semibold text-[#140B2E] sm:text-lg">
                        {match.team2?.players?.length || 0}
                      </p>
                    </div>
                    <div>
                      <p className="text-[0.65rem] uppercase tracking-[0.35em] text-slate-500 sm:text-xs">
                        Paris É1
                      </p>
                      <p className="mt-1 text-base font-semibold text-[#2C005A] sm:text-lg">
                        {match.team1?.bettings_winners?.length || 0}
                      </p>
                    </div>
                    <div>
                      <p className="text-[0.65rem] uppercase tracking-[0.35em] text-slate-500 sm:text-xs">
                        Paris É2
                      </p>
                      <p className="mt-1 text-base font-semibold text-[#2C005A] sm:text-lg">
                        {match.team2?.bettings_winners?.length || 0}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
                  <button
                    onClick={() => onSetResult(match)}
                    className="w-full rounded-lg bg-[#2C005A] px-3 py-2 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-[#3A008A] sm:px-4 sm:py-2.5 sm:text-sm"
                  >
                    {match.winner?.team ? 'Modifier résultat' : 'Définir résultat'}
                  </button>
                  <div className="flex gap-2 sm:gap-3">
                    <button
                      onClick={() => onEdit(match)}
                      className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold uppercase tracking-wide text-[#140B2E] transition hover:bg-slate-50 hover:border-[#2C005A] sm:px-4 sm:py-2.5 sm:text-sm"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => onDelete(match._id)}
                      className="flex-1 rounded-lg border border-red-300 bg-white px-3 py-2 text-xs font-semibold uppercase tracking-wide text-red-600 transition hover:bg-red-50 hover:border-red-400 sm:px-4 sm:py-2.5 sm:text-sm"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default AdminMatchList
