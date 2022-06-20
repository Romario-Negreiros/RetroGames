import { joinErrMsgAndAction } from '@utils/helpers'

import { AuthErrorCodes } from 'firebase/auth'

const handleError = (error: unknown, action: string, setError: (error: string) => void) => {
  const defaultUserErrorMessage = 'Looks like something went wrong, if the error persists, try again after a while!'

  if (error instanceof Error) {
    const getErrorCode = error.message.match(/[(]{1}[a-z]+[/]{1}[a-z-]+[)]{1}/)

    if (getErrorCode) {
      const message = getErrorCode[0].substring(1, getErrorCode[0].length - 1) // remove parentheses from message

      switch (message) {
        case AuthErrorCodes.NETWORK_REQUEST_FAILED:
          setError('Please, check your internet connection and try again!')
          break
        case AuthErrorCodes.INVALID_PASSWORD:
          setError('Wrong password!')
          break
        case AuthErrorCodes.EMAIL_EXISTS:
          setError('This email already exists, try another one!')
          break
        case AuthErrorCodes.TOO_MANY_ATTEMPTS_TRY_LATER:
          setError('Too many attempts, try again later!')
          break
        case AuthErrorCodes.USER_DELETED:
          setError('This user has been deleted!')
          break
        case AuthErrorCodes.CREDENTIAL_TOO_OLD_LOGIN_AGAIN:
          setError('Your need to sign in again to complete this operation!')
          break
        default:
          setError(defaultUserErrorMessage)
      }
      console.error(joinErrMsgAndAction(message, action))
    } else {
      console.error(joinErrMsgAndAction(error.message, action))
      setError(error.message)
    }
  } else {
    console.error(joinErrMsgAndAction('Unknown authentication error', action))
    setError(defaultUserErrorMessage)
  }
}

export default handleError
