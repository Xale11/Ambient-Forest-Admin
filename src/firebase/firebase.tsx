// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAO-ALlElkDNLLZhK-NY19nzQeZxWWoRws",
  authDomain: "ambientforest-7d39d.firebaseapp.com",
  projectId: "ambientforest-7d39d",
  storageBucket: "ambientforest-7d39d.appspot.com",
  messagingSenderId: "506170494831",
  appId: "1:506170494831:web:6cefc72663c3d94ee2a29a",
  measurementId: "G-JQ4X94YS4M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)