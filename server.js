const bodyParser = require("body-parser");
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const model = require("./model/model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET;

const port = process.env.PORT;

mongoose.connect(process.env.MONGODB_URI);

const app = express();
app.use(bodyParser.json());
app.use(cookieParser());

app.use(function (req, res, next) {
  if (req.path === "/App/index.html") {
    if (!req.cookies["logn"]) {
      return res.redirect("/login.html");
    }
  }
  next();
});

app.use("/", express.static(path.join(__dirname, "static")));

// login
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await model.findOne({ username }).lean();

  if (!user) {
    return res.json({ status: "error", error: "Invalid username/password" });
  }

  if (await bcrypt.compare(password, user.password)) {
    // the username, password combination is successful

    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
      },
      JWT_SECRET
    );

    res.cookie("logn", token, {});
    return res.json({ status: "ok" });
  }

  res.json({ status: "error", error: "Invalid username/password" });
});

app.post("/api/register", async (req, res) => {
  const { username, password: plainTextPassword } = req.body;
  if (!username || typeof username !== "string") {
    return res.json({ status: "error", error: "Invalid username" });
  }

  if (!plainTextPassword || typeof plainTextPassword !== "string") {
    return res.json({ status: "error", error: "Invalid password" });
  }

  if (plainTextPassword.length < 8) {
    return res.json({
      status: "error",
      error: "Password too small. Should be atleast 8 characters",
    });
  }

  const password = await bcrypt.hash(plainTextPassword, 10);

  try {
    const response = await model.create({
      username,
      password,
    });
    console.log("User Created Successfully : ", response);
  } catch (error) {
    if (error.code === 11000) {
      return res.json({ status: "error", error: "Username already in use" });
    }
    throw error;
  }
  res.json({ status: "ok" });
});

// app.post("/api/change-password", async (req, res) => {
//   const { token, newpassword: plainTextPassword } = req.body;

//   if (!plainTextPassword || typeof plainTextPassword !== "string") {
//     return res.json({ status: "error", error: "Invalid password" });
//   }

//   if (plainTextPassword.length < 8) {
//     return res.json({
//       status: "error",
//       error: "Password too small. Should be atleast 8 characters",
//     });
//   }

//   try {
//     const user = jwt.verify(token, JWT_SECRET);

//     const _id = user.id;

//     const password = await bcrypt.hash(plainTextPassword, 10);

//     await model.updateOne(
//       { _id },
//       {
//         $set: { password },
//       }
//     );
//     res.json({ status: "ok" });
//   } catch (error) {
//     console.log(error);
//     res.json({ status: "error", error: ";))" });
//   }
// });

app.listen(port, () => {
  console.log(`Server is running, Port : ${port}`);
});
