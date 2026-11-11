# Fly Away ✈️ — Frontend

SPA en **React 19 + TypeScript + Vite** que consume la API de reservas de vuelos *Fly Away* (Semana 14, CS2031).

## Cómo correrlo

1. Levanta el backend (necesita JDK 26), en su propia carpeta:
   ```bash
   ./mvnw spring-boot:run      # queda en http://localhost:8080
   ```
2. En esta carpeta:
   ```bash
   npm install
   npm run dev                 # abre http://localhost:5173
   ```

Si el backend corre en otra URL, crea un archivo `.env` con `VITE_API_URL=http://otra-url:puerto`.

Usuario de prueba: `ana.garcia@utec.edu.pe` / `Password1`.

## Funcionalidades

| Funcionalidad | Dónde |
|---|---|
| Registro con validación de campos vacíos, errores del backend y redirección al login | `pages/Register.tsx` |
| Login, token JWT en `localStorage`, error de credenciales, nombre del usuario (`GET /users/current`) | `pages/Login.tsx`, `context/AuthContext.tsx`, `components/Navbar.tsx` |
| Búsqueda por número de vuelo / aerolínea / **rango de fechas**, tabla y mensaje si no hay resultados | `pages/Flights.tsx`, `components/SearchForm.tsx`, `components/FlightTable.tsx` |
| Botón "Reservar" (solo con sesión), mensaje con ID de reserva, errores (vuelo pasado / superpuesto), **detalle de la reserva** | `pages/Flights.tsx`, `components/BookingDetail.tsx` |
| **Mis reservas**: IDs guardados en `localStorage` por usuario (`bookings:<email>`) | `pages/MyBookings.tsx`, `pages/BookingPage.tsx`, `utils/bookingsStorage.ts` |
| Logout, rutas protegidas y navegación | `components/Navbar.tsx`, `components/ProtectedRoute.tsx`, `components/GuestRoute.tsx`, `App.tsx` |

## Rutas

| Ruta | Acceso |
|---|---|
| `/register`, `/login` | Solo sin sesión (si ya iniciaste sesión te manda a `/flights`) |
| `/flights` | Pública — cualquiera busca; solo con sesión aparece "Reservar" |
| `/my-bookings`, `/bookings/:id` | Protegidas — sin token redirige a `/login` y vuelve después de ingresar |

## Estructura

```
src/
├── api/axios.ts            # instancia de Axios: baseURL, token en cada request, 403 → login
├── types/index.ts          # tipos de los DTOs del backend
├── services/               # funciones que llaman a la API (auth, users, flights)
├── context/                # AuthContext: token, usuario actual, login/logout
├── components/             # Navbar, rutas protegidas, formulario, tabla, alertas
├── pages/                  # una pantalla por ruta
├── utils/                  # mensajes de error, localStorage de reservas, formato de fechas
├── App.tsx                 # rutas
└── main.tsx                # punto de entrada
```

## Para probar los errores de reserva

- **Vuelo pasado:** reserva `LA100`.
- **Horario superpuesto:** reserva `LA101` y luego `SK120`.
