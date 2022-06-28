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
  const [isShowingGameInfo, setIsShowingGameInfo] = React.useState(false)

  return (
    <li>
      <h2 className={styles.game_name}>
        {name}
        <div onClick={() => setIsShowingGameInfo(!isShowingGameInfo)}>
          <FontAwesomeIcon
            icon={isShowingGameInfo ? faTimesCircle : faInfoCircle}
            color={isShowingGameInfo ? '#ff0000' : '#4ea9ff'}
            size="1x"
          />
        </div>
      </h2>
      {isShowingGameInfo && (
        <article className={styles.game_description}>
          <Image src={image} alt={name} width="100%" height="50px" layout="responsive" objectFit="contain" />
          <p>{description}</p>
        </article>
      )}
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
