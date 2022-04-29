import express from "express";
import { checkemails } from "./helper.js";
import bcrypt from "bcrypt";
import Jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import auth from "./middleware/auth.js";
import { google } from "googleapis";
import {client} from "./index.js";

const OAuth2 = google.auth.OAuth2;

dotenv.config();
const router = express.Router();

const hashpassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hashedpassword = await bcrypt.hash(password, salt);
  return hashedpassword;
};

router.post("/signup", async (request, response) => {
  const { email, password } = request.body;
  console.log(request.body);
  const checkemail = await checkemails(email);
  if (checkemail) {
    response.status(400).send({ message: "Email already exists" });
  }
  const hashedpassword = await hashpassword(password);
  const saveuser = await client
    .db("Moviereview")
    .collection("users")
    .insertOne({ ...request.body, password: hashedpassword });
  response.status(200).send({ message: "User created" });
});
router.post("/login", async (request, response) => {
  const { email, password } = request.body;
  const checkemail = await checkemails(email);
  if (!checkemail) {
    response.status(400).send({ message: "User not found" });
    return;
  }
  const hashedpassword = await bcrypt.compare(password, checkemail.password);
  if (!hashedpassword) {
    response.status(400).send({ message: "Password incorrect" });
    return;
  }
  const token = Jwt.sign({ id: checkemail._id }, process.env.JWT_SECRET);
  response.status(200).send({ token, email: checkemail.email });
});
export const signup_loginrouter = router;
