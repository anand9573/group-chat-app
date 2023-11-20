const aws = require("aws-sdk");
const fs = require('fs');


exports.uploadFile = async function uploadFile(file) {
    try {
        const s3bucket = new aws.S3({
            accessKeyId: process.env.AWS_S3_ACCESS_KEY,
            secretAccessKey: process.env.AWS_S3_SECRET_KEY,
            region: process.env.AWS_REGION
        });

        var params = {
            Bucket: process.env.BUCKET_NAME,
            Key: `${file.originalname}/${new Date()}`,
            Body: file.buffer,
            ContentType: file.mimetype,
            ACL: 'public-read'
        }

        const result = await s3bucket.upload(params).promise();
        return result;
    } catch (err) {
        console.log(err);
        throw err;
    }
}


// const fs = require('fs');
// const S3=require('aws-sdk/clients/s3')

// // AWS.config.update({
// //   accessKeyId: process.env.IAM_USER_KEY,
// //   secretAccessKey: process.env.IAM_USER_SECRET,
// //   region: process.env.AWS_REGION,
// // });

// const s3 = new S3({
//   accessKeyId: process.env.IAM_USER_KEY,
//   secretAccessKey: process.env.IAM_USER_SECRET,
//   region: process.env.AWS_REGION,
// });

// exports.uploadToS3 = async (file) => {
//   const fileStream = fs.createReadStream(file.path);
  
//   const uploadParams = {
//     Bucket: process.env.BUCKET_NAME,
//     Key: file.filename,
//     Body: fileStream,
//   };

//   try {
//     const uploadResponse = await s3.upload(uploadParams).promise();
//     console.log(`File uploaded successfully. URL: ${uploadResponse.Location}`);
//     return uploadResponse.Location;
//   } catch (error) {
//     console.error(`Error uploading file: ${error.message}`);
//     throw error;
//   }
// }


// const AWS=require('aws-sdk');

// exports.uploadToS3=async(file,filename)=>{
//     const BUCKET_NAME=process.env.BUCKET_NAME;
//     let s3bucket=new AWS.S3({
//         accessKeyId:process.env.IAM_USER_KEY,
//         secretAccessKey:process.env.IAM_USER_SECRET,
//         region: process.env.AWS_REGION
//     })
//         var params={
//             Bucket:BUCKET_NAME,
//             Key:filename,
//             Body:file.buffer,
//             ACL:'public-read'
//         }
//         try {
//             const s3response = await s3bucket.upload(params).promise();

//             return s3response.Location;
//         } catch (err) {
//             console.log('something went wrong', err);
//             throw err;
//         }
//     }


    