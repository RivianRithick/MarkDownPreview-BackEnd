import express from "express";
import {
    CreateMarkDown,
    ListAllUsers,
  Loginuser,
//   MarkDownList,
  MarkDownListById,
  MarkDownListDelete,
  MarkDownListUpdate,
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
// userRouter.get('/markdown-list', MarkDownList)
userRouter.get("/markdown/:id", MarkDownListById);
userRouter.put('/update-markdown/:id',MarkDownListUpdate )
userRouter.delete("/delete-markdown/:id", MarkDownListDelete);

export default userRouter;
