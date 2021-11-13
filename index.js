const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ftrdn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    console.log("connected to db");

    const database = client.db("classy_eye");
    const productsCollection = database.collection("products");
    const ordersCollection = database.collection("orders");
    const reviewCollection = database.collection("reviews");
    const usersCollection = database.collection("users");

    app.get("/products", async (req, res) => {
      const query = {};
      const cursor = productsCollection.find(query);
      const result = await cursor.toArray();
      res.json(result);
    });

    app.post("/products", async (req, res) => {
      const item = req.body;
      const result = await productsCollection.insertOne(item);
      res.json(result);
    });

    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await productsCollection.findOne(query);
      res.json(result);
    });

    app.delete("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await productsCollection.deleteOne(query);
      res.json(result);
    });

    app.post("/orders", async (req, res) => {
      const order = req.body;
      const result = await ordersCollection.insertOne(order);
      res.json(result);
    });

    app.put("/orders", async (req, res) => {
      const bodyItem = req.body;
      const id = bodyItem.id;
      const status = bodyItem.status;
      console.log(id, status);
      const query = {_id: ObjectId(id)};
      const doc = {$set: {status: status}};
      const result = await ordersCollection.updateOne(query, doc);
      res.json(result);
    });

    app.get("/orders", async (req, res) => {
      const find = {};
      const orders = ordersCollection.find(find);
      const result = await orders.toArray();
      res.send(result);
    });

    app.get("/orders/:email", async (req, res) => {
      const email = req.params.email;
      console.log(email);
      const query = { email: email };
      const orders = ordersCollection.find(query);
      const result = await orders.toArray();
      res.json(result);
    });

    app.delete("/orders/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: ObjectId(id) };
      const result = await ordersCollection.deleteOne(query);
      res.json(result);
    });

    app.post("/users", async(req, res)=>{
        const user = req.body;
        console.log(user);
        const result = await usersCollection.insertOne(user);
        res.json(result);
    })

    app.put("/users/:email", async(req, res)=>{
        const user = req.params.email;
        console.log(user);
        const query = {email: user};
        const doc = {$set: {role: 'admin'}};
        const option = { upsert: true };
        console.log(user);
        const result = await usersCollection.updateOne(query, doc, option);
        res.json(result);
    })

    app.put("/users", async(req, res)=>{
        const user = req.body;
        const email = {email: user.email};
        const doc = {$set: user};
        console.log(user);
        const option = { upsert: true };
        const result = await usersCollection.updateOne(email, doc, option);
        res.json(result);
    })

    app.get("/users/:email", async(req, res) => {
        const user = req.params.email;
        
        const query = {email: user};
        const result = await usersCollection.findOne(query);
        console.log(result);
        res.json(result);
    })

    app.post("/reviews", async (req, res) => {
      const review = req.body;
      console.log(review);
      const result = await reviewCollection.insertOne(review);
      res.json(result);
    });

    app.get("/reviews", async (req, res) => {
      const review = reviewCollection.find({});
      const result = await review.toArray();
      res.json(result);
    });
  } catch {
    //  client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("classy eye server...");
});

app.listen(port, () => {
  console.log("Listening at port", port);
});
