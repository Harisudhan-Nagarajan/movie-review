import express from "express";
import { ObjectId } from "mongodb";
import { client } from "./index.js";
import auth from "./middleware/auth.js";
const router = express.Router();

router.get("/movies", async (request, response) => {
  const movies = await client
    .db("Moviereview")
    .collection("movies")
    .find({})
    .toArray();

  response.send(movies);
});

router.get("/ratingss", async (request, response) => {
  const rating = await client
    .db("Moviereview")
    .collection("ratings")
    .aggregate([{ $group: { _id: "$movieid", avgrating: { $avg: "$rating" } } }])
    .toArray();
  // { $project: { state: 1, _id: 0 } },
  // { $unionWith: { coll: "warehouses", pipeline: [ { $project: { state: 1, _id: 0 } } ]} },
  // { $group: { _id: "$state" } }
  console.log(rating);
  response.send(rating);
});

router.get("/movies/:id", async (request, response) => {
  const { id } = request.params;
  const movie = await client
    .db("Moviereview")
    .collection("movies")
    .findOne({ movieid: id });
  response.send(movie);
});

router.post("/rating/:id", auth, async (request, response) => {
  const { id } = request.params;
  const { rating } = request.body;
  const { email } = request.headers;
  console.log(rating);
  const oldrating = await client
    .db("Moviereview")
    .collection("ratings")
    .findOne({
      movieid: id,
      email: email,
    });
  if (oldrating) {
    await client
      .db("Moviereview")
      .collection("ratings")
      .updateOne(
        {
          movieid: id,
          email: email,
        },
        {
          $set: { rating: +rating },
        }
      );
    response.send({ message: "Rating updated", rating: rating });
    return;
  }
  await client
    .db("Moviereview")
    .collection("ratings")
    .insertOne({
      movieid: id,
      email: email,
      rating: +rating,
    });
  response.send({ message: "Rating added", rating: rating });
});

router.put("/addmovies", async (request, response) => {
  const insert = await client
    .db("Moviereview")
    .collection("movies")
    .insertMany(request.body);
  console.log(request.body);
  response.send(insert);
});
export const moviesrouter = router;
