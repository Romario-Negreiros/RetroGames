import React from 'react'

import styles from '@styles/components/waiting.module.css'

interface Props {
  waitingFor: string
}

const Waiting: React.FC<Props> = ({ waitingFor }) => {
  return (
    <section className={styles.container}>
      <div></div>
      <p>{waitingFor}</p>
    </section>
  )
}

export default Waiting
