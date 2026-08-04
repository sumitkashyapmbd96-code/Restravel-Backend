const express = require('express');
const router = express.Router();
const upload = require('../../controllers/utils/multer')
const partnerAuth = require('../../middleware/partner_auth');
// const AddMenu = require("../controllers/AddMenuController")
const { AddMenu, getAllFood, UpdateMenu, DeleteMenu } = require("../../controllers/Restaurants/AddMenuController");

// post route

router.post(
    "/add-menu",
    partnerAuth,
     upload.fields([
        {name: "foodImages", maxCount: 5},
        {name: "foodVideo", maxCount: 1}
     ]),
     AddMenu
    )

    // get route

    router.get("/getmenu", getAllFood)

    // update route

    router.put(
    "/update-menu/:id",
    partnerAuth,
     upload.fields([
        {name: "foodImages", maxCount: 5},
        {name: "foodVideo", maxCount: 1}
     ]),
     UpdateMenu
    )

    // delete route

    router.delete("/delete-menu/:id", partnerAuth, DeleteMenu)

    module.exports = router;