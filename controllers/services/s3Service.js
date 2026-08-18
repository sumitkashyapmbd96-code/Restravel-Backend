const {
    S3Client,
    PutObjectCommand,
    DeleteObjectCommand,
    GetObjectCommand
} = require("@aws-sdk/client-s3");

const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { randomUUID } = require("crypto");

const s3 = new S3Client({
    region: process.env.AWS_REGION
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET;


// ================= UPLOAD TO S3 =================

const uploadToS3 = async (file, folder = "images") => {

    const extension = file.originalname.includes(".")
        ? file.originalname.substring(
            file.originalname.lastIndexOf(".")
        )
        : "";

    const fileName = `${Date.now()}-${randomUUID()}${extension}`;

    const key = `${folder}/${fileName}`;


    await s3.send(
        new PutObjectCommand({
            Bucket: BUCKET_NAME,
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype
        })
    );


    const url =
        `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;


    // console.log("========== S3 UPLOAD ==========");
    // console.log("Bucket:", BUCKET_NAME);
    // console.log("Key:", key);
    // console.log("URL:", url);
    // console.log("================================");


    return {
        fileName,
        key,
        url
    };
};


// ================= DELETE FROM S3 =================

const deleteFromS3 = async (key) => {

    if (!key) return;

    await s3.send(
        new DeleteObjectCommand({
            Bucket: BUCKET_NAME,
            Key: key
        })
    );

    console.log("S3 Image Deleted:", key);
};

const getSignedImageUrl = async (key) => {

    if (!key) return null;

    const command = new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key
    });

    return await getSignedUrl(s3, command, {
        expiresIn: 3600
    });
};


module.exports = {
    uploadToS3,
    deleteFromS3,
    getSignedImageUrl
};
