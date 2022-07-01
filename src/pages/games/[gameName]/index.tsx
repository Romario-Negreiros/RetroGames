import React from 'react'

import styles from '@styles/pages/game.module.css'

import type { NextPage, GetStaticPaths, GetStaticProps } from 'next'

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [{ params: { gameName: 'tic-tac-toe' } }, { params: { gameName: 'space-shooter' } }],
    fallback: false
  }
}

export const getStaticProps: GetStaticProps = async context => {
  const gameName = context.params?.gameName
  let nameForTitle: string

  if (gameName === 'tic-tac-toe') {
    nameForTitle = 'Tic Tac Toe'
  } else {
    nameForTitle = 'Space Shooter'
  }

  return {
    props: {
      game: {
        nameForTitle,
        urlName: gameName
      }
    }
  }
}

interface Props {
  game: {
    nameForTitle: string
    nameForUrl: string
  }
}

const Game: NextPage<Props> = ({ game: { nameForTitle } }) => {
  return (
    <section className={`full_screen_height_wrapper ${styles.container}`}>
      <h1>{nameForTitle}</h1>
      <div className={styles.game_container}>b</div>
    </section>
  )
}

export default Game
