const Event = require("../models/Event");
const User = require("../models/User");

exports.addEvent = async (req, res) => {
  try {
    // console.log(req.body)
    const { title, startTime, endTime, description } = req.body;
    const userId = req?.user?.id;

    if (!userId || !title || !startTime || !endTime) {
      return res.status(400).json({ message: "All required fields must be filled!" });
    }

    if (new Date(endTime) <= new Date(startTime)) {
      return res.status(400).json({ message: "End time must be after start time!" });
    }

    const newEvent = new Event({
      title,
      startTime,
      endTime,
      description,
      author: userId,
    });

    const savedEvent = await newEvent.save();

    await User.findByIdAndUpdate(userId, { $push: { events: savedEvent._id } });

    res.status(201).json({ message: "Event added successfully!", event: savedEvent });
  } catch (error) {
    console.error("Error adding event:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all events for a user
exports.getEvents = async (req, res) => {
  try {
    const userId = req?.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized access!" });
    }

    const events = await Event.find({ author: userId });

    res.status(200).json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete an event and remove its reference from the user
exports.deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    // console.log(req.body)

    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: "Event not found!" });
    }

    if (event.author.toString() !== req.user.id) {
      return res.status(403).json({ message: "You are not authorized to delete this event!" });
    }

    await Event.findByIdAndDelete(id);
    await User.findByIdAndUpdate(event.author, { $pull: { events: id } });

    res.status(200).json({ message: "Event deleted successfully!" });
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update an event
exports.updateEvent = async (req, res) => {
  try {
    // console.log(req.body)
    const { id } = req.params;
    const { title, startTime, endTime, description } = req.body;

    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: "Event not found!" });
    }

    if (event.author.toString() !== req.user.id) {
      return res.status(403).json({ message: "You are not authorized to update this event!" });
    }

    if (startTime && endTime && new Date(endTime) <= new Date(startTime)) {
      return res.status(400).json({ message: "End time must be after start time!" });
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      { title, startTime, endTime, description },
      { new: true, runValidators: true }
    );

    res.status(200).json({ message: "Event updated successfully!", event: updatedEvent });
  } catch (error) {
    console.error("Error updating event:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
