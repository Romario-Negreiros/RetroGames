import React from 'react'
import firebase from '../libs/firebase'
import { useToast, useAuthMethods, useAuth } from '@utils/hooks'
import { handleError, handleToast } from '@utils/handlers'
import { useRouter } from 'next/router'

import type { NextPage } from 'next'

const Home: NextPage = () => {
  const { user } = useAuth()
  const { setToast } = useToast()
  const { query } = useRouter()
  const { finishSignInWithEmailLink } = useAuthMethods()
  React.useEffect(() => {
    const { auth } = firebase
    if (auth.isSignInWithEmailLink(auth.instance, window.location.href)) {
      ;(async () => {
        try {
          console.log(user)
          await finishSignInWithEmailLink()
          console.log(user)
          if (query.name) {
            // await setDocument(name)
          }
        } catch (err) {
          handleError(err, 'Complete log in or account creation with email link', undefined, setToast)
        }
      })()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div>
      hello world!
      <button onClick={() => handleToast('toast mano', setToast)}>toast zao</button>
    </div>
  )
}

export default Home
