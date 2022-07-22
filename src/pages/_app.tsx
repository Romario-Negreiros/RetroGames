import React from 'react'
import firebase from '../libs/firebase'
import { handleError } from '@utils/handlers'
import { useFirestore } from '@utils/hooks'

import { Layout, Toast } from '../components'

import toastContext from '@contexts/toastContext'
import authContext from '@contexts/authContext'

import '@styles/common/reset.css'
import '@styles/common/variables.css'
import '@styles/common/global.css'

import type { AppProps } from 'next/app'
import type { IToast } from '@contexts/toastContext'
import type { User } from '@contexts/authContext'

const MyApp = ({ Component, pageProps }: AppProps) => {
  const [user, setUser] = React.useState<User | null>(null)
  const [toast, setToast] = React.useState<IToast>({
    isOpened: false,
    message: '',
    timeToCloseInMs: 0
  })
  const { getDoc } = useFirestore()
  React.useEffect(() => {
    const unsubscribe = firebase.auth.instance.onAuthStateChanged(
      async user => {
        if (user && user.displayName) {
          const doc = await getDoc<Pick<User, 'ticTacToe'>>(['users'], user.displayName)
          if (doc.exists()) {
            const userData = doc.data()
            setUser({ ...user, ...userData })
          }
        } else {
          setUser(null)
        }
      },
      error => {
        handleError(error, 'Auth state listener', undefined, setToast)
      }
    )

    return () => unsubscribe()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <authContext.Provider value={{ user, setUser }}>
      <toastContext.Provider value={{ toast, setToast }}>
        <Layout>
          <Toast />
          <Component {...pageProps} />
        </Layout>
      </toastContext.Provider>
    </authContext.Provider>
  )
}

export default MyApp
