const express = require('express');
const router = express.Router();
const upload = require('../../controllers/utils/multer');
const partnerAuth = require('../../middleware/partner_auth');
const { AddHotel, getHotel, getMyHotels, UpdateHotels, DeleteHotels } = require('../../controllers/Hotels/HotelController');

router.post('/ad-hotels', partnerAuth, upload.fields([{name: "hotelImages", maxCount: 5}]), AddHotel)

router.get('/get-hotel', getHotel)

router.get('/my-hotels', partnerAuth, getMyHotels)

router.put('/update-hotels/:id', partnerAuth, upload.fields([{ name: "hotelImages", maxCount: 5 }]), UpdateHotels);

router.delete("/delete-hotels/:id", partnerAuth, DeleteHotels);

module.exports = router