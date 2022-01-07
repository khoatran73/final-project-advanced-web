const express = require('express')
const router = express.Router()
const commentController = require('../controllers/CommentController')
const { isSignIn } = require('../middleware/authenticate')
const upload = require('../cloud-images/multer')

router.get("/get-comment/:post_id", isSignIn, commentController.getComment)
router.get("/get-count-comment/:post_id", isSignIn, commentController.countComments)

router.get("/get-user-comment/:user_email", isSignIn, commentController.getUserOfComment)
router.post("/add-comment/:post_id", isSignIn, upload.single("comment-image"), commentController.addComment)
router.put("/edit-comment/:comment_id", isSignIn, upload.single("image"), commentController.editComment)
router.delete("/delete-comment/:comment_id", isSignIn, commentController.deleteComment)
router.get("/check-user-comment/:comment_id", isSignIn, commentController.checkUserComment)

module.exports = router
