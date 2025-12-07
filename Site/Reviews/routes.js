import UsersDao from "../Users/dao.js";
export default function ReviewRoutes(app) {
  const usersDao = new UsersDao();

  const getAllReviews = async (req, res) => {
    const reviews = await usersDao.getAllReviews();
    res.json(reviews);
  };
  //TODO: duplication
  const getAllReviewsForApiRecipe = async (req, res) => {
    const { recipeId } = req.params;
    const reviews = await usersDao.getAllReviewsForApiRecipe(recipeId);
    res.json(reviews);
  };
  const getAllReviewsForLocalRecipe = async (req, res) => {
    const { recipeId } = req.params;
    const reviews = await usersDao.getAllReviewsForLocalRecipe(recipeId);
    console.log(JSON.stringify(reviews));
    res.json(reviews);
  };
  const getFollowingReviews = async (req, res) => {
    const { userId } = req.params;
    const user = await usersDao.getUserById(userId);
    const following = user.following;
    const reviews = await usersDao.getFollowingReviews(following);
    res.json(reviews);
  };
  const getReviewById = async (req, res) => {
    const { reviewId } = req.params;
    const review = await usersDao.getReviewById(reviewId);
    res.json(review);
  };

  app.get("/api/reviews", getAllReviews);
  app.get("/api/reviews/api/:recipeId", getAllReviewsForApiRecipe);
  app.get("/api/reviews/local/:recipeId", getAllReviewsForLocalRecipe);
  app.get("/api/reviews/following/:userId", getFollowingReviews);
  app.get("/api/reviews/:reviewId", getReviewById);
}
