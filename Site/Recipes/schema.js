import mongoose from "mongoose";
const recipeSchema = new mongoose.Schema(
  {
    _id: String,
    recipeAuthorId: { type: String, required: true },
    recipeTitle: { type: String, required: true },
    datePosted: { type: Date, required: true },
    img: Image,
    instructions: String,
    ingredients: {
      type: [{ ingredient: String, measure: String }],
      required: true,
    },
  },
  { collection: "recipes" }
);
export default userSchema;
