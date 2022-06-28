import React from 'react'
import firebase from '../libs/firebase'
import { useToast, useAuthMethods, useFirestore } from '@utils/hooks'
import { handleError } from '@utils/handlers'

import games from '@static/games.json'

import { GameCard } from '../components'

import styles from '@styles/pages/home.module.css'

import type { NextPage } from 'next'

const Home: NextPage = () => {
  const { setToast } = useToast()
  const { finishSignInWithEmailLink, updateProfile } = useAuthMethods()
  const { setDoc } = useFirestore()

  React.useEffect(() => {
    const { auth } = firebase
    if (auth.isSignInWithEmailLink(auth.instance, window?.location.href)) {
      ;(async () => {
        try {
          const params = new URLSearchParams(window?.location.search)
          const name = params.get('name')
          const user = await finishSignInWithEmailLink()
          if (name) {
            await updateProfile(user, { displayName: name })
            await setDoc(['users'], name, {})
          }
        } catch (err) {
          handleError(err, 'Complete log in or account creation with email link', undefined, setToast)
        }
      })()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <section className={`full_screen_height_wrapper ${styles.container}`}>
      <h1>
        Choose a game, play against other people, have fun and, maybe, get a good placement on the leaderboards...
        <span>Just for bragging</span>
      </h1>
      <ul className={styles.games_list}>
        {games.map(game => (
          <GameCard key={game.name} game={game} />
        ))}
      </ul>
    </section>
  )
}

export default Home
