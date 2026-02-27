import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyBSj4YA1sfDwLfgYA-RxEMKJfQP1nVqLi4',
  authDomain: 'tikoy-pass-around.firebaseapp.com',
  projectId: 'tikoy-pass-around',
  storageBucket: 'tikoy-pass-around.firebasestorage.app',
  messagingSenderId: '419582472336',
  appId: '1:419582472336:web:092405e4185d02a98d2815',
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const firestore = getFirestore(app);

export { firestore };
export default app;
