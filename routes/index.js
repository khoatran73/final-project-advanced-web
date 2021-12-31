const homeRouter = require('./homeRouter')
const loginRouter = require('./loginRouter')
const adminRouter = require('./adminRouter')

function route(app) {
    app.use('/login', loginRouter)
    app.use('/admin', adminRouter)
    app.use('/', homeRouter)
}

module.exports = route
