const User = require('../models/User')

class ProfileController {
    async profile(req, res) {
        const _id = req.params._id

        await User.findOne({ _id: _id })
            .then(profile => {
                if (profile) {
                    const user = req.session.passport?.user || req.session.user
                    return res.render("profile", { profile: profile, user: user })
                } else
                    return res.render("error")
            })
            .catch(err => res.json({ code: 2, message: err.message }))
    }
}

module.exports = new ProfileController;
