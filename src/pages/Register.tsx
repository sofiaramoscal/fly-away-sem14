import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Alert from '../components/Alert'
import { register } from '../services/authService'
import { errorMessage } from '../utils/apiError'
import type { RegisterPayload } from '../types'

const LABELS: Record<keyof RegisterPayload, string> = {
  email: 'Email',
  firstName: 'Nombre',
  lastName: 'Apellido',
  password: 'Contraseña',
}

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState<RegisterPayload>({ email: '', firstName: '', lastName: '', password: '' })
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof RegisterPayload, string>>>({})
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const update = (field: keyof RegisterPayload, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setFieldErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  // Validación de campos vacíos ANTES de enviar (el backend acepta un email vacío)
  const validate = () => {
    const errors: typeof fieldErrors = {}
    for (const field of Object.keys(LABELS) as (keyof RegisterPayload)[]) {
      if (!form[field].trim()) errors[field] = `${LABELS[field]} es obligatorio`
    }
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    if (!validate()) return

    setLoading(true)
    try {
      await register({ ...form, email: form.email.trim() })
      setSuccess('¡Cuenta creada con éxito! Te llevamos al login…')
      setTimeout(() => navigate('/login', { state: { email: form.email.trim(), registered: true } }), 1500)
    } catch (err) {
      setError(errorMessage(err)) // contraseña débil, email en uso, etc.
      setLoading(false)
    }
  }

  const input = (field: keyof RegisterPayload, type = 'text', autoComplete?: string) => (
    <label>
      {LABELS[field]}
      <input
        type={type}
        value={form[field]}
        onChange={(e) => update(field, e.target.value)}
        autoComplete={autoComplete}
        aria-invalid={!!fieldErrors[field]}
      />
      {fieldErrors[field] && <span className="field-error">{fieldErrors[field]}</span>}
    </label>
  )

  return (
    <section className="auth-page">
      <form className="card auth-card" onSubmit={handleSubmit} noValidate>
        <h1>Crear cuenta</h1>
        <p className="muted">Regístrate para reservar vuelos.</p>

        {error && <Alert type="error">{error}</Alert>}
        {success && <Alert type="success">{success}</Alert>}

        {input('email', 'email', 'email')}
        <div className="grid-2">
          {input('firstName', 'text', 'given-name')}
          {input('lastName', 'text', 'family-name')}
        </div>
        {input('password', 'password', 'new-password')}
        <p className="hint">
          Mínimo 8 caracteres, con al menos una mayúscula y un dígito. Nombre y apellido deben empezar con
          mayúscula.
        </p>

        <button type="submit" className="btn btn-primary btn-block" disabled={loading || !!success}>
          {loading ? 'Creando cuenta…' : 'Registrarme'}
        </button>
        <p className="switch">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </form>
    </section>
  )
}
