const fs = require('fs')
const path = require('path')
const Hotel = require('../../models/Hotels/HotelModel');
const { count } = require('console');
const { uploadToS3, deleteFromS3, getSignedImageUrl } = require('../services/s3Service');

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

        const hotelImages = [];

        if (req.files?.hotelImages) {

            for (const file of req.files.hotelImages) {
                const uploaded = await uploadToS3(file, "hotels");

                hotelImages.push({
                    filename: uploaded.fileName,
                    key: uploaded.key,
                    url: uploaded.url
                })
            }
        }

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

        const hotels = await Hotel.find()
            .sort({ createdAt: -1 })
            .lean();

        for (const hotel of hotels) {

            if (hotel.hotelImages?.length > 0) {

                for (const image of hotel.hotelImages) {

                    if (image.key) {

                        image.url = await getSignedImageUrl(image.key);

                    }

                }

            }

        }


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

        const hotels = await Hotel.find({ user: userId })
            .sort({ createdAt: -1 })
            .lean();

        for (const hotel of hotels) {

            if (hotel.hotelImages?.length > 0) {
                for (const image of hotel.hotelImages) {
                    if (image.key) {
                        image.url = await getSignedImageUrl(image.key);
                    }
                }

            }

        }

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

        if (deleteHotels.hotelImages?.length > 0) {
            for (const img of deleteHotels.hotelImages) {
                if (img.key) {
                    try {
                        await deleteFromS3(img.key);

                        console.log(
                            "S3 Images Deleted",
                            img.key
                        );
                    } catch (s3Err) {
                        console.log(
                            "S3 delete error:",
                            s3Err.message
                        );
                    }
                }
            }
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

        let images = hotel.hotelImages || [];

        // If new images uploaded
        if (req.files?.hotelImages?.length > 0) {

            // Delete old S3 images
            for (const img of images) {

                if (img.key) {

                    try {

                        await deleteFromS3(img.key);

                        console.log(
                            "Old S3 image deleted:",
                            img.key
                        );

                    } catch (error) {

                        console.log(
                            "Old S3 image delete error:",
                            error.message
                        );
                    }
                }
            }

            // Upload new images to S3
            images = [];

            for (const file of req.files.hotelImages) {

                const uploaded = await uploadToS3(
                    file,
                    "hotels"
                );

                images.push({
                    filename: uploaded.fileName,
                    key: uploaded.key,
                    url: uploaded.url
                });
            }
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
            }, { returnDocument: 'after' }
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