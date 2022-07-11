import { handleError } from '@utils/handlers'

import { DocumentData, QuerySnapshot, FirestoreError, Unsubscribe, WithFieldValue } from 'firebase/firestore'
import type { GameStates, Player } from './types'
import type { User } from '@contexts/authContext'
import type { IToast } from '@contexts/toastContext'

const generateRandomNumberInRange1to2 = () => {
  return Math.ceil(Math.random() * 2)
}

const CreateGame = (
  setGameState: (gameState: GameStates) => void,
  setTurn: (turn: Player | null) => void,
  setDoc: (pathSegments: string[], docId: string, data: WithFieldValue<DocumentData>) => Promise<void>,
  setListenerOnCollection: (
    pathSegments: string[],
    currentUserName: string,
    onNext: (snapshot: QuerySnapshot<DocumentData>) => void,
    onError: (err: FirestoreError) => void
  ) => Unsubscribe,
  setToast: (toast: IToast) => void,
  deleteDoc: (pathSegments: string[], docId: string) => Promise<void>,
  reset: (ctx: HTMLCanvasElement) => void
) => {
  const players: { p1: Player | null; p2: Player | null } = {
    p1: null,
    p2: null
  }
  let results: { winner: Player | null; loser: Player | null; message: string } = {
    winner: null,
    loser: null,
    message: ''
  }
  let board = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
  ]
  let unsubscribe: Unsubscribe | null = null

  const findAMatch = async (user: User) => {
    await setDoc(['games', 'tic-tac-toe', 'queue'], user.displayName as string, { name: user.displayName })

    const currentUserName = user.displayName as string
    let hasFoundAMatch = false

    await new Promise<void>((resolve, reject) => {
      unsubscribe = setListenerOnCollection(
        ['games', 'tic-tac-toe', 'queue'],
        currentUserName,
        async snapshot => {
          const usersInQueue = snapshot.docs
          if (usersInQueue.length) {
            const userWithLongestTimeInQueue = usersInQueue[usersInQueue.length - 1].data() as { name: string }
            const randomPlayer = Math.ceil(Math.random() * 2) as 1 | 2
            const randomShape = Math.ceil(Math.random() * 2) === 1 ? 'x' : 'o'
            players[`p${randomPlayer}` as 'p1' | 'p2'] = {
              ...userWithLongestTimeInQueue,
              id: randomPlayer,
              shape: randomShape
            }
            players[`p${randomPlayer === 1 ? 2 : 1}`] = {
              name: currentUserName,
              id: randomPlayer === 1 ? 2 : 1,
              shape: randomShape === 'x' ? 'o' : 'x'
            }

            await setDoc(['games', 'tic-tac-toe', 'matches'], `${players.p1?.name} x ${players.p2?.name}`, {
              players,
              board
            })

            hasFoundAMatch = true

            resolve()
          }
        },
        err => {
          reject(err)
        }
      )
    })

    if (hasFoundAMatch) {
      await deleteDoc(['games', 'tic-tac-toe', 'queue'], currentUserName)
    }
  }

  const start = () => {
    setGameState('in progress')
    setResults(undefined, true)
    if (unsubscribe) {
      unsubscribe()
      unsubscribe = null
    }

    // setListenerOnDoc
    unsubscribe = setListenerOnCollection(
      ['games', 'tic-tac-toe', 'matches'],
      `${players.p1?.name} x ${players.p2?.name}`,
      snapshot => {

      },
      err => {
        handleError(err, 'Listening to match changes', undefined, setToast)
      }
    )

    const turn = generateRandomNumberInRange1to2() === 1 ? players.p1 : players.p2
    return turn
  }

  const end = () => {
    setGameState('game ended')
    players.p1 = null
    players.p2 = null
    board = board.map(row => {
      return row.map(() => '')
    })
    setTurn(null)
    // reset canvas to its initial state
    const canvas = document.querySelector('canvas') as HTMLCanvasElement
    reset(canvas)
  }

  const checkIfCellIsAlreadyMarked = (row: number, col: number) => Boolean(board[row][col])

  const checkBoard = () => {
    let hasGameEnded = false

    for (const row of board) {
      if (row.every(col => col === 'x')) {
        setResults('x')
        hasGameEnded = true
      } else if (row.every(col => col === 'o')) {
        setResults('o')
        hasGameEnded = true
      }
    }

    for (const row of board) {
      if (board.indexOf(row) === 0) {
        for (const col in row) {
          if (board[0][col] === 'x' && board[1][col] === 'x' && board[2][col] === 'x') {
            setResults('x')
            hasGameEnded = true
          } else if (board[0][col] === 'o' && board[1][col] === 'o' && board[2][col] === 'o') {
            setResults('o')
            hasGameEnded = true
          }
        }
      } else break
    }

    if (board[0][0] === 'x' && board[1][1] === 'x' && board[2][2] === 'x') {
      setResults('x')
      hasGameEnded = true
    } else if (board[0][0] === 'o' && board[1][1] === 'o' && board[2][2] === 'o') {
      setResults('o')
      hasGameEnded = true
    } else if (board[0][2] === 'x' && board[1][1] === 'x' && board[2][0] === 'x') {
      setResults('x')
      hasGameEnded = true
    } else if (board[0][2] === 'o' && board[1][1] === 'o' && board[2][0] === 'o') {
      setResults('o')
      hasGameEnded = true
    } else if (board.every(row => row.every(col => col === 'x' || col === 'o'))) {
      setResults()
      hasGameEnded = true
    }

    if (hasGameEnded) end()
  }

  const getP1 = () => players.p1
  const getP2 = () => players.p2
  const getResults = () => results

  const setMovement = (row: number, col: number, player: 'p1' | 'p2') => {
    board[row][col] = players[player]?.shape as string
    checkBoard()
  }

  const setResults = (winnerShape?: 'x' | 'o', clear?: boolean) => {
    if (clear) {
      results = {
        winner: null,
        loser: null,
        message: ''
      }
      return
    }
    if (!winnerShape) {
      results = {
        winner: null,
        loser: null,
        message: "It's a tie!"
      }
      return
    }
    results =
      players.p1?.shape === winnerShape ? {
        winner: players.p1,
        loser: players.p2,
        message: `${players.p1.name} is the winner!`
      } : {
        winner: players.p2,
        loser: players.p1,
        message: `${players.p2?.name} is the winner!`
      }
  }
  return {
    findAMatch,
    start,
    getP1,
    getP2,
    getResults,
    setMovement,
    checkIfCellIsAlreadyMarked
  }
}

export default CreateGame
