const mongoose = require('mongoose')
const Schema = mongoose.Schema
const User = require('./User')

const Post = new Schema({
    cloudinary_id: String,
    user_email: { type: String, ref: User },
    image: String,
    description: String,
    video: String,
}, { timestamps: true })

module.exports = mongoose.model('Post', Post)