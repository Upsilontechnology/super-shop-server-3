const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const orderSchema = require("../schemas/orderSchema");
const OrderProductDB = new mongoose.model("OrderProductDB", orderSchema);

router.get("/", async (req, res) => {
  try {
    const data = await OrderProductDB.find().sort({ deliveryDate: 1 });
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

    const items = await OrderProductDB.find(query)
      .skip(skip)
      .limit(itemsPerPage)
      .sort({ deliveryDate: -1 });
    if (!items || items.length === 0) {
      return res.status(404).json({
        message: "No items found for the given email and search term",
      });
    }
    const totalCount = await OrderProductDB.countDocuments();
    res.status(200).json({ items, totalCount });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error occurred while searching for items",
    });
  }
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const query = { _id: new Object(id) };
  await OrderProductDB.findOne(query)
    .sort({ deliveryDate: 1 })
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
  const { filterName } = req.query;

  try {
    let query = {};

    if (filterName === "daily") {
      const startDate = new Date();
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date();
      endDate.setHours(23, 59, 59, 999);
      query.deliveryDate = { $gte: startDate, $lte: endDate };
    } else if (filterName === "weekly") {
      const startDate = new Date();
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + (7 - endDate.getDay()));
      endDate.setHours(23, 59, 59, 999);
      query.deliveryDate = { $gte: startDate, $lte: endDate };
    } else if (filterName === "monthly") {
      const startDate = new Date();
      startDate.setDate(1);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + 1);
      endDate.setDate(0);
      endDate.setHours(23, 59, 59, 999);
      query.deliveryDate = { $gte: startDate, $lte: endDate };
    } else if (filterName === "yearly") {
      const startDate = new Date();
      startDate.setMonth(0);
      startDate.setDate(1);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(startDate);
      endDate.setFullYear(endDate.getFullYear() + 1);
      endDate.setDate(0);
      endDate.setHours(23, 59, 59, 999);
      query.deliveryDate = { $gte: startDate, $lte: endDate };
    }

    const data = await OrderProductDB.find(query);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving sell products" });
  }
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const query = { _id: new Object(id) };
  await OrderProductDB.findOne(query)
    .sort({ deliveryDate: 1 })
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

router.get("/1/search", async (req, res) => {
  const { email, searchValue, currentPage, itemsPerPage, status } = req.query;
  try {
    // console.log("attack search");
    let query = {};
    if (!email) {
      return res.status(400).json({ message: "Invalid user" });
    } else {
      query = {};
    }

    if (searchValue && searchValue.trim() !== " ") {
      query.$or = [{ productCode: searchValue }];
    }

    if (status) {
      query.status = status;
    }
    // console.log(req.query);
    const skip = currentPage * itemsPerPage;

    const items = await OrderProductDB.find(query)
      .skip(skip)
      .limit(itemsPerPage)
      .sort({ deliveryDate: -1 });
    // console.log("object", items);
    if (!items || items.length === 0) {
      return res.status(404).json({
        message: "No items found for the given email and search term",
      });
    }
    // Total number of blogs
    const totalCount = await OrderProductDB.countDocuments(query);
    console.log(totalCount);
    res.status(200).json({ items, totalCount });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error occurred while searching for items",
    });
  }
});

// router.patch("/productStatus/:productId", async (req, res) => {
//   const productId = req.params.productId;
//   console.log(productId);
//   try {
//     const updatedDoc = await OrderProductDB.findByIdAndUpdate(
//       productId,
//       { $set: { productStatus: "complete" } },
//       { new: true }
//     );

//     if (!updatedDoc) {
//       return res.status(404).json({ message: "Document not found" });
//     }

//     res.status(200).json({ message: "success" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });

// router.post("/", async (req, res) => {
//   try {
//     const { productCode } = req.body;
//     console.log("attack");
//     console.log(req.body);
//     const existingProductCode = await OrderProductDB.findOne({ productCode });
//     console.log(existingProductCode);
//     if (existingProductCode) {
//       return res.status(400).json({ message: "Invoice number already exists" });
//     }

//     const newOrderProductDB = new OrderProductDB(req.body);
//     await newOrderProductDB.save();
//     res.status(200).json({ message: "Success" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });

// router.patch("/productStatus/:productId", async (req, res) => {
//   const productId = req.params.productId;
//   console.log(productId);

//   try {
//     const updatedDoc = await OrderProductDB.findByIdAndUpdate(
//       productId,
//       { $set: { "products.$[elem].productStatus": "complete" } },
//       {
//         new: true,
//         arrayFilters: [{ "elem._id": productId }],
//       }
//     );

//     if (!updatedDoc) {
//       return res.status(404).json({ message: "Document not found" });
//     }

//     res.status(200).json({ message: "success" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });

// router.patch("/orderId/:orderId/productStatus/:productId", async (req, res) => {
//   const orderId = req.params.orderId;
//   const productId = req.params.productId;
//   console.log("attack", orderId, productId);
//   try {
//     const existingOrder = await OrderProductDB.findById(orderId);
//     if (!existingOrder) {
//       return res.status(404).json({ message: "Order not found" });
//     }

//     const updatedOrder = await OrderProductDB.findByIdAndUpdate(
//       orderId,
//       {
//         $set: { "products.$[elem].productStatus": "complete" },
//       },
//       {
//         new: true,
//         arrayFilters: [{ "elem._id": mongoose.Types.ObjectId(productId) }],
//       }
//     );

//     if (!updatedOrder) {
//       return res.status(404).json({ message: "Product not found in order" });
//     }

//     res.status(200).json({ message: "Product status updated successfully" });
//   } catch (error) {
//     console.error(error);
//     let errorMessage = "Internal server error";
//     if (error.name === "CastError") {
//       errorMessage = "Invalid order or product ID";
//     }

//     res.status(500).json({ message: errorMessage });
//   }
// });

router.patch("/orderId/:orderId/productStatus/:productId", async (req, res) => {
  const orderId = req.params.orderId;
  const productId = req.params.productId;
  // console.log(orderId, productId);
  try {
    const existingOrder = await OrderProductDB.findById(orderId);
    if (!existingOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    const updatedOrder = await OrderProductDB.findByIdAndUpdate(
      orderId,
      {
        $set: { "products.$[elem].productStatus": "complete" },
      },
      {
        new: true,
        arrayFilters: [{ "elem._id": new mongoose.Types.ObjectId(productId) }],
      }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Product not found in order" });
    }

    res.status(200).json({ message: "success" });
  } catch (error) {
    console.error(error);
    let errorMessage = "Internal server error";
    if (error.name === "CastError") {
      errorMessage = "Invalid order or product ID";
    }

    res.status(500).json({ message: errorMessage });
  }
});

router.post("/", async (req, res) => {
  const data = req.body;
  const query = { invoiceNo: data?.invoiceNo };
  const existingInvoiceNo = await OrderProductDB.findOne(query);
  if (existingInvoiceNo) {
    return res.json({ message: "Product Code has alredy taken" });
  }
  const NewOrderProductDB = new OrderProductDB(data);
  await NewOrderProductDB.save()
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

// router.patch("/:id", async (req, res) => {
//   const id = req.params.id;
//   const filter = { _id: new Object(id) };
//   const updatedDoc = {
//     $set: {
//       status: "completed",
//     },
//   };
//   await OrderProductDB.updateOne(filter, updatedDoc)
//     .then(() => {
//       res.status(200).json({
//         message: "success",
//       });
//     })
//     .catch((err) => {
//       console.log(err);
//       res.status(500).json({
//         message: "error",
//       });
//     });
// });

router.patch("/:id", async (req, res) => {
  const id = req.params.id;
  console.log(id);
  try {
    const mainStatusUpdate = await OrderProductDB.updateOne(
      { _id: id },
      { $set: { status: "completed" } }
    );

    const productStatusUpdate = await OrderProductDB.updateMany(
      { _id: id },
      { $set: { "products.$[].productStatus": "completed" } }
    );

    if (
      mainStatusUpdate.nModified === 0 ||
      productStatusUpdate.nModified === 0
    ) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ message: "success" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  const query = { _id: new Object(id) };
  await OrderProductDB.deleteOne(query)
    .then(() => {
      res.status(200).json({
        message: "item deleted",
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        message: "error",
      });
    });
});

module.exports = router;
