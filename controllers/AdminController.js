const User = require('../models/User')
const cloudinary = require("../cloud-images/cloudinary")

class AdminController {
    userManager(req, res) {
        return res.render("admin")
    }

    async addNewUser(req, res) {
        try {
            const { email, name, password } = req.body
            const uploader = await cloudinary.uploads(req.file.path, "advanced-web/avatar")
            console.log(uploader)

            await User.find({ email: email })
                .then(user => {
                    if (user.length) {
                        return res.json({ code: 1, message: "Email already exists!" })
                    } else {
                        const user = new User({
                            name: name,
                            email: email,
                            avatar: uploader.url,
                            cloudinary_id: uploader.cloudinary_id
                        })

                        user.setPassword(password)
                        user.save()

                        return res.json({ code: 0, message: "Add a new user successfully!" })
                    }
                })
        } 
        catch (err) {
            return res.json({ code: 2, message: err })
        }
    }
}

module.exports = new AdminController()
