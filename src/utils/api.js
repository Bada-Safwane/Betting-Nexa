// Configuration de l'URL de base de l'API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

/**
 * Fonction de login
 * Appelle la route de login du backend qui récupère ou crée l'utilisateur
 * @param {string} username - Le nom d'utilisateur
 * @returns {Promise<Object>} Les données de l'utilisateur
 */
export const login = async (username) => {
  if (!username || !username.trim()) {
    throw new Error('Le nom d\'utilisateur est requis');
  }

  try {
    const response = await fetch(`${API_BASE_URL}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: username.trim() }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Erreur serveur' }));
      throw new Error(errorData.error || `Erreur HTTP: ${response.status}`);
    }

    const data = await response.json();
    const user = data.user;

    // Sauvegarder l'utilisateur dans localStorage
    if (user && user.id) {
      localStorage.setItem('user', JSON.stringify(user));
    }

    return user;
  } catch (error) {
    console.error('Erreur lors du login:', error);
    throw error;
  }
};

/**
 * Récupérer l'utilisateur actuellement connecté depuis localStorage
 * @returns {Object|null} Les données de l'utilisateur ou null
 */
export const getCurrentUser = () => {
  try {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      return null;
    }
    const user = JSON.parse(userStr);
    if (user && user.id && user.username) {
      return user;
    }
    return null;
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'utilisateur:', error);
    return null;
  }
};

/**
 * Déconnecter l'utilisateur (logout)
 */
export const logout = () => {
  localStorage.removeItem('user');
};

// ==================== FONCTIONS MATCHES ====================

/**
 * Récupérer l'utilisateur depuis localStorage pour les headers
 */
const getCurrentUserFromStorage = () => {
  try {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    const user = JSON.parse(userStr);
    if (user && user.id && user.username) {
      return user;
    }
    return null;
  } catch (error) {
    return null;
  }
};

/**
 * Récupérer tous les matchs
 * @returns {Promise<Array>} Liste de tous les matchs
 */
export const getAllMatches = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/matches`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Erreur serveur' }));
      throw new Error(errorData.error || `Erreur HTTP: ${response.status}`);
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Erreur lors de la récupération des matchs:', error);
    throw error;
  }
};

/**
 * Récupérer un match par son ID
 * @param {string} matchId - L'ID du match
 * @returns {Promise<Object>} Les données du match
 */
export const getMatchById = async (matchId) => {
  if (!matchId) {
    throw new Error('L\'ID du match est requis');
  }

  try {
    const response = await fetch(`${API_BASE_URL}/matches/${matchId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Erreur serveur' }));
      throw new Error(errorData.error || `Erreur HTTP: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Erreur lors de la récupération du match:', error);
    throw error;
  }
};

/**
 * Créer un nouveau match (admin seulement)
 * @param {Object} matchData - Les données du match à créer
 * @returns {Promise<Object>} Le match créé
 */
export const createMatch = async (matchData) => {
  const user = getCurrentUserFromStorage();
  if (!user || user.role !== 'admin') {
    throw new Error('Accès refusé. Seuls les administrateurs peuvent créer des matchs.');
  }

  try {
    const response = await fetch(`${API_BASE_URL}/matches`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-User-Id': user.id,
      },
      body: JSON.stringify(matchData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Erreur serveur' }));
      throw new Error(errorData.error || `Erreur HTTP: ${response.status}`);
    }

    const data = await response.json();
    return data.match;
  } catch (error) {
    console.error('Erreur lors de la création du match:', error);
    throw error;
  }
};

/**
 * Mettre à jour un match (admin seulement)
 * @param {string} matchId - L'ID du match à mettre à jour
 * @param {Object} updateData - Les données à mettre à jour
 * @returns {Promise<Object>} Le match mis à jour
 */
export const updateMatch = async (matchId, updateData) => {
  const user = getCurrentUserFromStorage();
  if (!user || user.role !== 'admin') {
    throw new Error('Accès refusé. Seuls les administrateurs peuvent modifier des matchs.');
  }

  if (!matchId) {
    throw new Error('L\'ID du match est requis');
  }

  try {
    const response = await fetch(`${API_BASE_URL}/matches/${matchId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-User-Id': user.id,
      },
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Erreur serveur' }));
      throw new Error(errorData.error || `Erreur HTTP: ${response.status}`);
    }

    const data = await response.json();
    return data.match;
  } catch (error) {
    console.error('Erreur lors de la mise à jour du match:', error);
    throw error;
  }
};

/**
 * Supprimer un match (admin seulement)
 * @param {string} matchId - L'ID du match à supprimer
 * @returns {Promise<Object>} Message de confirmation
 */
export const deleteMatch = async (matchId) => {
  const user = getCurrentUserFromStorage();
  if (!user || user.role !== 'admin') {
    throw new Error('Accès refusé. Seuls les administrateurs peuvent supprimer des matchs.');
  }

  if (!matchId) {
    throw new Error('L\'ID du match est requis');
  }

  try {
    const response = await fetch(`${API_BASE_URL}/matches/${matchId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'X-User-Id': user.id,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Erreur serveur' }));
      throw new Error(errorData.error || `Erreur HTTP: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Erreur lors de la suppression du match:', error);
    throw error;
  }
};

/**
 * Soumettre un pari sur un match
 * @param {string} matchId - L'ID du match
 * @param {Object} betData - Les données du pari {winnerTeam, team1Score, team2Score, playerScores}
 * @returns {Promise<Object>} Le match mis à jour avec le pari
 */
export const submitBet = async (matchId, betData) => {
  const user = getCurrentUserFromStorage();
  if (!user || !user.id) {
    throw new Error('Vous devez être connecté pour placer un pari');
  }

  if (!matchId) {
    throw new Error('L\'ID du match est requis');
  }

  try {
    const response = await fetch(`${API_BASE_URL}/matches/${matchId}/bet`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-User-Id': user.id,
      },
      body: JSON.stringify(betData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Erreur serveur' }));
      throw new Error(errorData.error || `Erreur HTTP: ${response.status}`);
    }

    const data = await response.json();
    return data.match;
  } catch (error) {
    console.error('Erreur lors de la soumission du pari:', error);
    throw error;
  }
};

/**
 * Définir le résultat d'un match et attribuer les points (admin seulement)
 * @param {string} matchId - L'ID du match
 * @param {Object} resultData - Les données du résultat {winnerTeam, winnerScore, looserScore, goalers}
 * @returns {Promise<Object>} Le match mis à jour avec le résultat et les utilisateurs mis à jour
 */
export const setMatchResult = async (matchId, resultData) => {
  const user = getCurrentUserFromStorage();
  if (!user || user.role !== 'admin') {
    throw new Error('Accès refusé. Seuls les administrateurs peuvent définir les résultats.');
  }

  if (!matchId) {
    throw new Error('L\'ID du match est requis');
  }

  try {
    const response = await fetch(`${API_BASE_URL}/matches/${matchId}/result`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-User-Id': user.id,
      },
      body: JSON.stringify(resultData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Erreur serveur' }));
      throw new Error(errorData.error || `Erreur HTTP: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erreur lors de la définition du résultat:', error);
    throw error;
  }
};
