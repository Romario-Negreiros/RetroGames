import React from 'react'
import firebase from '../libs/firebase'
import { useToast, useAuthMethods, useFirestore, useAuth } from '@utils/hooks'
import { handleError } from '@utils/handlers'

import Image from 'next/image'

import styles from '@styles/pages/home.module.css'

import type { NextPage } from 'next'
import Link from 'next/link'

const ticTacToe = {
  matches: 0,
  score: 0,
  wins: 0,
  losses: 0,
  currentWinStreak: 0,
  maxWinStreak: 0
}

const Home: NextPage = () => {
  const { setToast } = useToast()
  const { finishSignInWithEmailLink, updateProfile } = useAuthMethods()
  const { setDoc } = useFirestore()
  const { setUser } = useAuth()

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
            await setDoc(['users'], name, {
              ticTacToe
            })
            setUser({ ...user, ticTacToe })
          }
        } catch (err) {
          handleError(err, 'Complete log in or account creation with email link', undefined, setToast)
        }
      })()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <main className={`main_container full_screen_height_wrapper ${styles.container}`}>
      <div>
        <h1>Retro<span>Games</span></h1>
        <p>
          Choose a game, play against other people, have fun and, maybe, get a good placement on the leaderboards...<br />
          <span>Just for bragging</span>
        </p>
        <Link href="/games">
          <a className="button">Browse games</a>
        </Link>
      </div>
      <div className={styles.imageWrapper}>
        <Image src="/gaming.svg" alt="Gaming illustration" layout="fill" />
      </div>
    </main>
  )
}

export default Home
