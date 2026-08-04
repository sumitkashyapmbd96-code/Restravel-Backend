const express = require('express');
const router = express.Router();
const upload = require('../controllers/utils/multer')
const getRestHot = require("../controllers/RestHot")

// Routes start here

router.get("/view-more/:city", getRestHot)

module.exports = router