import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

export default function Navbar() {
  const { token, user, loadingUser, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="navbar">
      <Link to="/flights" className="brand">
        ✈️ Fly Away
      </Link>

      <nav className="nav-links">
        <NavLink to="/flights">Buscar vuelos</NavLink>
        {token && <NavLink to="/my-bookings">Mis reservas</NavLink>}
      </nav>

      <div className="nav-user">
        {token ? (
          <>
            <span className="user-name">
              {loadingUser ? 'Cargando…' : user ? `Hola, ${user.firstName} ${user.lastName}` : ''}
            </span>
            <button className="btn btn-outline" onClick={handleLogout}>
              Cerrar sesión
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login">Iniciar sesión</NavLink>
            <Link to="/register" className="btn btn-primary">
              Registrarse
            </Link>
          </>
        )}
      </div>
    </header>
  )
}
