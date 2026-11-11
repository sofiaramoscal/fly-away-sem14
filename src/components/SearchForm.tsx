import { useState, type FormEvent } from 'react'
import type { FlightSearchParams } from '../types'

type Props = {
  onSearch: (params: FlightSearchParams) => void
  loading: boolean
}

const EMPTY: FlightSearchParams = {
  flightNumber: '',
  airlineName: '',
  estDepartureTimeFrom: '',
  estDepartureTimeTo: '',
}

export default function SearchForm({ onSearch, loading }: Props) {
  const [form, setForm] = useState<FlightSearchParams>(EMPTY)
  const [error, setError] = useState('')

  const update = (field: keyof FlightSearchParams, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const { estDepartureTimeFrom: from, estDepartureTimeTo: to } = form
    if (from && to && new Date(from) > new Date(to)) {
      setError('La fecha "desde" no puede ser posterior a la fecha "hasta"')
      return
    }
    setError('')
    onSearch(form)
  }

  const handleClear = () => {
    setForm(EMPTY)
    setError('')
    onSearch(EMPTY)
  }

  return (
    <form className="card search-form" onSubmit={handleSubmit}>
      <div className="grid">
        <label>
          Número de vuelo
          <input
            value={form.flightNumber}
            onChange={(e) => update('flightNumber', e.target.value)}
            placeholder="Ej. LA101"
          />
        </label>
        <label>
          Aerolínea
          <input
            value={form.airlineName}
            onChange={(e) => update('airlineName', e.target.value)}
            placeholder="Ej. LATAM"
          />
        </label>
        <label>
          Salida desde
          <input
            type="datetime-local"
            value={form.estDepartureTimeFrom}
            onChange={(e) => update('estDepartureTimeFrom', e.target.value)}
          />
        </label>
        <label>
          Salida hasta
          <input
            type="datetime-local"
            value={form.estDepartureTimeTo}
            onChange={(e) => update('estDepartureTimeTo', e.target.value)}
          />
        </label>
      </div>
      {error && <p className="field-error">{error}</p>}
      <div className="actions">
        <button type="button" className="btn btn-outline" onClick={handleClear} disabled={loading}>
          Limpiar
        </button>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Buscando…' : 'Buscar'}
        </button>
      </div>
    </form>
  )
}
