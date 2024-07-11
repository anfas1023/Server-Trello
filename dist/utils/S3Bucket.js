"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const client_s3_1 = require("@aws-sdk/client-s3");
const multer_s3_1 = __importDefault(require("multer-s3"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const s3Config = {
    credentials: {
        secretAccessKey: process.env.S3_SECRET_KEY || '',
        accessKeyId: process.env.S3_ACCESS_KEY || ''
    },
    region: process.env.REGION || ''
};
const s3 = new client_s3_1.S3Client(s3Config);
const storage = (0, multer_s3_1.default)({
    s3: s3,
    bucket: "projecttello",
    contentType: multer_s3_1.default.AUTO_CONTENT_TYPE,
    metadata: function (req, file, cb) {
        cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
        cb(null, Date.now().toString());
    }
});
function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png|gif|mp4|mov|pdf/;
    const extname = filetypes.test(path_1.default.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
        return cb(null, true);
    }
    else {
        cb('Error: Images only (jpeg, jpg, png, gif, mp4, mov, png)!');
    }
}
const upload = (0, multer_1.default)({
    storage: storage,
    fileFilter: function (req, file, cb) {
        // console.log("req",req);  
        checkFileType(file, cb);
    },
});
const uploadMiddleWare = upload;
exports.default = uploadMiddleWare;
