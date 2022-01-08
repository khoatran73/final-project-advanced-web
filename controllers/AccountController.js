const User = require('../models/User')
const cloudinary = require("../cloud-images/cloudinary")
const imageHelper = require('../helper/image-helper')

class LoginController {
    login(req, res) {
        res.render('login')
    }

    async searchUsers(req, res) {
        const name = req.query.name

        await User.find({ name: { $regex: name, $options: "i" } })
            .then(users => {
                return res.json({ code: 0, users: users })
            })
            .catch(err => res.json({ code: 2, message: err.message }))
    }

    async auth(req, res) {
        const { email, password } = req.body

        if (!email || !password) {
            return res.json({ code: 1, message: "Please enter enough information" })
        } else {
            await User.findOne({ email: email })
                .then(user => {
                    if (user.validPassword(password)) {
                        req.session.user = user
                        return res.json({ code: 0, message: "Login successfully" })
                    } else {
                        return res.json({ code: 1, message: "Invalid password" })
                    }
                })
                .catch(() => res.json({ code: 1, message: "Invalid email" }))
        }
    }

    async renderResetPassword(req, res) {
        const _id = req.params._id
        const email = req.session.passport?.user?.email || req.session.user?.email

        await User.findOne({ _id: _id })
            .then(user => {
                if (user) {
                    if (user.email !== email) {
                        return res.render("error")
                    } else {
                        return res.render("reset-password", { user: user })
                    }
                } else {
                    return res.render("error")
                }
            })
    }

    async resetPassword(req, res) {
        const _id = req.params._id
        const email = req.session.passport?.user?.email || req.session.user?.email
        const { oldPassword, newPassword, reNewPassword } = req.body

        if (!oldPassword || !newPassword || !reNewPassword) {
            return res.json({ code: 1, message: "Vui lòng nhập đủ" })
        }

        await User.findOne({ _id: _id })
            .then(async user => {
                if (user) {
                    if (user.email !== email) {
                        return res.json({ code: 1, message: "not your account" })
                    }

                    if (!user.validPassword(oldPassword))
                        return res.json({ code: 1, message: "Mật khẩu cũ không chính xác" })

                    if (newPassword !== reNewPassword)
                        return res.json({ code: 1, message: "Mật khẩu nhập lại sai" })

                    const newSaltHash = user.setPassword(newPassword)

                    await User.updateOne({ _id: _id }, { salt: newSaltHash.salt, hash: newSaltHash.hash })
                        .then(() => res.json({ code: 0, message: "success" }))
                        .catch(err => res.json({ code: 2, message: err.message }))

                } else {
                    return res.json({ code: 1, message: "invalid id" })
                }
            })
    }

    async editUserAvatar(req, res) {
        const email = req.session.passport?.user?.email || req.session.user?.email
        if (req.file) {
            const iH = JSON.parse(imageHelper(req.file))
            if (iH.code !== 0) {
                return res.json({ code: iH.code, message: iH.message })
            } else {
                await User.findOne({ email: email })
                    .then(async user => {
                        if (user) {
                            await cloudinary.destroys(user.cloudinary_id)

                            const uploader = await cloudinary.uploads(req.file.path, "advanced-web/avatar")

                            await User.updateOne({ email: email }, {
                                avatar: uploader.url,
                                cloudinary_id: uploader.cloudinary_id,
                            })
                                .then(() => {
                                    if (req.session.user) {
                                        req.session.user.avatar = uploader.url
                                        req.session.user.cloudinary_id = uploader.cloudinary_id
                                    } else if (req.session.passport.user) {
                                        req.session.passport.user.avatar = uploader.url
                                        req.session.passport.user.cloudinary_id = uploader.cloudinary_id
                                    }
                                    res.json({ code: 0, message: "edit user avatar successfully" })
                                })
                        } else {
                            return res.json({ code: 1, message: "invalid id" })
                        }
                    })
                    .catch(() => res.json({ code: 1, message: "invalid format id" }))
            }
        } else {
            return res.json({ code: 1, message: "file not found" })
        }
    }

    async editUserInfo(req, res) {
        const email = req.session.passport?.user?.email || req.session.user?.email
        if (!req.body.name) return res.json({ code: 1, message: "Tên không được để trống" })

        await User.findOne({ email: email })
            .then(async user => {
                await User.updateOne({ email: email }, {
                    name: req.body.name,
                    class: req.body.class || user.class,
                    faculty: req.body.faculty || user.faculty
                })
                    .then(() => {
                        if (req.session.user) {
                            req.session.user.name = req.body.name
                        } else if (req.session.passport.user) {
                            req.session.passport.user.name = req.body.name
                            req.session.passport.user.faculty = req.body.faculty
                            req.session.passport.user.class = req.body.class
                        }
                        res.json({ code: 0, message: "success" })
                    })
                    .catch(err => res.json({ code: 2, message: err.message }))
            })
    }

    logout(req, res) {
        if (req.session.passport)
            delete req.session.passport
        if (req.session.user)
            delete req.session.user
        return res.redirect("/account/login")
    }
}

module.exports = new LoginController;
