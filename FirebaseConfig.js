import * as firebase from 'firebase';
import '@firebase/firestore';

// need to run: npm install --save firebase
// We will use the JS SDK with React Native


// var firebaseConfig = {
//   apiKey: "AIzaSyBcdBht0o5a1viDCmHx-ssA7DUOMgA1jxE",
//   authDomain: "react-native-firebase-6062c.firebaseapp.com",
//   databaseURL: "https://react-native-firebase-6062c.firebaseio.com",
//   projectId: "react-native-firebase-6062c",
//   storageBucket: "react-native-firebase-6062c.appspot.com",
//   messagingSenderId: "587031711318",
//   appId: "1:587031711318:web:cfd156e736d7619371f5f7"
// };

var firebaseConfig = {
  apiKey: "AIzaSyDKsluRlmjO9ugS5utHgG_C07ZBhA7TLGQ",
  authDomain: "fir-test-3bd5b.firebaseapp.com",
  databaseURL: "https://fir-test-3bd5b.firebaseio.com",
  projectId: "fir-test-3bd5b",
  storageBucket: "fir-test-3bd5b.appspot.com",
  messagingSenderId: "907778944698",
  appId: "1:907778944698:web:f744c0a130c5a839ef5c83"
};


let app = firebase.initializeApp(firebaseConfig);

export const db = app.database();
export const firestore = firebase.firestore(app);
export const auth = app.auth();