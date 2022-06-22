import firebase from '../../libs/firebase'

import { ActionCodeSettings } from 'firebase/auth'

const useAuthMethods = () => {
  const { auth } = firebase

  const actionCodeSettings: ActionCodeSettings = {
    url: 'http://localhost:3000/',
    handleCodeInApp: true
  }

  const sendSignInLinkToEmail = async (email: string) => {
    await auth.sendSignInLinkToEmail(auth.instance, email, actionCodeSettings)
    window.localStorage.setItem('email', email)
  }

  const signInWithEmailLink = async (email: string) => {
    await auth.signInWithEmailLink(auth.instance, email, window.location.href)
    window.localStorage.removeItem('email')
  }

  const finishSignInWithEmailLink = async () => {
    let email = window.localStorage.getItem('email')

    if (!email) {
      email = window.prompt('Please, provide your email for confirmation:')

      if (!email) {
        throw new Error(
          'Unable to complete the log in, no email for confirmation was provided!'
        )
      }

      await signInWithEmailLink(email)
      return
    }

    await signInWithEmailLink(email)
  }

  const verifyIfEmailAlreadyExists = async (email: string) => {
    const signInMethods = await auth.fetchSignInMethodsForEmail(auth.instance, email)
    if (signInMethods.length) {
      return true
    }
    return false
  }

  return {
    sendSignInLinkToEmail,
    finishSignInWithEmailLink,
    verifyIfEmailAlreadyExists
  }
}

export default useAuthMethods
