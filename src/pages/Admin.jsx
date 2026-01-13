import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAllMatches, createMatch, updateMatch, deleteMatch, setMatchResult } from '../utils/api'
import AdminMatchForm from '../components/admin/AdminMatchForm'
import AdminMatchList from '../components/admin/AdminMatchList'
import AdminMatchResultForm from '../components/admin/AdminMatchResultForm'

// Mapping des pays vers leurs drapeaux et codes
const countryFlags = {
  'Egypt': { flag: '🇪🇬', code: 'EGY' },
  'Senegal': { flag: '🇸🇳', code: 'SEN' },
  'Nigeria': { flag: '🇳🇬', code: 'NGA' },
  'Morocco': { flag: '🇲🇦', code: 'MAR' },
  'EGY': { flag: '🇪🇬', code: 'EGY' },
  'SEN': { flag: '🇸🇳', code: 'SEN' },
  'NGA': { flag: '🇳🇬', code: 'NGA' },
  'MAR': { flag: '🇲🇦', code: 'MAR' }
}

function Admin({ user }) {
  const navigate = useNavigate()
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingMatch, setEditingMatch] = useState(null)
  const [resultMatch, setResultMatch] = useState(null)
  const [formData, setFormData] = useState({
    team1Country: '',
    team2Country: '',
    team1Players: [], // Array d'objets {first_name, last_name}
    team2Players: [] // Array d'objets {first_name, last_name}
  })

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/home')
      return
    }
    loadMatches()
  }, [user, navigate])

  const loadMatches = async () => {
    try {
      setLoading(true)
      const matchesData = await getAllMatches()
      // S'assurer que matchesData est un tableau
      if (Array.isArray(matchesData)) {
        setMatches(matchesData)
      } else {
        console.error('Réponse API invalide:', matchesData)
        setMatches([])
        setError('Format de données invalide reçu du serveur')
      }
      setError('')
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement des matchs')
      console.error('Erreur lors du chargement des matchs:', err)
      setMatches([]) // S'assurer que matches reste un tableau même en cas d'erreur
    } finally {
      setLoading(false)
    }
  }

  const addPlayer = (team) => {
    if (team === 'team1') {
      setFormData({
        ...formData,
        team1Players: [...formData.team1Players, { first_name: '', last_name: '' }]
      })
    } else {
      setFormData({
        ...formData,
        team2Players: [...formData.team2Players, { first_name: '', last_name: '' }]
      })
    }
  }

  const removePlayer = (team, index) => {
    if (team === 'team1') {
      setFormData({
        ...formData,
        team1Players: formData.team1Players.filter((_, i) => i !== index)
      })
    } else {
      setFormData({
        ...formData,
        team2Players: formData.team2Players.filter((_, i) => i !== index)
      })
    }
  }

  const updatePlayer = (team, index, field, value) => {
    if (team === 'team1') {
      const updatedPlayers = [...formData.team1Players]
      updatedPlayers[index] = { ...updatedPlayers[index], [field]: value }
      setFormData({ ...formData, team1Players: updatedPlayers })
    } else {
      const updatedPlayers = [...formData.team2Players]
      updatedPlayers[index] = { ...updatedPlayers[index], [field]: value }
      setFormData({ ...formData, team2Players: updatedPlayers })
    }
  }

  const handleCreateMatch = async (e) => {
    e.preventDefault()
    try {
      // Convertir les joueurs en format backend (avec bettings vide)
      const formatPlayers = (players) => {
        return players
          .filter(p => p.first_name && p.first_name.trim())
          .map(p => ({
            first_name: p.first_name.trim(),
            last_name: (p.last_name || '').trim(),
            bettings: []
          }))
      }

      const matchData = {
        team1: {
          country: formData.team1Country,
          bettings_winners: [],
          betting_scores: [],
          players: formatPlayers(formData.team1Players)
        },
        team2: {
          country: formData.team2Country,
          bettings_winners: [],
          betting_scores: [],
          players: formatPlayers(formData.team2Players)
        },
        winner: {}
      }

      await createMatch(matchData)
      setShowForm(false)
      setFormData({
        team1Country: '',
        team2Country: '',
        team1Players: [],
        team2Players: []
      })
      loadMatches()
      alert('Match créé avec succès!')
    } catch (err) {
      alert(err.message || 'Erreur lors de la création du match')
      console.error('Erreur lors de la création du match:', err)
    }
  }

  const handleUpdateMatch = async (matchId) => {
    try {
      const match = matches.find(m => m._id === matchId)
      if (!match) return

      // Convertir les joueurs en format backend en préservant les bettings existants
      const formatPlayersWithBettings = (newPlayers, existingPlayers) => {
        return newPlayers
          .filter(p => p.first_name && p.first_name.trim())
          .map((p, index) => {
            const existingPlayer = existingPlayers?.[index]
            return {
              first_name: p.first_name.trim(),
              last_name: (p.last_name || '').trim(),
              bettings: existingPlayer?.bettings || []
            }
          })
      }

      const updateData = {
        team1: {
          country: formData.team1Country || match.team1.country,
          bettings_winners: match.team1.bettings_winners || [],
          betting_scores: match.team1.betting_scores || [],
          players: formData.team1Players.length > 0
            ? formatPlayersWithBettings(formData.team1Players, match.team1.players)
            : match.team1.players || []
        },
        team2: {
          country: formData.team2Country || match.team2.country,
          bettings_winners: match.team2.bettings_winners || [],
          betting_scores: match.team2.betting_scores || [],
          players: formData.team2Players.length > 0
            ? formatPlayersWithBettings(formData.team2Players, match.team2.players)
            : match.team2.players || []
        },
        winner: match.winner || {}
      }

      await updateMatch(matchId, updateData)
      setShowForm(false)
      setEditingMatch(null)
      setFormData({
        team1Country: '',
        team2Country: '',
        team1Players: [],
        team2Players: []
      })
      loadMatches()
      alert('Match mis à jour avec succès!')
    } catch (err) {
      alert(err.message || 'Erreur lors de la mise à jour du match')
      console.error('Erreur lors de la mise à jour du match:', err)
    }
  }

  const handleDeleteMatch = async (matchId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce match?')) {
      return
    }

    try {
      await deleteMatch(matchId)
      loadMatches()
      alert('Match supprimé avec succès!')
    } catch (err) {
      alert(err.message || 'Erreur lors de la suppression du match')
      console.error('Erreur lors de la suppression du match:', err)
    }
  }

  const startEdit = (match) => {
    setEditingMatch(match._id)
    setFormData({
      team1Country: match.team1?.country || '',
      team2Country: match.team2?.country || '',
      team1Players: match.team1?.players?.map(p => ({
        first_name: p.first_name || '',
        last_name: p.last_name || ''
      })) || [],
      team2Players: match.team2?.players?.map(p => ({
        first_name: p.first_name || '',
        last_name: p.last_name || ''
      })) || []
    })
    setShowForm(true)
  }

  const cancelEdit = () => {
    setShowForm(false)
    setEditingMatch(null)
    setFormData({
      team1Country: '',
      team2Country: '',
      team1Players: [],
      team2Players: []
    })
  }

  const startSetResult = (match) => {
    setResultMatch(match)
    // Masquer le formulaire de création/modification si ouvert
    setShowForm(false)
    setEditingMatch(null)
  }

  const cancelSetResult = () => {
    setResultMatch(null)
  }

  const handleSetResult = async (resultData) => {
    if (!resultMatch || !resultMatch._id) {
      alert('Erreur: match non trouvé')
      return
    }

    try {
      await setMatchResult(resultMatch._id, resultData)
      setResultMatch(null)
      loadMatches() // Recharger les matchs pour voir les résultats mis à jour
      alert('Résultat défini avec succès! Les points ont été attribués aux utilisateurs.')
    } catch (err) {
      alert(err.message || 'Erreur lors de la définition du résultat')
      console.error('Erreur lors de la définition du résultat:', err)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="size-12 animate-spin rounded-full border-4 border-slate-200 border-t-[#2C005A]" />
          <p className="text-sm text-slate-600">Chargement...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white text-[#140B2E]">
      {/* Header sticky violet */}
      <header className="sticky top-0 z-30 border-b border-[#2C005A] bg-[#2C005A] text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-4 sm:py-3">
          <button
            onClick={() => navigate('/home')}
            className="text-xs font-semibold uppercase tracking-[0.2em] hover:underline"
          >
            ← Retour aux matchs
          </button>
          <h1 className="text-sm font-semibold uppercase tracking-[0.3em]">
            Gestion des matchs
          </h1>
          <span className="w-20" />
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-6 py-4 text-red-700">
            {error}
          </div>
        )}

        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Créer ou modifier un match</h2>
            <p className="mt-1 text-sm text-slate-600">
              Configure les équipes et les joueurs, les paris seront automatiquement reliés.
            </p>
          </div>
          <button
            onClick={() => {
              setShowForm(true)
              setEditingMatch(null)
              setFormData({
                team1Country: '',
                team2Country: '',
                team1Players: [],
                team2Players: []
              })
            }}
            className="hidden rounded-full bg-[#2C005A] px-6 py-2 text-xs font-semibold uppercase tracking-wide text-white shadow-sm hover:bg-[#3A008A] sm:inline-flex"
          >
            + Nouveau match
          </button>
        </div>

        <AdminMatchForm
          showForm={showForm}
          editingMatch={editingMatch}
          formData={formData}
          setFormData={setFormData}
          addPlayer={addPlayer}
          removePlayer={removePlayer}
          updatePlayer={updatePlayer}
          onCreate={handleCreateMatch}
          onUpdate={handleUpdateMatch}
          onCancel={cancelEdit}
        />

        <AdminMatchResultForm
          showForm={!!resultMatch}
          match={resultMatch}
          countryFlags={countryFlags}
          onCancel={cancelSetResult}
          onSubmit={handleSetResult}
        />

        <AdminMatchList
          matches={matches}
          onEdit={startEdit}
          onDelete={handleDeleteMatch}
          onSetResult={startSetResult}
          countryFlags={countryFlags}
        />
      </main>
    </div>
  )
}

export default Admin
