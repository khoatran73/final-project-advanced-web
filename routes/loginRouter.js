const express = require('express')
const router = express.Router()
const loginRouter = require('../controllers/LoginController')
const checkLogin = require('../middleware/check-login')

router.use('/', loginRouter.get)

module.exports = router
