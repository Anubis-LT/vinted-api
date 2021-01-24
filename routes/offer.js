const express = require("express");
const router = express.Router();
const cloudinary = require("cloudinary").v2;
const isAuthenticated = require("../middlewares/isAuthenticated");

const User = require("../models/User");
const Offer = require("../models/Offer");

router.post("/offer/publish", isAuthenticated, async (req, res) => {
   try {
      // Destructuring
      const {
         title,
         description,
         price,
         size,
         brand,
         condition,
         city,
         color,
      } = req.fields;

      // Create a new offer
      const newOffer = new Offer({
         product_name: title,
         product_description: description,
         product_price: price,
         product_details: [
            {
               MARQUE: brand,
            },
            {
               TAILLE: size,
            },
            {
               ÉTAT: condition,
            },
            {
               COULEUR: color,
            },
            {
               EMPLACEMENT: city,
            },
         ],
         // To make a reference I can either send the id, or send the complete document.
         owner: req.user,
      });

      // Send picture at cloudinary
      const result = await cloudinary.uploader.upload(req.files.picture.path, {
         folder: `/vinted-andromeda/offers/${newOffer._id}`,
      });

      // Add the result for upload in newOffer
      newOffer.product_image = result;
      // backup offer
      await newOffer.save();

      // Send result
      res.status(200).json(newOffer);
   } catch (error) {
      res.status(400).json({ error: error.message });
   }
});

router.get("/offers", async (req, res) => {
   try {
      let filters = {};

      // If I receive a query title
      if (req.query.title) {
         // Add a product_name key to the filters object
         filters.product_name = new RegExp(req.query.title, "i");
      }

      if (req.query.priceMin) {
         filters.product_price = {
            $gte: Number(req.query.priceMin),
         };
      }

      if (req.query.priceMax) {
         if (filters.product_price) {
            filters.product_price.$lte = Number(req.query.priceMax);
         } else {
            filters.product_price = {
               $lte: Number(req.query.priceMax),
            };
         }
      }

      let sort = {};

      if (req.query.sort === "price-desc") {
         sort.product_price = -1;
      }
      if (req.query.sort === "price-asc") {
         sort.product_price = 1;
      }

      let page;
      // Force page 1 to be displayed if the query page is not sent or is sent with 0 or < -1.
      if (req.query.page < 1) {
         page = 1;
      } else {
         //  page is equal to what is requested
         page = Number(req.query.page);
      }

      // SKIP = ignore the first n results
      // The user asks for page 1 (the first 0 results are ignored)
      // (page - 1) * limit = 0

      // The user asks for page 2 (we ignore the first results limits)
      // (page - 1) * limit = 5 (if limit = 5)

      let limit = Number(req.query.limit);

      // Returns the number of results found according to the filters.
      const count = await Offer.countDocuments(filters);

      const offers = await Offer.find(filters)
         .sort(sort)
         .skip((page - 1) * limit)
         .limit(limit)
         .select("product_name product_price");
      res.status(200).json({
         count: count,
         offers: offers,
      });
   } catch (error) {
      res.status(400).json({ error: error.message });
   }
});

router.get("/offers/:id", async (req, res) => {
   try {
      // Returns user with id
      // Problem with populate
      const offers = await Offer.findById(req.params.id).populate("user");
      res.status(200).json({ offers: offers });
   } catch (error) {
      res.status(400).json({ error: error.message });
   }
});

router.delete("/offers/:id", async (req, res) => {
   try {
      // Returns user with id
      // Problem with populate
      await Offer.deleteOne({ _id: req.params.id })
         .then(() => res.status(200).json({ message: "Offre supprimée !" }))
         .catch((error) => res.status(400).json({ error }));
   } catch (error) {
      res.status(400).json({ error: error.message });
   }
});

module.exports = router;
