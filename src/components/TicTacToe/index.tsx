import React from 'react'

import styles from '@styles/components/ticTacToe.module.css'

const resizeCanvas = (canvas: HTMLCanvasElement) => {
  const { width, height } = canvas.getBoundingClientRect()
  if (canvas.width !== width || canvas.height !== height) {
    const { devicePixelRatio: ratio = 1 } = window
    const context = canvas.getContext('2d')
    if (context) {
      canvas.width = width * ratio
      canvas.height = height * ratio
      context.scale(ratio, ratio)
      return true
    }
  }
  return false
}

const drawCircle = (ctx: CanvasRenderingContext2D, coordinates: { halfCellX: number; halfCellY: number }) => {
  const _0degInRad = Math.PI / 180
  const _360degInRad = Math.PI * 2
  const { halfCellX, halfCellY } = coordinates
  ctx.beginPath()
  ctx.moveTo(halfCellX + 50, halfCellY)
  ctx.arc(halfCellX, halfCellY, 50, _0degInRad, _360degInRad)
  ctx.stroke()
}

const drawX = (ctx: CanvasRenderingContext2D, coordinates: { halfCellX: number; halfCellY: number }) => {
  const { halfCellX, halfCellY } = coordinates
  ctx.beginPath()
  ctx.moveTo(halfCellX + 50, halfCellY - 50)
  ctx.lineTo(halfCellX - 50, halfCellY + 50)
  ctx.moveTo(halfCellX - 50, halfCellY - 50)
  ctx.lineTo(halfCellX + 50, halfCellY + 50)
  ctx.stroke()
}

interface Cell {
  halfCellX: number
  halfCellY: number
}

const getTableStructure = (canvas: HTMLCanvasElement) => {
  const canvasWidth = canvas.width
  const canvasHeight = canvas.height
  const table: Cell[][] = [[], [], []]
  // i 0 j 0
  table[0][0] = { halfCellX: canvasWidth / 3 / 2, halfCellY: canvasHeight / 3 / 2 }
  table[0][1] = { halfCellX: canvasWidth / 2, halfCellY: canvasHeight / 3 / 2 }
  table[0][2] = { halfCellX: canvasWidth - canvasWidth / 3 / 2, halfCellY: canvasHeight / 3 / 2 }
  table[1][0] = { halfCellX: canvasWidth / 3 / 2, halfCellY: canvasWidth / 2 }
  table[1][1] = { halfCellX: canvasWidth / 2, halfCellY: canvasWidth / 2 }
  table[1][2] = { halfCellX: canvasWidth - canvasWidth / 3 / 2, halfCellY: canvasHeight / 2 }
  table[2][0] = { halfCellX: canvasWidth / 3 / 2, halfCellY: canvasHeight - canvasHeight / 3 / 2 }
  table[2][1] = { halfCellX: canvasWidth / 2, halfCellY: canvasHeight - canvasHeight / 3 / 2 }
  table[2][2] = { halfCellX: canvasWidth - canvasWidth / 3 / 2, halfCellY: canvasHeight - canvasHeight / 3 / 2 }

  return table
}

const findCoordinates = (table: Cell[][], mouseCoordinatesRelativeToCanvas: { x: number; y: number }) => {
  const { x, y } = mouseCoordinatesRelativeToCanvas
  let row
  let col
  let trackDistanceX = 0
  let trackDistanceY = 0
  for (let i = 0; i <= 2; i++) {
    for (let j = 0; j <= 2; j++) {
      const distanceX = Math.abs(table[i][j].halfCellX - x)
      if (trackDistanceX === 0) {
        trackDistanceX = distanceX
        col = j
      } else if (distanceX < trackDistanceX) {
        trackDistanceX = distanceX
        col = j
      }

      const distanceY = Math.abs(table[i][j].halfCellY - y)
      if (trackDistanceY === 0) {
        trackDistanceY = distanceY
        row = i
      } else if (distanceY < trackDistanceY) {
        trackDistanceY = distanceY
        row = i
      }
    }
  }

  const coordinates = table[row as number][col as number]
  return coordinates
}

const TicTacToe: React.FC = () => {
  React.useEffect(() => {
    const canvas = document.querySelector('canvas') as HTMLCanvasElement
    const ctx = canvas.getContext('2d')
    if (ctx) {
      const canvasWidth = canvas.width
      const canvasHeight = canvas.height

      ctx.beginPath()
      ctx.moveTo(canvasWidth / 3, 0)
      ctx.lineTo(canvasWidth / 3, canvasHeight)
      ctx.stroke()

      ctx.beginPath()
      ctx.moveTo(canvasWidth - canvasWidth / 3, 0)
      ctx.lineTo(canvasWidth - canvasWidth / 3, canvasHeight)
      ctx.stroke()

      ctx.beginPath()
      ctx.moveTo(0, canvasHeight / 3)
      ctx.lineTo(canvasWidth, canvasHeight / 3)
      ctx.stroke()

      ctx.beginPath()
      ctx.moveTo(0, canvasHeight - canvasHeight / 3)
      ctx.lineTo(canvasWidth, canvasHeight - canvasHeight / 3)
      ctx.stroke()

      drawX(ctx, { halfCellX: canvasWidth / 3 / 2, halfCellY: canvasHeight / 3 / 2 })

      resizeCanvas(canvas)
    }
  }, [])

  const handleScroll = () => {
    if (window.innerWidth < 440) {
      const canvas = document.querySelector('canvas') as HTMLCanvasElement
      resizeCanvas(canvas)
    }
  }

  React.useEffect(() => {
    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const handleClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const { x, y } = event.currentTarget.getBoundingClientRect()
    const { clientX, clientY } = event
    const mouseXPositionRelativeToCanvas = clientX - x
    const mouseYPositionRelativeToCanvas = clientY - y
    if (mouseXPositionRelativeToCanvas >= 0 && mouseYPositionRelativeToCanvas >= 0) {
      // based on the cords find the table and then draw the shape
      const canvas = event.currentTarget
      const ctx = canvas.getContext('2d')
      if (ctx) {
        const table = getTableStructure(canvas)
        const coordinates = findCoordinates(table, {
          x: mouseXPositionRelativeToCanvas,
          y: mouseYPositionRelativeToCanvas
        })
        drawCircle(ctx, coordinates)
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
