const express = require("express");
const formidable = require("express-formidable");
const cors = require("cors");
const mongoose = require("mongoose");
const cloudinary = require("cloudinary");
const http = require("http");
const fs = require("fs").promises;

require("dotenv").config();

const app = express();
app.use(formidable());
app.use(cors());

mongoose.connect(
   process.env.MONGODB_URI
      ? process.env.MONGODB_URI
      : "mongodb://localhost:27017",
   {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
   }
);

/*cloudinary.config({
   cloud_name: process.env.CLOUD_NAME,
   api_key: process.env.API_KEY,
   api_secret: process.env.API_SECRET,
})*/
cloudinary.config({
   cloud_name: "doxqbt8h2",
   api_key: "498176427155934",
   api_secret: "dPKqkgf1yNYgR2nd2ytWgzaUE7Q",
});

// Import des routes
const userRoutes = require("./routes/user");
app.use(userRoutes);
const offerRoutes = require("./routes/offer");
app.use(offerRoutes);

const importdataRoutes = require("./routes/importdata");
app.use(importdataRoutes);

app.get("/", (req, res) => {
   fs.readFile("./html/index.html")
      .then((contents) => {
         res.setHeader("Content-Type", "text/html");
         res.writeHead(200);
         res.end(contents);
      })
      .catch((err) => {
         res.writeHead(500);
         res.end(err);
         return;
      });
});

app.all("*", (req, res) => {
   res.status(404).json({ message: "Cette route n'existe pas" });
});

app.listen(process.env.PORT ? process.env.PORT : 3001, () => {
   console.log("Server Started");
});
