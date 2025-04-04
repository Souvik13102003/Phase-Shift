// routes/billing.routes.js
const express = require("express");
const router = express.Router();
const { billStudent } = require("../controllers/billing.controller");
const { protect } = require("../middlewares/auth.middleware");
const upload = require("../middlewares/MulterScreenshot");

// @route   POST /api/billing/bill
// @desc    Bill a student with optional screenshot
router.post("/bill", protect, upload.single("screenshot"), billStudent);

module.exports = router;
