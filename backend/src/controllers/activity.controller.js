const Activity = require("../models/Activity");
const moment = require("moment-timezone");

const saveUserActivity = async (req, res) => {
  const { userId, activeTime } = req.body;
  const date = moment().tz("Asia/Kolkata").format("YYYY-MM-DD"); // Correct Date

  try {
    let activity = await Activity.findOne({ userId, date });

    if (!activity) {
      activity = new Activity({ userId, date, totalActiveTime: 0 });
    }

    activity.totalActiveTime += activeTime;
    await activity.save();

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};

const savePageVisit = async (req, res) => {
  const { userId, page } = req.body;
  const date = moment().tz("Asia/Kolkata").format("YYYY-MM-DD"); // Correct Date

  try {
    await Activity.updateOne(
      { userId, date },
      { $push: { pagesVisited: page } },
      { upsert: true }
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};


// Get user activity data
const getUserActivity = async (req, res) => {
  try {
    const data = await Activity.find({ userId: req.params.userId });
    // console.log(data)
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};

module.exports = {
  saveUserActivity,
  savePageVisit,
  getUserActivity,
};
