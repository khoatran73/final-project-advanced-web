const Notification = require('../models/Notification')
const User = require('../models/User')

class NotificationController {
    async getAllNotifications(req, res) {
        await Notification.find({})
            .then(notifications => {
                if (notifications.length > 0) {
                    return res.json({ code: 0, message: "success", notifications: notifications })
                } else {
                    return res.json({ code: 1, message: "no notifications yet" })
                }
            })
            .catch(err => res.json({ code: 2, message: err.message }))
    }

    async getNotificationById(req, res) {
        const _id = req.params._id

        await Notification.findOne({ _id: _id })
            .then(notification => {
                if (notification)
                    return res.json({ code: 0, message: "success", notification: notification })
                else
                    return res.json({ code: 1, message: "invalid id" })
            })
            .catch(() => res.json({ code: 1, message: "invalid format id" }))
    }

    async getAllFacultyNotification(req, res) {
        const faculty = req.params.faculty

        await Notification.find({ faculty: faculty })
            .then(notifications => {
                if (notifications.length > 0) {
                    return res.json({ code: 0, message: "success", notifications: notifications })
                } else {
                    return res.json({ code: 1, message: "no notifications yet" })
                }
            })
            .catch(err => res.json({ code: 2, message: err.message }))
    }

    async getFacultyNotificationById(req, res) {
        const faculty = req.params.faculty
        const _id = req.params._id

        await Notification.find({ _id: _id, faculty: faculty })
            .then(notification => {
                if (notification.length > 0) {
                    return res.json({ code: 0, message: "success", notification: notification })
                } else {
                    return res.json({ code: 1, message: "invalid id" })
                }
            })
            .catch(err => res.json({ code: 2, message: err.message }))
    }

    async addNotification(req, res) {
        const { title, content } = req.body
        if (!title || !content) return res.json({ code: 1, message: "please enter enough information" })

        let faculty
        await User.findOne({ email: req.session.email })
            .then(user => faculty = user.faculty)

        const notification = new Notification({
            title: title,
            content: content,
            faculty: faculty,
            user_email: req.session.email
        })

        notification.save()

        return res.json({ code: 0, message: "success" })
    }

    async editNotification(req, res) {
        const _id = req.params._id

        const { title, content } = req.body
        if (!title || !content) return res.json({ code: 1, message: "please enter enough information" })
        else {
            await Notification.findOne({ _id: _id })
                .then(async notification => {
                    if (notification) {
                        await Notification.updateOne({ _id: _id }, { title: title, content: content })
                            .then(() => res.json({ code: 0, message: "edit notification success" }))
                            .catch(err => res.json({ code: 2, message: err.message }))
                    } else {
                        return res.json({ code: 1, message: "invalid id" })
                    }
                })
                .catch(() => res.json({ code: 1, message: "invalid format id" }))
        }
    }

    async deleteNotification(req, res) {
        const _id = req.params._id

        await Notification.findOne({ _id: _id })
            .then(async notification => {
                if (notification) {
                    await Notification.deleteOne({ _id: _id })
                        .then(() => res.json({ code: 0, message: "delete notification success" }))
                        .catch(err => res.json({ code: 2, message: err.message }))
                } else {
                    return res.json({ code: 1, message: "invalid id" })
                }
            })
            .catch(() => res.json({ code: 1, message: "invalid format id" }))
    }

    async updateUserRead(req, res) {
        const _id = req.params._id

        await Notification.findOne({ _id: _id })
            .then(async notification => {
                if (notification) {
                    if (notification.user_read.includes(req.session.email))
                        return res.json({ code: 1, message: "already read" })

                    notification.user_read.push(req.session.email)
                    await Notification.updateOne({ _id: _id }, { user_read: notification.user_read })
                        .then(() => res.json({ code: 0, message: "success" }))
                        .catch(err => res.json({ code: 2, message: err.message }))
                } else {
                    return res.json({ code: 1, message: "invalid id" })
                }
            })
            .catch(() => res.json({ code: 1, message: "invalid format id" }))
    }

}

module.exports = new NotificationController()