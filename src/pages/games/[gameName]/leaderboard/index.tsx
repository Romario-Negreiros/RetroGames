import React from 'react'
import { useFirestore, useAuth } from '@utils/hooks'

import { Error } from '../../../../components'
import Link from 'next/link'

import styles from '@styles/pages/leaderboard.module.css'

import type { GetServerSideProps, NextPage } from 'next'
import type { GameStats } from '@contexts/authContext'

type GamesNames = 'tic-tac-toe'

enum GamesNamesForQuery {
  'tic-tac-toe' = 'ticTacToe'
}

type Games = Record<GamesNamesForQuery, GameStats>

interface User extends GameStats {
  name: string
}

interface Props {
  users: Array<User>
  gameName: GamesNames
  serverSideError?: string
}

export const getServerSideProps: GetServerSideProps = async context => {
  const gameName = context.params?.gameName as GamesNames | null

  if (!gameName) {
    return {
      props: {
        serverSideError: 'Game name parameter not found!'
      }
    }
  }

  const firestoreFunctions = useFirestore
  const { getDocs } = firestoreFunctions()

  const results = await getDocs<Games>(['users'], [`${GamesNamesForQuery[gameName]}.matches`, '>', 0])
  if (results.empty) {
    return {
      props: {
        serverSideError: 'No user found!'
      }
    }
  }

  const users = results.docs.map(doc => {
    return {
      name: doc.id,
      ...doc.data()[GamesNamesForQuery[gameName]]
    }
  })

  users.sort((a, b) => {
    if (a.score > b.score) {
      return -1
    } else if (a.score < b.score) {
      return 1
    }
    return 0
  })

  return {
    props: {
      users,
      gameName
    }
  }
}

const Leaderboard: NextPage<Props> = ({ users, gameName, serverSideError }) => {
  const [error, setError] = React.useState(serverSideError)
  const [searchValue, setSearchValue] = React.useState('')
  const { user: currentUser } = useAuth()

  if (error) {
    return (
      <main className="main_container full_screen_height_wrapper">
        <Error error={error} setError={serverSideError ? undefined : setError} />
      </main>
    )
  }
  return (
    <main className={`main_container full_screen_height_wrapper ${styles.container}`}>
      <section className={styles.top_container}>
        <div className={styles.title_legend_container}>
          <h1>
            Leaderboard <br /> GameName
          </h1>
          <p>MWS = Max Win Streak</p>
          <p>CWS = Current Win Streak </p>
        </div>
        <div className={styles.input_container}>
          <input
            type="search"
            value={searchValue}
            onChange={e => setSearchValue(e.currentTarget.value)}
            placeholder="Search player..."
            className="input"
          />
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
              <th>CWS</th>
              <th>MWS</th>
            </tr>
          </thead>
          <tbody>
            {users.some(user => user.name === currentUser?.displayName) && (
              <tr className={styles.current_user_position}>
                <td>#{users.findIndex(user => user.name === currentUser?.displayName) + 1}</td>
                <td>
                  <Link href={`/users/${currentUser?.displayName}`}>
                    <a>You</a>
                  </Link>
                </td>
                <td>{currentUser?.[GamesNamesForQuery[gameName]].score}</td>
                <td>{currentUser?.[GamesNamesForQuery[gameName]].wins}</td>
                <td>{currentUser?.[GamesNamesForQuery[gameName]].losses}</td>
                <td>{currentUser?.[GamesNamesForQuery[gameName]].currentWinStreak}</td>
                <td>{currentUser?.[GamesNamesForQuery[gameName]].maxWinStreak}</td>
              </tr>
            )}
            {users.map((user, index) => {
              if (searchValue) {
                if (user.name.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase())) {
                  return (
                    <tr key={user.name}>
                      <td>#{index + 1}</td>
                      <td>
                        <Link href={`/users/${user.name}`}>
                          <a>{user.name}</a>
                        </Link>
                      </td>
                      <td>{user.score}</td>
                      <td>{user.wins}</td>
                      <td>{user.losses}</td>
                      <td>{user.currentWinStreak}</td>
                      <td>{user.maxWinStreak}</td>
                    </tr>
                  )
                } else return null
              } else {
                return (
                  <tr key={user.name}>
                    <td>#{index + 1}</td>
                    <td>
                      <Link href={`/users/${user.name}`}>
                        <a>{user.name}</a>
                      </Link>
                    </td>
                    <td>{user.score}</td>
                    <td>{user.wins}</td>
                    <td>{user.losses}</td>
                    <td>{user.currentWinStreak}</td>
                    <td>{user.maxWinStreak}</td>
                  </tr>
                )
              }
            })}
          </tbody>
        </table>
      </section>
    </main>
  )
}

export default Leaderboard
