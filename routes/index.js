const homeRouter = require('./homeRouter')
const accountRouter = require('./accountRouter')
const adminRouter = require('./adminRouter')
const postRouter = require('./postRouter')
const commentRouter = require('./commentRouter')
const notificationRouter = require('./notificationRouter')
const profileRouter = require('./profileRouter')

function route(app) {
    app.use('/account', accountRouter)
    app.use('/admin', adminRouter)
    app.use('/post', postRouter)
    app.use('/comment', commentRouter)
    app.use('/notification', notificationRouter)
    app.use('/profile', profileRouter)
    app.use('/', homeRouter)
    app.use((req, res) => {
        const user = req.session.passport?.user || req.session.user
        res.status(404)
        res.render('error', { user: user })
    })
}

module.exports = route
