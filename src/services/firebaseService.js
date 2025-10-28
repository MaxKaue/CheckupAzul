import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics"; <--- REMOVIDO

// Configuração do seu Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDQEUg2ohD-wSfpF1rAhQc0ipKWWOtMFVM",
    authDomain: "saudehomemmvpnasssau.firebaseapp.com",
    projectId: "saudehomemmvpnasssau",
    storageBucket: "saudehomemmvpnasssau.firebasestorage.app",
    messagingSenderId: "952537486987",
    appId: "1:952537486987:web:accc6af0f05e3ac413e68e",
    measurementId: "G-QP2N20XTXD"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app); <--- REMOVIDO

// Inicializa Auth e Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);