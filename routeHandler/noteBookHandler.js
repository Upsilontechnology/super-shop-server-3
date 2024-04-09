const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const noteBookSchema = require("../schemas/noteBookSchema");
const NoteBook = new mongoose.model("noteBook", noteBookSchema);

// get all NoteBook
router.get("/", async (req, res) => {
  try {
    const NoteBooks = await NoteBook.find().sort({
      data: "desc",
    });
    res.json(NoteBooks);
  } catch (error) {
    res.status(500).send("Server Error");
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const query = { _id: new Object(id) };
  try {
    const NoteBooks = await NoteBook.findOne(query);
    res.json(NoteBooks);
  } catch (error) {
    res.status(500).send("Server Error");
  }
})

// Create a new Note
router.post("/", async (req, res) => {
  try {
    const newNote = new NoteBook(req.body);
    await newNote.save();
    res.status(200).json({
      message: "success",
    });
  } catch (err) {
    res.status(500).send("Server Error");
  }
});


module.exports = router;
