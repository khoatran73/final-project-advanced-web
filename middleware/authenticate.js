module.exports = {
    isSignIn: function (req, res, next) {
        if (req.session.user || req.session.passport?.user)
            next()
        else
            res.redirect('/account/login')
    }, isAdmin: function (req, res, next) {
        if (req.session.user && req.session.user?.role === 1)
            next()
        else
            res.redirect('/')
    }, isFaculty: function (req, res, next) {
        if (req.session.user && req.session.user?.role === 2)
            next()
        else
            res.redirect('/')
    }, isNotStudent: function (req, res, next) {
        const user = req.session.user
        if (user && user.role === 2 || user.role === 1)
            next()
        else
            res.redirect('/')
    }, rejectUser: function (req, res, next) {
        const user = req.session.user || req.session.passport?.user
        if (user)
            res.redirect('/')
        else{
            next()
        }
    }
}