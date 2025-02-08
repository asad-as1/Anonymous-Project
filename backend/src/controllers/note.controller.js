const Note = require("../models/Note");

// Create a new note
exports.createNote = async (req, res) => {
  try {
    // console.log(req.body)
    const { title, description, file } = req.body;

    if (!title || !description || !file) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const newNote = new Note({
      title,
      description,
      file,
      author: req.user.id, 
    });

    await newNote.save();
    res.status(201).json(newNote);
  } catch (error) {
    console.error("Error creating note:", error);
    res.status(500).json({ message: "Server error. Please try again." });
  }
};

// Get all notes
exports.getNotes = async (req, res) => {
  try {
    const notes = await Note.find().populate("author", "username email").sort({ createdAt: -1 });
    res.status(200).json(notes);
  } catch (error) {
    console.error("Error fetching notes:", error);
    res.status(500).json({ message: "Server error. Please try again." });
  }
};
