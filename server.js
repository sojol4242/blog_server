const express = require("express");
// const bodyParser = require('body-parser');
const cors = require("cors");
const colors = require("colors");
const ObjectId = require("mongodb").ObjectID;
const MongoClient = require("mongodb").MongoClient;
const port = process.env.PORT || 5000; //||

require("dotenv").config();

// mongo client

const uri = process.env.MONGO_URI;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// initialized app
const app = express();

//middle
app.use(express.json());
app.use(cors());

//root app
app.get("/", (req, res) => {
  res.send("Welcome to blog server");
});

// main app

client.connect((err) => {
  const adminCollection = client.db("blogDB").collection("post");
  console.log(`Error : ${err}`.red);
  console.log(`MongoDb connected for Job task`.magenta);

  // add blog
  app.post("/addBlog", (req, res) => {
    const newBlog = req.body;
    console.log(newBlog);
    adminCollection.insertOne(newBlog).then((result) => {
      console.log(result.insertedCount > 0);
      res.send(result.insertedCount > 0);
    });
  });
  //  get  blogs and show :
  app.get("/getBlogs", (req, res) => {
    adminCollection.find({}).toArray((err, docs) => {
      res.send(docs);
    });
  });
  // delete blog from database :
  app.delete("/deleteBlog/:id", (req, res) => {
    // console.log(req.params.id);
    adminCollection
      .deleteOne({ _id: ObjectId(req.params.id) })
      .then((result) => {
        console.log(result);
        res.send(result.deletedCount > 0);
      });
  });
});

// client.connect((err) => {
//   const serviceCollection = client.db("photography").collection("newServices");
//   const userCollection = client.db("photography").collection("userCollection");
//   const reviewCollection = client
//     .db("photography")
//     .collection("reviewCollection");
//   const adminCollection = client
//     .db("photography")
//     .collection("adminCollection");

//   console.log(err);
//   console.log(
//     `MongoDb connected for assignment 11 given by programming hero`.magenta
//   );

//   // admin:  add services :
//   app.post("/addServices", (req, res) => {
//     const newService = req.body;
//     console.log(newService);
//     serviceCollection.insertOne(newService).then((result) => {
//       console.log(result.insertedCount > 0);
//       res.send(result.insertedCount > 0);
//     });
//   });

//   //set a admin
//   app.post("/setAdmin", (req, res) => {
//     const newAdmin = req.body;
//     console.log(newAdmin);
//     adminCollection.insertOne(newAdmin).then((result) => {
//       console.log(result.insertedCount > 0);
//       res.send(result.insertedCount > 0);
//     });
//   });

//   app.post("/getAdmin", (req, res) => {
//     const email = req.body.email;
//     adminCollection.find({ email: email }).toArray((err, admin) => {
//       res.send(admin.length > 0);
//     });
//   });

//   //  get  newest services and show home:
//   app.get("/getNewServices", (req, res) => {
//     serviceCollection.find({}).toArray((err, docs) => {
//       res.send(docs);
//     });
//   });

//   // delete data from database and home page :
//   app.delete("/delete/:id", (req, res) => {
//     console.log(req.params.id);
//     serviceCollection
//       .deleteOne({ _id: ObjectId(req.params.id) })
//       .then((result) => {
//         console.log(result);
//         res.send(result.deletedCount > 0);
//       });
//   });

//   //service added by user in his/her list
//   app.post("/checkoutService", (req, res) => {
//     const userProduct = req.body;

//     userCollection.insertOne(userProduct).then((result) => {
//       console.log(result.insertedCount > 0);
//       res.send(result.insertedCount > 0);
//     });
//   });

//   app.get("/checkout", (req, res) => {
//     userCollection.find({}).toArray((err, docs) => {
//       res.send(docs);
//     });
//   });

//   // add review to database by user

//   app.post("/addReview", (req, res) => {
//     const newService = req.body;
//     console.log(newService);
//     reviewCollection.insertOne(newService).then((result) => {
//       console.log(result.insertedCount > 0);
//       res.send(result.insertedCount > 0);
//     });
//   });

//   app.get("/getReview", (req, res) => {
//     reviewCollection.find({}).toArray((err, docs) => {
//       res.send(docs);
//     });
//   });
// });

// server port :
app.listen(port, () => {
  console.log(`Server is running on ${port} Successfully`.blue);
});
