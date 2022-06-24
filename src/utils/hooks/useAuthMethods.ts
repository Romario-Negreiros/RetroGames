import firebase from '../../libs/firebase'

import { ActionCodeSettings, User as FirebaseUser } from 'firebase/auth'

interface UpdateProfileData {
  displayName?: string
  photoURL?: string
}

const useAuthMethods = () => {
  const { auth } = firebase

  const sendSignInLinkToEmail = async (email: string, name?: string) => {
    const actionCodeSettings: ActionCodeSettings = {
      url: `http://localhost:3000/?name=${name}`,
      handleCodeInApp: true
    }

    await auth.sendSignInLinkToEmail(auth.instance, email, actionCodeSettings)
    window?.localStorage.setItem('email', email)
  }

  const signInWithEmailLink = async (email: string) => {
    const { user } = await auth.signInWithEmailLink(auth.instance, email, window?.location.href)
    window?.localStorage.removeItem('email')
    return user
  }

  const finishSignInWithEmailLink = async () => {
    let email = window?.localStorage.getItem('email')

    if (!email) {
      email = window?.prompt('Please, provide your email for confirmation:')

      if (!email) {
        throw new Error('Unable to complete the log in, no email for confirmation was provided!')
      }

      const user = await signInWithEmailLink(email)
      return user
    }

    const user = await signInWithEmailLink(email)
    return user
  }

  const verifyIfEmailAlreadyExists = async (email: string) => {
    const signInMethods = await auth.fetchSignInMethodsForEmail(auth.instance, email)
    if (signInMethods.length) {
      return true
    }
    return false
  }

  const updateProfile = async (currentUser: FirebaseUser, data: UpdateProfileData) => {
    await auth.updateProfile(currentUser, data)
  }

  return {
    sendSignInLinkToEmail,
    finishSignInWithEmailLink,
    verifyIfEmailAlreadyExists,
    updateProfile
  }
}

export default useAuthMethods
