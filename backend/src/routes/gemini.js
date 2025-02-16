const express = require("express");
const router = express.Router();
const { summarizeText, compareTexts } = require("../controllers/gemini.controller");
const { authenticate } = require('../middlewares/auth'); 


router.post("/summarize", authenticate, summarizeText);
router.post("/compare", authenticate, compareTexts);

module.exports = router;
