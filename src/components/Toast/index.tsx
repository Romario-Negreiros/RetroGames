import React from 'react'
import { useToast } from '@utils/hooks'

import styles from '@styles/components/toast.module.css'

const Toast: React.FC = () => {
  const { toast } = useToast()

  React.useEffect(() => {
    if (toast.isOpened) {
      setTimeout(() => {
        document.querySelector(`.${styles.progress} div`)?.classList.add(styles.animate_bar)
      }, 600)
    } else {
      document.querySelector(`.${styles.progress} div`)?.classList.remove(styles.animate_bar)
    }
  }, [toast.isOpened])

  const containerAnimation = {
    transform: toast.isOpened ? 'translateX(0)' : 'translateX(-400px)'
  }

  const progressBarAnimationDuration = {
    animationDuration: `${toast.timeToCloseInMs / 1000}s`,
    MozAnimationDuration: `${toast.timeToCloseInMs / 1000}s`,
    OAnimationDuration: `${toast.timeToCloseInMs / 1000}s`
  }

  return (
    <div className={styles.container} style={containerAnimation}>
      <p>{toast.message}</p>
      <div className={styles.progress}>
        <div style={progressBarAnimationDuration}></div>
      </div>
    </div>
  )
}

export default Toast
