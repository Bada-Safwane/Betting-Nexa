import React from 'react'

function AdminMatchForm({
  showForm,
  editingMatch,
  formData,
  setFormData,
  addPlayer,
  removePlayer,
  updatePlayer,
  onCreate,
  onUpdate,
  onCancel,
}) {
  if (!showForm) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editingMatch) {
      onUpdate(editingMatch)
    } else {
      onCreate(e)
    }
  }

  return (
    <div className="mb-8 w-full space-y-5 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:space-y-6 sm:p-6 sm:p-10">
      <h2 className="text-xl font-bold tracking-tight text-[#140B2E] sm:text-2xl">
        {editingMatch ? 'Modifier le match' : 'Créer un nouveau match'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-[0.35em] text-slate-600 sm:text-sm">
            Équipe 1 (Pays)
          </label>
          <input
            type="text"
            value={formData.team1Country}
            onChange={(e) => setFormData({ ...formData, team1Country: e.target.value })}
            placeholder="Ex: Egypt"
            required
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-[#140B2E] placeholder:text-slate-400 focus:border-[#2C005A] focus:outline-none focus:ring-2 focus:ring-[#2C005A]/30 sm:rounded-xl sm:px-5 sm:py-4"
          />
        </div>

        <div className="space-y-2 sm:space-y-3">
          <label className="block text-xs font-semibold uppercase tracking-[0.35em] text-slate-600 sm:text-sm">
            Joueurs Équipe 1
          </label>
          <div className="space-y-2 sm:space-y-3">
            {formData.team1Players.map((player, index) => (
              <div key={index} className="flex gap-2 sm:gap-3">
                <input
                  type="text"
                  placeholder="Prénom"
                  value={player.first_name}
                  onChange={(e) => updatePlayer('team1', index, 'first_name', e.target.value)}
                  className="min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-[#140B2E] placeholder:text-slate-400 focus:border-[#2C005A] focus:outline-none focus:ring-2 focus:ring-[#2C005A]/30 sm:rounded-xl sm:px-4 sm:py-3"
                />
                <input
                  type="text"
                  placeholder="Nom"
                  value={player.last_name}
                  onChange={(e) => updatePlayer('team1', index, 'last_name', e.target.value)}
                  className="min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-[#140B2E] placeholder:text-slate-400 focus:border-[#2C005A] focus:outline-none focus:ring-2 focus:ring-[#2C005A]/30 sm:rounded-xl sm:px-4 sm:py-3"
                />
                <button
                  type="button"
                  onClick={() => removePlayer('team1', index)}
                  className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-slate-300 bg-white text-lg font-semibold text-[#140B2E] transition hover:bg-slate-50 hover:border-red-400 hover:text-red-600 sm:size-12 sm:text-xl"
                >
                  ×
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addPlayer('team1')}
              className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-slate-300 bg-white px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-[#140B2E] transition-all hover:bg-slate-50 hover:border-[#2C005A] hover:scale-[1.02] active:scale-100 sm:rounded-xl sm:px-5 sm:py-3 sm:text-sm"
            >
              <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Ajouter un joueur
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-[0.35em] text-slate-600 sm:text-sm">
            Équipe 2 (Pays)
          </label>
          <input
            type="text"
            value={formData.team2Country}
            onChange={(e) => setFormData({ ...formData, team2Country: e.target.value })}
            placeholder="Ex: Senegal"
            required
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-[#140B2E] placeholder:text-slate-400 focus:border-[#2C005A] focus:outline-none focus:ring-2 focus:ring-[#2C005A]/30 sm:rounded-xl sm:px-5 sm:py-4"
          />
        </div>

        <div className="space-y-2 sm:space-y-3">
          <label className="block text-xs font-semibold uppercase tracking-[0.35em] text-slate-600 sm:text-sm">
            Joueurs Équipe 2
          </label>
          <div className="space-y-2 sm:space-y-3">
            {formData.team2Players.map((player, index) => (
              <div key={index} className="flex gap-2 sm:gap-3">
                <input
                  type="text"
                  placeholder="Prénom"
                  value={player.first_name}
                  onChange={(e) => updatePlayer('team2', index, 'first_name', e.target.value)}
                  className="min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-[#140B2E] placeholder:text-slate-400 focus:border-[#2C005A] focus:outline-none focus:ring-2 focus:ring-[#2C005A]/30 sm:rounded-xl sm:px-4 sm:py-3"
                />
                <input
                  type="text"
                  placeholder="Nom"
                  value={player.last_name}
                  onChange={(e) => updatePlayer('team2', index, 'last_name', e.target.value)}
                  className="min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-[#140B2E] placeholder:text-slate-400 focus:border-[#2C005A] focus:outline-none focus:ring-2 focus:ring-[#2C005A]/30 sm:rounded-xl sm:px-4 sm:py-3"
                />
                <button
                  type="button"
                  onClick={() => removePlayer('team2', index)}
                </button>
                >
                  ×
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addPlayer('team2')}
              className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-slate-300 bg-white px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-[#140B2E] transition-all hover:bg-slate-50 hover:border-[#2C005A] hover:scale-[1.02] active:scale-100 sm:rounded-xl sm:px-5 sm:py-3 sm:text-sm"
            >
              <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Ajouter un joueur
            </button>
            className="flex-1 rounded-lg bg-[#2C005A] px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-[#3A008A] sm:rounded-xl sm:px-6 sm:py-4 sm:text-sm"
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
          <button
            type="submit"
            className="flex-1 rounded-lg bg-[#2C005A] px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-white shadow-md transition-all hover:bg-[#3A008A] hover:shadow-lg hover:scale-[1.02] active:scale-100 sm:rounded-xl sm:px-6 sm:py-4 sm:text-sm"
            className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-[#140B2E] transition hover:bg-slate-50 hover:border-[#2C005A] sm:rounded-xl sm:px-6 sm:py-4 sm:text-sm"
            {editingMatch ? 'Mettre à jour' : 'Créer'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-lg border-2 border-slate-300 bg-white px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-[#140B2E] transition-all hover:bg-slate-50 hover:border-[#2C005A] hover:scale-[1.02] active:scale-100 sm:rounded-xl sm:px-6 sm:py-4 sm:text-sm"
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  )
}

export default AdminMatchForm
