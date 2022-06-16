import React from 'react'

import Header from '../Header'
import Head from 'next/head'

interface Props {
  children: React.ReactElement
}

const Layout: React.FC<Props> = ({ children }) => {
  return (
    <>
      <Head>
        <title>RetroGames</title>
        <meta name="author" content="Romario Negreiros" />
        <meta
          name="description"
          content="RetroGames is a website you can play all the old games you've ever played, but online!"
        />
        <meta name="keywords" content="Games, Online" />
        <meta name="theme-color" content="#121212" />
      </Head>

      <Header />
      <main className="body_container">{children}</main>
    </>
  )
}

export default Layout
