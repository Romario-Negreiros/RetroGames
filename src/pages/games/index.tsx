import games from '@static/games.json'

import { GameCard } from '../../components'

import styles from '@styles/pages/games.module.css'

import type { NextPage } from 'next'

const Games: NextPage = () => {
  return (
    <main className="main_container full_screen_height_wrapper">
      <ul className={styles.games_list}>
        {games.map(game => (
          <GameCard key={game.name} game={game} />
        ))}
      </ul>
    </main>
  )
}

export default Games
