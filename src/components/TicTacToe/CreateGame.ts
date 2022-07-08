import type { GameStates, Player } from './types'

const generateRandomNumberInRange1to2 = () => {
  return Math.ceil(Math.random() * 2)
}

const CreateGame = (
  setGameState: (gameState: GameStates) => void,
  setTurn: (turn: Player | null) => void,
  reset: (ctx: HTMLCanvasElement) => void
) => {
  const players: { p1: Player | null; p2: Player | null } = {
    p1: null,
    p2: null
  }
  const results: any = {}
  let board = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
  ]

  const findAMatch = () => {
    setGameState('finding a match')

    players.p1 = {
      id: 1,
      name: 'roamrio',
      shape: generateRandomNumberInRange1to2() === 1 ? 'x' : 'o'
    }
    players.p2 = {
      id: 2,
      name: 'oamsoasm',
      shape: players.p1.shape === 'x' ? 'o' : 'x'
    }
  }

  const start = () => {
    setGameState('in progress')

    const turn = generateRandomNumberInRange1to2() === 1 ? players.p1 : players.p2
    return turn
  }

  const end = () => {
    setGameState('game ended')
    results.winner = players.p1
    results.loser = players.p2
    players.p1 = null
    players.p2 = null
    board = [['', '', ''], ['', '', ''], ['', '', '']]
    setTurn(null)
    // reset canvas to its initial state
    const canvas = document.querySelector('canvas') as HTMLCanvasElement
    reset(canvas)
  }

  const checkBoard = () => {
    if (board.every(row => row.every(col => col === 'x' || col === 'o'))) {
      end()
    }
  }

  const setMovement = (row: number, col: number, player: 'p1' | 'p2') => {
    board[row][col] = players[player]?.shape as string
    checkBoard()
  }

  const getP1 = () => players.p1
  const getP2 = () => players.p2
  const getResults = () => results

  return {
    findAMatch,
    start,
    getP1,
    getP2,
    getResults,
    setMovement
  }
}

export default CreateGame
