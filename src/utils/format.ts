// Las fechas llegan en ISO-8601 → las mostramos en formato legible
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('es-PE', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}
