// const express = require("express");
// const userController = require("./../controller/userController");
// const authController = require("./../controller/authController")

import { Router } from "express";
import { getAllUsers, updateMe, deleteMe} from "../controller/userController.js";
import { signup, login, forgotPassword, resetPassword, updatePassword, protect } from "../controller/authController.js";
// import { authController } from "../controller/authController.js";

const userRouter=Router();
// router.post("signup")
userRouter.route("/signup").post(signup);
userRouter.route("/login").post(login);
userRouter.route("/getAllUsers").get(getAllUsers);
userRouter.post("/forgotPassword", forgotPassword);
userRouter.patch("/resetPassword/:token", resetPassword);
userRouter.patch("/updateMyPassword", protect, updatePassword )
userRouter.patch("/updateMe", protect, updateMe)
userRouter.delete("/deleteMe", protect, deleteMe)


export default userRouter;