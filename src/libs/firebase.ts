// https://firebase.google.com/docs/auth/web/email-link-auth?authuser=0&hl=pt

import { initializeApp } from 'firebase/app'

import { getAuth, sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_APP_ID
}

const app = initializeApp(firebaseConfig)

const firebase = {
  auth: {
    instance: getAuth(app),
    sendSignInLinkToEmail,
    signInWithEmailLink,
    isSignInWithEmailLink
  }
}

export default firebase
