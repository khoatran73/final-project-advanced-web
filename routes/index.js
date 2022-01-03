const homeRouter = require('./homeRouter')
const accountRouter = require('./accountRouter')
const adminRouter = require('./adminRouter')
const postRouter = require('./postRouter')
const commentRouter = require('./commentRouter')
const notificationRouter = require('./notificationRouter')

function route(app) {
    app.use('/account', accountRouter)
    app.use('/admin', adminRouter)
    app.use('/post',postRouter)
    app.use('/comment', commentRouter)
    app.use('/notification', notificationRouter)
    app.use('/', homeRouter)
}

module.exports = route
