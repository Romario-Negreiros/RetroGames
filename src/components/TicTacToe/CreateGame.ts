import { handleError } from '@utils/handlers'
import CreateCanvas from './CreateCanvas'

import type {
  DocumentData,
  DocumentSnapshot,
  QuerySnapshot,
  FirestoreError,
  Unsubscribe,
  WithFieldValue
} from 'firebase/firestore'
import type { GameStates, Match, Player, Results, Players } from './types'
import type { User } from '@contexts/authContext'
import type { IToast } from '@contexts/toastContext'
import type { WhereArgs } from '@utils/hooks/useFirestore'

const canvas = CreateCanvas()

const CreateGame = (
  setGameState: (gameState: GameStates) => void,
  setTurn: (turn: Player | null) => void,
  setPlayTimer: (playTimer: number | null) => void,
  setIsCancelable: (isCancelable: boolean) => void,
  setDoc: (pathSegments: string[], docId: string, data: WithFieldValue<DocumentData>) => Promise<void>,
  setListenerOnCollection: (
    pathSegments: string[],
    whereArgs: WhereArgs,
    onNext: (snapshot: QuerySnapshot<DocumentData>) => void,
    onError: (err: FirestoreError) => void
  ) => Unsubscribe,
  setListenerOnDoc: (
    pathSegments: string[],
    docId: string,
    onNext: (snapshot: DocumentSnapshot<DocumentData>) => void,
    onError: (err: FirestoreError) => void
  ) => Unsubscribe,
  setToast: (toast: IToast) => void,
  deleteDoc: (pathSegments: string[], docId: string) => Promise<void>,
  updateDoc: (pathSegments: string[], docId: string, data: WithFieldValue<DocumentData>) => Promise<void>
) => {
  let players: Players | null = null
  let results: Results = {
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
    setGameState('finding a match')
    const currentUserTimeStamp = Date.now()
    await setDoc(['games', 'tic-tac-toe', 'queue'], user.displayName as string, {
      name: user.displayName,
      timeStamp: currentUserTimeStamp
    })

    const currentUserName = user.displayName as string
    let hasFoundAMatch = false

    await new Promise<void>((resolve, reject) => {
      unsubscribe = setListenerOnCollection(
        ['games', 'tic-tac-toe', 'queue'],
        ['name', '!=', currentUserName],
        async snapshot => {
          const usersInQueue = snapshot.docs
          if (usersInQueue.length) {
            setIsCancelable(false)
            const userWithLongestTimeInQueue = usersInQueue[usersInQueue.length - 1].data() as {
              name: string
              timeStamp: number
            }

            const p1 =
              userWithLongestTimeInQueue.timeStamp > currentUserTimeStamp ? userWithLongestTimeInQueue.name : currentUserName
            const p2 =
              userWithLongestTimeInQueue.timeStamp < currentUserTimeStamp ? userWithLongestTimeInQueue.name : currentUserName
            players = {
              p1: {
                id: 1,
                name: p1,
                shape: 'X'
              },
              p2: {
                id: 2,
                name: p2,
                shape: 'O'
              }
            }
            await setDoc(['games', 'tic-tac-toe', 'matches'], `${players.p1?.name} x ${players.p2?.name}`, {
              players,
              turn: players.p1,
              board: {
                // doing this because firestore does not accept nested arrays .................. ok
                row0: board[0],
                row1: board[1],
                row2: board[2]
              }
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

  const start = (user: User) => {
    setGameState('in progress')
    setResults(undefined, true)
    if (unsubscribe) {
      unsubscribe()
      unsubscribe = null
    }

    unsubscribe = setListenerOnDoc(
      ['games', 'tic-tac-toe', 'matches'],
      `${players?.p1.name} x ${players?.p2?.name}`,
      async snapshot => {
        if (snapshot.exists()) {
          const matchData = snapshot.data() as Match
          if (matchData.markedCell) {
            const canvasElement = document.querySelector('canvas') as HTMLCanvasElement
            const { width, height } = canvasElement.getBoundingClientRect()
            const ctx = canvasElement?.getContext('2d')
            const cellsCenterCoordinates = canvas.getCellsCenterCoordinates(width, height)
            if (ctx && matchData.turn.name === user.displayName) {
              canvas[`draw${matchData.turn.shape === 'X' ? 'O' : 'X'}`](
                ctx,
                cellsCenterCoordinates[matchData.markedCell.row][matchData.markedCell.col],
                width / 3
              )
            }
          }
          if (matchData.results) {
            results = matchData.results
            end(user)
          } else {
            board = [matchData.board.row0, matchData.board.row1, matchData.board.row2]
            setTurn(matchData.turn)
          }
        }
      },
      err => {
        handleError(err, 'Listening to match changes', undefined, setToast)
      }
    )
  }

  const checkIfCellIsAlreadyMarked = (row: number, col: number) => Boolean(board[row][col])

  const endMatchDueToInactivity = (inactivePlayerShape: 'X' | 'O') => {
    setResults(inactivePlayerShape === 'X' ? 'O' : 'X', false, true)
  }

  const setMovement = async (row: number, col: number, player: 'p1' | 'p2') => {
    if (players) {
      board[row][col] = players[player].shape as string
      await updateDoc(['games', 'tic-tac-toe', 'matches'], `${players?.p1.name} x ${players?.p2.name}`, {
        board: {
          row0: board[0],
          row1: board[1],
          row2: board[2]
        },
        markedCell: {
          row,
          col
        },
        turn: players[player === 'p1' ? 'p2' : 'p1']
      })
      await checkBoard()
    }
  }

  const checkBoard = async () => {
    for (const row of board) {
      if (row.every(col => col === 'X')) {
        await setResults('X')
      } else if (row.every(col => col === 'O')) {
        await setResults('O')
      }
    }

    for (const row of board) {
      if (board.indexOf(row) === 0) {
        for (const col in row) {
          if (board[0][col] === 'X' && board[1][col] === 'X' && board[2][col] === 'X') {
            await setResults('X')
          } else if (board[0][col] === 'O' && board[1][col] === 'O' && board[2][col] === 'O') {
            await setResults('O')
          }
        }
      } else break
    }

    if (board[0][0] === 'X' && board[1][1] === 'X' && board[2][2] === 'X') {
      await setResults('X')
    } else if (board[0][0] === 'O' && board[1][1] === 'O' && board[2][2] === 'O') {
      await setResults('O')
    } else if (board[0][2] === 'X' && board[1][1] === 'X' && board[2][0] === 'X') {
      await setResults('X')
    } else if (board[0][2] === 'O' && board[1][1] === 'O' && board[2][0] === 'O') {
      await setResults('O')
    } else if (board.every(row => row.every(col => col === 'X' || col === 'O'))) {
      await setResults()
    }
  }

  const setResults = async (winnerShape?: 'X' | 'O', clear?: boolean, inactivtyWin?: boolean) => {
    if (clear) {
      results = {
        winner: null,
        loser: null,
        message: ''
      }
      return
    }
    if (!winnerShape) {
      await updateDoc(['games', 'tic-tac-toe', 'matches'], `${players?.p1.name} x ${players?.p2.name}`, {
        results: {
          winner: null,
          loser: null,
          message: "It's a tie!"
        }
      })
      return
    }

    await updateDoc(['games', 'tic-tac-toe', 'matches'], `${players?.p1.name} x ${players?.p2.name}`, {
      results:
        players?.p1.shape === winnerShape ? {
          winner: players?.p1,
          loser: players?.p2,
          message: `${players.p1.name} is the winner ${
                inactivtyWin ? `due to ${players.p2?.name}'s inactivity` : ''
              }!`
        } : {
          winner: players?.p2,
          loser: players?.p1,
          message: `${players?.p2?.name} is the winner ${
                inactivtyWin ? `due to ${players?.p1.name}'s inactivity` : ''
              }!`
        }
    })
  }

  const end = async (user: User) => {
    try {
      await deleteDoc(['games', 'tic-tac-toe', 'matches'], `${players?.p1.name} x ${players?.p2.name}`)
      await updateUserGameStats(user)
    } catch (err) {
      handleError(err, 'Updating user game stats', undefined, setToast)
    } finally {
      setGameState('game ended')
      reset()
    }
  }

  const updateUserGameStats = async (user: User) => {
    if (results.winner) {
      const isWinner = results.winner.name === user.displayName
      await updateDoc(['users'], user.displayName as string, {
        ticTacToe: {
          match: user.ticTacToe.matches + 1,
          score: isWinner ? user.ticTacToe.score + 30 : user.ticTacToe.score - 15,
          wins: isWinner ? user.ticTacToe.wins + 1 : user.ticTacToe.wins,
          losses: isWinner ? user.ticTacToe.losses : user.ticTacToe.losses + 1,
          currentWinStreak: isWinner ? user.ticTacToe.currentWinStreak + 1 : 0,
          maxWinStreak:
            isWinner && user.ticTacToe.currentWinStreak + 1 > user.ticTacToe.maxWinStreak ? user.ticTacToe.currentWinStreak + 1 : user.ticTacToe.maxWinStreak
        }
      })
    }
  }

  const getP1 = () => players?.p1
  const getP2 = () => players?.p2
  const getResults = () => results
  const getBoard = () => board

  const unsubscribeFromListener = () => unsubscribe && unsubscribe()

  const reset = () => {
    players = null

    board = board.map(row => {
      return row.map(() => '')
    })

    setTurn(null)
    setPlayTimer(null)
    setIsCancelable(true)

    // reset canvas to its initial state
    const canvasElement = document.querySelector('canvas') as HTMLCanvasElement
    canvas.reset(canvasElement)
  }

  return {
    findAMatch,
    start,
    getP1,
    getP2,
    getResults,
    getBoard,
    unsubscribeFromListener,
    setMovement,
    endMatchDueToInactivity,
    checkIfCellIsAlreadyMarked,
    reset
  }
}

export default CreateGame
