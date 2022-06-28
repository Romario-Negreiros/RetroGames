import React from 'react'

import Link from 'next/link'

import styles from '@styles/components/gameCard.module.css'

interface Props {
  game: {
    name: string
    urlName: string
    image: string
    description: string
  }
}

const GameCard: React.FC<Props> = ({ game: { name, urlName, image, description } }) => {
  console.log(image, description)

  return (
    <li>
      <h2 className={styles.game}>{name}</h2>
      <div className={styles.game_options}>
        <Link href={`/${urlName}/leaderboards`}>
          <a>Leaderboards</a>
        </Link>
        <Link href={`/${urlName}`}>
          <a>Play</a>
        </Link>
      </div>
    </li>
  )
}

export default GameCard
