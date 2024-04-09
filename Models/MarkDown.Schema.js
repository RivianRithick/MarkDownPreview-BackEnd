import mongoose from "mongoose";

const markdownSchema = new mongoose.Schema({
  content: String,
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const Markdown = mongoose.model("Markdown", markdownSchema);

export default Markdown;
