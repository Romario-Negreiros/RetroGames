import type { GameStates } from './types'

const CreateGame = (setGameState: (gameState: GameStates) => void) => {
  let p1: any
  let p2: any
  let results: any

  const findAMatch = () => {
    setGameState('finding a match')

    p1 = {
      name: 'roamrio'
    }
    p2 = {
      name: 'oamsoasm'
    }
  }

  const start = () => {
    setGameState('in progress')
  }

  const end = () => {
    setGameState('game ended')
    results = {
      winner: p1,
      loser: p2
    }
  }

  const getP1 = () => p1
  const getP2 = () => p2
  const getResults = () => results

  return {
    findAMatch,
    start,
    end,
    getP1,
    getP2,
    getResults
  }
}

export default CreateGame
