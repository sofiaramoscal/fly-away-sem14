export type RegisterPayload = {
  email: string
  firstName: string
  lastName: string
  password: string
}

export type LoginPayload = {
  email: string
  password: string
}

export type LoginResponse = {
  token: string
}

export type NewIdResponse = {
  id: number
}

export type CurrentUser = {
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  role: 'USER' | 'ADMIN'
}

export type Flight = {
  id: number
  flightNumber: string
  airlineName: string
  estDepartureTime: string
  estArrivalTime: string
  availableSeats: number
}

export type FlightSearchParams = {
  flightNumber?: string
  airlineName?: string
  estDepartureTimeFrom?: string // valor de <input type="datetime-local">
  estDepartureTimeTo?: string
}

export type FlightSearchResponse = {
  items: Flight[]
}

export type Booking = {
  id: number
  bookingDate: string
  flightId: number
  flightNumber: string
  airlineName: string
  estDepartureTime: string
  estArrivalTime: string
  customerId: number
  customerFirstName: string
  customerLastName: string
}
