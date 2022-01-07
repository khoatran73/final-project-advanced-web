const express = require('express')
const router = express.Router()
const notificationController = require('../controllers/NotificationController')
const { isFaculty, isSignIn} = require('../middleware/authenticate')

router.get("/all", isSignIn, notificationController.getAll)
router.get("/faculty", isSignIn, notificationController.getFaculty)
router.get("/add-notify", isFaculty, notificationController.getAddNotify)
router.get("/search/:faculty", isSignIn, notificationController.searchNotification)
router.get('/:faculty/:_id', isSignIn, notificationController.getFacultyNotificationById)
router.get('/:faculty', isSignIn, notificationController.getAllFacultyNotification)
router.get('/get-all-notifications', isSignIn, notificationController.getAllNotifications)
router.get('/get-notification/:_id', isSignIn, notificationController.getNotificationById)
router.get("/", isSignIn, notificationController.getAll)


router.post('/add-notification', isFaculty, notificationController.addNotification)
router.put('/edit-notification/:_id', isFaculty, notificationController.editNotification)
router.delete('/delete-notification/:_id', isFaculty, notificationController.deleteNotification)

router.put('/update-user-read/:_id', isSignIn, notificationController.updateUserRead)

module.exports = router
