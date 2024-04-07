import express from "express";
import { Book, connectToDb } from "./Database/database.js";
import cors from "cors";

const app = express();
const Port = 3000;

connectToDb();

// app.use(
//   cors({
//     origin: "http://localhost:5137",
//     methods: ["GET", "POST"],
//   })
// );
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/all", async(req, res) => {
  try {
    const allBooks = await Book.find({});
    res.status(200).json(allBooks);
  } catch (err) {
    console.log("Error while fetching all books", err);
  }
});

app.post("/add", async (req, res) => {
  const { title, desc, img_url, type } = req.body;
  if (!title || !desc || !img_url || !type) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide all details" });
  }
  try {
    const newBook = new Book({
      title,
      desc,
      img_url,
      type,
    });
    await newBook.save();
    res.status(201).json({ success: true, message: "Book added successfully" });
  } catch (err) {
    console.log("Error while adding book", err);
  }
});

app.listen(Port, () => {
  console.log(`Server is listening on port ${Port}`);
});
