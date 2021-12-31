const cloudinary = require('cloudinary')
require("dotenv").config()

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
})

module.exports.uploads = (file, folder) => {
    return new Promise(resolve => {
        cloudinary.uploader.upload(file, (result) => {
            resolve({
                url: result.secure_url,
                cloudinary_id: result.public_id,
            })
        }, {
            folder: folder
        })
    })
}

module.exports.destroys = public_id => {
    return new Promise(resolve => {
        cloudinary.uploader.destroy(public_id, (result) => {
            resolve({
                message: "destroy success"
            })
        })
    })
}

