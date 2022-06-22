import React from 'react'

import styles from '@styles/components/error.module.css'

interface Props {
  error: string
  setError: (err: string) => void
}

const Error: React.FC<Props> = ({ error, setError }) => {
  const dismiss = () => setError('')

  return (
    <section className={styles.container}>
      <h1>Error</h1>
      <p>{error}</p>
      <button className="button" onClick={dismiss}>
        Dismiss
      </button>
    </section>
  )
}

export default Error
