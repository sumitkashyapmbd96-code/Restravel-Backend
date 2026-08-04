const AddRestaurent = require('../../models/Restaurants/AddRestaurent');

// ================= Add Restaurants =================

const addRestaurant = async (req, res) => {

    try {

        console.log("FILES:", req.files);

        const userId = req.user.id;

        const {
            restaurentname,
            city,
            address,
            phonenumber,
        } = req.body;

        // validation

        if (!restaurentname || !city || !address || !phonenumber) {
            return res.status(400).json({
                success: false,
                message: "Required fields missing"
            })
        }

        if (!/^[0-9]{10}$/.test(phonenumber)) {
            return res.status(400).json({
                success: false,
                message: "Invalid phone number"
            })
        }

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: "At least one image required"
            })
        }

        // duplicate user check

        // if (existing) {
        //     return res.status(400).json({
        //         success: false,
        //         message: "Restaurant already exist"
        //     })
        // }

        // file maping

        const images = req.files.map(file => ({
            filename: file.filename,
            url: `/uploads/images/${file.filename}`
        }));

        const newRestaurent = new AddRestaurent({

            user: userId,

            restaurentname: restaurentname.trim(),
            city: city.trim(),
            address: address.trim(),
            phonenumber,
            images
        })

        await newRestaurent.save();

        res.status(201).json({
            message: "Restaurent Added Successfully",
            data: newRestaurent
        })


    } catch (err) {
        console.log("Error", err);
        res.status(500).json({ error: err.message });

    }
}

// ================= GET ALL Restaurants =================

const getRest = async (req, res) => {

    try {

        const restaurants = await AddRestaurent.find().sort({ createdAt: -1 })

        res.status(200).json({
            success: true,
            count: restaurants.length,
            data: restaurants
        })

    } catch (err) {
        console.log("Error:", err)
        res.status(500).json({ error: err.message })
    }
}

module.exports = {
    addRestaurant,
    getRest
}