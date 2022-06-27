import { initializeApp } from 'firebase/app'

import {
  getAuth,
  sendSignInLinkToEmail,
  fetchSignInMethodsForEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
  updateProfile,
  signOut
} from 'firebase/auth'

import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  doc,
  limit
} from 'firebase/firestore'

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
    isSignInWithEmailLink,
    fetchSignInMethodsForEmail,
    updateProfile,
    signOut
  },

  firestore: {
    instance: getFirestore(app),
    collection,
    query,
    where,
    getDocs,
    setDoc,
    getDoc,
    updateDoc,
    deleteDoc,
    doc,
    limit
  }
}

export default firebase
