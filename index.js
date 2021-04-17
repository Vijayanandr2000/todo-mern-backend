const express = require("express");
const mongodb = require("mongodb");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const DBURL =
  "mongodb+srv://vijay:8l1tN8bdDwbQi3tF@cluster0.motqj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

const mongoClient = mongodb.MongoClient;
const objectId = mongodb.ObjectID;
const DB_URL = DBURL || "mongodb://127.0.0.1:27017";

app.post("/create", async (req, res) => {
  try {
    const client = await mongoClient.connect(DB_URL);
    const db = client.db("Todo");
    const data = {
      task: req.body.todo,
      des: req.body.hint,
    };
    await db.collection("list").insertOne(data);

    res.status(200).json({
      message: "task is posted",
    });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  } finally {
    client.close();
  }
});

app.get("/todo", async (req, res) => {
  try {
    const client = await mongoClient.connect(DB_URL);
    const db = client.db("Todo");
    const result = await db
      .collection("list")
      .find()
      // .project({ password: 0, _id: 0, key: 0 })
      .toArray();
    res.status(200).json({ result });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  } finally {
    client.close();
  }
});

app.delete("/todo/:id", async (req, res) => {
  try {
    const client = await mongoClient.connect(DB_URL);
    const db = client.db("Todo");
    const result = await db
      .collection("list")
      .deleteOne({ _id: objectId(req.params.id) });
    res.status(200).json({ result });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  } finally {
    client.close();
  }
});

app.put("/todo/:id", async (req, res) => {
  try {
    const client = await mongoClient.connect(DB_URL);
    const db = client.db("Todo");
    const result = await db.collection("list").updateOne(
      { _id: objectId(req.params.id) },
      {
        $set: {
          task: req.body.task,
          des: req.body.des,
        },
      }
    );
    res.status(200).json({ result });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  } finally {
    client.close();
  }
});

app.listen(7000, () => {
  console.log("App is listening in port 7000");
});