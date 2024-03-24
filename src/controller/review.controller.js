import { Review } from "../models/review.model.js";
import { ApiError, ApiSuccess } from "../util/ApiResponse.js";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../util/asyncHandler.js";

// adding reviews
export const createReview = async (req, res) => {
  try {
    // taking data from body
    const { doctorId, patientId, rating, comment } = req.body;

    // check entered all the fields are not
    if (!doctorId || !patientId || !rating || !comment) {
      return ApiError(res, 400, "All the fields are required!!");
    }

    // Check if a review already exists for the given patient and doctor IDs
    const existingReview = await Review.findOne({ patientId, doctorId });
    if (existingReview) {
      return ApiError(
        res,
        400,
        "Review already exists. If you want you can update your previous review"
      );
    }

    // check patient and doctor with entered ID exits or not
    const existingPatient = await User.findById(patientId);
    if (!existingPatient) {
      return ApiError(res, 400, "Patient not found!");
    }
    const existingDoctor = await User.findById(doctorId);
    if (!existingDoctor) {
      return ApiError(res, 400, "Doctor not found!");
    }

    // create object to store in db
    const review = await Review.create({
      patientId,
      doctorId,
      rating,
      comment,
    });

    return ApiSuccess(res, 200, {
      message: "Thank you for your feedback!",
      data: review,
    });
  } catch (error) {
    console.error("Error: ", error.message);
    return ApiError(res, 500, "Feedback not Submitted");
  }
};

// deleting review
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return ApiError(res, 404, "Review Not Found!");
    }

    await Review.findByIdAndDelete(review._id);
    return ApiSuccess(res, 200, {
      message: "Review removed successfully",
    });
  } catch (error) {
    return ApiError(res, 500, error.message);
  }
};

// updating existing reviews
export const updateReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    const updatedFields = {};
    if (rating !== undefined) updatedFields.rating = rating;
    if (comment !== undefined) updatedFields.comment = comment;

    const review = await Review.findByIdAndUpdate(
      req.params.id,
      updatedFields,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!review) {
      return ApiError(res, 404, "Review not found");
    }

    res.send("Review Updated Successfully");
    return ApiSuccess(res, 200, review);
  } catch (error) {
    return ApiError(res, 500, error.message);
  }
};

// searching reviews
export const searchReview = async (req, res) => {
  try {
    // search criteria depending on request parameters
    const { patientId, doctorId, rating } = req.query;
    const searchCriteria = {};

    if (patientId) searchCriteria.patientId = patientId;
    if (doctorId) searchCriteria.doctorId = doctorId;
    if (rating) searchCriteria.rating = rating;

    const review = await Review.find(searchCriteria);

    // no matching with search
    if (review.length == 0)
      return ApiError(res, 404, "No reviews found matching search");

    // search found
    return ApiSuccess(res, 200, review);
  } catch (error) {
    return ApiError(res, 500, error.message);
  }
};

export const getAllReviewsOfDoctor = asyncHandler(async (req, res) => {
  const doctorId = req.params.id;

  if (!doctorId) {
    return ApiError(res, 400, "Mssing doctor id params");
  }

  const reviews = await Review.find({ doctorId: doctorId });

  return ApiSuccess(res, 200, {
    data: reviews,
  });
});
