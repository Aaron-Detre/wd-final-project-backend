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
  const getUsersByPartialUsername = (partialName) => {
    const regex = new RegExp(partialName, "i"); // 'i' makes it case-insensitive
    return model.find({
      $or: [{ firstName: { $regex: regex } }, { lastName: { $regex: regex } }],
    });
  };
  const findUsersByRole = (role) => model.find({ role: role });

  return {
    createUser,
    getAllUsers,
    getUserById,
    getUserByUsername,
    getUserByCredentials,
    updateUser,
    deleteUser,
    getUsersByPartialUsername,
    findUsersByRole,
  };
}
