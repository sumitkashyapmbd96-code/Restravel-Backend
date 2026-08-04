const fs = require('fs')
const path = require('path')
const Hotel = require('../../models/Hotels/HotelModel');
const { count } = require('console');

// ================= ADD HOTEL =================

const AddHotel = async (req, res) => {


    try {

        const userId = req.user.id;

        const {
            hotelname,
            category,
            city,
            address,
            price,
            rooms,
            amenities,
            description,
        } = req.body;

        // validation 

        if (!hotelname || !city || !price) {
            return res.status(400).json({ message: "Required fields missing" })
        }

        // amenities parsing (strong)

        let parsedAmenities = [];

        if (amenities) {
            try {
                parsedAmenities = JSON.parse(amenities)

            } catch (err) {
                parsedAmenities = amenities.split(",").map(a => a.trim());
            }
        }

        // hotel images handling

        const hotelImages = req.files["hotelImages"]
            ? req.files["hotelImages"].map(file => ({
                filename: file.filename,
                url: file.path
            }))
            : [];

        // create new hotel

        const newHotel = new Hotel({

            user: userId,

            hotelname,
            category,
            city,
            address,
            price,
            rooms,
            amenities: parsedAmenities,
            description,
            hotelImages
        });

        // save to db

        await newHotel.save();

        res.status(200).json({
            message: "Hotel added Successfully",
            data: newHotel
        })

    } catch (err) {
        console.log("Error:", err)
        res.status(500).json({ error: err.message })

    }
}

// ================= GET ALL HOTELS =================

const getHotel = async (req, res) => {
    try {

        const hotels = await Hotel.find().sort({ createdAt: -1 })

        res.status(200).json({
            success: true,
            count: hotels.length,
            data: hotels
        })

    } catch (err) {
        console.log("Error:", err)
        res.status(500).json({ error: err.message })
    }
}

// ================= GET MY HOTELS =================

const getMyHotels = async (req, res) => {
    try {

        const userId = req.user.id;

        const hotels = await Hotel.find({ user: userId }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: hotels.length,
            data: hotels
        })

    } catch (err) {
        console.log("Error:", err)
        res.status(500).json({ error: err.message })
    }
}

// ================= DELETE HOTEL =================

const DeleteHotels = async (req, res) => {

    try {

        const { id } = req.params;
        const userId = req.user.id

        const deleteHotels = await Hotel.findById(id);

        if (!deleteHotels) {
            return res.status(404).json({ message: "Hotel not Found" })
        }

        if (deleteHotels.user.toString() !== userId.toString()) {
            return res.status(403).json({ message: "Unauthorized" });
        }


        // delete image safety

        if (deleteHotels.hotelImages.length > 0) {
            deleteHotels.hotelImages.forEach(img => {
                if (img.url && fs.existsSync(img.url)) {
                    fs.unlinkSync(img.url);
                }
            });
        }

        // Delete Video

        // if (foodMenu.foodVideo?.url && fs.existsSync(foodMenu.foodVideo.url)) {
        //     fs.unlinkSync(foodMenu.foodVideo.url);
        // }

        await Hotel.findByIdAndDelete(id);

        res.status(200).json({
            message: "Hotel Delete Successfully",
        })


    } catch (err) {
        console.log("Error", err);
        res.status(500).json({ error: err.message })

    }
}

// ================= UPDATE HOTEL =================

const UpdateHotels = async (req, res) => {
    try {

        const { id } = req.params;
        const userId = req.user.id

        const {
            hotelname,
            category,
            city,
            address,
            price,
            rooms,
            amenities,
            description,
        } = req.body;

        // existing menu

        let hotel = await Hotel.findById(id);

        if (!hotel) {
            return res.status(404).json({ message: "hotel not Found" })
        }

        // security check

        if (hotel.user.toString() !== userId.toString()) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        // amenities parsing
        let parsedAmenities = [];
        if (amenities) {
            try {
                parsedAmenities = JSON.parse(amenities);
            } catch {
                parsedAmenities = amenities.split(",").map(a => a.trim());
            }
        }

        // image update

        let images = hotel.hotelImages;

        if (req.files?.hotelImages) {
            hotel.hotelImages.forEach(img => {
                if (img.url && fs.existsSync(img.url)) {
                    try {
                        fs.unlinkSync(img.url);
                    } catch (err) {
                        console.log(err);
                    }
                }
            });

            // new images

            images = req.files.hotelImages.map(file => ({
                filename: file.filename,
                url: file.path
            }));
        }

        // video

        // let video = foodMenu.foodVideo;

        // if (req.files?.foodVideo) {
        //     video = {
        //         filename: req.files.foodVideo[0].filename,
        //         url: req.files.foodVideo[0].path
        //     };
        // }

        const updateHotel = await Hotel.findByIdAndUpdate(
            id,
            {
                hotelname,
                category,
                city,
                address,
                price,
                rooms,
                amenities: parsedAmenities,
                description,
                hotelImages: images,
                // hotelVideo: video
            }, { returnDocument: 'after'}
        )

        res.status(200).json({
            message: "Hotel Updated Successfully",
            data: updateHotel
        })


    } catch (err) {
        console.log("Error", err);
        res.status(500).json({ error: err.message })

    }
}

module.exports = {
    AddHotel,
    getHotel,
    getMyHotels,
    UpdateHotels,
    DeleteHotels
}