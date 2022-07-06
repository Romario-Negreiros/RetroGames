import React from 'react'
import canvasMethods from './canvasMethods'
import { handleToast } from '@utils/handlers'
import { useToast } from '@utils/hooks'
import { throttle } from '@utils/helpers'

import styles from '@styles/components/ticTacToe.module.css'

interface CanvasDimensions {
  width: number
  height: number
}

const {
  resizeCanvas,
  drawTable,
  drawO,
  drawX,
  findClosestTableCellToTheMouseClickCoordinates,
  getCellsCenterCoordinates
} = canvasMethods()

const TicTacToe: React.FC = () => {
  const [canvasDimensions, setCanvasDimensions] = React.useState<CanvasDimensions>({ width: 0, height: 0 })
  const { setToast } = useToast()

  const handleWindowResize = throttle(() => {
    if (window.innerWidth < 440) {
      const canvas = document.querySelector('canvas') as HTMLCanvasElement
      const { width, height } = canvas.getBoundingClientRect()
      setCanvasDimensions({ width, height })
      const ctx = canvas.getContext('2d')
      if (ctx) {
        resizeCanvas(canvas)
        drawTable({ width, height }, ctx)
      }
    }
  }, 500)

  React.useEffect(() => {
    const canvas = document.querySelector('canvas') as HTMLCanvasElement
    const { width, height } = canvas.getBoundingClientRect()
    setCanvasDimensions({ width, height })
    const ctx = canvas.getContext('2d')
    if (ctx) {
      resizeCanvas(canvas)
      drawTable({ width, height }, ctx)

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

  const handleClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const { x, y } = event.currentTarget.getBoundingClientRect()
    const { clientX, clientY } = event
    const mouseXPositionRelativeToCanvas = clientX - x
    const mouseYPositionRelativeToCanvas = clientY - y
    if (mouseXPositionRelativeToCanvas >= 0 && mouseYPositionRelativeToCanvas >= 0) {
      const canvas = event.currentTarget
      const ctx = canvas.getContext('2d')
      if (ctx) {
        const table = getCellsCenterCoordinates(canvasDimensions.width, canvasDimensions.height)
        const coordinates = findClosestTableCellToTheMouseClickCoordinates(table, {
          x: mouseXPositionRelativeToCanvas,
          y: mouseYPositionRelativeToCanvas
        })
        drawX(ctx, coordinates, canvasDimensions.width / 3)
      }
    }
  }

  return (
    <div className={styles.container}>
      <canvas onClick={handleClick}>
        <p>Sorry but your browser doesn&aphos;t support the game!</p>
      </canvas>
    </div>
  )
}

export default TicTacToe
