import React from 'react'

function BetScoreStep({
  step,
  winnerTeam,
  team1Flag,
  team1Name,
  team2Flag,
  team2Name,
  winnerScore,
  setWinnerScore,
  onBack,
  onNext,
}) {
  if (step !== 2 || !winnerTeam) return null

  return (
    <div className="w-full space-y-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:space-y-8 sm:p-6 sm:p-10">
      <div className="text-center">
        <p className="text-xs uppercase tracking-[0.35em] text-[#2C005A]">Étape 2</p>
        <h3 className="mt-2 text-xl font-bold tracking-tight text-[#140B2E] sm:text-2xl sm:text-3xl">
          Score du gagnant
        </h3>
      </div>
      <div className="flex flex-col items-center gap-4 sm:gap-6">
        <div className="flex flex-col items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-6 sm:gap-4 sm:rounded-2xl sm:p-8">
          <div className="text-4xl sm:text-6xl">{winnerTeam === 1 ? team1Flag : team2Flag}</div>
          <div className="text-lg font-semibold text-[#140B2E] sm:text-xl sm:text-2xl">
            {winnerTeam === 1 ? team1Name : team2Name}
          </div>
        </div>
        <div className="w-full space-y-3 sm:space-y-4">
          <label className="block text-center text-xs uppercase tracking-[0.35em] text-slate-600 sm:text-sm">
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
      </div>
      <div className="flex gap-3 sm:gap-4">
        <button
          onClick={onBack}
          className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-[#140B2E] transition hover:bg-slate-50 hover:border-[#2C005A] sm:rounded-xl sm:px-6 sm:py-4 sm:text-sm"
        >
          ← Retour
        </button>
        <button
          onClick={onNext}
          disabled={winnerScore === 0}
          className="flex-1 rounded-lg bg-[#2C005A] px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-[#3A008A] disabled:opacity-50 sm:rounded-xl sm:px-6 sm:py-4 sm:text-sm"
        >
          Suivant →
        </button>
      </div>
    </div>
  )
}

export default BetScoreStep
