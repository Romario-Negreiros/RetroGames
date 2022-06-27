import React from 'react'

import { User as FirebaseUser } from 'firebase/auth'

export interface User extends FirebaseUser {}

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
