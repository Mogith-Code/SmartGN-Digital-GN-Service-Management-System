export const getAuthHeaders = () => {
  const token = localStorage.getItem('smartgn_token')
  return {
    'Authorization': token ? `Bearer ${token}` : '',
    'Content-Type': 'application/json'
  }
}

export const authenticatedFetch = (url, options = {}) => {
  const headers = {
    ...getAuthHeaders(),
    ...options.headers
  }
  return fetch(url, {
    ...options,
    headers
  })
}