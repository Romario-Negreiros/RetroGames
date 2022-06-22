import firebase from '../../libs/firebase'

import { joinPathSegmentsWithSlash } from '@utils/helpers'

import { CollectionReference, DocumentData, WithFieldValue, FieldPath, WhereFilterOp } from 'firebase/firestore'

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

  const getDocs = async (pathSegments: string[], whereArgs: WhereArgs, limit?: number) => {
    const collection = getCollection(pathSegments)
    const query = createQuery(collection, whereArgs, limit)
    const results = await firestore.getDocs(query)
    return results
  }

  const getDoc = async (pathSegments: string[], docId: string) => {
    const doc = getDocReference(pathSegments, docId)
    const result = await firestore.getDoc(doc)
    return result
  }

  const setDoc = async (pathSegments: string[], docId: string, data: WithFieldValue<DocumentData>) => {
    const doc = getDocReference(pathSegments, docId)
    await firestore.setDoc(doc, data)
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
    updateDoc,
    deleteDoc
  }
}

export default useFirestore
