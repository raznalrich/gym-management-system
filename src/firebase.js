// Import the functions you need from the SDKs you need
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyARE6_6Z-vhD82-o3bXu898GxuK4oPYEtA",
  authDomain: "gym-management-system-7182a.firebaseapp.com",
  projectId: "gym-management-system-7182a",
  storageBucket: "gym-management-system-7182a.appspot.com",
  messagingSenderId: "1023436622208",
  appId: "1:1023436622208:web:00b03832c627ac05655965",
  measurementId: "G-YECGZN1LG4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const db = getFirestore(app);

export const storage = getStorage(app);