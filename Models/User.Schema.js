import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstname: String,
    lastname: String,
    email: String,
    password: String,
    token: String,
  },
  { versionKey: false }
);

const User = mongoose.model("MarkDownUser", userSchema);

export default User;
