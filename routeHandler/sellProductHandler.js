const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const sellSchema = require("../schemas/sellSchema");
const SellProduct = new mongoose.model("SellProduct", sellSchema);
const verifyLogin = require("../middlewares/verifyLogin");

router.get("/", async (req, res) => {
  try {
    const data = await SellProduct.find().sort({ sellingDate: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({
      message: "error",
    });
  }
});
router.get("/state", async (req, res) => {
  const { email, searchValue, role, currentPage, itemsPerPage } = req.query;
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

    const items = await SellProduct.find(query)
      .skip(skip)
      .limit(itemsPerPage)
      .sort({ sellingDate: -1 });
    if (!items || items.length === 0) {
      return res
        .status(404)
        .json({
          message: "No items found for the given email and search term",
        });
    }
    // console.log(items);

    // Total number of blogs
    const totalCount = await SellProduct.countDocuments();
    res.status(200).json({ items, totalCount });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error occurred while searching for items",
    });
  }
});
router.get("/search", async (req, res) => {
  const { searchValue, currentPage, itemsPerPage } = req.query;

  try {
    let query = {};
    // if (role === 'employee') {
    //     if (!email) {
    //         return res.status(400).json({ message: 'Missing email for employee role' });
    //     }
    //     query.email = email;
    // }
    // else if (role === 'admin') {
    //     query = {};
    // }
    // else {
    //     return res.status(400).json({ message: 'Invalid user' });
    // }
    if (searchValue && searchValue.trim() !== " ") {
      query.$or = [{ productCode: searchValue }];
    }

    const skip = currentPage * itemsPerPage;

    const items = await SellProduct.find(query)
      .skip(skip)
      .limit(itemsPerPage)
      .sort({ sellingDate: -1 });
    // if (!items || items.length === 0) {
    //     return res.status(404).json({ message: 'No items found for the given email and search term' });
    // }
    // console.log(items);

    // Total number of blogs
    const totalCount = await SellProduct.countDocuments();
    res.status(200).json({ items, totalCount });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error occurred while searching for items",
    });
  }
});
router.get("/:category", async (req, res) => {
  const { category } = req.params;
  const query = { category: category };
  await SellProduct.find(query)
    .sort({ sellingDate: -1 })
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

router.get("/1/filter", async (req, res) => {
  const { categoryName, filterName } = req.query;
  let query = { category: categoryName };
  console.log(query, filterName);
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
        const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
        query.sellingDate = { $gte: startDate };
      }
    }

    const data = await SellProduct.find(query);
    res.json(data);
    console.log(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error retrieving sell products" });
  }
});

router.get("/1/:id", async (req, res) => {
  const id = req.params.id;
  const query = { _id: new Object(id) };
  await SellProduct.findOne(query)
    .sort({ sellingDate: -1 })
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

router.post("/", async (req, res) => {
  const data = req.body;
  const query = { productCode: data?.productCode };
  const existingProductCode = await SellProduct.findOne(query);
  if (existingProductCode) {
    return res.json({ message: "Product Code has alredy taken" });
  }
  const NewSellProduct = new SellProduct(data);
  await NewSellProduct.save()
    .then((data) => {
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
  await SellProduct.deleteOne(query)
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

router.patch("/cartUpdate", async (req, res) => {
  const { items } = req.body;
  // console.log(items)

  for (const item of items) {
    const { code, quantity } = item;
    // console.log(code)
    // console.log(quantity)
    const product = await SellProduct.findOne({ productCode: code });
    const newQuantity = product?.quantity - quantity;
    const filter = { productCode: code };
    const updatedDoc = { quantity: newQuantity };
    await SellProduct.updateOne(filter, updatedDoc);
  }
});

// Update a sell product
router.put("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const updatedProduct = await SellProduct.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
