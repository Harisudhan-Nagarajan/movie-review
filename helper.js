import { client } from "./index.js";

export const checkemails = async (email) => {
  return await client
    .db("Moviereview")
    .collection("users")
    .findOne({ email: email });
};
