import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import { moviesrouter } from "./movies.js";
import { usersrouter } from "./users.js";
import { signup_loginrouter } from "./login.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
const MONGO_URL = process.env.MONGO_URL;
export const client = await createconnection();

async function createconnection() {
  try {
    const client = new MongoClient(MONGO_URL);
    await client.connect();
    console.log("connected");
    return client;
  } catch (err) {
    console.log("error", err);
  }
}

app.use("/signup_login", signup_loginrouter);
app.use("/movies", moviesrouter);
app.use("/users", usersrouter);
app.get("/", (request, responce) => {
  responce.send("Hello World");
});

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`running on ${port}`)
});
