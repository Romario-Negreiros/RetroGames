import firebase from '../../libs/firebase'

import { joinPathSegmentsWithSlash } from '@utils/helpers'

import {
  CollectionReference,
  DocumentData,
  DocumentSnapshot,
  WithFieldValue,
  FieldPath,
  WhereFilterOp,
  DocumentReference,
  Query,
  QuerySnapshot,
  FirestoreError
} from 'firebase/firestore'

type WhereArgs = [fieldPath: string | FieldPath, opStr: WhereFilterOp, value: unknown]

const useFirestore = () => {
  const { firestore } = firebase

  const getCollection = (pathSegments: string[]) => {
    const path = joinPathSegmentsWithSlash(pathSegments)
    return firestore.collection(firestore.instance, path)
  }

  const getDocReference = (pathSegments: string[], docId: string) => {
    const path = joinPathSegmentsWithSlash(pathSegments)
    return firestore.doc(firestore.instance, path, docId)
  }

  const createQuery = (collection: CollectionReference<DocumentData>, whereArgs: WhereArgs, limit?: number) => {
    if (limit) {
      return firestore.query(collection, firestore.where(...whereArgs), firestore.limit(limit))
    }
    return firestore.query(collection, firestore.where(...whereArgs))
  }

  const getDocs = async <I>(pathSegments: string[], whereArgs: WhereArgs, limit?: number) => {
    const collection = getCollection(pathSegments)
    const query = createQuery(collection, whereArgs, limit)
    const results = await firestore.getDocs<I>(query as Query<I>)
    return results
  }

  const getDoc = async <I>(pathSegments: string[], docId: string) => {
    const doc = getDocReference(pathSegments, docId)
    const result = await firestore.getDoc<I>(doc as DocumentReference<I>)
    return result
  }

  const setDoc = async (pathSegments: string[], docId: string, data: WithFieldValue<DocumentData>) => {
    const doc = getDocReference(pathSegments, docId)
    await firestore.setDoc(doc, data)
  }

  const setListenerOnDoc = (
    pathSegments: string[],
    docId: string,
    onNext: (snapshot: DocumentSnapshot<DocumentData>) => void,
    onError: (err: FirestoreError) => void
  ) => {
    const doc = getDocReference(pathSegments, docId)
    const unsubscribe = firestore.onSnapshot(
      doc,
      snapshot => {
        onNext(snapshot)
      },
      err => {
        onError(err)
      }
    )

    return unsubscribe
  }

  const setListenerOnCollection = (
    pathSegments: string[],
    currentUserName: string,
    onNext: (snapshot: QuerySnapshot<DocumentData>) => void,
    onError: (err: FirestoreError) => void
  ) => {
    const collection = getCollection(pathSegments)
    const query = createQuery(collection, ['name', '!=', currentUserName])
    const unsubscribe = firestore.onSnapshot(
      query,
      snapshot => {
        onNext(snapshot)
      },
      err => {
        onError(err)
      }
    )

    return unsubscribe
  }

  const updateDoc = async (pathSegments: string[], docId: string, data: WithFieldValue<DocumentData>) => {
    const doc = getDocReference(pathSegments, docId)
    await firestore.updateDoc(doc, data)
  }

  const deleteDoc = async (pathSegments: string[], docId: string) => {
    const doc = getDocReference(pathSegments, docId)
    await firestore.deleteDoc(doc)
  }

  return {
    getDocs,
    getDoc,
    setDoc,
    setListenerOnCollection,
    setListenerOnDoc,
    updateDoc,
    deleteDoc
  }
}

export default useFirestore
