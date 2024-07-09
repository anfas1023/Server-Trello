// import AWS from 'aws-sdk'

// const s3= new AWS.S3();

// (async ()=>{
//     s3.putObject({
//         Body:"Hello World",
//         Bucket:"project-my-upload",
//         Key:"my-file.txt"
//     }).promise()
// })();


import multer from 'multer'
import  path from 'path';
import util from 'util';
import  { S3Client ,S3ClientConfig} from '@aws-sdk/client-s3' 

import multerS3  from 'multer-s3'

import dotenv from "dotenv";
dotenv.config();

const s3Config: S3ClientConfig = {
  credentials: {
    secretAccessKey: process.env.S3_SECRET_KEY || '',
    accessKeyId: process.env.S3_ACCESS_KEY || ''
  },
  region: process.env.REGION || ''
};

const s3 = new S3Client(s3Config);


const storage = multerS3({
  s3: s3,
  bucket: "projecttello",
  contentType: multerS3.AUTO_CONTENT_TYPE,
  metadata: function (req :any, file :any, cb:any) {
    cb(null, {fieldName: file.fieldname});
  },
  key: function (req : any, file : any, cb:any) {
    cb(null, Date.now().toString())
  }
})
  

  function checkFileType(file : any, cb:any) {
    const filetypes = /jpeg|jpg|png|gif|mp4|mov|pdf/;

    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    const mimetype = filetypes.test(file.mimetype);
    

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb('Error: Images only (jpeg, jpg, png, gif, mp4, mov, png)!');
    }
  }

  const upload = multer({
  
    
    storage: storage,
    fileFilter: function (req :any, file :any, cb :any) {
        // console.log("req",req);  
        
      checkFileType(file, cb);
    },
  }); 
  
  const uploadMiddleWare = upload

 export default uploadMiddleWare
 
  
