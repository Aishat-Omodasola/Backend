// const express = require("express");

import { Router } from "express";
import { getAllUsers, updateMe, deleteMe, resizeUserPhoto} from "../controller/userController.js";
import { signup, login, forgotPassword, resetPassword, updatePassword, protect } from "../controller/authController.js";


const userRouter=Router();
// router.post("signup")
userRouter.route("/signup").post(signup);
userRouter.route("/login").post(login);
userRouter.route("/getAllUsers").get(getAllUsers);
userRouter.post("/forgotPassword", forgotPassword);
userRouter.patch("/resetPassword/:token", resetPassword);
userRouter.patch("/updateMyPassword", protect, updatePassword )
userRouter.patch("/updateMe", uploadUserPhoto, resizeUserPhoto, protect, updateMe)
userRouter.delete("/deleteMe", protect, deleteMe)


export default userRouter;