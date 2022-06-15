import type { AppProps } from 'next/app'

import '@styles/common/reset.module.css'

const MyApp = ({ Component, pageProps }: AppProps) => {
  return <Component {...pageProps} />
}

export default MyApp
