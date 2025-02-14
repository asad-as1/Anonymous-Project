const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
  userId: String,
  date: String,
  totalActiveTime: { type: Number, default: 0 },
  pagesVisited: { type: [String], default: [] }
});

module.exports = mongoose.model("Activity", activitySchema);
