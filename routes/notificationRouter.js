const express = require('express')
const router = express.Router()
const notificationController = require('../controllers/NotificationController')
const { isFaculty, isSignIn } = require('../middleware/authenticate')

// render view
router.get("/all", isSignIn, notificationController.renderView)
router.get("/faculty", isSignIn, notificationController.renderFaculty)
router.get("/add-notify", isFaculty, notificationController.renderAddNotification)
router.get("/edit-notify", isFaculty, notificationController.renderAddNotification)
// load edit noti
router.get('/get-notify-detail/:_id', isFaculty, notificationController.getNotificationDetail)
router.get("/:faculty", isSignIn, notificationController.renderView)

// dung ajax
router.get('/get-notification/:faculty', isSignIn, notificationController.getAllFacultyNotification)
router.get("/search/:faculty", isSignIn, notificationController.searchNotification)



// noti detail
router.get('/:faculty/:_id', isSignIn, notificationController.renderNotificationDetail)

// render view
router.get("/", isSignIn, notificationController.renderView)

// add notification
router.post('/add-notification', isFaculty, notificationController.addNotification)


router.put('/edit-notification/:_id', isFaculty, notificationController.editNotification)
router.delete('/delete-notification/:_id', isFaculty, notificationController.deleteNotification)
// router.put('/update-user-read/:_id', isSignIn, notificationController.updateUserRead)

module.exports = router
