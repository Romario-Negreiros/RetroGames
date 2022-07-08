import React from 'react'
import CreateCanvas from './CreateCanvas'
import { handleError, handleToast } from '@utils/handlers'
import { useToast } from '@utils/hooks'
import { throttle } from '@utils/helpers'
import CreateGame from './CreateGame'

import { ClientOnlyPortal, Waiting } from '../'

import styles from '@styles/components/ticTacToe.module.css'

import type { GameStates, CanvasDimensions, Player } from './types'

const canvas = CreateCanvas()

const TicTacToe: React.FC = () => {
  const [gameState, setGameState] = React.useState<GameStates>('pre game')
  const [turn, setTurn] = React.useState<Player | null>(null)
  const [canvasDimensions, setCanvasDimensions] = React.useState<CanvasDimensions>({ width: 0, height: 0 })
  const { setToast } = useToast()
  const game = React.useMemo(() => CreateGame(setGameState, setTurn, canvas.reset), [])

  const handleClickOnCanvas = (event: React.MouseEvent<HTMLCanvasElement>, canvasDimensions: CanvasDimensions) => {
    const { x, y } = event.currentTarget.getBoundingClientRect()
    const { clientX, clientY } = event
    const mouseXPositionRelativeToCanvas = clientX - x
    const mouseYPositionRelativeToCanvas = clientY - y
    if (mouseXPositionRelativeToCanvas >= 0 && mouseYPositionRelativeToCanvas >= 0) {
      const canvasElement = event.currentTarget
      const ctx = canvasElement.getContext('2d')
      if (ctx) {
        const table = canvas.getCellsCenterCoordinates(canvasDimensions.width, canvasDimensions.height)
        const { coordinates, row, col } = canvas.findClosestTableCellToTheMouseClickCoordinates(table, {
          x: mouseXPositionRelativeToCanvas,
          y: mouseYPositionRelativeToCanvas
        })
        if (turn?.shape === 'x') {
          canvas.drawX(ctx, coordinates, canvasDimensions.width / 3)
        } else {
          canvas.drawO(ctx, coordinates, canvasDimensions.width / 3)
        }

        if (turn?.id === 1) {
          game.setMovement(row, col, 'p1')
          setTurn(game.getP2())
        } else {
          game.setMovement(row, col, 'p2')
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
        canvas.drawTable({ width, height }, ctx)
      }
    }
  }, 500)

  const handleClickOnButton = () => {
    try {
      game.findAMatch()
      setTimeout(() => {
        const turn = game.start()
        setTurn(turn)
      }, 3000)
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
      canvas.drawTable({ width, height }, ctx)

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
  console.log(turn)
  return (
    <div className={styles.container}>
      {gameState !== 'in progress' && (
        <ClientOnlyPortal selector="#modal_container">
          <section className={styles.game_modal_container}>
            <h2>Tic Tac Toe</h2>
            <div className={styles.game_state_container}>
              {gameState === 'finding a match' && <Waiting waitingFor="Finding an opponent..." />}
              {gameState === 'game ended' && <div>results oaskaos</div>}
            </div>
            <button className="button" onClick={handleClickOnButton}>
              Find a match
            </button>
          </section>
        </ClientOnlyPortal>
      )}
      <canvas onClick={event => handleClickOnCanvas(event, canvasDimensions)}>
        <p>Sorry but your browser doesn&aphos;t support the game!</p>
      </canvas>
    </div>
  )
}

export default TicTacToe
