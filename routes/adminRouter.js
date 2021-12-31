const express = require('express')
const router = express.Router()
const adminController = require('../controllers/AdminController')
const upload = require('../cloud-images/multer')

router.post('/add-user', upload.single("avatar"), adminController.addNewUser)

module.exports = router
