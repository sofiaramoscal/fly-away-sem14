import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Alert from '../components/Alert'
import BookingDetail from '../components/BookingDetail'
import { getBooking } from '../services/flightService'
import type { Booking } from '../types'
import { errorMessage } from '../utils/apiError'

// Detalle de una reserva: GET /flights/book/{id}
export default function BookingPage() {
  const { id } = useParams()
  const [booking, setBooking] = useState<Booking | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    getBooking(Number(id))
      .then(setBooking)
      .catch((err) => setError(errorMessage(err)))
  }, [id])

  return (
    <section className="narrow">
      <Link to="/my-bookings" className="small">← Volver a mis reservas</Link>
      <div className="page-header">
        <h1>Reserva #{id}</h1>
      </div>
      {error ? (
        <Alert type="error">No se pudo cargar la reserva: {error}</Alert>
      ) : !booking ? (
        <p className="muted">Cargando…</p>
      ) : (
        <div className="card">
          <BookingDetail booking={booking} />
        </div>
      )}
    </section>
  )
}
