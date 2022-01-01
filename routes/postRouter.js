const express = require('express')
const router = express.Router()
const postController = require('../controllers/PostController')
const { isSignIn } = require('../middleware/authenticate')
const upload = require('../cloud-images/multer')

router.get('/get-post', isSignIn, postController.getPost)
router.post('/add-post', isSignIn, upload.single("image"), postController.addPost)
router.put("/edit-post/:_id", isSignIn, upload.single("image"), postController.editPost)
router.delete("/delete-post-image/:_id", isSignIn, postController.deletePostImage)
router.delete("/delete-post-video/:_id", isSignIn, postController.deletePostVideo)
router.delete("/delete-post/:_id", isSignIn, postController.deletePost)

module.exports = router
