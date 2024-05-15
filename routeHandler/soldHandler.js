const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const soldSchema = require("../schemas/soldSchema");
const SoldItems = new mongoose.model("SoldItems", soldSchema);

router.get("/", async (req, res) => {
  try {
    const data = await SoldItems.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({
      message: "error",
    });
  }
});

router.get("/:categoryName", async (req, res) => {
  const { categoryName } = req.params;
  // console.log(categoryName)
  let query = { category: categoryName };
  try {
    await SoldItems.find(query).then((data) => {
      res.json(data);
    });
  } catch (error) {
    console.log(error);
    res.json({
      message: "error",
    });
  }
});

router.get("/1/state", async (req, res) => {
  const { email, searchValue, role, currentPage, itemsPerPage } = req.query;
  console.log(email, currentPage);
  try {
    let query = {};
    if (role === "employee") {
      if (!email) {
        return res
          .status(400)
          .json({ message: "Missing email for employee role" });
      }
      query.email = email;
    } else if (role === "admin") {
      query = {};
    } else {
      return res.status(400).json({ message: "Invalid user" });
    }
    if (searchValue && searchValue.trim() !== " ") {
      query.$or = [{ productCode: searchValue }];
    }

    const skip = currentPage * itemsPerPage;
    console.log(skip);

    const items = await SoldItems.find(query)
      .skip(skip)
      .limit(itemsPerPage)
      .sort({ sellingDate: -1 });
    // if (!items || items.length === 0) {
    //   return res
    //     .status(404)
    //     .json({
    //       message: "No items found for the given email and search term",
    //     });
    // }
    // console.log(items);

    // Total number of blogs
    const totalCount = await SoldItems.countDocuments();
    res.status(200).json({ items, totalCount });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error occurred while searching for items",
    });
  }
});

router.get("/1/filter", async (req, res) => {
  const { categoryName, filterName } = req.query;
  let query = { category: categoryName };

  try {
    if (
      filterName === "daily" ||
      filterName === "weekly" ||
      filterName === "monthly" ||
      filterName === "yearly"
    ) {
      let days;
      if (filterName === "daily") {
        days = 1;
      } else if (filterName === "weekly") {
        days = 7;
      } else if (filterName === "monthly") {
        days = 30;
      } else if (filterName === "yearly") {
        days = 365;
      }

      if (!isNaN(days)) {
        const startDate = new Date(Date.now());
        startDate.setDate(startDate.getDate() - days);
        query.sellingDate = { $gte: startDate };
        console.log(query);
      }
    }
    const data = await SoldItems.find(query);
    res.json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error retrieving sell products" });
  }
});

router.post("/", async (req, res) => {
  const { items } = req.body;
  console.log(items);
  try {
    const datas = [];
    for (const item of items) {
      const SoldData = new SoldItems(item);
      // await SoldData.save();
      const savedItems = await SoldData.save();
      datas.push(savedItems);
    }
    res.status(200).json({
      message: "success",
    });
  } catch (err) {
    if (err) {
      console.log(err);
      res.status(500).json({
        message: "error",
      });
    }
  }
});

router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  const query = { _id: new Object(id) };
  await SoldItems.deleteOne(query)
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

module.exports = router;
