const homeRouter = require('./homeRouter')
const accountRouter = require('./accountRouter')
const adminRouter = require('./adminRouter')


function route(app) {
    app.use('/account', accountRouter)
    app.use('/admin', adminRouter)
    app.use('/', homeRouter)
}

module.exports = route
