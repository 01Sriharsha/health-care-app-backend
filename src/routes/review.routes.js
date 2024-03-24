import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {
  createReview,
  deleteReview,
  updateReview,
  searchReview,
  getAllReviewsOfDoctor,
} from "../controller/review.controller.js";

const router = Router();

router.route("/add").post(verifyJWT, createReview);
router.route("/delete/:id").delete(verifyJWT, deleteReview);
router.route("/update/:id").put(verifyJWT, updateReview);
router.route("/search").get(searchReview);
router.route("/getDoctorReviews/:id").get(getAllReviewsOfDoctor);

export const reviewRouter = router;
