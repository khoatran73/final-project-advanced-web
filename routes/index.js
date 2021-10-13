const notificationRouter = require('./notification')

function route(app) {

    app.use('/notification', notificationRouter)
}

module.exports = route
