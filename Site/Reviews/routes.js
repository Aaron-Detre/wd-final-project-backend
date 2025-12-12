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
    res.json(reviews);
  };
  const getFollowingReviews = async (req, res) => {
    const { userId } = req.params;
    const user = await usersDao.getUserById(userId);
    const following = user.following;
    following.push(userId);
    const reviews = await usersDao.getFollowingReviews(following);
    res.json(reviews);
  };
  const getReviewById = async (req, res) => {
    const { reviewId } = req.params;
    const review = await usersDao.getReviewById(reviewId);
    res.json(review);
  };
  const createReview = async (req, res) => {
    const review = req.body;
    const status = await usersDao.createReview(review);
    res.json(status);
  };
  const deleteReview = async (req, res) => {
    const { reviewId } = req.params;
    const status = await usersDao.deleteReview(reviewId);
    res.json(status);
  };

  app.get("/api/reviews", getAllReviews);
  app.get("/api/reviews/api/:recipeId", getAllReviewsForApiRecipe);
  app.get("/api/reviews/local/:recipeId", getAllReviewsForLocalRecipe);
  app.get("/api/reviews/following/:userId", getFollowingReviews);
  app.get("/api/reviews/:reviewId", getReviewById);

  // Using put instead of create/delete because reviews are stored within users
  app.put("/api/reviews/create", createReview); // Put review in req.body
  app.put("/api/reviews/delete/:reviewId", deleteReview);
}
