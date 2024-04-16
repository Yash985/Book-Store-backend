import mongoose from "mongoose";

export const userSchema = mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
  },

  image: {
    type: String,
  },
  googleId: {
    type: String,
  },

  cart: {
    type: Array,
    default: [],
  },
});
