const User = require('../models/User')

class LoginController {
    login(req, res) {
        res.render('login')
    }

    async auth(req, res) {
        const { email, password } = req.body

        if (!email || !password) {
            return res.json({ code: 1, message: "Please enter enough information" })
        } else {
            await User.findOne({ email: email })
                .then(user => {
                    if (user.validPassword(password)) {
                        req.session.email = user.email
                        req.session.role = user.role

                        return res.json({ code: 0, message: "Login successfully" })
                    } else {
                        return res.json({ code: 1, message: "Invalid password" })
                    }
                })
                .catch(() => res.json({ code: 1, message: "Invalid email" }))
        }
    }

    logout(req, res) {
        delete req.session.email
        delete req.session.role
        delete req.session.passport.user
        return res.json({ code: 0, message: "Logout successfully" })
    }
}

module.exports = new LoginController;
