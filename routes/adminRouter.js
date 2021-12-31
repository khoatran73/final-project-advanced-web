const express = require('express')
const router = express.Router()
const adminController = require('../controllers/AdminController')
const upload = require('../cloud-images/multer')
const { isAdmin } = require('../middleware/authenticate')

router.get("/get-user/:_id", isAdmin, adminController.getUser)
router.post('/add-user', isAdmin, upload.single("avatar"), adminController.addNewUser)
router.put("/edit-user/:_id", isAdmin, adminController.editUser)
router.put("/edit-user-avatar/:_id", isAdmin, upload.single("avatar"), adminController.editUserAvatar)
router.delete("/delete-user/:_id", isAdmin, adminController.deleteUser)

module.exports = router
