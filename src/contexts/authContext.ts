import React from 'react'

import type { User as FirebaseUser } from 'firebase/auth'

export interface GameStats {
  matches: number
  score: number
  wins: number
  losses: number
  maxWinStreak: number
  currentWinStreak: number
}

export interface User extends FirebaseUser {
  ticTacToe: GameStats
}

export interface IAuthContext {
  user: User | null
  setUser: (user: User | null) => void
}

const initialValues = {
  user: null,
  setUser: () => {}
}

const authContext = React.createContext<IAuthContext>(initialValues)

export default authContext
