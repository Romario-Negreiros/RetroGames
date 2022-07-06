interface CellCenterCoordinate {
  x: number
  y: number
}

interface CanvasDimensions {
  width: number
  height: number
}

const canvasMethods = () => {
  const resizeCanvas = (canvas: HTMLCanvasElement) => {
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

  const drawTable = (canvasDimensions: CanvasDimensions, ctx: CanvasRenderingContext2D) => {
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
    const _30PercentOffCelWidth = cellWidth / 100 * 30
    const { x, y } = cellCenterCoordinates
    ctx.beginPath()
    ctx.moveTo(x + _30PercentOffCelWidth, y - _30PercentOffCelWidth)
    ctx.lineTo(x - _30PercentOffCelWidth, y + _30PercentOffCelWidth)
    ctx.moveTo(x - _30PercentOffCelWidth, y - _30PercentOffCelWidth)
    ctx.lineTo(x + _30PercentOffCelWidth, y + _30PercentOffCelWidth)
    ctx.stroke()
  }

  const getCellsCenterCoordinates = (
    width: number,
    height: number
  ) => {
    const cellsCenterCoordinates: CellCenterCoordinate[][] = [[], [], []]
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

  const findClosestTableCellToTheMouseClickCoordinates = (
    cellsCenterCoordinates: CellCenterCoordinate[][],
    mouseCoordinatesRelativeToCanvas: { x: number; y: number }
  ) => {
    const { x, y } = mouseCoordinatesRelativeToCanvas
    let row
    let col
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

    const cellCenterCoordinates = cellsCenterCoordinates[row as number][col as number]
    return cellCenterCoordinates
  }

  return {
    resizeCanvas,
    drawTable,
    drawO,
    drawX,
    getCellsCenterCoordinates,
    findClosestTableCellToTheMouseClickCoordinates
  }
}

export default canvasMethods
