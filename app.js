import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getDatabase, ref, set, get, onValue, update, increment } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCVqss1TjFhMVbGWYOADrTeekKfwqC-94I",
  authDomain: "tgf-c655b.firebaseapp.com",
  databaseURL: "https://tgf-c655b-default-rtdb.firebaseio.com",
  projectId: "tgf-c655b",
  storageBucket: "tgf-c655b.appspot.com",
  messagingSenderId: "328093296287",
  appId: "1:328093296287:web:59b92b698be8ff1919e4aa"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const longUrlInput = document.getElementById("longUrl");
const shortBtn = document.getElementById("shortBtn");
const urlTable = document.getElementById("urlTable");

// Generate random code
function generateCode(length = 6){
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for(let i=0;i<length;i++){
    code += chars.charAt(Math.floor(Math.random()*chars.length));
  }
  return code;
}

// Shorten URL
shortBtn.addEventListener("click", async ()=>{
  const longUrl = longUrlInput.value.trim();
  if(!longUrl) return alert("URL লিখুন!");
  const code = generateCode();

  await set(ref(db, "shortUrls/" + code), {
    originalUrl: longUrl,
    clicks: 0
  });

  longUrlInput.value = "";
  loadUrls();
});

// Load URLs
function loadUrls(){
  urlTable.innerHTML = "";
  const dbRef = ref(db, "shortUrls");
  onValue(dbRef, (snapshot)=>{
    urlTable.innerHTML = "";
    snapshot.forEach(childSnap=>{
      const data = childSnap.val();
      const code = childSnap.key;
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${code}</td>
        <td><a href="/${code}" target="_blank">${window.location.origin}/${code}</a></td>
        <td>${data.clicks}</td>
      `;
      urlTable.appendChild(tr);
    });
  });
}

loadUrls();
