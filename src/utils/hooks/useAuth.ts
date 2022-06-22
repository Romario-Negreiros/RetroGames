import React from 'react'

import userContext from '@contexts/authContext'

const useAuth = () => {
  return React.useContext(userContext)
}

export default useAuth
