module.exports = {
    isSignIn: function (req, res, next) {
        if (req.session.user || req.session.passport?.user)
            next()
        else
            res.redirect('/account/login')
    }, isAdmin: function (req, res, next) {
        if ((req.session.user || req.session.passport?.user) && (req.session.user?.role === 1 || req.session.passport?.user.role === 1))
            next()
        else
            res.redirect('/')
    }, isFaculty: function (req, res, next) {
        if ((req.session.user || req.session.passport?.user) && (req.session.user?.role === 2 || req.session.passport?.user.role === 2))
            next()
        else
            res.redirect('/')
    }
}