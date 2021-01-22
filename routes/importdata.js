const express = require("express");
const router = express.Router();
const cloudinary = require("cloudinary").v2;
const uid2 = require("uid2");
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");

const User = require("../models/User");
const Offer = require("../models/Offer");
let articlelopp = 1;

router.get("/importdata", async (req, res) => {
   try {
      const users = {
         user1: {
            email: "corinne@lereacteur.io",
            username: "Corinne",
            phone: "0101010101",
            password: "azerty01",
         },
         user2: {
            email: "brice@lereacteur.io",
            username: "Brice",
            phone: "0202020202",
            password: "azerty02",
         },
         user3: {
            email: "bastien@lereacteur.io",
            username: "Bastien",
            phone: "0303030303",
            password: "azerty03",
         },
         user4: {
            email: "alexis@lereacteur.io",
            username: "Alexis",
            phone: "0404040404",
            password: "azerty03",
         },
      };
      const article = {
         article1: {
            title: "Nike Air Max",
            description: "Talwind IV",
            price: "90",
            detail: [
               { MARQUE: "Nike" },
               { TAILLE: "46" },
               { ETAT: "Neuf" },
               { COULEUR: "Blanc" },
               { EMPLACEMENT: "Trignac, France" },
            ],
            picture: "../pictures/chaussure1.png",
         },
         article2: {
            title: "Escarpins",
            description:
               "piqures matelassées talons confortables de 7cm avec un petit patin de 1,5 cm",
            price: "35",
            detail: [
               { MARQUE: "" },
               { TAILLE: "35,5" },
               { ETAT: "Tres bon" },
               { COULEUR: "Noir" },
               { EMPLACEMENT: "Bordeaux, France" },
            ],
            picture: "../pictures/chaussure2.png",
         },
         article3: {
            title: "Boots",
            description:
               "boots en cuir et daim noires à lacets et fermées par un plaque dorée tres stylées",
            price: "23",
            detail: [
               { MARQUE: "" },
               { TAILLE: "37" },
               { ETAT: "Bon état" },
               { COULEUR: "Noir" },
               { EMPLACEMENT: "Paris, France" },
            ],
            picture: "../pictures/chaussure3.png",
         },
         article4: {
            title: "Boots",
            description: "basket femme en taille 37 1/3 porter quelques fois",
            price: "30",
            detail: [
               { MARQUE: "" },
               { TAILLE: "35" },
               { ETAT: "Neuf" },
               { COULEUR: "Blanc" },
               { EMPLACEMENT: "Marseille, France" },
            ],
            picture: "../pictures/chaussure4.png",
         },
         article5: {
            title: "Chaussures adidas noires",
            description: "basket adidas porter rarement",
            price: "30",
            detail: [
               { MARQUE: "Adidas" },
               { TAILLE: "41" },
               { ETAT: "Bon état" },
               { COULEUR: "Noir" },
               { EMPLACEMENT: "Lille, France" },
            ],
            picture: "../pictures/chaussure5.png",
         },
         article6: {
            title: "Robe Holy, rayures bohème, Sezane",
            description:
               "jamais portée.\n80% coton, 20% soie, doublure : 100% viscose\n Robe longue à manches courtes légèrement évasées. Découpe à la taille, volume ample.\n Encolure V et patte boutonnage devant",
            price: "125",
            detail: [
               { MARQUE: "" },
               { TAILLE: "34" },
               { ETAT: "Bon état" },
               { COULEUR: "Orange" },
               { EMPLACEMENT: "Nice, France" },
            ],
            picture: "../pictures/robe1.png",
         },
         article7: {
            title: "Robe noir T.S",
            description: "Vestido negro Talla S.Nuevo",
            price: "16",
            detail: [
               { MARQUE: "" },
               { TAILLE: "S" },
               { ETAT: "" },
               { COULEUR: "Noir" },
               { EMPLACEMENT: "Madrid, Espagne" },
            ],
            picture: "../pictures/robe2.png",
         },
         article8: {
            title: "Robe d’été fille Roxy",
            description: "robe légère d’été pour fille",
            price: "6",
            detail: [
               { MARQUE: "" },
               { TAILLE: "10 ans" },
               { ETAT: "Bon état" },
               { COULEUR: "Rose" },
               { EMPLACEMENT: "Bourges, France" },
            ],
            picture: "../pictures/robe3.png",
         },
         article9: {
            title: "Robe roxy",
            description: "Robe Roxy vert d eau",
            price: "2",
            detail: [
               { MARQUE: "" },
               { TAILLE: "10 ans" },
               { ETAT: "Bon état" },
               { COULEUR: "Vert" },
               { EMPLACEMENT: "Nantes, France" },
            ],
            picture: "../pictures/robe4.png",
         },
         article10: {
            title: "Robe grise",
            description:
               "obe grise en col v , avec des poches sur les hanches. se porte avec une ceinture",
            price: "150",
            detail: [
               { MARQUE: "Armani" },
               { TAILLE: "L" },
               { ETAT: "Comme Neuf" },
               { COULEUR: "Gris" },
               { EMPLACEMENT: "Paris, France" },
            ],
            picture: "../pictures/robe5.png",
         },
         article11: {
            title: "Chapeau noir 100% laine Mango",
            description:
               "Chapeau noir 100% laine. Taille unique. Jamais porté (voir étiquette)",
            price: "19",
            detail: [
               { MARQUE: "Melon" },
               { TAILLE: "" },
               { ETAT: "Bon état" },
               { COULEUR: "Noir" },
               { EMPLACEMENT: "Paris, France" },
            ],
            picture: "../pictures/chapeau1.png",
         },
         article12: {
            title: "Casquette New York",
            description: "vraiment neuf, jamais porté",
            price: "10",
            detail: [
               { MARQUE: "NY" },
               { TAILLE: "" },
               { ETAT: "Neuf" },
               { COULEUR: "Noir" },
               { EMPLACEMENT: "Lyon, France" },
            ],
            picture: "../pictures/chapeau2.png",
         },
         article13: {
            title: "Bonnet hiver Napapijri",
            description:
               "super bonnet hiver de marque Napapijri, en coloris jaune avec pompon gris.",
            price: "17",
            detail: [
               { MARQUE: "" },
               { TAILLE: "Unique" },
               { ETAT: "Bon état" },
               { COULEUR: "Jaune" },
               { EMPLACEMENT: "Paris, France" },
            ],
            picture: "../pictures/chapeau3.png",
         },
         article14: {
            title: "Chapeau ou postillon gendarmerie",
            description: "Beau chapeau bleue marine avec son logo gendarmerie",
            price: "12",
            detail: [
               { MARQUE: "" },
               { TAILLE: "54" },
               { ETAT: "Bon état" },
               { COULEUR: "Noir" },
               { EMPLACEMENT: "Vannes, France" },
            ],
            picture: "../pictures/chapeau4.png",
         },
         article15: {
            title: "Chapeau Lack of color",
            description: "Chapeau Modèle Teak Rancher",
            price: "30",
            detail: [
               { MARQUE: "Teak Rancher" },
               { TAILLE: "L" },
               { ETAT: "Neuf" },
               { COULEUR: "Jaune" },
               { EMPLACEMENT: "Biarritz, France" },
            ],
            picture: "../pictures/chapeau5.png",
         },
         article16: {
            title: "Veste cuir",
            description: "veste cuir rivaldiblack",
            price: "35",
            detail: [
               { MARQUE: "" },
               { TAILLE: "S" },
               { ETAT: "Bon état" },
               { COULEUR: "Noir" },
               { EMPLACEMENT: "Lille, France" },
            ],
            picture: "../pictures/veste1.png",
         },
         article17: {
            title: "Veste vintage wearguard L couleur vert céladon",
            description:
               "veste vintage wearguard de provenance USA en style Dickies / Carhartt / Burton. Taille L. Couleur comme dans les photos, jean délavé. Bon état, un peu usuré par le temps comme normal.",
            price: "320",
            detail: [
               { MARQUE: "Burton" },
               { TAILLE: "L" },
               { ETAT: "Bon état" },
               { COULEUR: "Vert" },
               { EMPLACEMENT: "Strabourg, France" },
            ],
            picture: "../pictures/veste2.png",
         },
         article18: {
            title: "Manteau long léger ",
            description: "manteau long léger taille 36 état proche du Neuf",
            price: "17",
            detail: [
               { MARQUE: "" },
               { TAILLE: "36" },
               { ETAT: "Bon état" },
               { COULEUR: "Gris" },
               { EMPLACEMENT: "Dublin, Irlande" },
            ],
            picture: "../pictures/veste3.png",
         },
         article19: {
            title: "Manteau court zara ",
            description:
               "veste couleur camel zara collection taille S bien épaisse état proche du Neuf",
            price: "19",
            detail: [
               { MARQUE: "Zara" },
               { TAILLE: "36" },
               { ETAT: "Très Bon état" },
               { COULEUR: "Marron" },
               { EMPLACEMENT: "Limoges, France" },
            ],
            picture: "../pictures/veste4.png",
         },
         article20: {
            title: "Veste H&M",
            description: "veste manches longues couleur gris femme ",
            price: "3",
            detail: [
               { MARQUE: "H&M" },
               { TAILLE: "38" },
               { ETAT: "Bon état" },
               { COULEUR: "Gris" },
               { EMPLACEMENT: "Paris, France" },
            ],
            picture: "../pictures/veste5.png",
         },
      };
      let ComptArt = 0;
      // loop for users
      for (let i_user = 1; i_user <= 4; i_user++) {
         // create user------------------------------------
         // step 1 : password + token
         const salt = uid2(64);
         const hash = SHA256(users["user" + i_user].password + salt).toString(
            encBase64
         );
         const token = uid2(64);

         // step 2 : create new user
         const newUser = new User({
            email: users["user" + i_user].email,
            account: {
               username: users["user" + i_user].username,
               phone: users["user" + i_user].phone,
            },
            token: token,
            hash: hash,
            salt: salt,
         });
         const user = await newUser.save();

         // create article
         for (i_article = 1; i_article <= 5; i_article++) {
            ComptArt++;
            const newOffer = new Offer({
               product_name: article["article" + ComptArt].title,
               product_description: article["article" + ComptArt].description,
               product_price: Number(article["article" + ComptArt].price),
               product_details: [
                  {
                     MARQUE: article["article" + ComptArt].detail[0].MARQUE,
                  },
                  {
                     TAILLE: article["article" + ComptArt].detail[1].TAILLE,
                  },
                  {
                     ÉTAT: article["article" + ComptArt].detail[2].ETAT,
                  },
                  {
                     COULEUR: article["article" + ComptArt].detail[3].COULEUR,
                  },
                  {
                     EMPLACEMENT:
                        article["article" + ComptArt].detail[4].EMPLACEMENT,
                  },
               ],
               // add user
               owner: user,
            });

            /*  // send picture à cloudinary
            const result = await cloudinary.uploader.upload(
               article["article" + ComptArt].picture,
               {
                  folder: `/vinted/offers/${newOffer._id}`,
               }
            );

            // add result upload in newOffer
            newOffer.product_image = result;*/
            console.log("Ok tout c'est bien passé");
            await newOffer.save();
         }
      }
      res.status(200).send("Import completed ");
   } catch (error) {
      res.status(400).json({ error: error.message });
   }
});
module.exports = router;
