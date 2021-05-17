import firebase from 'firebase/app';
import "firebase/auth";
import "firebase/database";
import "firebase/storage";

var firebaseConfig = {
    apiKey: "AIzaSyD5PVxz5XS8VRa8AhTEyzYTH6vJrU88ltQ",
    authDomain: "react-slack-clone-a848b.firebaseapp.com",
    projectId: "react-slack-clone-a848b",
    storageBucket: "react-slack-clone-a848b.appspot.com",
    messagingSenderId: "311168451388",
    appId: "1:311168451388:web:490d821092f419d7db1439",
    measurementId: "G-ZQ9KVSP1ZZ",
    databaseURL: 'https://react-slack-clone-a848b-default-rtdb.firebaseio.com/'
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase;

