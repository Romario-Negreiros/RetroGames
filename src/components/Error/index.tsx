import React from 'react'
import { useRouter } from 'next/router'

import styles from '@styles/components/error.module.css'

interface Props {
  error: string
  setError?: (err: string) => void
}

const Error: React.FC<Props> = ({ error, setError }) => {
  const { back } = useRouter()

  return (
    <section className={styles.container}>
      <h1>Error</h1>
      <p>{error}</p>
      {setError ? (
        <button className="button" onClick={() => setError('')}>
          Dismiss
        </button>
      ) : (
        <button className="button" onClick={() => back()}>
          Go back
        </button>
      )}
    </section>
  )
}

export default Error
