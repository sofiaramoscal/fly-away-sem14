import axios from 'axios'

// El backend devuelve los errores 400 como ProblemDetail: el mensaje está en "detail"
export function errorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    if (!err.response) return 'No se pudo conectar con el servidor. ¿Está corriendo el backend?'
    const detail = err.response.data?.detail
    if (detail) return translate(detail)
    if (err.response.status === 403) return 'Necesitas iniciar sesión.'
    return `Error del servidor (${err.response.status})`
  }
  return 'Error inesperado'
}

// Traducciones de los mensajes conocidos del backend (si no hay traducción, se muestra tal cual)
const TRANSLATIONS: Record<string, string> = {
  'password: must be at least 8 characters': 'La contraseña debe tener al menos 8 caracteres',
  'password: must contain at least one uppercase letter and one digit':
    'La contraseña debe tener al menos una mayúscula y un dígito',
  'firstName: must start with an uppercase letter': 'El nombre debe empezar con mayúscula',
  'lastName: must start with an uppercase letter': 'El apellido debe empezar con mayúscula',
  'email: must be a valid email': 'El email no es válido',
  'Username already exists': 'Ese email ya está registrado',
  'Username does not exist': 'Email o contraseña incorrectos',
  'Cannot book a past flight': 'No puedes reservar un vuelo que ya pasó',
  'Overlapping flight found': 'Ya tienes una reserva con un horario que se superpone con este vuelo',
}

function translate(detail: string): string {
  // Si fallan varios campos, el backend los separa con "; "
  return detail
    .split('; ')
    .map((part) => TRANSLATIONS[part] ?? part)
    .join(' · ')
}
