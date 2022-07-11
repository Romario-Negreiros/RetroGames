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
  const [canvasDimensions, setCanvasDimensions] = React.useState<CanvasDimensions>({ width: 0, height: 0 })
  const { setToast } = useToast()
  const { user } = useAuth()
  const { deleteDoc, getDoc, setDoc, setListenerOnCollection, setListenerOnDoc, updateDoc } = useFirestore()
  const game = React.useMemo(
    () =>
      CreateGame(
        setGameState,
        setTurn,
        setDoc,
        setListenerOnCollection,
        setListenerOnDoc,
        setToast,
        deleteDoc,
        updateDoc,
        getDoc,
        canvas.reset
      ),
    [deleteDoc, getDoc, setDoc, setListenerOnCollection, setListenerOnDoc, setToast, updateDoc]
  )

  const handleClickOnCanvas = async (event: React.MouseEvent<HTMLCanvasElement>, canvasDimensions: CanvasDimensions) => {
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

        if (turn?.shape === 'x') {
          canvas.drawX(ctx, coordinates, canvasDimensions.width / 3)
        } else {
          canvas.drawO(ctx, coordinates, canvasDimensions.width / 3)
        }

        if (turn?.id === 1) {
          await game.setMovement(row, col, 'p1')
          setTurn(game.getP2())
        } else {
          await game.setMovement(row, col, 'p2')
          setTurn(game.getP1())
        }
      }
    }
  }

  const handleWindowResize = throttle(() => {
    if (window.innerWidth < 440) {
      const canvasElement = document.querySelector('canvas') as HTMLCanvasElement
      const { width, height } = canvasElement.getBoundingClientRect()
      setCanvasDimensions({ width, height })
      const ctx = canvasElement.getContext('2d')
      if (ctx) {
        canvas.resize(canvasElement)
        canvas.drawBoard({ width, height }, ctx)
      }
    }
  }, 500)

  const handleClickOnButton = async () => {
    try {
      await game.findAMatch(user as User)
      const turn = game.start()
      setTurn(turn)
    } catch (err) {
      handleError(err, 'Finding a tic tac toe match', undefined, setToast)
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
      if (ctx) {
        window.removeEventListener('resize', handleWindowResize)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
            <button className="button" onClick={handleClickOnButton}>
              Find a match
            </button>
          </section>
        </ClientOnlyPortal>
      )}
      <canvas
        style={{ cursor: turn?.name === user?.displayName ? 'pointer' : 'not-allowed' }}
        onClick={event => (turn?.name === user?.displayName ? handleClickOnCanvas(event, canvasDimensions) : '')}
      >
        <p>Sorry but your browser doesn&aphos;t support the game!</p>
      </canvas>
    </div>
  )
}

export default TicTacToe
