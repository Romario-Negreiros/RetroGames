import styles from '@styles/pages/userProfile.module.css'

import type { NextPage } from 'next'

const user = {
  name: 'bananana',
  ticTacToe: {
    position: 1,
    score: 24567,
    wins: 47,
    losses: 5,
    maxWinStreak: 12
  },
  spaceShooter: {
    position: 2,
    score: 12345,
    wins: 88,
    losses: 4,
    maxWinStreak: 19
  }
}

type Games = 'ticTacToe' | 'spaceShooter'

const games: Games[] = ['ticTacToe', 'spaceShooter']

const gamesNamesForTitle = {
  ticTacToe: 'Tic Tac Toe',
  spaceShooter: 'Space Shooter'
}

const UserProfile: NextPage = () => {
  return (
    <main className={`main_container ${styles.container}`}>
      <h1>Nome do otário</h1>
      {games.map(game => (
        <ul key={game} className={styles.game_info}>
          <li className={styles.game_title}>
            <h2>{gamesNamesForTitle[game]}</h2>
          </li>
          <li>
            <span>Leaderboard position: </span>
            {user[game].position}
          </li>
          <li>
            <span>Score: </span>
            {user[game].score}
          </li>
          <li>
            <span>Wins: </span>
            {user[game].wins}
          </li>
          <li>
            <span>Losses: </span>
            {user[game].losses}
          </li>
          <li>
            <span>Max Win Streak: </span>
            {user[game].maxWinStreak}
          </li>
        </ul>
      ))}
    </main>
  )
}

export default UserProfile
