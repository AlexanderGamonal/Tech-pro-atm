import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey:            "AIzaSyA6vW-G9giLOdkO3VcHEWXFMePcVOylz_k",
    authDomain:        "tech-pro-atm.firebaseapp.com",
    projectId:         "tech-pro-atm",
    storageBucket:     "tech-pro-atm.firebasestorage.app",
    messagingSenderId: "212551931391",
    appId:             "1:212551931391:web:96ef0d9be97aac27da03ca",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
