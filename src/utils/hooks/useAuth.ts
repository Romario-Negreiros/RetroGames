import React from 'react'

import authContext from '@contexts/authContext'

const useAuth = () => {
  return React.useContext(authContext)
}

export default useAuth
