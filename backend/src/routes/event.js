const express = require("express");
const router = express.Router();
const eventController = require("../controllers/event.controller");
const { authenticate } = require('../middlewares/auth'); 


router.post("/newEvent", authenticate, eventController.addEvent);
router.post("/fetchAll", authenticate, eventController.getEvents);
router.post("/delete/:id", authenticate, eventController.deleteEvent);
router.put("/:id", authenticate, eventController.updateEvent);

module.exports = router;
