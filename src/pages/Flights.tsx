import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Alert from '../components/Alert'
import BookingDetail from '../components/BookingDetail'
import FlightTable from '../components/FlightTable'
import SearchForm from '../components/SearchForm'
import { useAuth } from '../context/useAuth'
import { bookFlight, getBooking, searchFlights } from '../services/flightService'
import type { Booking, Flight, FlightSearchParams } from '../types'
import { errorMessage } from '../utils/apiError'
import { addBookingId } from '../utils/bookingsStorage'

export default function Flights() {
  const { token, user } = useAuth()

  const [flights, setFlights] = useState<Flight[]>([])
  const [lastParams, setLastParams] = useState<FlightSearchParams>({})
  const [loading, setLoading] = useState(true)
  const [searchError, setSearchError] = useState('')

  const [bookingFlightId, setBookingFlightId] = useState<number | null>(null)
  const [bookingError, setBookingError] = useState('')
  const [newBookingId, setNewBookingId] = useState<number | null>(null)
  const [bookingDetail, setBookingDetail] = useState<Booking | null>(null)
  const [loadingDetail, setLoadingDetail] = useState(false)

  const runSearch = async (params: FlightSearchParams) => {
    setLoading(true)
    setSearchError('')
    setLastParams(params)
    try {
      setFlights(await searchFlights(params))
    } catch (err) {
      setSearchError(errorMessage(err))
      setFlights([])
    } finally {
      setLoading(false)
    }
  }

  // Al entrar, mostramos todos los vuelos (búsqueda sin filtros)
  useEffect(() => {
    searchFlights({})
      .then(setFlights)
      .catch((err) => setSearchError(errorMessage(err)))
      .finally(() => setLoading(false))
  }, [])

  const handleBook = async (flight: Flight) => {
    setBookingFlightId(flight.id)
    setBookingError('')
    setNewBookingId(null)
    setBookingDetail(null)
    try {
      const id = await bookFlight(flight.id)
      setNewBookingId(id)
      if (user) addBookingId(user.email, id) // para "Mis reservas"
      void runSearch(lastParams) // refrescamos los asientos disponibles
    } catch (err) {
      setBookingError(`No se pudo reservar ${flight.flightNumber}: ${errorMessage(err)}`)
    } finally {
      setBookingFlightId(null)
    }
  }

  const handleShowDetail = async () => {
    if (newBookingId === null) return
    setLoadingDetail(true)
    try {
      setBookingDetail(await getBooking(newBookingId))
    } catch (err) {
      setBookingError(errorMessage(err))
    } finally {
      setLoadingDetail(false)
    }
  }

  return (
    <section>
      <div className="page-header">
        <h1>Buscar vuelos</h1>
        <p className="muted">Filtra por número de vuelo, aerolínea o rango de fechas de salida.</p>
      </div>

      <SearchForm onSearch={runSearch} loading={loading} />

      {!token && (
        <Alert type="info">
          <Link to="/login">Inicia sesión</Link> o <Link to="/register">regístrate</Link> para reservar un vuelo.
        </Alert>
      )}

      {bookingError && (
        <Alert type="error" onClose={() => setBookingError('')}>
          {bookingError}
        </Alert>
      )}

      {newBookingId !== null && (
        <Alert type="success" onClose={() => { setNewBookingId(null); setBookingDetail(null) }}>
          <p>
            <strong>¡Reserva confirmada!</strong> Tu ID de reserva es <strong>#{newBookingId}</strong>.
          </p>
          {bookingDetail ? (
            <BookingDetail booking={bookingDetail} />
          ) : (
            <div className="inline-actions">
              <button className="btn btn-outline btn-sm" onClick={handleShowDetail} disabled={loadingDetail}>
                {loadingDetail ? 'Cargando…' : 'Ver detalle de la reserva'}
              </button>
              <Link to="/my-bookings" className="small">Ir a mis reservas →</Link>
            </div>
          )}
        </Alert>
      )}

      {loading ? (
        <p className="muted center">Cargando vuelos…</p>
      ) : searchError ? (
        <Alert type="error">{searchError}</Alert>
      ) : flights.length === 0 ? (
        <div className="empty">
          <p className="empty-icon">🛫</p>
          <p><strong>No encontramos vuelos con esos filtros.</strong></p>
          <p className="muted">Prueba con otro número de vuelo, otra aerolínea u otro rango de fechas.</p>
        </div>
      ) : (
        <>
          <p className="muted small">{flights.length} vuelo(s) encontrado(s)</p>
          <FlightTable flights={flights} canBook={!!token} bookingId={bookingFlightId} onBook={handleBook} />
        </>
      )}
    </section>
  )
}
