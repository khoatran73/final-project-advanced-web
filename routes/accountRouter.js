const express = require('express')
const router = express.Router()
const accountController = require('../controllers/AccountController')
const passport = require('passport')
const { isSignIn } = require('../middleware/authenticate')
require('../middleware/passport')(passport)

router.get('/login', accountController.login)
router.post("/login", accountController.auth)
router.get("/logout", accountController.logout)

router.get('/reset-password/:_id', isSignIn, accountController.resetPassword)

router.get('/auth/google', passport.authenticate('google', { scope: ['email', 'profile'] }))
router.get('/google/callback',
    passport.authenticate('google', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    }))


module.exports = router
