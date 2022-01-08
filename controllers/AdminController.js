const User = require('../models/User')
const cloudinary = require("../cloud-images/cloudinary")
const imageHelper = require('../helper/image-helper')

class AdminController {
    async userManager(req, res) {
        await User.find({ role: 2 })
            .then(users => {
                return res.render("admin", {
                    user: req.session.passport?.user || req.session.user,
                    users: users
                })
            })
    }

    async addNewUser(req, res) {
        const { email, name, password, faculty } = req.body

        if (!email || !name || !password || !faculty || !req.file) {
            return res.json({ code: 1, message: "Please enter enough information" })
        } else {
            await User.findOne({ email: email })
                .then(async user => {
                    if (user) {
                        return res.json({ code: 1, message: "Email already exists!" })
                    } else {
                        const iH = JSON.parse(imageHelper(req.file))
                        if (iH.code !== 0) {
                            return res.json({ code: 1, message: iH.message })
                        } else {
                            const uploader = await cloudinary.uploads(req.file.path, "advanced-web/avatar")

                            const user = new User({
                                name: name,
                                email: email,
                                avatar: uploader.url,
                                cloudinary_id: uploader.cloudinary_id,
                                role: 2,
                                faculty: faculty,
                                user_created: req.session.passport?.user?.email || req.session.user?.email
                            })

                            user.setPassword(password)
                            user.save()

                            return res.json({ code: 0, message: "Add a new user successfully!" })
                        }
                    }
                })
        }
    }
}

module.exports = new AdminController()
