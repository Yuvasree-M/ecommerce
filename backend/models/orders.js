import { db } from "../config/firebase.js";

const orderCollection = db.collection("orders");

export default orderCollection;