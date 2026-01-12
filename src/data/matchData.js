// Match data for CAN 2026 Semi Finals
// This will be replaced with API calls when backend is integrated

export const matches = [
  {
    id: 'egypt-senegal',
    team1: {
      name: 'Egypt',
      flag: '🇪🇬',
      code: 'EGY'
    },
    team2: {
      name: 'Senegal',
      flag: '🇸🇳',
      code: 'SEN'
    },
    stats: {
      team1WinPercentage: 35,
      team2WinPercentage: 48,
      drawPercentage: 17,
      topScorer: 'Salah'
    }
  },
  {
    id: 'nigeria-morocco',
    team1: {
      name: 'Nigeria',
      flag: '🇳🇬',
      code: 'NGA'
    },
    team2: {
      name: 'Morocco',
      flag: '🇲🇦',
      code: 'MAR'
    },
    stats: {
      team1WinPercentage: 42,
      team2WinPercentage: 40,
      drawPercentage: 18,
      topScorer: 'Ziyech'
    }
  }
]

// Team players data
export const teamPlayers = {
  'EGY': [
    { id: 1, name: 'Salah', number: 10, position: 'Forward' },
    { id: 2, name: 'Trezeguet', number: 7, position: 'Forward' },
    { id: 3, name: 'Marmoush', number: 9, position: 'Forward' },
    { id: 4, name: 'Elneny', number: 17, position: 'Midfielder' },
    { id: 5, name: 'Mostafa Mohamed', number: 11, position: 'Forward' },
    { id: 6, name: 'Zizo', number: 8, position: 'Midfielder' },
    { id: 7, name: 'Fathi', number: 13, position: 'Defender' },
    { id: 8, name: 'Ashour', number: 6, position: 'Midfielder' },
    { id: 9, name: 'Abdel Monem', number: 24, position: 'Defender' },
    { id: 10, name: 'Hamdi', number: 3, position: 'Defender' },
    { id: 11, name: 'El Shenawy', number: 1, position: 'Goalkeeper' }
  ],
  'SEN': [
    { id: 1, name: 'Mane', number: 10, position: 'Forward' },
    { id: 2, name: 'Dia', number: 9, position: 'Forward' },
    { id: 3, name: 'Sarr', number: 18, position: 'Forward' },
    { id: 4, name: 'Mendy E.', number: 16, position: 'Goalkeeper' },
    { id: 5, name: 'Gueye', number: 5, position: 'Midfielder' },
    { id: 6, name: 'Koulibaly', number: 3, position: 'Defender' },
    { id: 7, name: 'Jackson', number: 20, position: 'Forward' },
    { id: 8, name: 'Sarr P.', number: 17, position: 'Midfielder' },
    { id: 9, name: 'Mendy N.', number: 6, position: 'Midfielder' },
    { id: 10, name: 'Diallo', number: 22, position: 'Defender' },
    { id: 11, name: 'Sabaly', number: 21, position: 'Defender' }
  ],
  'NGA': [
    { id: 1, name: 'Osimhen', number: 9, position: 'Forward' },
    { id: 2, name: 'Lookman', number: 11, position: 'Forward' },
    { id: 3, name: 'Chukwueze', number: 7, position: 'Midfielder' },
    { id: 4, name: 'Simon', number: 12, position: 'Forward' },
    { id: 5, name: 'Iheanacho', number: 14, position: 'Forward' },
    { id: 6, name: 'Onyeka', number: 8, position: 'Midfielder' },
    { id: 7, name: 'Ndidi', number: 4, position: 'Midfielder' },
    { id: 8, name: 'Troost-Ekong', number: 5, position: 'Defender' },
    { id: 9, name: 'Aina', number: 3, position: 'Defender' },
    { id: 10, name: 'Bassey', number: 21, position: 'Defender' },
    { id: 11, name: 'Nwabali', number: 23, position: 'Goalkeeper' }
  ],
  'MAR': [
    { id: 1, name: 'Ziyech', number: 7, position: 'Midfielder' },
    { id: 2, name: 'En-Nesyri', number: 19, position: 'Forward' },
    { id: 3, name: 'Hakimi', number: 2, position: 'Defender' },
    { id: 4, name: 'Boufal', number: 17, position: 'Forward' },
    { id: 5, name: 'Ounahi', number: 8, position: 'Midfielder' },
    { id: 6, name: 'Amrabat', number: 4, position: 'Midfielder' },
    { id: 7, name: 'Saibari', number: 20, position: 'Midfielder' },
    { id: 8, name: 'Mazraoui', number: 3, position: 'Defender' },
    { id: 9, name: 'Aguerd', number: 5, position: 'Defender' },
    { id: 10, name: 'Ezzalzouli', number: 16, position: 'Forward' },
    { id: 11, name: 'Bounou', number: 1, position: 'Goalkeeper' }
  ]
}

export const getMatchById = (id) => {
  return matches.find(match => match.id === id)
}
