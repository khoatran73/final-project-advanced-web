const User = require('../models/User')
class HomeController {
    async home(req, res) {
        const email = req.session.passport?.user.email || req.session.email;

        User.findOne({ email: email })
            .then(user => res.render("index", { user: user }))
            .catch(err => res.json({ code: 2, message: err.message }))
    }
}

module.exports = new HomeController;
