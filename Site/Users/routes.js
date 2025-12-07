import UsersDao from "./dao.js";
export default function UserRoutes(app) {
  const usersDao = UsersDao();

  const createUser = async (req, res) => {
    const user = await usersDao.createUser(req.body);
    res.json(user);
  };
  const deleteUser = async (req, res) => {
    const status = await usersDao.deleteUser(req.params.userId);
    res.json(status);
  };
  const getAllUsers = async (req, res) => {
    const { role, name } = req.query;
    let users;
    if (role) {
      users = await usersDao.getUsersByRole(role);
    } else if (name) {
      users = await usersDao.getUsersByPartialName(name);
    } else {
      users = await usersDao.getAllUsers();
    }
    res.json(users);
  };

  const getUserById = async (req, res) => {
    const user = await usersDao.getUserById(req.params.userId);
    res.json(user);
  };
  const updateUser = async (req, res) => {
    const userId = req.params.userId;
    const userUpdates = req.body;
    await usersDao.updateUser(userId, userUpdates);
    const currentUser = req.session["currentUser"];
    if (currentUser && currentUser._id === userId) {
      req.session["currentUser"] = { ...currentUser, ...userUpdates };
    }
    res.json(currentUser);
  };
  const signUp = async (req, res) => {
    const user = await usersDao.getUserByUsername(req.body.username);
    if (user) {
      res.status(400).json({ message: "Username already in use" });
      return;
    }
    const currentUser = await usersDao.createUser(req.body);
    req.session["currentUser"] = currentUser;
    res.json(currentUser);
  };
  const signIn = async (req, res) => {
    const { username, password } = req.body;
    const currentUser = await usersDao.getUserByCredentials(username, password);
    if (currentUser) {
      req.session["currentUser"] = currentUser;
      res.json(currentUser);
    } else {
      res.status(401).json({ message: "Unable to login. Try again later." });
    }
  };
  const signOut = (req, res) => {
    req.session.destroy();
    res.sendStatus(200);
  };
  const profile = (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
    res.json(currentUser);
  };
  const getUserFollowing = async (req, res) => {
    const { userId } = req.params;
    const following = await usersDao.getUserFollowing(userId);
    res.json(following);
  };
  const getUserFollowers = async (req, res) => {
    const { userId } = req.params;
    const followers = await usersDao.getUserFollowers(userId);
    res.json(followers);
  };
  const getUserAuthoredRecipes = async (req, res) => {
    const { userId } = req.params;
    const authored = await usersDao.getUserAuthoredRecipes(userId);
    res.json(authored);
  };
  const getUserReviewedRecipes = async (req, res) => {
    const { userId } = req.params;
    const reviewed = await usersDao.getUserReviewedRecipes(userId);
    res.json(reviewed);
  };
  const follow = async (req, res) => {
    console.log("HERE");
    const { following, followee } = req.params;
    const status = await usersDao.follow(following, followee);
    res.json(status);
  };
  const unfollow = async (req, res) => {
    console.log("HERE1");
    const { unfollowing, unfollowee } = req.params;
    const status = await usersDao.unfollow(unfollowing, unfollowee);
    console.log("STATUS: " + JSON.stringify(status));
    res.json(status);
  };

  // C
  app.post("/api/users", createUser);
  app.post("/api/users/profile", profile);
  app.post("/api/users/signIn", signIn);
  app.post("/api/users/signUp", signUp);
  app.post("/api/users/signOut", signOut);

  // R
  app.get("/api/users", getAllUsers); // Add query params for role and name
  app.get("/api/users/following/:userId", getUserFollowing);
  app.get("/api/users/followers/:userId", getUserFollowers);
  app.get("/api/users/authored/:userId", getUserAuthoredRecipes);
  app.get("/api/users/reviewed/:userId", getUserReviewedRecipes);
  app.get("/api/users/:userId", getUserById);

  // U
  app.put("/api/users/follow/:following/:followee", follow);
  app.put("/api/users/unfollow/:unfollowing/:unfollowee", unfollow);
  app.put("/api/users/:userId", updateUser);

  // D
  app.delete("/api/users/:userId", deleteUser);
}
