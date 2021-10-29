import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import 'firebase/storage'

const firebaseConfig = {
    apiKey: "AIzaSyD5tmNAP6zTcxo9wz639KpfipneqABZhDs",
    authDomain: "vue-muso-b3fdd.firebaseapp.com",
    projectId: "vue-muso-b3fdd",
    storageBucket: "vue-muso-b3fdd.appspot.com",
    messagingSenderId: "17369281738",
    appId: "1:17369281738:web:b3ad998e28b40cdc7eb033"
};

// init firebase
firebase.initializeApp(firebaseConfig)

// init services
const projectFirestore = firebase.firestore()
const projectAuth = firebase.auth()

// init storage
const projectStorage = firebase.storage()

// timestamps
const timestamp = firebase.firestore.FieldValue.serverTimestamp

export { projectFirestore, projectAuth, projectStorage, timestamp }