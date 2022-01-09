const express = require('express')
const router = express.Router()
const adminController = require('../controllers/AdminController')
const upload = require('../cloud-images/multer')
const { isAdmin } = require('../middleware/authenticate')

router.post('/add-user', isAdmin, upload.single("avatar"), adminController.addNewUser)
router.get("/get-all-users", isAdmin, adminController.getAllUsers)
router.get("/", isAdmin, adminController.userManager)
router.put("/edit-user-role", isAdmin, adminController.editUserRole)

module.exports = router
