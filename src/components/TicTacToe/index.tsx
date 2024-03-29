import React from 'react'
import CreateCanvas from './CreateCanvas'
import { handleError, handleToast } from '@utils/handlers'
import { useToast, useAuth, useFirestore } from '@utils/hooks'
import { throttle } from '@utils/helpers'
import CreateGame from './CreateGame'

import { ClientOnlyPortal, Waiting } from '../'

import styles from '@styles/components/ticTacToe.module.css'

import type { GameStates, CanvasDimensions, Player } from './types'
import type { User } from '@contexts/authContext'

const canvas = CreateCanvas()

const TicTacToe: React.FC = () => {
  const [gameState, setGameState] = React.useState<GameStates>('pre game')
  const [turn, setTurn] = React.useState<Player | null>(null)
  const [playTimer, setPlayTimer] = React.useState<number | null>(null)
  const [isCancelable, setIsCancelable] = React.useState(true)
  const [timeoutID, setTimeoutID] = React.useState<ReturnType<typeof setTimeout> | null>(null)
  const [canvasDimensions, setCanvasDimensions] = React.useState<CanvasDimensions>({ width: 0, height: 0 })
  const { setToast } = useToast()
  const { user } = useAuth()
  const { deleteDoc, setDoc, setListenerOnCollection, setListenerOnDoc, updateDoc } = useFirestore()
  const isUnmounting = React.useRef(false)
  const game = React.useMemo(
    () =>
      CreateGame(
        setGameState,
        setTurn,
        setPlayTimer,
        setIsCancelable,
        setDoc,
        setListenerOnCollection,
        setListenerOnDoc,
        setToast,
        deleteDoc,
        updateDoc
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  const handleClickOnCanvas = async (event: React.MouseEvent<HTMLCanvasElement>) => {
    const { x, y } = event.currentTarget.getBoundingClientRect()
    const { clientX, clientY } = event
    const mouseXPositionRelativeToCanvas = clientX - x
    const mouseYPositionRelativeToCanvas = clientY - y
    if (mouseXPositionRelativeToCanvas >= 0 && mouseYPositionRelativeToCanvas >= 0) {
      const canvasElement = event.currentTarget
      const ctx = canvasElement.getContext('2d')
      if (ctx) {
        const board = canvas.getCellsCenterCoordinates(canvasDimensions.width, canvasDimensions.height)
        const { coordinates, row, col } = canvas.findClosestBoardCellToTheMouseClickCoordinates(board, {
          x: mouseXPositionRelativeToCanvas,
          y: mouseYPositionRelativeToCanvas
        })
        if (game.checkIfCellIsAlreadyMarked(row, col)) {
          return
        }

        if (turn) {
          canvas[`draw${turn?.shape}`](ctx, coordinates, canvasDimensions.width / 3)
          await game.setMovement(row, col, `p${turn.id}`)
        }
      }
    }
  }

  const handleWindowResize = throttle(() => {
    const canvasElement = document.querySelector('canvas') as HTMLCanvasElement
    const { width, height } = canvasElement.getBoundingClientRect()
    setCanvasDimensions({ width, height })
    const ctx = canvasElement.getContext('2d')
    if (ctx) {
      canvas.resize(canvasElement)
      canvas.drawBoard({ width, height }, ctx, game.getBoard())
    }
  }, 500)

  const handleClickOnFindAMatchButton = async () => {
    if (gameState === 'pre game' || gameState === 'game ended') {
      try {
        await game.findAMatch(user as User)
        game.start(user as User)
      } catch (err) {
        handleError(err, 'Finding a tic tac toe match', undefined, setToast)
        setGameState('pre game')
      }
    }
  }

  const handleClickOnCancelButton = async () => {
    if (isCancelable) {
      await deleteDoc(['games', 'tic-tac-toe', 'queue'], user?.displayName as string)
      game.reset()
      game.unsubscribeFromListener()
      setGameState('pre game')
    }
  }

  React.useEffect(() => {
    const canvasElement = document.querySelector('canvas') as HTMLCanvasElement
    const { width, height } = canvasElement.getBoundingClientRect()
    setCanvasDimensions({ width, height })
    const ctx = canvasElement.getContext('2d')
    if (ctx) {
      canvas.resize(canvasElement)
      canvas.drawBoard({ width, height }, ctx)

      window.addEventListener('resize', handleWindowResize)
    } else {
      handleToast("Sorry, but your browser doesn't support the game!", setToast)
    }

    return () => {
      window.removeEventListener('resize', handleWindowResize)
      game.unsubscribeFromListener()
      isUnmounting.current = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  React.useEffect(() => {
    return () => {
      if (isUnmounting.current) {
        if (timeoutID) {
          clearTimeout(timeoutID)
        }
        if (gameState === 'finding a match') {
          deleteDoc(['games', 'tic-tac-toe', 'queue'], user?.displayName as string)
        } else if (gameState === 'in progress') {
          const p1 = game.getP1()
          const p2 = game.getP2()
          if (p1 && p2) {
            const winner = p1.name === user?.displayName ? p2 : p1
            const loser = p1.name === user?.displayName ? p1 : p2
            ;(async () => {
              await updateDoc(['games', 'tic-tac-toe', 'matches'], `${p1.name} x ${p2.name}`, {
                results: {
                  winner,
                  loser,
                  message: `${winner.name} is the winner because ${loser.name} left the match!`
                }
              })
              await deleteDoc(['games', 'tic-tac-toe', 'matches'], `${game.getP1()?.name} x ${game.getP2()?.name}`)
              await updateDoc(['users'], user?.displayName as string, {
                ticTacToe: {
                  matches: (user?.ticTacToe.matches as number) + 1,
                  score: (user?.ticTacToe.score as number) - 15,
                  wins: user?.ticTacToe.wins,
                  losses: (user?.ticTacToe.losses as number) + 1,
                  currentWinStreak: 0,
                  maxWinStreak: user?.ticTacToe.maxWinStreak
                }
              })
            })()
          }
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeoutID, gameState])

  React.useEffect(() => {
    if (!turn) {
      return
    }

    setPlayTimer(30)
    if (timeoutID && playTimer && playTimer < 30) {
      clearTimeout(timeoutID)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [turn])

  React.useEffect(() => {
    if (playTimer === 0) {
      if (user?.displayName === turn?.name) {
        game.endMatchDueToInactivity(turn?.shape as 'X' | 'O')
      }
    } else if (playTimer && playTimer > 0) {
      const timeout = setTimeout(() => {
        setPlayTimer(playTimer => (playTimer ? playTimer - 1 : null))
      }, 1000)
      setTimeoutID(timeout)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playTimer])

  return (
    <div className={styles.container}>
      {gameState !== 'in progress' && (
        <ClientOnlyPortal selector="#modal_container">
          <section className={styles.game_modal_container}>
            <h2>Tic Tac Toe</h2>
            <div>
              {gameState === 'finding a match' && <Waiting waitingFor="Finding an opponent..." />}
              {gameState === 'game ended' && <p className={styles.game_results}>{game.getResults().message}</p>}
            </div>
            <button
              className="button"
              disabled={gameState === 'finding a match'}
              onClick={handleClickOnFindAMatchButton}
            >
              Find a match
            </button>
            {gameState === 'finding a match' && (
              <button className="button" disabled={!isCancelable} onClick={handleClickOnCancelButton}>
                Cancel
              </button>
            )}
          </section>
        </ClientOnlyPortal>
      )}
      {gameState === 'in progress' && (
        <div className={styles.match_info_container}>
          <p>
            {game.getP1()?.name} <span>{game.getP1()?.shape}</span>
            <span className={styles.play_timer}>
              {game.getP1()?.name === turn?.name ? `0:${String(playTimer).padStart(2, '0')}` : ''}
            </span>
          </p>
          <p>
            {game.getP2()?.name} <span>{game.getP2()?.shape}</span>
            <span className={styles.play_timer}>
              {game.getP2()?.name === turn?.name ? `0:${String(playTimer).padStart(2, '0')}` : ''}
            </span>
          </p>
        </div>
      )}
      <canvas
        style={{ cursor: turn?.name === user?.displayName ? 'pointer' : 'not-allowed' }}
        onClick={event => (turn?.name === user?.displayName ? handleClickOnCanvas(event) : '')}
      >
        <p>Sorry but your browser doesn&aphos;t support the game!</p>
      </canvas>
    </div>
  )
}

export default TicTacToe
