import express from "express";
const router = express.Router();

import {
  allUsers,
  deleteUser,
  loginUser,
  registerUser,
} from "../controllers/UserController.js";
import { authenticateUser, authorizeUser } from "../middleware/auth.js";

router.route("/login").post(loginUser);
router
  .route("/register")
  .post(authenticateUser, authorizeUser("Admin"), registerUser);
router
  .route("/allUser")
  .get(authenticateUser, authorizeUser("Admin"), allUsers);
router
  .route("/delete/:id")
  .delete(authenticateUser, authorizeUser("Admin"), deleteUser);

export default router;
