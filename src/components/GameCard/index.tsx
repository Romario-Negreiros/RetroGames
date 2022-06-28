import React from 'react'

import Link from 'next/link'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { faInfoCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons'

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
      <h2>
        {name} <br />
        <FontAwesomeIcon icon={faInfoCircle} color="#4ea9ff" size="1x" /> <br />
      </h2>
      <div className={styles.game_options}>
        <Link href={`/${urlName}/leaderboards`}>
          <a>Leaderboards</a>
        </Link>
        <Link href={`/${urlName}`}>
          <a>Play</a>
        </Link>
      </div>
      <article className={styles.game_description}>
        <Image src={image} alt={name} width="100%" height="40px" layout="responsive" objectFit="contain" />
        <p>{description}</p>
      </article>
    </li>
  )
}

export default GameCard
