import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="empty">
      <p className="empty-icon">🧭</p>
      <p><strong>Página no encontrada</strong></p>
      <Link to="/flights" className="btn btn-primary">Ir a la búsqueda</Link>
    </div>
  )
}
