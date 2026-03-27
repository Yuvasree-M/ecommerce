import express from "express";
import multer  from "multer";
import {
  submitFeedback,
  getTestimonials,
  getMyFeedback,
  approveFeedback,
  deleteFeedback,
  getAllFeedback,
  updateFeedback,
} from "../controllers/Feedbackcontroller.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { attachUser  } from "../middleware/attachUser.js";
import { checkAdmin  } from "../middleware/roleMiddleware.js";

const router = express.Router();

// multer — store in memory for Cloudinary upload (max 5 MB)
const upload = multer({
  storage: multer.memoryStorage(),
  limits:  { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Only image files are allowed"), false);
  },
});

// ── Public ─────────────────────────────────────────────────────────────────────
router.get("/testimonials", getTestimonials);

// ── Authenticated user routes ──────────────────────────────────────────────────
router.use(verifyToken, attachUser);

router.post("/", upload.single("image"), submitFeedback);
router.get("/my",                        getMyFeedback);
router.patch("/:id", upload.single("image"), updateFeedback);
// ── Admin routes ───────────────────────────────────────────────────────────────
router.get(    "/all",         checkAdmin, getAllFeedback);
router.patch(  "/:id/approve", checkAdmin, approveFeedback);
router.delete( "/:id",         checkAdmin, deleteFeedback);

export default router;