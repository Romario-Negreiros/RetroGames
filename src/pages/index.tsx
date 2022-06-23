import React from 'react'
import firebase from '../libs/firebase'
import { useToast, useAuthMethods, useFirestore } from '@utils/hooks'
import { handleError, handleToast } from '@utils/handlers'

import type { NextPage } from 'next'

const Home: NextPage = () => {
  const { setToast } = useToast()
  const { finishSignInWithEmailLink } = useAuthMethods()
  const { setDoc } = useFirestore()

  React.useEffect(() => {
    const { auth } = firebase
    if (auth.isSignInWithEmailLink(auth.instance, window.location.href)) {
      ;(async () => {
        try {
          const params = new URLSearchParams(window?.location.search)
          const name = params.get('name')
          await finishSignInWithEmailLink()
          if (name) {
            await setDoc(['users'], name, { name })
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
