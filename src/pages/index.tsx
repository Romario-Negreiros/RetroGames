import React from 'react'
import firebase from '../libs/firebase'
import { useToast, useAuthMethods, useFirestore } from '@utils/hooks'
import { handleError, handleToast } from '@utils/handlers'

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
            await setDoc(['users'], name, { deuCerto: true })
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
      <button onClick={() => handleToast('toast bro', setToast)}>ppppp</button>
    </div>
  )
}

export default Home
