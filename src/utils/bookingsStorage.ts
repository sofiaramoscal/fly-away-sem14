// No existe un endpoint para listar "mis reservas", así que guardamos
// los IDs en localStorage, separados por usuario (clave = bookings:<email>)

const keyFor = (email: string) => `bookings:${email}`

export function getBookingIds(email: string): number[] {
  try {
    return JSON.parse(localStorage.getItem(keyFor(email)) ?? '[]')
  } catch {
    return []
  }
}

export function addBookingId(email: string, id: number): void {
  const ids = getBookingIds(email)
  if (!ids.includes(id)) {
    localStorage.setItem(keyFor(email), JSON.stringify([...ids, id]))
  }
}

export function removeBookingId(email: string, id: number): void {
  const ids = getBookingIds(email).filter((x) => x !== id)
  localStorage.setItem(keyFor(email), JSON.stringify(ids))
}
