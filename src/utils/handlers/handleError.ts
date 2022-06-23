import { joinErrMsgAndAction } from '@utils/helpers'
import handleToast from './handleToast'

import { IToast } from '@contexts/toastContext'

import { AuthErrorCodes } from 'firebase/auth'

const handleError = (
  error: unknown,
  action: string,
  setError?: (error: string) => void,
  setToast?: (toast: IToast) => void
) => {
  const defaultUserErrorMessage = 'Looks like something went wrong, if the error persists, try again after a while!'

  const setErrorOrToast = (message: string) => {
    if (setError) {
      setError(message)
    } else if (setToast) {
      handleToast(message, setToast)
    }
  }

  if (error instanceof Error) {
    const firebaseError = error.message.match(/[(]{1}[a-z]+[/]{1}[a-z-]+[)]{1}/)

    if (firebaseError) {
      const message = firebaseError[0].substring(1, firebaseError[0].length - 1) // remove parentheses from message

      switch (message) {
        case AuthErrorCodes.NETWORK_REQUEST_FAILED:
          setErrorOrToast('Please, check your internet connection and try again!')
          break
        case AuthErrorCodes.INVALID_PASSWORD:
          setErrorOrToast('Wrong password!')
          break
        case AuthErrorCodes.EMAIL_EXISTS:
          setErrorOrToast('This email already exists, try another one!')
          break
        case AuthErrorCodes.TOO_MANY_ATTEMPTS_TRY_LATER:
          setErrorOrToast('Too many attempts, try again later!')
          break
        case AuthErrorCodes.USER_DELETED:
          setErrorOrToast('This user has been deleted!')
          break
        case AuthErrorCodes.CREDENTIAL_TOO_OLD_LOGIN_AGAIN:
          setErrorOrToast('You need to sign in again to complete this operation!')
          break
        case AuthErrorCodes.INVALID_EMAIL:
          setErrorOrToast("We couldn't complete the action because the email provided doesn't match our records!")
          break
        case 'auth/invalid-action-code':
          setErrorOrToast('The link or code has already been used, or has expired!')
          break
        default:
          setErrorOrToast(defaultUserErrorMessage)
      }
      console.error(joinErrMsgAndAction(message, action))
    } else {
      console.error(joinErrMsgAndAction(error.message, action))
      setErrorOrToast(error.message)
    }
  } else {
    console.error(joinErrMsgAndAction('Unknown error', action))
    setErrorOrToast(defaultUserErrorMessage)
  }
}

export default handleError
