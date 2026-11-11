import api from '../api/axios'
import type { Booking, FlightSearchParams, FlightSearchResponse, NewIdResponse } from '../types'

export async function searchFlights(params: FlightSearchParams) {
  const { data } = await api.get<FlightSearchResponse>('/flights/search', {
    params: {
      // los campos vacíos se mandan como undefined para que axios no los incluya
      flightNumber: params.flightNumber?.trim() || undefined,
      airlineName: params.airlineName?.trim() || undefined,
      // ¡importante! el backend exige ISO-8601 (con toISOString), si no responde 500
      estDepartureTimeFrom: params.estDepartureTimeFrom
        ? new Date(params.estDepartureTimeFrom).toISOString()
        : undefined,
      estDepartureTimeTo: params.estDepartureTimeTo
        ? new Date(params.estDepartureTimeTo).toISOString()
        : undefined,
    },
  })
  return data.items // la lista viene dentro de "items"
}

export async function bookFlight(flightId: number) {
  const { data } = await api.post<NewIdResponse>('/flights/book', { flightId })
  return data.id // ID de la reserva
}

export async function getBooking(id: number) {
  const { data } = await api.get<Booking>(`/flights/book/${id}`)
  return data
}

// Pide varias reservas a la vez; ignora las que fallen (p. ej. si se reinició el backend)
export async function getBookings(ids: number[]) {
  const results = await Promise.allSettled(ids.map((id) => getBooking(id)))
  return results
    .filter((r): r is PromiseFulfilledResult<Booking> => r.status === 'fulfilled')
    .map((r) => r.value)
}
