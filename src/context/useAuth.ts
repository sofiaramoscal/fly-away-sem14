import { createContext, useContext } from 'react'
import type { CurrentUser } from '../types'

export type AuthContextValue = {
  token: string | null
  user: CurrentUser | null
  loadingUser: boolean
  saveToken: (token: string) => Promise<void>
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>')
  return ctx
}
