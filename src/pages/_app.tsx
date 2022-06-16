import { Layout } from '../components'

import '@styles/common/reset.css'
import '@styles/common/variables.css'
import '@styles/common/global.css'

import type { AppProps } from 'next/app'

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  )
}

export default MyApp
