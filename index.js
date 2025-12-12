import "dotenv/config";
import session from "express-session";
import express from "express";
import UserRoutes from "./Site/Users/routes.js";
import cors from "cors";
import mongoose from "mongoose";
import RecipesRoutes from "./Site/Recipes/routes.js";
import ReviewRoutes from "./Site/Reviews/routes.js";

const CONNECTION_STRING =
  process.env.DATABASE_CONNECTION_STRING ||
  "mongodb://172.17.176.1:27017/recipes";
mongoose.connect(CONNECTION_STRING);
const app = express();
app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL || "http://localhost:3000",
  })
);
const sessionOptions = {
  secret: process.env.SESSION_SECRET || "recipes",
  resave: false,
  saveUninitialized: false,
};
if (process.env.SERVER_ENV !== "development") {
  sessionOptions.proxy = true;
  sessionOptions.cookie = {
    sameSite: "none",
    secure: true,
    httpOnly: true,
  };
}
app.use(session(sessionOptions));
app.use(express.json());
UserRoutes(app);
RecipesRoutes(app);
ReviewRoutes(app);
app.listen(process.env.PORT || 4000);
