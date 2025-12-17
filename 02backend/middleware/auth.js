import jwt from "jsonwebtoken";
import Registration from "../models/registration.user.model.js";
const auth = (req, res, next) => {
  try {
    const bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader != "undefined") {
      let bearer = bearerHeader.split(" ");
      let token = bearer[1];
      const user = jwt.verify(token, process.env.JWT_SECRET);
      console.log(user);
      req.Token = user;
      next();
    } else {
      res.status(401).json({ msg: "Token is not valid" });
    }
  } catch (err) {
    res.status(403).json({ msg: "Invalid or expired token" });
  }
};

export default auth;
