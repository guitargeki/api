const express = require("express");
const router = express.Router();
exports.router = router;

const participants = require("./participants.js");
const submissions = require("./submissions.js");
const matches = require("./matches.js");
const events = require("./events.js");

router.use("/participants", participants.router);
router.use("/submissions", submissions.router);
router.use("/matches", matches.router);
router.use("/events", events.router);