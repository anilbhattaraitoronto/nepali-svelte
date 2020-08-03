const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const DB = require("./database/createtables.js");
const path = require("path");

const app = express();

var corsOptions = {
  origin: "https://nepali.playingpets.com",
};

app.use(cors());

//parse request of application/json content type
app.use(bodyParser.json());

//parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

//Import routes

const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");

app.get("/", (req, res) => {
  res.json({ message: "Welcome to Learn Nepali" });
});

app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "front/public")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "front", "public", "index.html"));
  });
}

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`App server is running on port ${PORT}`);
});
