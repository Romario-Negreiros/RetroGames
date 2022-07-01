import Link from 'next/link'

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
    position: 2,
    name: 'Romario',
    score: 2323565,
    wins: 123,
    losses: 21,
    maxWinStreak: 74
  },
  {
    position: 3,
    name: 'Romario',
    score: 2323565,
    wins: 123,
    losses: 21,
    maxWinStreak: 74
  },
  {
    position: 4,
    name: 'Romario',
    score: 2323565,
    wins: 123,
    losses: 21,
    maxWinStreak: 74
  },
  {
    position: 5,
    name: 'Romario',
    score: 2323565,
    wins: 123,
    losses: 21,
    maxWinStreak: 74
  },
  {
    position: 6,
    name: 'Romario',
    score: 2323565,
    wins: 123,
    losses: 21,
    maxWinStreak: 74
  },
  {
    position: 7,
    name: 'Romario',
    score: 2323565,
    wins: 123,
    losses: 21,
    maxWinStreak: 74
  },
  {
    position: 8,
    name: 'Romario',
    score: 2323565,
    wins: 123,
    losses: 21,
    maxWinStreak: 74
  },
  {
    position: 9,
    name: 'Romario',
    score: 2323565,
    wins: 123,
    losses: 21,
    maxWinStreak: 74
  },
  {
    position: 10,
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
      <section className={styles.top_container}>
        <div className={styles.title_legend_container}>
          <h1>
            Leaderboard <br /> GameName
          </h1>
          <p>MWS = Max Win Streak</p>
        </div>
        <div className={styles.input_container}>
          <input type="search" placeholder="Search player..." className="input" />
        </div>
      </section>
      <section className={styles.table_container}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Position</th>
              <th>Name</th>
              <th>Score</th>
              <th>Wins</th>
              <th>Losses</th>
              <th>MWS</th>
            </tr>
          </thead>
          <tbody>
            <tr className={styles.current_user_position}>
              <td>#1546</td>
              <td>
                <Link href={`/users/${'oasdfghj cnvmsfedopl'}`}>
                  <a>{'oasdfghj cnvmsfedopl'}</a>
                </Link>
              </td>
              <td>2456</td>
              <td>14</td>
              <td>5</td>
              <td>2</td>
            </tr>
            {users.map(data => (
              <tr key={data.position}>
                <td>#{data.position}</td>
                <td>
                  <Link href={`/users/${data.name}`}>
                    <a>{data.name}</a>
                  </Link>
                </td>{' '}
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
