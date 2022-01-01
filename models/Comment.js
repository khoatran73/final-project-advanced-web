const mongoose = require('mongoose')
const Schema = mongoose.Schema
const User = require('./User')
const Post = require('./Post')

const Comment = new Schema({
    cloudinary_id: String,
    image: String,
    user_email: { type: String, ref: User }, //user commented email
    post_id: { type: mongoose.Types.ObjectId, ref: Post },
    content: String,
}, { timestamps: true })

module.exports = mongoose.model('Comment', Comment)