import { db } from "../config/firebase.js";
import cloudinary from "../config/cloudinary.js";
import { Readable } from "stream";

// ─── Helper: upload buffer to Cloudinary ──────────────────────────────────────
const uploadToCloudinary = (buffer, filename) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder:         "verdura/feedback",
        public_id:      filename,
        transformation: [{ width: 800, height: 800, crop: "limit", quality: "auto" }],
      },
      (err, result) => {
        if (err) reject(err);
        else resolve(result);
      }
    );
    Readable.from(buffer).pipe(stream);
  });

// ─── POST /api/feedback ───────────────────────────────────────────────────────
export const submitFeedback = async (req, res) => {
  try {
    const userId = req.user.uid;
    const { orderId, productId, rating, reviewText } = req.body;

    if (!orderId || !reviewText?.trim())
      return res.status(400).json({ message: "orderId and reviewText are required" });

    const ratingNum = parseInt(rating, 10);
    if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5)
      return res.status(400).json({ message: "Rating must be between 1 and 5" });

    // Verify order exists and belongs to this user
    const orderDoc = await db.collection("orders").doc(orderId).get();
    if (!orderDoc.exists)
      return res.status(404).json({ message: "Order not found" });

    const order = orderDoc.data();
    if (order.userId !== userId)
      return res.status(403).json({ message: "Access denied" });

    // Duplicate check — single field query only (no composite index needed)
    const existingSnap = await db.collection("feedback")
      .where("orderId", "==", orderId)
      .limit(10)
      .get();

    const alreadyReviewed = existingSnap.docs.some(
      (doc) => doc.data().userId === userId
    );
    if (alreadyReviewed)
      return res.status(409).json({ message: "You have already submitted feedback for this order" });

    // Optional Cloudinary image upload
    let imageUrl = null;
    if (req.file) {
      try {
        const filename = `feedback_${userId}_${Date.now()}`;
        const result   = await uploadToCloudinary(req.file.buffer, filename);
        imageUrl       = result.secure_url;
      } catch (uploadErr) {
        console.error("Cloudinary upload failed (skipping):", uploadErr.message);
      }
    }

    // Get user display name
    let userName = order.name || "Anonymous";
    try {
      const userDoc = await db.collection("users").doc(userId).get();
      if (userDoc.exists) userName = userDoc.data().name || userName;
    } catch (_) {}

    const feedbackRef = await db.collection("feedback").add({
      userId,
      orderId,
      productId:  productId || null,
      userName,
      rating:     ratingNum,
      reviewText: reviewText.trim(),
      imageUrl,
      approved:   false,
      createdAt:  new Date(),
    });

    return res.status(201).json({
      message:    "Feedback submitted successfully. It will appear after review.",
      feedbackId: feedbackRef.id,
    });

  } catch (err) {
    console.error("Submit feedback error:", err);
    return res.status(500).json({ message: err.message || "Failed to submit feedback" });
  }
};

// ─── GET /api/feedback/testimonials (public) ─────────────────────────────────
// Single-field query only — no composite index needed. Sort in JS.
export const getTestimonials = async (req, res) => {
  try {
    const snap = await db.collection("feedback")
      .where("approved", "==", true)
      .limit(30)
      .get();

    const testimonials = snap.docs
      .map((doc) => {
        const d = doc.data();
        return {
          id:         doc.id,
          userName:   d.userName,
          rating:     d.rating,
          reviewText: d.reviewText,
          imageUrl:   d.imageUrl || null,
          createdAt:  d.createdAt?.toDate?.() || null,
        };
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 20);

    return res.json(testimonials);
  } catch (err) {
    console.error("Get testimonials error:", err);
    return res.status(500).json({ message: err.message || "Failed to fetch testimonials" });
  }
};

// ─── GET /api/feedback/my ─────────────────────────────────────────────────────
export const getMyFeedback = async (req, res) => {
  try {
    const snap = await db.collection("feedback")
      .where("userId", "==", req.user.uid)
      .get();

    const feedback = snap.docs
      .map((doc) => ({ id: doc.id, ...doc.data(), createdAt: doc.data().createdAt?.toDate?.() || null }))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return res.json(feedback);
  } catch (err) {
    console.error("Get my feedback error:", err);
    return res.status(500).json({ message: err.message || "Failed to fetch feedback" });
  }
};

// ─── GET /api/feedback/all (admin) ───────────────────────────────────────────
export const getAllFeedback = async (req, res) => {
  try {
    const snap = await db.collection("feedback").get();

    const feedback = snap.docs
      .map((doc) => ({ id: doc.id, ...doc.data(), createdAt: doc.data().createdAt?.toDate?.() || null }))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return res.json(feedback);
  } catch (err) {
    console.error("Get all feedback error:", err);
    return res.status(500).json({ message: err.message || "Failed to fetch feedback" });
  }
};

// ─── PATCH /api/feedback/:id/approve (admin) ─────────────────────────────────
export const approveFeedback = async (req, res) => {
  try {
    const feedbackDoc = await db.collection("feedback").doc(req.params.id).get();
    if (!feedbackDoc.exists)
      return res.status(404).json({ message: "Feedback not found" });

    await db.collection("feedback").doc(req.params.id).update({ approved: true, approvedAt: new Date() });
    return res.json({ message: "Feedback approved and will now appear in testimonials" });
  } catch (err) {
    console.error("Approve feedback error:", err);
    return res.status(500).json({ message: err.message || "Failed to approve feedback" });
  }
};

// ─── DELETE /api/feedback/:id (admin) ────────────────────────────────────────
export const deleteFeedback = async (req, res) => {
  try {
    const feedbackDoc = await db.collection("feedback").doc(req.params.id).get();
    if (!feedbackDoc.exists)
      return res.status(404).json({ message: "Feedback not found" });

    const data = feedbackDoc.data();
    if (data.imageUrl) {
      try {
        const parts    = data.imageUrl.split("/upload/")[1] || "";
        const publicId = parts.replace(/\.[^/.]+$/, "");
        await cloudinary.uploader.destroy(publicId);
      } catch (_) {}
    }

    await db.collection("feedback").doc(req.params.id).delete();
    return res.json({ message: "Feedback deleted" });
  } catch (err) {
    console.error("Delete feedback error:", err);
    return res.status(500).json({ message: err.message || "Failed to delete feedback" });
  }
};

export const updateFeedback = async (req, res) => {
  try {
    const userId = req.user.uid;
    const { rating, reviewText } = req.body;

    const feedbackRef = db.collection("feedback").doc(req.params.id);
    const doc = await feedbackRef.get();

    if (!doc.exists)
      return res.status(404).json({ message: "Feedback not found" });

    const data = doc.data();

    if (data.userId !== userId)
      return res.status(403).json({ message: "Unauthorized" });

    let imageUrl = data.imageUrl || null;

    // upload new image if provided
    if (req.file) {
      try {
        const filename = `feedback_${userId}_${Date.now()}`;
        const result = await uploadToCloudinary(req.file.buffer, filename);
        imageUrl = result.secure_url;
      } catch (err) {
        console.error("Image update failed:", err.message);
      }
    }

await feedbackRef.update({
  rating: rating ? parseInt(rating) : data.rating,
  reviewText: reviewText?.trim() || data.reviewText,
  imageUrl,
  approved: false,
  updatedAt: new Date(),
});
    res.json({ message: "Feedback updated" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};