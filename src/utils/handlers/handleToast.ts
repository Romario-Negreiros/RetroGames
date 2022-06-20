import { IToast } from '@contexts/toastContext'

const handleToast = (
  message: string,
  setToast: (toast: IToast) => void,
  timeToCloseInMs: number = 3600 // 3 SECONDS + 600 MILLISECONDS DUE TO TOAST'S TRANSITION
) => {
  setToast({
    isOpened: true,
    message,
    timeToCloseInMs
  })

  // + 100 MILLISECONDS TO BE ABLE TO SEE PROGRESS BAR FULLFILLED
  setTimeout(() => setToast({ isOpened: false, message: '', timeToCloseInMs: 0 }), timeToCloseInMs + 100)
}

export default handleToast
