import React from 'react'
import { createPortal } from 'react-dom'

interface Props {
  children: React.ReactNode
}

const ClientOnlyPortal: React.FC<Props> = ({ children }) => {
  const ref = React.useRef<HTMLDivElement | null>(null)

  React.useEffect(() => {
    const modalContainer = document.querySelector('#modal_container') as HTMLDivElement | null
    if (modalContainer) {
      ref.current = modalContainer
    }
  }, [])

  if (!ref.current) {
    return null
  }
  return createPortal(<div className="modal_container">{children}</div>, ref.current)
}

export default ClientOnlyPortal
