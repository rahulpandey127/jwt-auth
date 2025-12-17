import express from "express";
import cors from "cors";
import dbConnect from "./config/dbConnect.js";
import { MulterError } from "multer";
import auth from "./middleware/auth.js";
import path from "path";
import router from "./routes/router.js";
import router2 from "./routes/user.router.js";
import { fileURLToPath } from "url";
import { dirname } from "path";
import bodyParser from "body-parser";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/user1", router2);

app.use(auth);
app.use("/api", router);

app.use((error, req, res, next) => {
  if (error instanceof MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res
        .status(400)
        .send(`Image Error: ${error.message}:${error.code}}`);
    } else if (error) {
      return res.status(400).send(`Something went wrong:${error.message}}`);
    }
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
  dbConnect();
});
