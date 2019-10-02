/* eslint-disable no-param-reassign */
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const multerS3 = require('multer-s3-transform');
const AWS = require('ibm-cos-sdk');
const sharp = require('sharp');

const config = {
  endpoint: process.env.IBM_S3_ENDPOINT,
  apiKeyId: process.env.IBM_API_KEY_ID,
  serviceInstanceId: process.env.IBM_S3_INSTANCE_ID
};

const cos = new AWS.S3(config);

const storageTypes = {
  local: multer.diskStorage({
    destination: path.resolve(__dirname, '..', '..', 'uploads'),
    filename: (req, file, cb) => {
      crypto.randomBytes(16, (err, hash) => {
        if (err) cb(err);
        file.key = `${hash.toString('hex')}.webp`;
        cb(null, file.key);
      });
    }
  }),
  s3: multerS3({
    s3: cos,
    bucket: process.env.BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    acl: 'public-read',
    shouldTransform(req, file, cb) {
      cb(null, /^image/i.test(file.mimetype));
    },
    transforms: [
      {
        id: 'original',
        key: (req, file, cb) => {
          crypto.randomBytes(16, (err, hash) => {
            if (err) cb(err);
            const fileName = `${hash.toString('hex')}.webp`;
            cb(null, fileName);
          });
        },
        transform(req, file, cb) {
          cb(
            null,
            sharp()
              .resize(300)
              .toFormat('webp')
              .webp({
                quality: 80
              })
          );
        }
      }
    ]
  })
};
module.exports = {
  storage: storageTypes[process.env.STORAGE || 's3'],
  fileFilter: (req, file, cb) => {
    const isAccepted = [
      'image/png',
      'image/jpg',
      'image/jpeg',
      'image/webp'
    ].find(formatoAceito => formatoAceito === file.mimetype);
    if (isAccepted) {
      return cb(null, true);
    }
    return cb(null, false);
  }
};
