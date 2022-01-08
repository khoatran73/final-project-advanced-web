const express = require('express')
const router = express.Router()
const accountController = require('../controllers/AccountController')
const passport = require('passport')
const upload = require('../cloud-images/multer')
const { isSignIn, isNotStudent, rejectUser } = require('../middleware/authenticate')
require('../middleware/passport')(passport)

router.get('/login', rejectUser, accountController.login)
router.post("/login", rejectUser, accountController.auth)
router.get("/logout", isSignIn, accountController.logout)

router.get("/search-users", isSignIn, accountController.searchUsers)

router.get('/reset-password/:_id', isNotStudent, accountController.renderResetPassword)
router.put('/reset-password/:_id', isNotStudent, accountController.resetPassword)
router.put("/edit-user-avatar/", isSignIn, upload.single("avatar"), accountController.editUserAvatar)
router.put("/edit-user-info/", isSignIn, accountController.editUserInfo)

router.get('/auth/google', rejectUser, passport.authenticate('google', { scope: ['email', 'profile'] }))
router.get('/google/callback', rejectUser,
    passport.authenticate('google', {
        successRedirect: '/',
        failureRedirect: '../../account/login',
        failureFlash: false
    }))


module.exports = router
