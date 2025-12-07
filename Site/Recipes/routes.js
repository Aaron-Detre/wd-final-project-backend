import UsersDao from "../Users/dao.js";
export default function RecipesRoutes(app) {
  const usersDao = new UsersDao();

  const getAllUserRecipes = async (req, res) => {
    const { id, title } = req.query;
    let recipes;
    if (id) {
      recipes = await usersDao.getRecipeById(id);
    } else if (title) {
      recipes = await usersDao.getRecipeByTitle(title); //TODO
    } else {
      recipes = await usersDao.getAllRecipes();
    }
    res.json(recipes);
  };
  const getFollowingRecipes = async (req, res) => {
    const { userId } = req.params;
    const user = await usersDao.getUserById(userId);
    const following = user.following;
    const recipes = await usersDao.getFollowingRecipes(following);
    res.json(recipes);
  };

  app.get("/api/recipes", getAllUserRecipes); // Add query params for id/title
  app.get("/api/recipes/following/:userId", getFollowingRecipes);
}
