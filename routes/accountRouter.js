const express = require('express')
const router = express.Router()
const accountController = require('../controllers/AccountController')

router.get('/login', accountController.login)
router.post("/login", accountController.auth)
router.get("/logout", accountController.logout)

module.exports = router
