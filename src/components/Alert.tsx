import type { ReactNode } from 'react'

type Props = {
  type: 'error' | 'success' | 'info'
  children: ReactNode
  onClose?: () => void
}

export default function Alert({ type, children, onClose }: Props) {
  return (
    <div className={`alert alert-${type}`} role={type === 'error' ? 'alert' : 'status'}>
      <div>{children}</div>
      {onClose && (
        <button className="alert-close" onClick={onClose} aria-label="Cerrar">
          ×
        </button>
      )}
    </div>
  )
}
