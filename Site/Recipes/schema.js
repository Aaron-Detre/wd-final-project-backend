import mongoose from "mongoose";
const recipeSchema = new mongoose.Schema(
  {
    _id: String,
    recipeTitle: { type: String, required: true },
    datePosted: { type: Date, required: true },
    img: String,
    instructions: [String],
    ingredients: [{ ingredient: String, measure: String }],
    scalableIngredients: [{ ingredient: String, amount: Number, unit: String }],
    scalable: Boolean,
  },
  { collection: "recipes" }
);
export default recipeSchema;
