module.exports = {
    isSignIn: function (req, res, next) {
        if (req.session.email|| req.session.passport.user)
            next()
        else
            res.redirect('/account/login')
    }, isAdmin: function (req, res, next) {
        if (req.session.email && req.session.role === 1)
            next()
        else
            res.redirect('/')
    }
}