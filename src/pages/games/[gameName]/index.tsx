import React from 'react'

import { TicTacToe, SpaceShooter } from '../../../components'

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
        nameForUrl: gameName
      }
    }
  }
}

interface Props {
  game: {
    nameForTitle: string
    nameForUrl: 'tic-tac-toe' | 'space-shooter'
  }
}

const games = {
  'tic-tac-toe': <TicTacToe />,
  'space-shooter': <SpaceShooter />
}

const Game: NextPage<Props> = ({ game: { nameForTitle, nameForUrl } }) => {
  return (
    <main className={`main_container full_screen_height_wrapper ${styles.container}`}>
      <h1>{nameForTitle}</h1>
      <section className={styles.game_container}>
        {games[nameForUrl]}
      </section>
    </main>
  )
}

export default Game
