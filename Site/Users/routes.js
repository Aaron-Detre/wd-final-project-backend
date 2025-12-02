import UsersDao from "./dao.js";
export default function UserRoutes(app) {
  const dao = UsersDao();
  const createUser = async (req, res) => {
    const user = await dao.createUser(req.body);
    res.json(user);
  };
  const deleteUser = async (req, res) => {
    const status = await dao.deleteUser(req.params.userId);
    res.json(status);
  };
  const getAllUsers = async (req, res) => {
    const { role, name } = req.query;
    if (role) {
      const users = await dao.getUsersByRole(role);
      res.json(users);
      return;
    }
    if (name) {
      const users = await dao.getUsersByPartialName(name);
      res.json(users);
      return;
    }
    const users = await dao.getAllUsers();
    res.json(users);
  };

  const getUserById = async (req, res) => {
    const user = await dao.getUserById(req.params.userId);
    res.json(user);
  };
  const updateUser = async (req, res) => {
    const userId = req.params.userId;
    const userUpdates = req.body;
    await dao.updateUser(userId, userUpdates);
    const currentUser = req.session["currentUser"];
    if (currentUser && currentUser._id === userId) {
      req.session["currentUser"] = { ...currentUser, ...userUpdates };
    }
    res.json(currentUser);
  };
  const signUp = async (req, res) => {
    const user = await dao.getUserByUsername(req.body.username);
    if (user) {
      res.status(400).json({ message: "Username already in use" });
      return;
    }
    const currentUser = await dao.createUser(req.body);
    res.json(currentUser);
  };
  const signIn = async (req, res) => {
    const { username, password } = req.body;
    console.log(`${username} - ${password}`);
    const currentUser = await dao.getUserByCredentials(username, password);
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

  app.get("/api/users", getAllUsers); // Add query params for role and name
  app.get("/api/users/:userId", getUserById);
  app.post("/api/users", createUser);
  app.post("/api/users/profile", profile);
  app.post("/api/users/signin", signIn);
  app.post("/api/users/signup", signUp);
  app.post("/api/users/signout", signOut);
  app.put("/api/users/:userId", updateUser);
  app.delete("/api/users/:userId", deleteUser);
}
