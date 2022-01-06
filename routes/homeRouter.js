const express = require('express')
const router = express.Router()
const homeController = require('../controllers/HomeController')
const { isSignIn } = require('../middleware/authenticate')

router.get('/', isSignIn, homeController.home)

module.exports = router
