const express = require('express')
const router = express.Router()
const commentController = require('../controllers/CommentController')
const { isSignIn } = require('../middleware/authenticate')
const upload = require('../cloud-images/multer')

router.post("/add-comment/:post_id", isSignIn, upload.single("image"), commentController.addComment)
router.put("/edit-comment/:comment_id", isSignIn, upload.single("image"), commentController.editComment)
router.delete("/delete-comment/:comment_id", isSignIn, commentController.deleteComment)

module.exports = router
