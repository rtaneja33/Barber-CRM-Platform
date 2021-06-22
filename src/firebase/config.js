import * as firebase from 'firebase';
import '@firebase/auth';
import '@firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCJcIa7mSIe1KrqgY5-UVH_q2FVtfksUKM",
    authDomain: "cliply-b6cae.firebaseapp.com",
    projectId: "cliply-b6cae",
    storageBucket: "cliply-b6cae.appspot.com",
    messagingSenderId: "157663474262",
    appId: "1:157663474262:web:36ce89d3c148db3fb741f7",
    measurementId: "G-PL5JY4L7SX"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export { firebase, firebaseConfig };
