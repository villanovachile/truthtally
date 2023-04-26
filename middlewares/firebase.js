import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyA5Qq5H_KnrZJseTVBhT4pIyMB9Q3OvMww',
  authDomain: 'truth-tally-46692.firebaseapp.com',
  projectId: 'truth-tally-46692',
  storageBucket: 'truth-tally-46692.appspot.com',
  messagingSenderId: '764822122063',
  appId: '1:764822122063:web:ab8ff242294e15a029843a',
  measurementId: 'G-YMML36KM3B'
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();

export { firebase, auth };
