import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

// Login y Registro: si ya hay sesión iniciada, no tiene sentido verlos
// → vamos a la página que el usuario quería ver, o a la búsqueda
export default function GuestRoute() {
  const { token } = useAuth()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from

  if (token) return <Navigate to={from ?? '/flights'} replace />
  return <Outlet />
}
