const Activity = require("../models/Activity");
const moment = require("moment-timezone");

const saveUserActivity = async (req, res) => {
  const { userId, activeTime } = req.body;
  const date = moment().tz("Asia/Kolkata").format("YYYY-MM-DD");
  
  try {
    let activity = await Activity.findOne({ userId });
    
    if (!activity) {
      activity = new Activity({ userId, totalActiveTime: 0 });
    }
    
    activity.totalActiveTime += activeTime;
    await activity.save();
    // console.log(activity)

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};

const savePageVisit = async (req, res) => {
  const { userId, page } = req.body;
  
  try {
    const a = await Activity.findOneAndUpdate(
      { userId },
      { $inc: { [`pagesVisited.${page}`]: 1 } }, 
      { upsert: true, new: true }
    );
    // console.log(a)

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};

// Get user activity data
const getUserActivity = async (req, res) => {
  try {
    const data = await Activity.find({ userId: req.user.id });
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
