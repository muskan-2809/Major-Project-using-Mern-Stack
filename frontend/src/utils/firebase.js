// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import {getAuth, GoogleAuthProvider} from "firebase/auth"
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "loginstudysphere-cd317.firebaseapp.com",
  projectId: "loginstudysphere-cd317",
  storageBucket: "loginstudysphere-cd317.firebasestorage.app",
  messagingSenderId: "194423415435",
  appId: "1:194423415435:web:39d442ead45c3e766aea8e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app)
const provider = new GoogleAuthProvider()

export {auth, provider}
