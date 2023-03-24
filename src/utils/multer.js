const multer = require('multer')
const multerS3 = require('multer-s3')
const AWS = require('aws-sdk');
require('dotenv').config();

const S3 = new AWS.S3({
    region: process.env.REGION,
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY
});

// Create multer function for file upload
exports.uploadBanners = multer({
    storage: multerS3({
        s3: S3,
        // acl: 'public-read',
        bucket: process.env.IMAGE_BUCKET_NAME,
        metadata: (req, file, callBack) => {
            callBack(null, { fieldName: file.fieldname })
        },
        key: (req, file, callBack) => {
            // var fullPath = 'banners/' + new Date().toISOString() + '-' + file.originalname; //If you want to save into a folder concat de name of the folder to the path
            var fullPath = new Date().toISOString() + '-' + file.originalname;
            callBack(null, fullPath)
        }
    }),
    limits: { fileSize: 5000000 }, // In bytes: 5000000 bytes = 5 MB
    // fileFilter: function (req, file, cb) {
    //     checkFileType(file, cb);
    // }
}).array('banner_image', 10);
// }).single('banners', 10);   --> for single file

// File Upload for Testimonial
exports.uploadFiles = multer({
    storage: multerS3({
        s3: S3,
        // acl: 'public-read',
        bucket: process.env.IMAGE_BUCKET_NAME,
        metadata: (req, file, callBack) => {
            callBack(null, { fieldName: file.fieldname })
        },
        key: (req, file, callBack) => {
            // var fullPath = 'testimonials/' + new Date().toISOString() + '-' + file.originalname; //If you want to save into a folder concat de name of the folder to the path
            var fullPath = new Date().toISOString() + '-' + file.originalname;
            callBack(null, fullPath)
        }
    }),
    limits: { fileSize: 15000000 }, // In bytes: 15000000 bytes = 15 MB
    // fileFilter: function (req, file, cb) {
    //     checkFileType(file, cb);
    // }
}).array('files', 10);

// File Upload for Testimonial
exports.uploadImages = multer({
    storage: multerS3({
        s3: S3,
        // acl: 'public-read',
        bucket: process.env.IMAGE_BUCKET_NAME,
        metadata: (req, file, callBack) => {
            callBack(null, { fieldName: file.fieldname })
        },
        key: (req, file, callBack) => {
            // var fullPath = 'testimonials/' + new Date().toISOString() + '-' + file.originalname; //If you want to save into a folder concat de name of the folder to the path
            var fullPath = new Date().toISOString() + '-' + file.originalname;
            callBack(null, fullPath)
        }
    }),
    limits: { fileSize: 15000000 }, // In bytes: 15000000 bytes = 15 MB
    // fileFilter: function (req, file, cb) {
    //     checkFileType(file, cb);
    // }
}).single('image', 10);

exports.uploadDocs = multer({
    storage: multerS3({
        s3: S3,
        // acl: 'public-read',
        bucket: process.env.DOC_BUCKET_NAME,
        metadata: (req, file, callBack) => {
            callBack(null, { fieldName: file.fieldname })
        },
        key: (req, file, callBack) => {
            // var fullPath = 'testimonials/' + new Date().toISOString() + '-' + file.originalname; //If you want to save into a folder concat de name of the folder to the path
            var fullPath = new Date().toISOString() + '-' + file.originalname;
            callBack(null, fullPath)
        }
    }),
    limits: { fileSize: 15000000 }, // In bytes: 15000000 bytes = 15 MB
    // fileFilter: function (req, file, cb) {
    //     checkFileType(file, cb);
    // }
}).single("attachment");