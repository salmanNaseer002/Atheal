import { initializeApp } from "firebase/app";
import {
  getAuth,
  User,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as signOutFirebase,
} from "firebase/auth";
import {
  doc,
  getDoc,
  getDocs,
  getFirestore,
  collection,
  setDoc,
  WithFieldValue,
  DocumentData,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  CollectionReference,
  Query,
  query,
  where,
  orderBy,
  limit,
  WhereFilterOp,
  OrderByDirection,
  startAfter,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export const onAuthStateChangedHandler = (
  callback: (user: User | null) => void
) => {
  return onAuthStateChanged(auth, callback);
};

export const signUp = async (email: string, password: string) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const signIn = async (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const signOut = async () => {
  return signOutFirebase(auth);
};

export const getDocument = async <T>(collectionName: string, id: string) => {
  const docRef = doc(db, collectionName, id);
  const docSnap = await getDoc(docRef);
  return docSnap.data() as T;
};

export const getCollection = async <T>(collectionName: string) => {
  const querySnapshot = await getDocs(collection(db, collectionName));
  return querySnapshot.docs.map((doc) => doc.data()) as T[];
};

export const createDocumentWithId = async <T>(
  collectionName: string,
  id: string,
  data: T
) => {
  const docRef = doc(db, collectionName, id);

  await setDoc(docRef, {
    ...data,
    id,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as WithFieldValue<DocumentData>);
};

export const createDocument = async <T>(collectionName: string, data: T) => {
  const docRef = collection(db, collectionName);
  await addDoc(docRef, {
    ...data,
    id: docRef.id,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as WithFieldValue<DocumentData>);
};

export const updateDocument = async <T>(
  collectionName: string,
  id: string,
  data: T
) => {
  const docRef = doc(db, collectionName, id);
  await updateDoc(docRef, data as WithFieldValue<DocumentData>);
};

export const deleteDocument = async (collectionName: string, id: string) => {
  const docRef = doc(db, collectionName, id);
  await deleteDoc(docRef);
};

export const addDocumentInSubCollection = async <T>(
  collectionName: string,
  id: string,
  subCollectionName: string,
  data: T
): Promise<T & { id: string; createdAt: Date; updatedAt: Date }> => {
  const docRef = doc(db, collectionName, id);
  const subCollectionRef = collection(docRef, subCollectionName);

  const newDocRef = doc(subCollectionRef);

  const timestamp = new Date();
  const documentData = {
    ...data,
    id: newDocRef.id,
    createdAt: timestamp,
    updatedAt: timestamp,
  } as WithFieldValue<DocumentData>;

  await setDoc(newDocRef, documentData);

  return documentData as T & { id: string; createdAt: Date; updatedAt: Date };
};

export const deleteDocumentInSubCollection = async (
  collectionName: string,
  id: string,
  subCollectionName: string,
  documentId: string
) => {
  const docRef = doc(db, collectionName, id);
  await deleteDoc(doc(docRef, subCollectionName, documentId));
};

export const updateDocumentInSubCollection = async <T>(
  collectionName: string,
  id: string,
  subCollectionName: string,
  documentId: string,
  data: T
) => {
  const docRef = doc(db, collectionName, id);
  await updateDoc(
    doc(docRef, subCollectionName, documentId),
    data as WithFieldValue<DocumentData>
  );
};

export const uploadFileToStorage = async (
  file: File,
  path: string
): Promise<string> => {
  const storageRef = ref(storage, `${path}/${file.name}`);

  try {
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
        },
        (error) => {
          reject(error);
        },
        async () => {
          const downloadURL = await getDownloadURL(storageRef);
          resolve(downloadURL);
        }
      );
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};

export const deleteFileFromStorage = async (path: string): Promise<void> => {
  const storageRef = ref(storage, path);
  try {
    await deleteObject(storageRef);
  } catch (error) {
    console.error("Error deleting file:", error);
    throw error;
  }
};

type CollectionPath = {
  collection: string;
  document?: string;
  subcollection?: string;
};

export const createStreamListener = <T>(
  path: CollectionPath,
  callback: (data: T[]) => void
) => {
  try {
    let ref: CollectionReference | Query;

    if (path.document && path.subcollection) {
      const docRef = doc(db, path.collection, path.document);
      ref = collection(docRef, path.subcollection);
    } else {
      ref = collection(db, path.collection);
    }

    return onSnapshot(
      ref,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as T[];
        callback(data);
      },
      (error) => {
        console.error("Error in stream listener:", error);
      }
    );
  } catch (error) {
    console.error("Error setting up stream listener:", error);

    return () => {};
  }
};

type QueryFilter = {
  field: string;
  operator: WhereFilterOp;
  value: string | number | boolean | null;
};

type PaginationInfo = {
  lastVisible?: string;
  pageSize: number;
};

type QueryOptions = {
  filters?: QueryFilter[];
  orderByField?: string;
  orderDirection?: OrderByDirection;
  pagination?: PaginationInfo;
};

type QueryResult<T> = {
  data: (T & { id: string })[];
  hasMore: boolean;
  lastVisible: string | null;
};

export const queryDocuments = async <T>(
  collectionName: string,
  options?: QueryOptions
): Promise<QueryResult<T>> => {
  try {
    let queryRef: Query = collection(db, collectionName);

    if (options?.filters) {
      options.filters.forEach((filter) => {
        queryRef = query(
          queryRef,
          where(filter.field, filter.operator, filter.value)
        );
      });
    }

    const orderByField = options?.orderByField || "createdAt";
    queryRef = query(
      queryRef,
      orderBy(orderByField, options?.orderDirection || "desc")
    );

    if (options?.pagination) {
      const { lastVisible, pageSize } = options.pagination;

      if (lastVisible) {
        const lastDoc = await getDoc(doc(db, collectionName, lastVisible));
        if (lastDoc.exists()) {
          queryRef = query(queryRef, startAfter(lastDoc));
        }
      }

      queryRef = query(queryRef, limit(pageSize));
    }

    const querySnapshot = await getDocs(queryRef);
    const documents = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as (T & { id: string })[];

    const hasMore = documents.length === (options?.pagination?.pageSize || 0);
    const lastVisible =
      documents.length > 0 ? documents[documents.length - 1].id : null;

    return {
      data: documents,
      hasMore,
      lastVisible,
    };
  } catch (error) {
    console.error("Error querying documents:", error);
    throw new Error(
      `Failed to query documents from ${collectionName}: ${error}`
    );
  }
};
