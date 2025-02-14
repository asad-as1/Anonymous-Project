const express = require("express");
const {
  saveUserActivity,
  savePageVisit,
  getUserActivity,
} = require("../controllers/activity.controller");
const { authenticate } = require('../middlewares/auth'); 


const router = express.Router();

router.post("/newActivity", authenticate, saveUserActivity);
router.post("/page-visit", authenticate, savePageVisit);
router.post("/:userId", authenticate, getUserActivity);

module.exports = router;
