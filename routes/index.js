const homeRouter = require('./homeRouter')
const loginRouter = require('./loginRouter')

function route(app) {

    app.use('/login', loginRouter)
    app.use('/', homeRouter)

}

module.exports = route
