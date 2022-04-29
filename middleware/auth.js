import Jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const auth = async (request, response, next) => {
  try {
    const token = request.header("token");
    Jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    response.status(400).send({ message: "failure" });
  }
};

export default auth;