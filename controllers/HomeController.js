const User = require('../models/User')
class HomeController {
    async home(req, res) {
        return res.render("index", { user: req.session.passport?.user || req.session.user })
    }
}

module.exports = new HomeController;
