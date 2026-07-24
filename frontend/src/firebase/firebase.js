// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
// import { getAnalytics } from 'firebase/analytics';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyABczXJyvDSDpvqEhfbijbqL5asJ_OjYu0',
  authDomain: 'verifyhire-96ca5.firebaseapp.com',
  projectId: 'verifyhire-96ca5',
  storageBucket: 'verifyhire-96ca5.firebasestorage.app',
  messagingSenderId: '1043743394703',
  appId: '1:1043743394703:web:8c60fb4eebe659729599fa',
  measurementId: 'G-8R33VK9FYC',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export const auth = getAuth(app);

export const googleProvider = new GoogleAuthProvider();
// Always show the account chooser instead of auto-selecting the last used account.
googleProvider.setCustomParameters({ prompt: 'select_account' });

export default app;
