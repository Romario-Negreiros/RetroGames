import React from 'react'
import firebase from '../libs/firebase'
import { useToast, useAuthMethods } from '@utils/hooks'
import { handleError, handleToast } from '@utils/handlers'

import type { NextPage } from 'next'

const Home: NextPage = () => {
  const { setToast } = useToast()
  const { finishSignInWithEmailLink } = useAuthMethods()

  React.useEffect(() => {
    const { auth } = firebase
    if (auth.isSignInWithEmailLink(auth.instance, window.location.href)) {
      (async () => {
        try {
          await finishSignInWithEmailLink()
        } catch (err) {
          handleError(
            err,
            'Complete log in or account creation with email link',
            undefined,
            setToast
          )
        }
      })()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div>
      hello world!
      <button onClick={() => handleToast('toast mano', setToast)}>
        toast zao
      </button>
    </div>
  )
}

export default Home
