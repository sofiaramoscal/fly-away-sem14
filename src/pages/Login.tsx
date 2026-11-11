import { useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Alert from '../components/Alert'
import { useAuth } from '../context/useAuth'
import { login } from '../services/authService'
import { errorMessage } from '../utils/apiError'

type LocationState = { email?: string; registered?: boolean; from?: string } | null

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state as LocationState
  const { saveToken } = useAuth()

  const [email, setEmail] = useState(state?.email ?? '')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !password) {
      setError('Ingresa tu email y contraseña')
      return
    }
    setError('')
    setLoading(true)
    try {
      const token = await login({ email: email.trim(), password })
      await saveToken(token) // guarda en localStorage y carga GET /users/current
      navigate(state?.from ?? '/flights', { replace: true })
    } catch (err) {
      setError(errorMessage(err)) // credenciales incorrectas
      setLoading(false)
    }
  }

  return (
    <section className="auth-page">
      <form className="card auth-card" onSubmit={handleSubmit} noValidate>
        <h1>Iniciar sesión</h1>
        <p className="muted">Bienvenido de vuelta a Fly Away.</p>

        {state?.registered && !error && (
          <Alert type="success">Cuenta creada. Ahora inicia sesión con tu contraseña.</Alert>
        )}
        {state?.from && !state.registered && !error && (
          <Alert type="info">Inicia sesión para continuar.</Alert>
        )}
        {error && <Alert type="error">{error}</Alert>}

        <label>
          Email
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
        </label>
        <label>
          Contraseña
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </label>

        <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
          {loading ? 'Ingresando…' : 'Ingresar'}
        </button>
        <p className="switch">
          ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
        </p>
      </form>
    </section>
  )
}
