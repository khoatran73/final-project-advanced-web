const User = require('../models/User')
const Notification = require('../models/Notification')

class ProfileController {
    async profile(req, res) {
        const _id = req.params._id
        let notifications

        await Notification.find({}).sort({ _id: -1 })
            .then(nts => notifications = nts)

        await User.findOne({ _id: _id })
            .then(profile => {
                if (profile) {
                    const user = req.session.passport?.user || req.session.user
                    return res.render("profile", { profile: profile, user: user, notifications: notifications })
                } else
                    return res.render("error")
            })
            .catch(err => res.json({ code: 2, message: err.message }))
    }
}

module.exports = new ProfileController;
