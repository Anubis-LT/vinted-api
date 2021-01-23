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

/*app.get("/", (req, res) => {
   res.status(200).send(
      "<html><header><title>Vinted-Api</title></header><body bgcolor='E3F0F0'><h1><center>Vinted-api</center></h1><p></p><p></p><p>Le Réacteur - Grégory Le Terte 2021</p></body></html>"
   );
});*/
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

app.listen(process.env.PORT, () => {
   console.log("Server Started");
});
