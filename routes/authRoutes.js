const express = require("express")
const auth_router = express.Router();
const authController = require("../controllers/authController");

auth_router.get("/signup", authController.signup_user);
auth_router.get("/login", authController.login_user);
auth_router.post("/signup", authController.create_user);
auth_router.post("/login", authController.get_user);
auth_router.get("/logout", authController.logout_user);

module.exports = auth_router;