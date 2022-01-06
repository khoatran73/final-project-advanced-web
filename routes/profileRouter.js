const express = require('express')
const router = express.Router()
const profileController = require('../controllers/ProfileController')
const { isSignIn } = require('../middleware/authenticate')

router.get("/:_id", isSignIn, profileController.profile)

module.exports = router
