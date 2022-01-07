const mongoose = require('mongoose')
const Schema = mongoose.Schema
const User = require('./User')

const Notification = new Schema({
    title: String,
    content: Array,
    faculty: Number,
    user_email: { type: String, ref: User },
    user_read: { type: Array, default: [] }
}, { timestamps: true })

module.exports = mongoose.model('Notification', Notification)