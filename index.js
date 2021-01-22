const express = require("express");
const formidable = require("express-formidable");
const cors = require("cors");
const mongoose = require("mongoose");
const cloudinary = require("cloudinary");
require("dotenv").config();

const app = express();
app.use(formidable());
app.use(cors());

mongoose.connect(process.env.MONGODB_URI, {
   useUnifiedTopology: true,
   useNewUrlParser: true,
   useCreateIndex: true,
});

cloudinary.config({
   cloud_name: process.env.CLOUD_NAME,
   api_key: process.env.API_KEY,
   api_secret: process.env.API_SECRET,
});

// Import des routes
const userRoutes = require("./routes/user");
app.use(userRoutes);
const offerRoutes = require("./routes/offer");
app.use(offerRoutes);

const importdataRoutes = require("./routes/importdata");
app.use(importdataRoutes);

app.all("*", (req, res) => {
   res.status(404).json({ message: "Cette route n'existe pas" });
});

app.listen(process.env.PORT, () => {
   console.log("Server Started");
});
