const express = require('express')
const router = express.Router()
const loginRouter = require('../controllers/LoginController')
const checkLogin = require('../middleware/check-login')

router.get('/', loginRouter.get)

module.exports = router
