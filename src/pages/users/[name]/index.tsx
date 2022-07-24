import React from 'react'
import { useFirestore } from '@utils/hooks'

import { Error } from '../../../components'

import styles from '@styles/pages/userProfile.module.css'

import type { GetServerSideProps, NextPage } from 'next'
import type { GameStats } from '@contexts/authContext'

type Games = 'ticTacToe'

const games: Games[] = ['ticTacToe']

const gamesNamesForTitle = {
  ticTacToe: 'Tic Tac Toe'
}

type UserGamesStats = Record<Games, GameStats>

interface User extends UserGamesStats {
  name: string
}

interface Props {
  user: User
  serverSideError?: string
}

export const getServerSideProps: GetServerSideProps = async context => {
  const name = context.params?.name as string | null

  if (!name) {
    return {
      props: {
        serverSideError: 'Name parameter not found!'
      }
    }
  }

  const firestoreFunctions = useFirestore
  const { getDoc } = firestoreFunctions()

  const doc = await getDoc<UserGamesStats>(['users'], name)
  if (!doc.exists()) {
    return {
      props: {
        serverSideError: 'User not found!'
      }
    }
  }

  const user = doc.data()
  return {
    props: {
      user: { name, ...user }
    }
  }
}

const UserProfile: NextPage<Props> = ({ user, serverSideError }) => {
  const [error, setError] = React.useState(serverSideError)

  if (error) {
    return (
      <main className="main_container full_screen_height_wrapper">
        <Error error={error} setError={serverSideError ? undefined : setError} />
      </main>
    )
  }
  return (
    <main className={`main_container ${styles.container}`}>
      <h1>{user.name}</h1>
      {games.map(game => (
        <ul key={game} className={styles.game_info}>
          <li className={styles.game_title}>
            <h2>{gamesNamesForTitle[game]}</h2>
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
