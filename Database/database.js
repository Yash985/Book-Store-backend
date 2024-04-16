import mongoose from "mongoose";
import dotenv from "dotenv";
import { userSchema } from "./UserSchema/userSchema.js";
import { bookSchema } from "./BookSchema/bookSchema.js";
dotenv.config();

const dbUrl = process.env.DB_URL;

export const Book = mongoose.model("Book", bookSchema);
export const User = mongoose.model("User", userSchema);

export const connectToDb = () => {
  try {
    mongoose.connect(dbUrl);
    console.log("Connect To Db");
  } catch (err) {
    console.log("Error while connecting to db", err);
  }
};
