import React from 'react'

import { Layout, Toast } from '../components'

import toastContext, { IToast } from '@contexts/toastContext'

import '@styles/common/reset.css'
import '@styles/common/variables.css'
import '@styles/common/global.css'

import type { AppProps } from 'next/app'

const MyApp = ({ Component, pageProps }: AppProps) => {
  const [toast, setToast] = React.useState<IToast>({
    isOpened: false,
    message: '',
    timeToCloseInMs: 0
  })

  return (
    <toastContext.Provider value={{ toast, setToast }}>
      <Layout>
        <Toast />
        <Component {...pageProps} />
      </Layout>
    </toastContext.Provider>
  )
}

export default MyApp
