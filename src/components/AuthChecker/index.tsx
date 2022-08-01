import React from 'react'
import { useRouter } from 'next/router'

import { Error } from '../'

import type { User } from '@contexts/authContext'

interface Props {
  children: React.ReactNode
  user: User | null
}

const forbiddenPaths = ['/games/', '/users']

const AuthChecker: React.FC<Props> = ({ children, user }) => {
  const { pathname } = useRouter()

  if (!forbiddenPaths.some(path => pathname.includes(path))) {
    return <>{children}</>
  } else if (!user) {
    return (
      <main className="main_container full_screen_height_wrapper">
        <Error error={'You need to be signed in to access this page!'} />
      </main>
    )
  }
  return <>{children}</>
}

export default AuthChecker
