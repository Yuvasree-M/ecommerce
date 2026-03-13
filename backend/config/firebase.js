// import admin from "firebase-admin";

// const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });

// export const db = admin.firestore();
// export const auth = admin.auth();

import { readFileSync } from "fs";
import admin from "firebase-admin";

// const serviceAccount = JSON.parse(readFileSync("./serviceAccountKey.json", "utf8"));
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export const db = admin.firestore();
export const auth = admin.auth();
