import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDVZ_yr5otQ_uzKUocd9vvEvb-uJn1eE0g",
  authDomain: "neurozsis.firebaseapp.com",
  projectId: "neurozsis",
  storageBucket: "cendekia-fk-unp.firebasestorage.app",
  messagingSenderId: "5216400358",
  appId: "1:5216400358:web:b55de85806ea931cc91c27"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
