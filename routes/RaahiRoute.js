
const express = require("express");
const RaahiAI = require("../controllers/RaahiController");

const router = express.Router();

router.post('/raahi', RaahiAI)

module.exports = router;