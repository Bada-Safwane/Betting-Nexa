// Authentication utilities
// This will be replaced with actual API calls when backend is integrated

export const login = (firstName) => {
  const user = { firstName, id: Date.now() }
  localStorage.setItem('user', JSON.stringify(user))
  return user
}

export const logout = () => {
  localStorage.removeItem('user')
}

export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user')
  return userStr ? JSON.parse(userStr) : null
}
