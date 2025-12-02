import mongoose from "mongoose";
const reviewSchema = new mongoose.Schema(
  {
    _id: String,
    reviewTitle: { type: String, required: true },
    stars: { type: Number, enum: [1, 2, 3, 4, 5], required: true },
    text: String,
    datePosted: { type: Date, required: true },
    localRecipeId: String,
    apiRecipeId: String,
  },
  { collection: "reviews" }
);

//TODO: TEST THAT THIS VALIDATION ACTUALLY WORKS

// Based off this -> https://stackoverflow.com/questions/71128914/how-to-make-sure-that-only-one-of-two-fields-are-populated-in-mongodb
reviewSchema.pre("validate", function (next) {
  if (
    (this.localRecipeId && this.apiRecipeId) ||
    (!this.localRecipeId && !this.apiRecipeId)
  ) {
    return next(
      new Error(
        "Exactly one of 'localRecipeId' and 'apiRecipeId' should be populated"
      )
    );
  } else {
    next();
  }
});

export default reviewSchema;
