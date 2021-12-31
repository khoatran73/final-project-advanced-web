const express = require('express')
const router = express.Router()
const adminController = require('../controllers/AdminController')
const upload = require('../cloud-images/multer')

router.post('/add-user', upload.single("avatar"), adminController.addNewUser)
router.get("/get-user/:_id", adminController.getUser)
router.put("/edit-user/:_id", adminController.editUser)
router.put("/edit-user-avatar/:_id", upload.single("avatar"), adminController.editUserAvatar)

module.exports = router
