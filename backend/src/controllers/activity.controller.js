const Activity = require("../models/Activity");
const moment = require("moment-timezone");

const saveUserActivity = async (req, res) => {
  // console.log(req.body)
  const { userId, activeTime } = req.body;
  const today = moment().tz("Asia/Kolkata").startOf("day").toDate(); // Start of today

  try {
    let activity = await Activity.findOne({
      userId,
      lastUpdated: { 
        $gte: today, 
        $lt: moment(today).add(1, "day").toDate() // Ensure only today's activity is updated
      }
    });

    if (!activity) {
      // If no activity for today, create a new one
      activity = new Activity({ userId, totalActiveTime: activeTime, lastUpdated: new Date() });
    } else {
      // If activity exists for today, update active time
      activity.totalActiveTime += activeTime;
      activity.lastUpdated = new Date();
    }

    await activity.save();
    res.json({ success: true, activity });
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};

const savePageVisit = async (req, res) => {
  const { userId, page } = req.body;
  const today = moment().tz("Asia/Kolkata").startOf("day").toDate(); // Start of today

  try {
    const activity = await Activity.findOneAndUpdate(
      { 
        userId, 
        lastUpdated: { 
          $gte: today, 
          $lt: moment(today).add(1, "day").toDate() // Ensure only today's activity is updated
        }
      },
      { 
        $inc: { [`pagesVisited.${page}`]: 1 }, 
        $set: { lastUpdated: new Date() } // Update timestamp
      },
      { new: true } // Return updated document
    );

    if (!activity) {
      return res.status(404).json({ error: "Activity not found for today" });
    }

    res.json({ success: true, activity });
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};


// Get user activity data
const getUserActivity = async (req, res) => {
  try {
    const data = await Activity.find({ userId: req.user.id }).sort({ lastUpdated: -1 });
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
