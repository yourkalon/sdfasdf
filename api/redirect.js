import { initializeApp } from "firebase/app";
import { getDatabase, ref, get, update, increment } from "firebase/database";

// Firebase config
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

export default async function handler(req, res) {
  const code = req.query.code;
  if (!code) return res.status(400).send("No code provided");

  const urlRef = ref(db, 'shortUrls/' + code);
  const snapshot = await get(urlRef);

  if (snapshot.exists()) {
    const data = snapshot.val();
    // increment clicks
    update(urlRef, { clicks: increment(1) });
    // redirect
    res.writeHead(302, { Location: data.originalUrl });
    res.end();
  } else {
    res.status(404).send("Short URL not found");
  }
}
