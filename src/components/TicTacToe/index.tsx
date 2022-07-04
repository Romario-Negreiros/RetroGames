import React from 'react'

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
      ctx.moveTo(canvasWidth - (canvasWidth / 3), 0)
      ctx.lineTo(canvasWidth - (canvasWidth / 3), canvasHeight)
      ctx.stroke()

      ctx.beginPath()
      ctx.moveTo(0, canvasHeight / 3)
      ctx.lineTo(canvasWidth, canvasHeight / 3)
      ctx.stroke()

      ctx.beginPath()
      ctx.moveTo(0, canvasHeight - (canvasHeight / 3))
      ctx.lineTo(canvasWidth, canvasHeight - (canvasHeight / 3))
      ctx.stroke()

      const _0degInRad = Math.PI / 180
      const _360degInRad = Math.PI * 2
      const halfRectX = (canvasWidth / 3) / 2
      const halfRectY = (canvasHeight / 3) / 2
      ctx.beginPath()
      ctx.moveTo(halfRectX + 22, halfRectY)
      ctx.arc(halfRectX, halfRectY, 22, _0degInRad, _360degInRad)
      ctx.stroke()
    }
  }, [])

  return (
    <canvas style={{ backgroundColor: '#fff', width: '100%', height: '100%' }}>
      <p style={{ fontSize: '2rem', color: '#fff' }}>Sorry but your browser doesn&aphos;t support the game!</p>
    </canvas>
  )
}

export default TicTacToe
