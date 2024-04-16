import express from "express";
import { Book, User, connectToDb } from "./Database/database.js";
import cors from "cors";
import passport from "passport";
import session from "express-session";
import dotenv from "dotenv";
import GoogleStrategy from "passport-google-oauth20";
import { authenticate } from "./Authenticate.js";

const app = express();
const Port = 3000;
dotenv.config();
connectToDb();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  })
);
// app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "Thisisasecretkey202410032",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
      passReqToCallback: true,
      scope: ["email", "profile"],
    },
    async function (accessToken, refreshToken, params, profile, cb) {
      // console.log("Profile", profile);
      if (!profile) {
        return cb(null, false);
      }
      try {
        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
          user = new User({
            googleId: profile.id,
            email: profile.emails[0].value,
            name: profile.displayName,
            image: profile.photos[0].value,
          });
          await user.save();
        }
        return cb(null, user);
      } catch (err) {
        return cb(err, null);
      }
    }
  )
);

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (user, cb) {
  return cb(null, user);
});

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: process.env.SUCCESS_URL,
    failureRedirect: process.env.FAILURE_URL,
  })
);

app.get("/login/success", async (req, res) => {
  // console.log("User", req.user);
  if (req.user) {
    res.status(200).json({ success: true, user: req.user });
  } else {
    res.status(400).json({ success: false, message: "User not found" });
  }
});

app.get("/authenticate", authenticate);

app.get("/auth/logout", (req, res) => {
  req.logout(function (err) {
    if (err) {
      return res
        .status(400)
        .json({ success: false, message: "Error while logging out" });
    }
  });
  res.redirect(process.env.FAILURE_URL);
});
//All other routes
app.get("/all", async (req, res) => {
  try {
    const allBooks = await Book.find({});
    res.status(200).json(allBooks);
  } catch (err) {
    console.log("Error while fetching all books", err);
  }
});

app.get("/book/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const book = await Book.findById(id);
    res.status(200).json(book);
  } catch (err) {
    console.log("Error while fetching book", err);
  }
});

app.get("/filter/:type", async (req, res) => {
  const { type } = req.params;
  try {
    const filteredBooks = await Book.find({ type: type });
    res.status(200).json(filteredBooks);
  } catch (err) {
    console.log("Error while fetching filtered books", err);
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
