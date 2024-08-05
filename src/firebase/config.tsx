import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {getFirestore} from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyAwj1gcgwqOxjI3LRWwEmT0LqCEGobRjHM",
  authDomain: "miniblog-cd89a.firebaseapp.com",
  projectId: "miniblog-cd89a",
  storageBucket: "miniblog-cd89a.appspot.com",
  messagingSenderId: "799691782264",
  appId: "1:799691782264:web:4eff4009e2b5fe6ce7958d"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app)

const db = getFirestore(app)

export {auth, db}