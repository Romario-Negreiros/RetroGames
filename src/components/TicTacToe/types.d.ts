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
  shape: 'X' | 'O'
}

export interface Players {
  p1: Player
  p2: Player
}

export interface Results {
  winner: Player | null
  loser: Player | null
  message: string
}

type Row = Array<'X' | 'O' | ''>

export interface Match {
  players: Players
  turn: Player
  board: {
    row0: Row
    row1: Row
    row2: Row
  }
  results?: Results
  markedCell?: {
    row: number
    col: number
  }
}
