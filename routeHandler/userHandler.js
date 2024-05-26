const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const userSchema = require("../schemas/userSchema");
const UserInfo = new mongoose.model("User", userSchema);
const verifyLogin = require("../middlewares/verifyLogin");
const verifyToken = require("../middlewares/verifyToken");
const verifyAdmin = require("../middlewares/verifyAdmin");

router.get("/", async (req, res) => {
  await UserInfo.find()
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      console.log(err);
      res.json({
        message: "error",
      });
    });
});

router.get("/:email", async (req, res) => {
  try {
    const { email } = req.params;

    const userInfo = await UserInfo.findOne({ email: email });

    if (userInfo) {
      res.json(userInfo);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/1/state", async (req, res) => {
  const { role, currentPage, itemsPerPage } = req.query;
  console.log(role, currentPage);
  try {
    let query = {};
    if (role === "employee" || role === "user") {
      return res.status(400).json({ message: "Invalid user" });
    } else if (role === "admin") {
      query = {};
    }

    const skip = currentPage * itemsPerPage;

    const items = await UserInfo.find(query).skip(skip).limit(itemsPerPage);
    if (!items || items.length === 0) {
      return res.status(404).json({
        message: "No items found for the given email and search term",
      });
    }
    // console.log(items);

    // Total number of blogs
    const totalCount = await UserInfo.countDocuments();
    res.status(200).json({ items, totalCount });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error occurred while searching for items",
    });
  }
});

router.get("/:email", async (req, res) => {
  const { email } = req.params;

  try {
    const user = await UserInfo.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error fetching user information:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/", async (req, res) => {
  const NewUserInfo = new UserInfo(req.body);
  await NewUserInfo.save()
    .then((data) => {
      res.status(200).json({
        message: "Success",
      });
    })
    .catch((err) => {
      if (err) {
        console.log(err);
        res.status(500).json({
          message: "error",
        });
      }
    });
});

router.patch("/admin/:id", async (req, res) => {
  const id = req.params.id;
  const filter = { _id: new Object(id) };
  const updatedDoc = {
    $set: {
      role: "admin",
    },
  };
  await UserInfo.updateOne(filter, updatedDoc)
    .then(() => {
      res.status(200).json({
        message: "success",
      });
    })
    .catch((err) => {
      if (err) {
        console.log(err);
        res.status(500).json({
          message: "error",
        });
      }
    });
});

router.patch("/employee/:id", async (req, res) => {
  const id = req.params.id;
  const filter = { _id: new Object(id) };
  const updatedDoc = {
    $set: {
      role: "employee",
    },
  };
  await UserInfo.updateOne(filter, updatedDoc)
    .then(() => {
      res.status(200).json({
        message: "success",
      });
    })
    .catch((err) => {
      if (err) {
        console.log(err);
        res.status(500).json({
          message: "error",
        });
      }
    });
});
router.patch("/:id", async (req, res) => {
  const id = req.params.id;
  const filter = { _id: new Object(id) };
  const updatedDoc = {
    $set: {
      role: "user",
    },
  };
  await UserInfo.updateOne(filter, updatedDoc)
    .then(() => {
      res.status(200).json({
        message: "success",
      });
    })
    .catch((err) => {
      if (err) {
        console.log(err);
        res.status(500).json({
          message: "error",
        });
      }
    });
});
router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  const query = { _id: new Object(id) };
  await UserInfo.deleteOne(query)
    .then(() => {
      res.status(200).json({
        message: "item deleted",
      });
    })
    .catch((err) => {
      if (err) {
        console.log(err);
        res.status(500).json({
          message: "error",
        });
      }
    });
});

router.get("/admin/:email", verifyToken, verifyAdmin, async (req, res) => {
  const email = req.params.email;

  if (email !== req.decoded.email) {
    return res.status(403).send({ message: "forbidden access" });
  }
  const query = { email: email };
  const user = await UserInfo.findOne(query);

  const isAdmin = user?.role === "admin" ? true : false;

  res.send({ isAdmin });
});

module.exports = router;
