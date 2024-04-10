import mongoose from "mongoose";

const contentSchema = new mongoose.Schema({
  email: String,
  data: String,
});

const Content = mongoose.model("Content", contentSchema);

export default Content;
