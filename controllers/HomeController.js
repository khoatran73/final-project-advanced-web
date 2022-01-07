const Notification = require('../models/Notification')
class HomeController {
    async home(req, res) {
        const user = req.session.passport?.user || req.session.user

        await Notification.find({}).sort({ _id: -1 })
            .then(notifications => {
                return res.render("index", { user: user, notifications: notifications })
            })
    }
}

module.exports = new HomeController;
