import express from "express";
import {
  CreateMarkDown,
  CreateMarkDownSave,
  ListAllUsers,
  Loginuser,
  RegisterUser,
  ResetPassword,
  forgotPassword,
} from "../Controllers/User.Controller.js";

const userRouter = express.Router();

userRouter.post("/register", RegisterUser);
userRouter.post("/login", Loginuser);
userRouter.post("/forgotpassword", forgotPassword);
userRouter.put("/resetpassword", ResetPassword);
userRouter.get("/listallusers", ListAllUsers)
userRouter.post('/create-markdown', CreateMarkDown)
userRouter.post("/save/:email", CreateMarkDownSave);

export default userRouter;
