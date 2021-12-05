const express = require('express')
const router = express.Router()
const homeController = require('../controllers/HomeController')
const checkLogin = require('../middleware/check-login')

router.use('/', homeController.home)

module.exports = router
