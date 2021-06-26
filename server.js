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

 
// server port :
app.listen(port, () => {
  console.log(`Server is running on ${port} Successfully`.orange);
});
