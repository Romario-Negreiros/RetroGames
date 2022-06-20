import React from 'react'

import toastContext from '@contexts/toastContext'

const useToast = () => {
  return React.useContext(toastContext)
}

export default useToast
