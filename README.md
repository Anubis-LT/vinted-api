![alt text][logo]

[logo]: https://github.com/Anubis-LT/vinted-api/blob/master/pictures/banvinted.png "Vinted-api"

Description :

The vinted-api is a training project for the students of the REACTEUR bootcamp - Working with node.js, to perform routes, such as searching, adding, modifying or deleting data. The data is stored in a mongodb database.
To make queries, you can use postman
Have a good routes

Before continuing, install the following programs :

-  node.js https://nodejs.org/en/
-  postman https://www.postman.com/
-  compass https://www.mongodb.com/products/compass
-  cloudinary, create an account https://cloudinary.com/

Install :

-  Clone the repository on your pc https://git-scm.com/docs/git-clone/fr
-  Open a terminal in the cloned folder
-  Then type the following commands

```
$ npm install
$ touch .env
$ vi .env
```

In the file type these lines

```
PORT=3000
MONGODB_URI="mongodb://localhost/vinted-api"
CLOUD_NAME = "your CLOUD_NAME Info account cloudinary"
API_KEY= "your API_KEY Info account cloudinary"
API_SECRET= "your API_SECRET Info account cloudinary"
```

Run :
`npx nodemon index.js`

# Routes List :

POST:

-  "/user/signup" Create account
-  "/user/login" Login account
-  "/offer/publish" Create offers

GET :

-  "/" index documentation page
-  "/offer/" List offers

PUT :

-  in progress...

DELETE :

-  in progress...

![alt text][logo1]

[logo1]: https://github.com/Anubis-LT/vinted-api/blob/master/pictures/routes.png "Example routes"

https://greg-vinted-api.herokuapp.com/

Project student bootcamp - LE REACTEUR
2021- Promo Andromeda
