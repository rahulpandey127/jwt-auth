import mongoose from "mongoose";
import React from "react";

const dbConnect = () => {
  mongoose
    .connect("mongodb://localhost:27017/fromdetails")
    .then(() => {
      console.log("Database connected successfully");
    })
    .catch((err) => {
      console.log("Database connection failed", err);
    });
};

export default dbConnect;
