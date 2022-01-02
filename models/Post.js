const mongoose = require('mongoose')
const Schema = mongoose.Schema
const User = require('./User')

const Post = new Schema({
    cloudinary_id: String,
    user_email: { type: String, ref: User },
    image: String,
    description: String,
    video: String,
    users_like: { type: Array, default: [] },
    like: { type: Number, default: 0 }
}, { timestamps: true })

module.exports = mongoose.model('Post', Post)