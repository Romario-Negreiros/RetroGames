import React from 'react'
import { createPortal } from 'react-dom'

interface Props {
  children: React.ReactNode
  selector: string
}

const ClientOnlyPortal: React.FC<Props> = ({ children, selector }) => {
  const ref = React.useRef<HTMLDivElement | null>(null)
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    if (document.querySelector(selector)) {
      ref.current = document.querySelector(selector) as HTMLDivElement
    }
    setMounted(true)
  }, [selector])

  return mounted && ref.current ? createPortal(<div className="modal_container">{children}</div>, ref.current) : null
}

export default ClientOnlyPortal
