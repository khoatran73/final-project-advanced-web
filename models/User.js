const mongoose = require('mongoose')
const Schema = mongoose.Schema
const crypto = require('crypto')

const User = new Schema({
    uid: String, // sign in with google
    cloudinary_id: String,
    name: String,
    email: { type: String, unique: true, required: true },
    avatar: String,
    role: Number, // 1: admin, 2: Phòng/Khoa, 3: sinh vieen
    class: String,
    faculty: Number,
    posts_like: { type: Array, default: [] },
    user_created: String,
    hash: String,
    salt: String
}, { timestamps: true })

User.methods.setPassword = function (password) {
    this.salt = crypto.randomBytes(16).toString('hex')
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, `sha512`).toString(`hex`)

    return {
        salt: this.salt,
        hash: this.hash
    }
}

User.methods.validPassword = function (password) {
    let hash = crypto.pbkdf2Sync(password,
        this.salt, 1000, 64, `sha512`).toString(`hex`)

    return this.hash === hash
}

module.exports = mongoose.model('User', User)

