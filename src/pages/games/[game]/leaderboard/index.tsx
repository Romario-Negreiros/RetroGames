import styles from '@styles/pages/leaderboard.module.css'

import type { NextPage } from 'next'

const users = [
  {
    position: 1,
    name: 'Romario',
    score: 2323565,
    wins: 123,
    losses: 21,
    maxWinStreak: 74
  },
  {
    position: 1,
    name: 'Romario',
    score: 2323565,
    wins: 123,
    losses: 21,
    maxWinStreak: 74
  },
  {
    position: 1,
    name: 'Romario',
    score: 2323565,
    wins: 123,
    losses: 21,
    maxWinStreak: 74
  },
  {
    position: 1,
    name: 'Romario',
    score: 2323565,
    wins: 123,
    losses: 21,
    maxWinStreak: 74
  },
  {
    position: 1,
    name: 'Romario',
    score: 2323565,
    wins: 123,
    losses: 21,
    maxWinStreak: 74
  },
  {
    position: 1,
    name: 'Romario',
    score: 2323565,
    wins: 123,
    losses: 21,
    maxWinStreak: 74
  },
  {
    position: 1,
    name: 'Romario',
    score: 2323565,
    wins: 123,
    losses: 21,
    maxWinStreak: 74
  },
  {
    position: 1,
    name: 'Romario',
    score: 2323565,
    wins: 123,
    losses: 21,
    maxWinStreak: 74
  },
  {
    position: 1,
    name: 'Romario',
    score: 2323565,
    wins: 123,
    losses: 21,
    maxWinStreak: 74
  },
  {
    position: 1,
    name: 'Romario',
    score: 2323565,
    wins: 123,
    losses: 21,
    maxWinStreak: 74
  }
]

const Leaderboard: NextPage = () => {
  return (
    <section className={`full_screen_height_wrapper ${styles.container}`}>
      <h1>Leaderboard / GameName</h1>
      <section className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Position</th>
              <th>Name</th>
              <th>Score</th>
              <th>Wins</th>
              <th>Losses</th>
              <th>Max Win Streak</th>
            </tr>
          </thead>
          <tbody>
            {users.map(data => (
              <tr key={data.position}>
                <td>#{data.position}</td>
                <td>{data.name}</td>
                <td>{data.score}</td>
                <td>{data.wins}</td>
                <td>{data.losses}</td>
                <td>{data.maxWinStreak}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </section>
  )
}

export default Leaderboard
