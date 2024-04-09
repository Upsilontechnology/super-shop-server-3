const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const categorySchema = require("../schemas/categorySchema");
const Category = new mongoose.model("Category", categorySchema);

router.get("/", async (req, res) => {
  try {
    const data = await Category.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({
      message: "error",
    });
  }
});

router.post("/", async (req, res) => {
  const data = req.body;
  const query = { category: data?.category };
  const existingCategory = await Category.findOne(query);
  if (existingCategory) {
    return res.json({ message: "Category has already added" });
  }
  const NewCategory = new Category(data);
  await NewCategory.save()
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
router.delete("/:categoryId", async (req, res) => {
  const { categoryId } = req.params;
  const query = { _id: new Object(categoryId) };
  await Category.deleteOne(query)
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

router.put("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const updatedProduct = await Category.findByIdAndUpdate(id, req.body, {
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
