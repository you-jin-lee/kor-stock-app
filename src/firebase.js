import firebase from "firebase/app";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = firebase.initializeApp({
  apiKey: "AIzaSyDO9in_TNXf5g84EM6jS1pYATiaZvezQ08",
  authDomain: "kor-stock-app.firebaseapp.com",
  databaseURL: "https://kor-stock-app.firebaseio.com",
  projectId: "kor-stock-app",
  storageBucket: "kor-stock-app.appspot.com",
  messagingSenderId: "991710397554",
  appId: "1:991710397554:web:378c59be0a158d2dff6eeb",
  measurementId: "G-NKHYF5BMGG",
});

const db = firebaseConfig.firestore();

export default db;
