// Import các chức năng cần dùng
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

// Cấu hình Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAUg35zEAS2M53ZdXpgCAkIbD952aaQR6s",
  authDomain: "thuchanhdnt.firebaseapp.com",
  projectId: "thuchanhdnt",
  storageBucket: "thuchanhdnt.appspot.com",
  messagingSenderId: "476026534176",
  appId: "1:476026534176:web:f05a9911abaa2dd0bfff45",
  databaseURL: "https://thuchanhdnt-default-rtdb.firebaseio.com"
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);

// Khởi tạo Auth, Database và Storage
export const auth = getAuth(app);
export const db = getDatabase(app);
export const storage = getStorage(app);
