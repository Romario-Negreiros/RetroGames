import React from 'react'

export interface IToast {
  isOpened: boolean
  message: string
  timeToCloseInMs: number
}

interface IToastContext {
  toast: IToast
  setToast: (toast: IToast) => void
}

const initialValue = {
  toast: {
    isOpened: false,
    message: '',
    timeToCloseInMs: 0
  },
  setToast: () => {}
}

const toastContext = React.createContext<IToastContext>(initialValue)

export default toastContext
