import axios from 'axios'

// URL del backend. Se puede cambiar con la variable VITE_API_URL en un archivo .env
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8080',
  headers: { 'Content-Type': 'application/json' },
})

// Antes de cada request: si hay token, lo mandamos en el header Authorization
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Después de cada respuesta: un 403 significa token inválido o ausente
// → limpiamos el token y mandamos al usuario al login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 403) {
      localStorage.removeItem('token')
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  },
)

export default api
