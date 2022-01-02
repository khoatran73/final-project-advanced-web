const express = require('express')
const router = express.Router()
const accountController = require('../controllers/AccountController')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const LocalStrategy = require('passport-local').Strategy
const expressSession = require('express-session')
const MemoryStore = require('session-memory-store')(expressSession)
const cookieSession = require('cookie-session')
const passport = require('passport')
require('../middleware/passport')(passport)

router.get('/login',accountController.login)
router.post("/login", accountController.auth)
router.get("/logout", accountController.logout)
router.get('/auth/google', passport.authenticate('google', { scope : [ 'email', 'profile' ] }))

router.get('/google/callback',
passport.authenticate('google', {
    successRedirect : '/',
    failureRedirect : '/login',
    failureFlash : true
}))


module.exports = router
