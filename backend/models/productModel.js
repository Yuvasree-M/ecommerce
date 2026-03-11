import { db } from "../config/firebase.js";

const productCollection = db.collection("products");

export default productCollection;