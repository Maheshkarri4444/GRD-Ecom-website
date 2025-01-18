const express = require("express");
const { getChatResponse } = require("../controllers/chatController");

const router = express.Router();

router.post("/", getChatResponse);

module.exports = router;
