import express from "express";
import Users from "../models/user.model.js";
import multer from "multer";
import path from "path";
const router = express.Router();

router.get("/allUsers", async (req, res) => {
  try {
    let users = await Users.find();
    if (!users) return res.status(404).json({ message: "No users found" });

    res.status(200).json({
      message: "User found successful",
      data: users,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    //  file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    let newFileName =
      file.fieldname + Date.now() + path.extname(file.originalname);
    console.log(newFileName);
    cb(null, newFileName);
  },
});

let fileFilter = (req, file, cb) => {
  console.log("hello", req.body);
  if (file.fieldname === "profilepic") {
    if (
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpg"
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only images are allowed !"), false);
    }
  } else {
    cb(new Error("Unknown fields !"), false);
  }
};

let upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 3,
  },
  fileFilter: fileFilter,
});

// const upload = multer({ dest: "uploads/" });

router.post("/createUser", upload.single("profilepic"), async (req, res) => {
  let { name, email, mobile, city } = req.body;
  try {
    let userCreated = new Users({ name, email, mobile, city });
    if (!req.file || req.file.length === 0) {
      return res.status(400).send("No files were uploaded.");
    }
    if (!userCreated) {
      return res.status(404).json({ message: "User not created" });
    }

    userCreated.profilepic = req.file.filename;
    await userCreated.save();
    console.log(userCreated);
    return res
      .status(200)
      .json({ message: "User created successfully", data: userCreated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/deleteUser/:id", async (req, res) => {
  try {
    let userDeleted = await Users.findByIdAndDelete(req.params.id);
    if (!userDeleted) {
      res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/updateUser/:id", upload.single("profilepic"), async (req, res) => {
  try {
    // let { name, email, mobile, city } = req.body;
    let userUpdated = await Users.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!userUpdated) {
      res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/getUser/:id", async (req, res) => {
  try {
    let user = await Users.findById(req.params.id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User found successfully", data: user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/getAllUser", async (req, res) => {
  // console.log(req.query.search);
  // console.log(req.query.page);
  // console.log(req.query.limit);
  try {
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 3;
    let searchItem = req.query.search || "";
    let totaluser = await Users.countDocuments(searchItem);
    console.log(totaluser);
    let totalpages = Math.ceil(totaluser / limit);
    let skip = (page - 1) * limit;
    console.log(
      "page:" + page,
      "limit:" + limit,
      "totalpages:" + totalpages,
      "skip:" + skip
    );
    let search = {
      $or: [
        { name: { $regex: `^${searchItem}`, $options: "i" } },
        { email: { $regex: `^${searchItem}`, $options: "i" } },
        { mobile: { $regex: `^${searchItem}` } },
      ],
    };
    let users = await Users.find(search).skip(skip).limit(5);

    if (!users) {
      res.status(404).json({ message: "Users not found" });
    }

    res.status(201).json({
      message: "Searched users found successfully",
      data: users,
      total: totaluser,
      pages: totalpages,
      limit: limit,
      page: page,
    });
    console.log(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
