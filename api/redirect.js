import admin from "firebase-admin";

// Firebase Admin initialization
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: "https://tgf-c655b-default-rtdb.firebaseio.com"
  });
}

const db = admin.database();

export default async function handler(req, res) {
  try {
    const code = req.query.code;
    if (!code) return res.status(400).send("No code provided");

    const urlRef = db.ref('shortUrls/' + code);
    const snapshot = await urlRef.once('value');

    if (!snapshot.exists()) return res.status(404).send("Short URL not found");

    const data = snapshot.val();
    // Increment clicks
    await urlRef.update({ clicks: (data.clicks || 0) + 1 });

    // Redirect
    res.writeHead(302, { Location: data.originalUrl });
    res.end();

  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
}
