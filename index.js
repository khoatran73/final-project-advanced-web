const express = require('express')
const app = express()
const route = require('./routes/index')
const port = 3030

route(app)

app.listen(port, () => {
    console.log("sever is running on port " + port)
})