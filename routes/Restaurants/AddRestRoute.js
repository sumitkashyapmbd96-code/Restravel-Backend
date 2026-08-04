const express = require('express');
const router = express.Router();
const upload = require('../../controllers/utils/multer')
const partnerAuth = require('../../middleware/partner_auth');
const { addRestaurant, getRest} = require("../../controllers/Restaurants/AddRestController")

// Routes start here

router.post("/addrest", partnerAuth, upload.array("images", 5), addRestaurant)
router.get("/get-restaurants", getRest)

module.exports = router