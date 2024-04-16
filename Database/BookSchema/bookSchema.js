import mongoose from "mongoose";

export const bookSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    required: true,
  },
  img_url: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
});
