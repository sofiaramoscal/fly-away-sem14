import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import GuestRoute from './components/GuestRoute'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider } from './context/AuthContext'
import BookingPage from './pages/BookingPage'
import Flights from './pages/Flights'
import Login from './pages/Login'
import MyBookings from './pages/MyBookings'
import NotFound from './pages/NotFound'
import Register from './pages/Register'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <main className="container">
          <Routes>
            <Route path="/" element={<Navigate to="/flights" replace />} />

            {/* Solo para quien NO ha iniciado sesión */}
            <Route element={<GuestRoute />}>
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
            </Route>

            {/* Pública: cualquiera puede buscar; solo los autenticados ven "Reservar" */}
            <Route path="/flights" element={<Flights />} />

            {/* Protegidas: sin token → /login */}
            <Route element={<ProtectedRoute />}>
              <Route path="/my-bookings" element={<MyBookings />} />
              <Route path="/bookings/:id" element={<BookingPage />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </BrowserRouter>
    </AuthProvider>
  )
}
