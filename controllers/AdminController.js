const User = require('../models/User')
const cloudinary = require("../cloud-images/cloudinary")

class AdminController {
    userManager(req, res) {
        return res.render("admin")
    }

    async addNewUser(req, res) {
        const { email, name, password, faculty } = req.body

        if (!email || !name || !password || !faculty) {
            return res.json({ code: 1, message: "Please enter Enough information" })
        } else {
            try {
                await User.find({ email: email })
                    .then(async user => {
                        if (user.length) {
                            return res.json({ code: 1, message: "Email already exists!" })
                        } else {
                            const uploader = await cloudinary.uploads(req.file.path, "advanced-web/avatar")
                            // console.log(uploader)

                            const user = new User({
                                name: name,
                                email: email,
                                avatar: uploader.url,
                                cloudinary_id: uploader.cloudinary_id,
                                faculty: faculty
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

    async getUser(req, res) {
        const _id = req.params._id

        await User.findOne({ _id: _id })
            .then(user => res.json({ code: 0, message: "success", user: user }))
            .catch(() => res.json({ code: 1, message: "invalid id" }))
    }

    async editUser(req, res) {
        const _id = req.params._id
        const { name, faculty } = req.body

        if (!name || !faculty) {
            return res.json({ code: 1, message: "Please enter Enough information" })
        } else {
            await User.findOne({ _id: _id })
                .then(async () => {
                    await User.updateOne({ _id: _id }, {
                        name: name,
                        faculty: faculty
                    })
                        .then(() => res.json({ code: 0, message: "Update user successfully" }))
                })
                .catch(() => res.json({ code: 1, message: "invalid id" }))
        }
    }

    async editUserAvatar(req, res) {
        const _id = req.params._id

        if (req.file) {
            if (!req.file.mimetype.match(/image.*/)) {
                return res.json({ code: 1, message: "Chỉ hổ trợ định dạng hình ảnh" })
            } else if (req.file.size > (1024 * 1024 * 5)) {
                return res.json({ code: 1, message: "Size ảnh không được quá 5MB" })
            } else {
                await User.findOne({ _id: _id })
                    .then(async user => {
                        await cloudinary.destroys(user.cloudinary_id)

                        const uploader = await cloudinary.uploads(req.file.path, "advanced-web/avatar")

                        await User.updateOne({ _id: _id }, {
                            avatar: uploader.url,
                            cloudinary_id: uploader.cloudinary_id,
                        })
                            .then(() => res.json({ code: 0, message: "edit user successfully" }))

                    })
                    .catch(() => res.json({ code: 1, message: "invalid id" }))
            }
        } else {
            return res.json({ code: 1, message: "file not found" })
        }
    }
}

module.exports = new AdminController()
