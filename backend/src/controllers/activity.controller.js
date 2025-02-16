const Activity = require("../models/Activity");
const moment = require("moment-timezone");

const saveUserActivity = async (req, res) => {
  const { userId, activeTime } = req.body;
  const today = moment().tz("Asia/Kolkata").startOf("day").toDate();

  try {
    const activity = await Activity.findOneAndUpdate(
      { 
        userId, 
        lastUpdated: { 
          $gte: today, 
          $lt: moment(today).add(1, "day").toDate() 
        } 
      },
      { 
        $inc: { totalActiveTime: activeTime }, 
        $set: { lastUpdated: new Date() },
        $setOnInsert: { userId }  
      },
      { new: true, upsert: true } 
    );

    res.json({ success: true, activity });
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};


const savePageVisit = async (req, res) => {
  const { userId, page } = req.body;
  const today = moment().tz("Asia/Kolkata").startOf("day").toDate();

  try {
    const activity = await Activity.findOneAndUpdate(
      { 
        userId, 
        lastUpdated: { 
          $gte: today, 
          $lt: moment(today).add(1, "day").toDate() 
        } 
      },
      { 
        $inc: { [`pagesVisited.${page}`]: 1 }, 
        $set: { lastUpdated: new Date() },
        $setOnInsert: { userId } 
      },
      { new: true, upsert: true } // Ensures atomic operation
    );

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
