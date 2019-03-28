const express = require("express");
const router = express.Router();
exports.router = router;

const Messages = {
    NOT_FOUND: "Participant not found"
};

// Get Participant
// Returns a participant object for a given ID.
router.get("/:id", (request, response) => {
    response.send("Get participant with id: " + request.params.id);
});

// Get Participants
// Returns an array of participant objects. By default, returns the top 20 participants (based on Elo).
router.get("/", (request, response) => {
    response.send("Get all participants");
});