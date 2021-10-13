const express = require('express')
const router = express.Router()

const notificationController = require('../controllers/NotificationController')

router.use('/', notificationController.index)

module.exports = router
