import React from 'react'
import firebase from '../libs/firebase'
import { handleError } from '@utils/handlers'

import { Layout, Toast } from '../components'

import toastContext, { IToast } from '@contexts/toastContext'
import authContext, { User } from '@contexts/authContext'

import '@styles/common/reset.css'
import '@styles/common/variables.css'
import '@styles/common/global.css'

import type { AppProps } from 'next/app'

const MyApp = ({ Component, pageProps }: AppProps) => {
  const [user, setUser] = React.useState<User | null>(null)
  const [toast, setToast] = React.useState<IToast>({
    isOpened: false,
    message: '',
    timeToCloseInMs: 0
  })

  React.useEffect(() => {
    const unsubscribe = firebase.auth.instance.onAuthStateChanged(
      user => {
        setUser(user as User)
      },
      error => {
        handleError(error, 'Auth state listener', undefined, setToast)
      }
    )

    return () => unsubscribe()
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
