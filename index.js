const express = require('express')
const app = express()
const cookieParser = require('cookie-parser')
const expressSession = require('express-session')
const MemoryStore = require('session-memory-store')(expressSession)
const cookieSession = require('cookie-session')
var bodyParser = require('body-parser')
const route = require('./routes/index')
const port = process.env.PORT || 3000
const db = require('./server/server')
require('ejs')
require('dotenv').config()

db.connect()

// app.use(express.urlencoded({ extended: true }))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.static("public"))
app.use(cookieParser())
app.use(cookieSession({
    secret: 'secret',
    store: new MemoryStore(60 * 60 * 12),
    cookie: { maxAge: 60 * 60 * 1000 }
}))

app.set('view engine', 'ejs')
route(app)

app.listen(port, () => {
    console.log("sever is running on port " + port)
})
