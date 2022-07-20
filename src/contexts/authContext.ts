import React from 'react'

import { User as FirebaseUser } from 'firebase/auth'

export interface User extends FirebaseUser {
  ticTacToe: {
    score: number
    wins: number
    losses: number
    currentWinStreak: number
    maxWinStreak: number
  }
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
