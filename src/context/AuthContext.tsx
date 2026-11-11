import { useEffect, useState, type ReactNode } from 'react'
import type { CurrentUser } from '../types'
import { getCurrentUser } from '../services/userService'
import { AuthContext } from './useAuth'

// Estado global de autenticación: token, usuario actual, login y logout
export function AuthProvider({ children }: { children: ReactNode }) {
  // Leemos el token guardado para no perder la sesión al recargar la página
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'))
  const [user, setUser] = useState<CurrentUser | null>(null)
  const [loadingUser, setLoadingUser] = useState<boolean>(() => !!localStorage.getItem('token'))

  const clearSession = () => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
  }

  // Al cargar la app, si ya había token, pedimos los datos del usuario (GET /users/current)
  useEffect(() => {
    if (!localStorage.getItem('token')) return
    getCurrentUser()
      .then(setUser)
      .catch(clearSession) // token inválido (p. ej. se reinició el backend)
      .finally(() => setLoadingUser(false))
  }, [])

  const saveToken = async (newToken: string) => {
    localStorage.setItem('token', newToken) // la clave DEBE ser 'token' (la lee el interceptor)
    setLoadingUser(true)
    setToken(newToken)
    try {
      setUser(await getCurrentUser())
    } catch {
      clearSession()
    } finally {
      setLoadingUser(false)
    }
  }

  return (
    <AuthContext.Provider value={{ token, user, loadingUser, saveToken, logout: clearSession }}>
      {children}
    </AuthContext.Provider>
  )
}
