const mongoose = require('mongoose')
const server = process.env.mongodb || "mongodb://localhost:27017/final-project"
async function connect() {
    try {
        await mongoose.connect(server)
        console.log('connect to MongoDB successfully')
    }
    catch (err) {
        console.log("connection to MongoDB failed")
        console.log(err)
    }
}

module.exports = { connect }
