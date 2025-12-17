import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Registration from "../models/registration.user.model.js";
let router = express.Router();
dotenv.config();
router.post("/register", async (req, res) => {
  try {
    console.log(req.body);
    let { name, email, password, phone, city, role } = req.body;
    let user = await Registration.findOne({
      $or: [
        { name: { $regex: name, $options: "i" } },
        { email: { $regex: email, $options: "i" } },
      ],
    });
    if (user) return res.status(400).send({ message: "User already exists" });

    let salt = await bcrypt.genSalt(10);
    let hashPassword = await bcrypt.hash(password, salt);
    let newUser = new Registration({
      name: name,
      email: email,
      password: hashPassword,
      phone: phone,
      city: city,
      role: role,
    });
    let savedUser = await newUser.save();
    res
      .status(200)
      .send({ message: "User registered successfully", data: savedUser });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    let { name, email, password } = req.body;
    let user = await Registration.findOne({
      $or: [
        { name: { $regex: name, $options: "i" } } || {
          email: { $regex: email, $options: "i" },
        },
      ],
    });

    if (!user) return res.status(400).send({ message: "User not found" });
    let isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid)
      return res.status(400).send({ message: "Invalid password" });
    let token = jwt.sign(
      { userid: user._id, username: user.name },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h", // expires in 1 hour
      }
    );

    res.status(200).send({ message: "Login successful", token: token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/logout", (req, res) => {
  res.status(200).send({ message: "Logout successful" });
});

export default router;
