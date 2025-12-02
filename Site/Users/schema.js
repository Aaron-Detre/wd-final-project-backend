import mongoose from "mongoose";
import reviewSchema from "../Reviews/schema.js";
const userSchema = new mongoose.Schema(
  {
    _id: String,
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["AUTHOR", "REVIEWER", "BOTH"],
      default: "BOTH",
    },
    following: [String],
    reviews: [reviewSchema],
  },
  { collection: "users" }
);
export default userSchema;
