
import { initializeApp,getApp,getApps } from "firebase/app";
import {getFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAdz7Xrw8jf8MpNrmDOzbAxBAHtjaf_ZxY",
  authDomain: "nike-1544d.firebaseapp.com",
  projectId: "nike-1544d",
  storageBucket: "nike-1544d.appspot.com",
  messagingSenderId: "650343425687",
  appId: "1:650343425687:web:9f115eeda506cc6746ebd2"
};

const app=getApps().length === 0 ? initializeApp(firebaseConfig):getApp()
const db =getFirestore(app)

export {db}
