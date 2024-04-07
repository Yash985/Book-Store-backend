import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const dbUrl = process.env.DB_URL;

const bookSchema = mongoose.Schema({
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

export const Book = mongoose.model("Book", bookSchema);

export const connectToDb = () => {
  try {
    mongoose.connect(dbUrl);
    console.log("Connect To Db");
  } catch (err) {
    console.log("Error while connecting to db", err);
  }
};
