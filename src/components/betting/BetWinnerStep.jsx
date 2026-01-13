import React from 'react'

function BetWinnerStep({ step, team1Flag, team1Name, team2Flag, team2Name, winnerTeam, onSelectWinner }) {
  if (step !== 1) return null

  return (
    <div className="w-full space-y-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:space-y-8 sm:p-6 sm:p-10">
      <div className="text-center">
        <p className="text-xs uppercase tracking-[0.35em] text-[#2C005A]">Étape 1</p>
        <h3 className="mt-2 text-xl font-bold tracking-tight text-[#140B2E] sm:text-2xl sm:text-3xl">
          Choisissez le vainqueur
        </h3>
      </div>
      <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-center sm:gap-6">
        <button
          onClick={() => onSelectWinner(1)}
          className={`flex min-w-0 flex-1 flex-col items-center gap-3 rounded-xl border-2 p-4 transition sm:gap-4 sm:rounded-2xl sm:p-6 sm:p-8 ${
            winnerTeam === 1
              ? 'border-[#2C005A] bg-[#2C005A]/10'
              : 'border-slate-300 bg-slate-50 hover:border-[#2C005A]/50 hover:bg-slate-100'
          }`}
        >
          <div className="text-4xl sm:text-6xl">{team1Flag}</div>
          <div className="truncate text-base font-semibold text-[#140B2E] sm:text-lg sm:text-xl">
            {team1Name}
          </div>
        </button>
        <div className="shrink-0 text-xs font-semibold uppercase tracking-[0.6em] text-slate-400 sm:px-4 sm:text-sm">
          VS
        </div>
        <button
          onClick={() => onSelectWinner(2)}
          className={`flex min-w-0 flex-1 flex-col items-center gap-3 rounded-xl border-2 p-4 transition sm:gap-4 sm:rounded-2xl sm:p-6 sm:p-8 ${
            winnerTeam === 2
              ? 'border-[#2C005A] bg-[#2C005A]/10'
              : 'border-slate-300 bg-slate-50 hover:border-[#2C005A]/50 hover:bg-slate-100'
          }`}
        >
          <div className="text-4xl sm:text-6xl">{team2Flag}</div>
          <div className="truncate text-base font-semibold text-[#140B2E] sm:text-lg sm:text-xl">
            {team2Name}
          </div>
        </button>
      </div>
    </div>
  )
}

export default BetWinnerStep
