const express = require('express')
const app = express()
const cookieParser = require('cookie-parser')
const expressSession = require('express-session')
const route = require('./routes/index')
const port = process.env.PORT || 3000
const db = require('./server/server')
require('ejs')
require('dotenv').config()

db.connect()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static("public"))
app.use(cookieParser())
app.use(expressSession({
    resave: false,
    saveUninitialized: false,
    secret: 'secret'
}))

app.set('view engine', 'ejs')
route(app)

app.listen(port, () => {
    console.log("sever is running on port " + port)
})