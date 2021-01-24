const express = require("express");
const router = express.Router();
const uid2 = require("uid2");
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");

const User = require("../models/User");
const Offer = require("../models/Offer");

router.get("/users", async (req, res) => {
   try {
      // Returns the number of results found
      const count = await User.countDocuments();

      const users = await User.find();
      res.status(200).json({
         count: count,
         users: users,
      });
   } catch (error) {
      res.status(400).json({ error: error.message });
   }
});

router.get("/users/:id", async (req, res) => {
   try {
      // Returns user with id

      const users = await User.findOne({ _id: req.params.id });
      res.status(200).json({ users: users });
   } catch (error) {
      res.status(400).json({ error: error.message });
   }
});

router.post("/user/signup", async (req, res) => {
   try {
      // Search Bdd, if the user already has this email
      const user = await User.findOne({ email: req.fields.email });

      if (!user) {
         // All fields are complete ?
         if (req.fields.email && req.fields.username && req.fields.password) {
            // Step 1 : crypt paswword
            const salt = uid2(64);
            const hash = SHA256(req.fields.password + salt).toString(encBase64);
            const token = uid2(64);
            // Step 2 : Create a new user
            const newUser = new User({
               email: req.fields.email,
               account: {
                  username: req.fields.username,
                  phone: req.fields.phone,
               },
               token: token,
               hash: hash,
               salt: salt,
            });
            // Step 3 : Backup user
            await newUser.save();
            // Step 4 : reply to the user
            res.status(200).json({
               _id: newUser._id,
               token: newUser.token,
               account: {
                  username: newUser.account.username,
                  phone: newUser.account.phone,
               },
            });
         } else {
            res.status(400).json({ message: "Missing parameters" });
         }
      } else {
         // If yes, send message error
         res.status(400).json({ message: "This email already has an account" });
      }
   } catch (error) {
      res.status(400).json({ error: error.message });
   }
});

router.post("/user/login", async (req, res) => {
   try {
      // Search in the BBD  user connect
      const user = await User.findOne({ email: req.fields.email });
      if (user) {
         // password is Ok ?
         // generate a new hash with the entered password + the salt of the found user
         const newHash = SHA256(req.fields.password + user.salt).toString(
            encBase64
         );
         //  If this hash is the same as the hash of the found user => OK
         if (newHash === user.hash) {
            res.status(200).json({
               _id: user._id,
               token: user.token,
               account: {
                  username: user.account.username,
                  phone: user.account.phone,
               },
            });
         } else {
            // Error
            res.status(401).json({ message: "Unauthorized" });
         }
      } else {
         res.status(401).json({ message: "Unauthorized" });
      }
   } catch (error) {
      res.status(400).json({ error: error.message });
   }
});

router.delete("/users/:id", async (req, res) => {
   try {
      // Returns user with id
      const offers = await Offer.find({ owner: req.params.id });

      for (const property in offers) {
         console.log(`Suppresion des offres ${property}: ${offers[property]}`);
         await Offer.findByIdAndDelete(offers[property]);
      }

      await User.deleteOne({ _id: req.params.id })
         .then(() =>
            res
               .status(200)
               .json({ message: "Utilisateur supprimé avec ses offres !" })
         )
         .catch((error) => res.status(400).json({ error }));
   } catch (error) {
      res.status(400).json({ error: error.message });
   }
});

module.exports = router;
