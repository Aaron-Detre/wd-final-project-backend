import mongoose from "mongoose";
const recipeSchema = new mongoose.Schema(
  {
    _id: String,
    recipeTitle: { type: String, required: true },
    datePosted: { type: Date, required: true },
    img: String,
    instructions: [String],
    ingredients: {
      type: [{ ingredient: String, measure: String }],
      required: true,
    },
  },
  { collection: "recipes" }
);
export default recipeSchema;
