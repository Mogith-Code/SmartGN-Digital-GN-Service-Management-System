export const getAuthHeaders = () => {
  const token = localStorage.getItem('smartgn_token')
  return {
    'Authorization': token ? `Bearer ${token}` : '',
    'Content-Type': 'application/json'
  }
}