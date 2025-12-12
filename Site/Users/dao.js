import model from "./model.js";
import { v4 as uuidv4 } from "uuid";

export default function UsersDao() {
  const createUser = (user) => {
    const newUser = { ...user, _id: uuidv4() };
    return model.create(newUser);
  };
  const getAllUsers = () => model.find();
  const getUserById = (userId) => model.findById(userId);
  const getUserByUsername = (username) => model.findOne({ username: username });
  const getUserByCredentials = (username, password) =>
    model.findOne({ username, password });
  const updateUser = (userId, user) =>
    model.updateOne({ _id: userId }, { $set: user });
  const deleteUser = (userId) => model.deleteOne({ _id: userId });
  const getUsersByPartialName = (partialName) => {
    const regex = new RegExp(partialName, "i"); // 'i' makes it case-insensitive
    return model.find({ username: { $regex: regex } }, { _id: 1, username: 1 });
  };
  const getUsersByRole = (role) => model.find({ role: role });

  const getUserFollowing = async (userId) => {
    const user = await getUserById(userId);
    const followingUsers = await Promise.all(
      user.following.map((followingId) => model.findById(followingId))
    );
    return followingUsers;
  };
  const getUserFollowers = async (userId) => {
    const allUsers = await getAllUsers();
    return allUsers.filter((user) => user.following.includes(userId));
  };
  const getUserAuthoredRecipes = async (userId) => {
    const user = await getUserById(userId);
    return user.authored;
  };
  const getUserReviewedRecipes = async (userId) => {
    const user = await getUserById(userId);
    return user.reviews;
  };

  const getAllReviewsForApiRecipe = async (recipeId) => {
    const usersWithReviews = await model.find({}, { reviews: 1, username: 1 });
    const allReviewsPerUser = usersWithReviews.map((user) => {
      return {
        ...{ reviews: user.reviews },
        reviewAuthor: { _id: user._id, username: user.username },
      };
    });
    let allReviews = [];
    allReviewsPerUser.forEach((reviewsPerUser) => {
      if (reviewsPerUser.reviews.length > 0) {
        reviewsPerUser.reviews.forEach((review) => {
          if (review.apiRecipeId === recipeId) {
            allReviews.push({
              ...review._doc,
              reviewAuthor: reviewsPerUser.reviewAuthor,
            });
          }
        });
      }
    });
    return allReviews;
  };
  const getAllReviewsForLocalRecipe = async (recipeId) => {
    const usersWithReviews = await model.find({}, { reviews: 1, username: 1 });
    const allReviews = usersWithReviews
      .map((user) =>
        user.reviews.map((review) => {
          return {
            ...review._doc,
            reviewAuthor: { _id: user._id, username: user.username },
          };
        })
      )
      .reduce((acc, cur) => (acc = acc.concat(cur)), []);
    return allReviews.filter((review) => review.localRecipeId === recipeId);
  };

  //TODO: big duplication
  const addUserReviewsToArray = (reviewArray, userWithReviews) => {
    (userWithReviews.reviews ?? []).forEach((review) =>
      reviewArray.push({
        ...review._doc,
        reviewAuthor: {
          _id: userWithReviews._id,
          username: userWithReviews.username,
        },
      })
    );
  };
  const getAllReviews = async () => {
    const usersWithReviews = await model.find({}, { reviews: 1, username: 1 });
    const allReviews = [];
    usersWithReviews.forEach((userWithReviews) =>
      addUserReviewsToArray(allReviews, userWithReviews)
    );
    return allReviews;
  };
  const getFollowingReviews = async (following) => {
    const usersWithReviews = await model.find(
      {},
      { _id: 1, username: 1, reviews: 1 }
    );
    const allReviews = [];
    usersWithReviews.forEach(
      (userWithReviews) =>
        following.includes(userWithReviews._id) &&
        addUserReviewsToArray(allReviews, userWithReviews)
    );
    return allReviews;
  };

  const addUserRecipesToArray = (recipeArray, userWithRecipes) => {
    (userWithRecipes.authored ?? []).forEach((recipe) =>
      recipeArray.push({
        ...recipe._doc,
        recipeAuthor: {
          _id: userWithRecipes._id,
          username: userWithRecipes.username,
        },
      })
    );
  };
  const getAllRecipes = async () => {
    const usersWithRecipes = await model.find({}, { authored: 1, username: 1 });
    const allRecipes = [];
    usersWithRecipes.forEach((userWithRecipes) =>
      addUserRecipesToArray(allRecipes, userWithRecipes)
    );
    return allRecipes;
  };

  const getFollowingRecipes = async (following) => {
    const usersWithRecipes = await model.find(
      {},
      { _id: 1, username: 1, authored: 1 }
    );
    const allRecipes = [];
    usersWithRecipes.forEach(
      (userWithRecipes) =>
        following.includes(userWithRecipes._id) &&
        addUserRecipesToArray(allRecipes, userWithRecipes)
    );
    return allRecipes;
  };
  const getRecipeById = async (recipeId) => {
    const userWithTargetRecipe = await model.findOne(
      { authored: { $elemMatch: { _id: recipeId } } },
      { "authored.$": 1, _id: 1, username: 1 }
    );
    const recipe = userWithTargetRecipe.authored.at(0);
    return {
      ...recipe._doc,
      recipeAuthor: {
        _id: userWithTargetRecipe._id,
        username: userWithTargetRecipe.username,
      },
    };
  };
  const getRecipesByTitle = async (title) => {
    const recipes = await getAllRecipes();
    const recipesMatchingTitle = recipes.filter((recipe) =>
      recipe.recipeTitle.toLowerCase().includes(title.toLowerCase())
    );
    return recipesMatchingTitle;
  };

  const getReviewById = async (reviewId) => {
    const userWithTargetReview = await model.findOne(
      {
        reviews: { $elemMatch: { _id: reviewId } },
      },
      { "reviews.$": 1, _id: 1, username: 1 }
    );
    const review = userWithTargetReview.reviews.at(0);
    return {
      ...review._doc,
      reviewAuthor: {
        _id: userWithTargetReview._id,
        username: userWithTargetReview.username,
      },
    };
  };
  const follow = async (following, followee) => {
    const followingUser = await model.findById(following);
    followingUser.following.push(followee);
    return model.updateOne(
      { _id: following },
      { $set: { following: followingUser.following } }
    );
  };
  const unfollow = async (unfollowing, unfollowee) => {
    const unfollowingUser = await model.findById(unfollowing);
    const updatedFollowing = unfollowingUser.following.filter(
      (userId) => userId !== unfollowee
    );
    return model.updateOne(
      { _id: unfollowing },
      { $set: { following: updatedFollowing } }
    );
  };
  const createRecipe = async (recipe) => {
    const userId = recipe.recipeAuthor._id;
    const user = await model.findById(userId);
    const recipes = user.authored ?? [];
    recipes.push(recipe);
    return model.updateOne({ _id: userId }, { $set: { authored: recipes } });
  };
  const createReview = async (review) => {
    const userId = review.reviewAuthor._id;
    const user = await model.findById(userId);
    const reviews = user.reviews ?? [];
    reviews.push(review);
    return model.updateOne({ _id: userId }, { $set: { reviews: reviews } });
  };

  return {
    // C
    createUser,

    // R
    getAllUsers,
    getUserById,
    getUserByUsername,
    getUserByCredentials,
    getUsersByRole,
    getUsersByPartialName,
    getUserFollowing,
    getUserFollowers,
    getUserAuthoredRecipes,
    getUserReviewedRecipes,
    getAllReviewsForApiRecipe,
    getAllReviewsForLocalRecipe,
    getAllReviews,
    getAllRecipes,
    getFollowingReviews,
    getFollowingRecipes,
    getRecipeById,
    getRecipesByTitle,
    getReviewById,

    // U
    updateUser,
    follow,
    unfollow,
    createRecipe,
    createReview,

    // D
    deleteUser,
  };
}
