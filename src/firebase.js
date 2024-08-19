import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDSvvOsIRQW40NBpdaISZVmL5hUc8chROk",
  authDomain: "babytinder-ea8d5.firebaseapp.com",
  projectId: "babytinder-ea8d5",
  storageBucket: "babytinder-ea8d5.appspot.com",
  messagingSenderId: "883205820136",
  appId: "1:883205820136:web:d502ec746c173cea0e035d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

export { db };
