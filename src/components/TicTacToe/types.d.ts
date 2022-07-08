export interface CellCenterCoordinates {
  x: number
  y: number
}

export interface CanvasDimensions {
  width: number
  height: number
}

export type GameStates = 'pre game' | 'finding a match' | 'in progress' | 'game ended'

export interface Player {
  id: 1 | 2
  name: string
  shape: 'x' | 'o'
}
