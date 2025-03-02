// Import the functions you need from the SDKs you need
import { initializeApp,getApp,getApps } from "firebase/app";
import {getFirestore} from "firebase/firestore"
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyC7qRocsEJas89XZMO7F7u5NkBQDEwhvdQ",
    authDomain: "pdf-search-app.firebaseapp.com",
    projectId: "pdf-search-app",
    storageBucket: "pdf-search-app.firebasestorage.app",
    messagingSenderId: "597987538579",
    appId: "1:597987538579:web:bc1f5368833b323a9b7f66"
  };

// Initialize Firebase
const app =getApps().length===0 ? initializeApp(firebaseConfig) : getApp();

const db=getFirestore(app);
const storage=getStorage(app);


export  {db,storage};