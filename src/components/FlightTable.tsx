import { Link } from 'react-router-dom'
import type { Flight } from '../types'
import { formatDate } from '../utils/format'

type Props = {
  flights: Flight[]
  canBook: boolean // solo los usuarios autenticados pueden reservar
  bookingId: number | null // vuelo que se está reservando ahora mismo
  onBook: (flight: Flight) => void
}

export default function FlightTable({ flights, canBook, bookingId, onBook }: Props) {
  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Número</th>
            <th>Aerolínea</th>
            <th>Salida</th>
            <th>Llegada</th>
            <th>Asientos</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {flights.map((flight) => (
            <tr key={flight.id}>
              <td className="mono">{flight.flightNumber}</td>
              <td>{flight.airlineName}</td>
              <td>{formatDate(flight.estDepartureTime)}</td>
              <td>{formatDate(flight.estArrivalTime)}</td>
              <td>{flight.availableSeats}</td>
              <td className="cell-action">
                {canBook ? (
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => onBook(flight)}
                    disabled={bookingId !== null || flight.availableSeats <= 0}
                  >
                    {bookingId === flight.id ? 'Reservando…' : 'Reservar'}
                  </button>
                ) : (
                  <Link to="/login" className="muted small">
                    Inicia sesión para reservar
                  </Link>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
