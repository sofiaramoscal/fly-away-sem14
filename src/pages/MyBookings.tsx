import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Alert from '../components/Alert'
import { useAuth } from '../context/useAuth'
import { getBookings } from '../services/flightService'
import type { Booking } from '../types'
import { getBookingIds } from '../utils/bookingsStorage'
import { formatDate } from '../utils/format'

export default function MyBookings() {
  const { user, loadingUser } = useAuth()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [missing, setMissing] = useState(0)

  useEffect(() => {
    if (!user) return
    const ids = getBookingIds(user.email)
    getBookings(ids)
      .then((found) => {
        // ordenamos por fecha de salida
        found.sort((a, b) => +new Date(a.estDepartureTime) - +new Date(b.estDepartureTime))
        setBookings(found)
        setMissing(ids.length - found.length)
      })
      .finally(() => setLoading(false))
  }, [user])

  if (loadingUser || (user && loading)) return <p className="muted center">Cargando reservas…</p>

  return (
    <section>
      <div className="page-header">
        <h1>Mis reservas</h1>
        <p className="muted">Reservas hechas desde este navegador con tu cuenta.</p>
      </div>

      {missing > 0 && (
        <Alert type="info">
          {missing} reserva(s) guardada(s) ya no existen en el servidor (probablemente se reinició el backend).
        </Alert>
      )}

      {bookings.length === 0 ? (
        <div className="empty">
          <p className="empty-icon">🧳</p>
          <p><strong>Aún no tienes reservas.</strong></p>
          <Link to="/flights" className="btn btn-primary">Buscar vuelos</Link>
        </div>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Reserva</th>
                <th>Vuelo</th>
                <th>Aerolínea</th>
                <th>Salida</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id}>
                  <td>#{b.id}</td>
                  <td className="mono">{b.flightNumber}</td>
                  <td>{b.airlineName}</td>
                  <td>{formatDate(b.estDepartureTime)}</td>
                  <td className="cell-action">
                    <Link to={`/bookings/${b.id}`} className="btn btn-outline btn-sm">Ver detalle</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
