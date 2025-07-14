import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD2Gtl-4di2gK-OejLLoIhDjOu7yjrstoo",
  authDomain: "unihealth-9fc00.firebaseapp.com",
  databaseURL: "https://unihealth-9fc00-default-rtdb.firebaseio.com/",
  projectId: "unihealth-9fc00",
  storageBucket: "unihealth-9fc00.firebasestorage.app",
  messagingSenderId: "819007548137",
  appId: "1:819007548137:web:587a7b7a3728f42f459e78"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const database = getDatabase(app);
export const auth = getAuth(app);

export default app;