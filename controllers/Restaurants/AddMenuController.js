const fs = require('fs')
const path = require('path')
const FoodMenu = require("../../models/Restaurants/AddMenu");
const AddRestaurent = require('../../models/Restaurants/AddRestaurent');

// ================= Add Menu =================

const AddMenu = async (req, res) => {

    try {

        console.log("FILES:", req.files);
        console.log("Files:", req.body);

        const {
            foodName,
            foodCategory,
            price,
            description,
            restaurant
        } = req.body;

        // validation

        if (!foodName || !foodCategory || !price || !description || !restaurant) {
            return res.status(400).json({ message: "All required fields missing" });
        }

        // food image handling

        const restaurantData = await AddRestaurent.findById(restaurant)

        console.log("Restaurant Owner:", restaurantData.user.toString());
        console.log("Logged User:", req.user.id);

        if (!restaurantData) {
            return res.status(404).json({ message: "Restaurant not found" })
        }

        if (restaurantData.user.toString() !== req.user.id.toString()) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        const foodImages = req.files["foodImages"]
            ? req.files["foodImages"].map(file => ({
                filename: file.filename,
                url: file.path
            }))
            : [];

        // video handling

        const foodVideo = req.files["foodVideo"]
            ? {
                filename: req.files["foodVideo"][0].filename,
                url: req.files["foodVideo"][0].path
            }
            : {
                filename: "",
                url: ""
            };

        // create new food
        const newfoodMenu = new FoodMenu({

            foodName,
            foodCategory,
            price,
            description,
            restaurant,
            foodImages,
            foodVideo
        });

        // save to DB

        await newfoodMenu.save();

        res.status(201).json({
            message: "foodMenu Added Successfully",
            data: newfoodMenu
        })

    } catch (err) {
        console.log("Error", err);
        res.status(500).json({ error: err.message })
    }
}

// ================= Get All Food (with populate) =================

const getAllFood = async (req, res) => {

    try {

        const foods = await FoodMenu.find()
            .populate("restaurant", "restaurantname city")
            .sort({ createdAt: -1 })

        res.status(200).json({
            success: true,
            count: foods.length,
            data: foods
        })

    } catch (err) {
        console.log("Error fetching food:", err);
        res.status(500).json({
            success: false,
            message: "Server error"
        })

    }
}


// ================= Update Menu =================

const UpdateMenu = async (req, res) => {
    try {

        const { id } = req.params;

        const {
            foodName,
            foodCategory,
            price,
            description,
            restaurant,
        } = req.body;

        // existing menu

        let foodMenu = await FoodMenu.findById(id);

        if (!foodMenu) {
            return res.status(404).json({ message: "Food Menu not Found" })
        }

        // security check 

        const restaurantData = await AddRestaurent.findById(foodMenu.restaurant)

        if (restaurantData.user.toString() !== req.user.id.toString()) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        // image handling

        let images = foodMenu.foodImages;

        if (req.files?.foodImages) {

            // delete old images

            images.forEach(img => {
                if (img.url && fs.existsSync(img.url)) {
                    fs.unlinkSync(img.url)
                }
            })

            images = req.files.foodImages.map(file => ({
                filename: file.filename,
                url: file.path
            }));
        }

        // video handling

        let video = foodMenu.foodVideo;

        if (req.files?.foodVideo) {

            // delete old video
            if (video?.url && fs.existsSync(video.url)) {
                fs.unlinkSync(video.url)
            }
            video = {
                filename: req.files.foodVideo[0].filename,
                url: req.files.foodVideo[0].path
            };
        }

        const updateMenu = await FoodMenu.findByIdAndUpdate(
            id,
            {
                foodName,
                foodCategory,
                price,
                description,
                restaurant,
                foodImages: images,
                foodVideo: video
            }, { new: true }
        )

        res.status(200).json({
            message: "foodMenu Updated Successfully",
            data: updateMenu
        })


    } catch (err) {
        console.log("Error", err);
        res.status(500).json({ error: err.message })

    }
}

// ================= Delete Menu =================

const DeleteMenu = async (req, res) => {
    try {

        const { id } = req.params;

        const foodMenu = await FoodMenu.findById(id);

        if (!foodMenu) {
            return res.status(404).json({ message: "Food Menu not Found" })
        }

        // security check

        const restaurantData = await AddRestaurent.findById(foodMenu.restaurant)

        if (restaurantData.user.toString() !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized" })
        }



        // delete image
        if (foodMenu.foodImages.length > 0) {
            foodMenu.foodImages.forEach(img => {
                if (img.url && fs.existsSync(img.url)) {
                    fs.unlinkSync(img.url);
                }
            });
        }

        // Delete Video

        if (foodMenu.foodVideo?.url && fs.existsSync(foodMenu.foodVideo.url)) {
            fs.unlinkSync(foodMenu.foodVideo.url);
        }

        await FoodMenu.findByIdAndDelete(id);

        res.status(200).json({
            message: "foodMenu Delete Successfully",
        })


    } catch (err) {
        console.log("Error", err);
        res.status(500).json({ error: err.message })

    }
}

module.exports = {
    AddMenu,
    getAllFood,
    UpdateMenu,
    DeleteMenu
}