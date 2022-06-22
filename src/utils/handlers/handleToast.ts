import { IToast } from '@contexts/toastContext'

const handleToast = (
  message: string,
  setToast: (toast: IToast) => void,
  timeToCloseInMs: number = 3000 // 3 SECONDS
) => {
  setToast({
    isOpened: true,
    message,
    timeToCloseInMs
  })

  // + 100 MILLISECONDS TO BE ABLE TO SEE PROGRESS BAR FULLFILLED
  // + 600 MILLISECONDS DUE TO TOAST'S TRANSITION
  setTimeout(() => setToast({ isOpened: false, message: '', timeToCloseInMs: 0 }), timeToCloseInMs + 100 + 600)
}

export default handleToast
