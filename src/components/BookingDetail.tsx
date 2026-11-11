import type { Booking } from '../types'
import { formatDate } from '../utils/format'

export default function BookingDetail({ booking }: { booking: Booking }) {
  return (
    <dl className="detail">
      <dt>ID de reserva</dt>
      <dd>#{booking.id}</dd>
      <dt>Fecha de reserva</dt>
      <dd>{formatDate(booking.bookingDate)}</dd>
      <dt>Vuelo</dt>
      <dd className="mono">{booking.flightNumber}</dd>
      <dt>Aerolínea</dt>
      <dd>{booking.airlineName}</dd>
      <dt>Salida</dt>
      <dd>{formatDate(booking.estDepartureTime)}</dd>
      <dt>Llegada</dt>
      <dd>{formatDate(booking.estArrivalTime)}</dd>
      <dt>Pasajero</dt>
      <dd>
        {booking.customerFirstName} {booking.customerLastName}
      </dd>
    </dl>
  )
}
