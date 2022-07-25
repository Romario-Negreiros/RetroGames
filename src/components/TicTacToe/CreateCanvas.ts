import type { CanvasDimensions, CellCenterCoordinates } from './types'

const CreateCanvas = () => {
  const resize = (canvas: HTMLCanvasElement) => {
    const { width, height } = canvas.getBoundingClientRect()
    if (canvas.width !== width || canvas.height !== height) {
      const { devicePixelRatio: ratio = 1 } = window
      const context = canvas.getContext('2d')
      if (context) {
        canvas.width = width * ratio
        canvas.height = height * ratio
        context.scale(ratio, ratio)
      }
    }
  }

  const drawBoard = (canvasDimensions: CanvasDimensions, ctx: CanvasRenderingContext2D, board?: Array<Array<string>>) => {
    const { width, height } = canvasDimensions

    ctx.beginPath()
    ctx.moveTo(width / 3, 0)
    ctx.lineTo(width / 3, height)
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(width - width / 3, 0)
    ctx.lineTo(width - width / 3, height)
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(0, height / 3)
    ctx.lineTo(width, height / 3)
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(0, height - height / 3)
    ctx.lineTo(width, height - height / 3)
    ctx.stroke()

    if (board) {
      const cellsCenterCoordinates = getCellsCenterCoordinates(width, height)
      board.forEach((row, rowIndex) => {
        row.forEach((col, colIndex) => {
          if (col) {
            if (col === 'X') {
              drawX(ctx, cellsCenterCoordinates[rowIndex][colIndex], width / 3)
            } else {
              drawO(ctx, cellsCenterCoordinates[rowIndex][colIndex], width / 3)
            }
          }
        })
      })
    }
  }

  const reset = (canvas: HTMLCanvasElement) => {
    const { width, height } = canvas.getBoundingClientRect()
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.clearRect(0, 0, width, height)
      drawBoard({ width, height }, ctx)
    }
  }

  const drawO = (ctx: CanvasRenderingContext2D, cellCenterCoordinates: { x: number; y: number }, cellWidth: number) => {
    const _0degInRad = Math.PI / 180
    const _360degInRad = Math.PI * 2
    const { x, y } = cellCenterCoordinates
    ctx.beginPath()
    ctx.arc(x, y, cellWidth / 3, _0degInRad, _360degInRad)
    ctx.stroke()
  }

  const drawX = (ctx: CanvasRenderingContext2D, cellCenterCoordinates: { x: number; y: number }, cellWidth: number) => {
    const _30PercentOffCelWidth = (cellWidth / 100) * 30
    const { x, y } = cellCenterCoordinates
    ctx.beginPath()
    ctx.moveTo(x + _30PercentOffCelWidth, y - _30PercentOffCelWidth)
    ctx.lineTo(x - _30PercentOffCelWidth, y + _30PercentOffCelWidth)
    ctx.moveTo(x - _30PercentOffCelWidth, y - _30PercentOffCelWidth)
    ctx.lineTo(x + _30PercentOffCelWidth, y + _30PercentOffCelWidth)
    ctx.stroke()
  }

  const getCellsCenterCoordinates = (width: number, height: number) => {
    const cellsCenterCoordinates: CellCenterCoordinates[][] = [[], [], []]
    cellsCenterCoordinates[0][0] = { x: width / 3 / 2, y: height / 3 / 2 }
    cellsCenterCoordinates[0][1] = { x: width / 2, y: height / 3 / 2 }
    cellsCenterCoordinates[0][2] = { x: width - width / 3 / 2, y: height / 3 / 2 }
    cellsCenterCoordinates[1][0] = { x: width / 3 / 2, y: width / 2 }
    cellsCenterCoordinates[1][1] = { x: width / 2, y: width / 2 }
    cellsCenterCoordinates[1][2] = { x: width - width / 3 / 2, y: height / 2 }
    cellsCenterCoordinates[2][0] = { x: width / 3 / 2, y: height - height / 3 / 2 }
    cellsCenterCoordinates[2][1] = { x: width / 2, y: height - height / 3 / 2 }
    cellsCenterCoordinates[2][2] = { x: width - width / 3 / 2, y: height - height / 3 / 2 }

    return cellsCenterCoordinates
  }

  const findClosestBoardCellToTheMouseClickCoordinates = (
    cellsCenterCoordinates: CellCenterCoordinates[][],
    mouseCoordinatesRelativeToCanvas: { x: number; y: number }
  ) => {
    const { x, y } = mouseCoordinatesRelativeToCanvas
    let row = 0
    let col = 0
    let trackDistanceX = 0
    let trackDistanceY = 0
    for (let i = 0; i <= 2; i++) {
      for (let j = 0; j <= 2; j++) {
        const distanceX = Math.abs(cellsCenterCoordinates[i][j].x - x)
        if (trackDistanceX === 0) {
          trackDistanceX = distanceX
          col = j
        } else if (distanceX < trackDistanceX) {
          trackDistanceX = distanceX
          col = j
        }

        const distanceY = Math.abs(cellsCenterCoordinates[i][j].y - y)
        if (trackDistanceY === 0) {
          trackDistanceY = distanceY
          row = i
        } else if (distanceY < trackDistanceY) {
          trackDistanceY = distanceY
          row = i
        }
      }
    }

    const coordinates = cellsCenterCoordinates[row][col]
    return {
      coordinates,
      row,
      col
    }
  }

  return {
    resize,
    reset,
    drawBoard,
    drawO,
    drawX,
    getCellsCenterCoordinates,
    findClosestBoardCellToTheMouseClickCoordinates
  }
}

export default CreateCanvas
