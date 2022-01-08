const express = require('express')
const router = express.Router()
const adminController = require('../controllers/AdminController')
const upload = require('../cloud-images/multer')
const { isAdmin } = require('../middleware/authenticate')

router.post('/add-user', isAdmin, upload.single("avatar"), adminController.addNewUser)

router.get("/", isAdmin, adminController.userManager)

module.exports = router
