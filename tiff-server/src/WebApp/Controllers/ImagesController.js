const express = require('express');
const Router = express.Router();
const multer  = require('multer');
const GridFsStorage = require("multer-gridfs-storage");
const crypto = require("crypto");
const ImagesRepository = require('../../Infrastructure/MongoDB/Repository/ImagesRepository.js');

// Create storage engine
const storage = new GridFsStorage({
    url: 'mongodb://localhost/tiff',
    file: (req, file) => {

      return new Promise((resolve, reject) => {
        crypto.randomBytes(16, (err, buf) => {
          if (err) {
            return reject(err)
          }
          const filename = file.originalname
          const fileInfo = {
            _id: 2,
            filename: filename,
            bucketName: 'uploads',
          }
          resolve(fileInfo)
        })
      })
    },
  })
  
const upload = multer({ storage })

Router.post("/", upload.single("img"), (req, res, err) => {
    res.send(req.files);
  });

Router.get("/:filename", async (req, res) => {
    await ImagesRepository.getImageByName(req, res)
});

module.exports = Router;