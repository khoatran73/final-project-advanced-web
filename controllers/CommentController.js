const Comment = require('../models/Comment')
const Post = require('../models/Post')
const cloudinary = require("../cloud-images/cloudinary")
const imageHelper = require("../helper/image-helper")

class CommentController {
    async getComment(req, res) {
        const postId = req.params.post_id
        await Comment.find({ post_id: postId })
            .then(comments => {
                if (comments.length > 0) {
                    return res.json({ code: 0, message: "success", comments: comments })
                } else {
                    return res.json({ code: 1, message: "no comment yet" })
                }
            })
            .catch(err => res.json({ code: 1, message: "invalid format id" }))
    }

    async addComment(req, res) {
        const postId = req.params.post_id

        if (!req.body.content) {
            return res.json({ code: 1, message: "content is required" })
        } else {
            Post.findOne({ _id: postId })
                .then(async post => {
                    if (post) {
                        let result

                        if (req.file) {
                            const iH = JSON.parse(imageHelper(req.file))
                            if (iH.code === 0) {
                                await cloudinary.destroys(post.cloudinary_id)
                                result = await cloudinary.uploads(req.file.path, "advanced-web/comment")
                            } else {
                                return res.json({ code: 1, message: iH.message })
                            }
                        }

                        const comment = new Comment({
                            cloudinary_id: result?.cloudinary_id || null,
                            image: result?.url || null,
                            content: req.body.content,
                            post_id: post._id,
                            user_email: req.session.email
                        })

                        comment.save()

                        return res.json({ code: 0, message: "add comment successfully" })
                    } else {
                        res.json({ code: 1, message: "invalid post" })
                    }
                })
                .catch(() => res.json({ code: 1, message: "invalid format post id" }))
        }
    }

    async deleteComment(req, res) {
        const commentId = req.params.comment_id

        await Comment.findOne({ _id: commentId })
            .then(async comment => {
                if (comment) {
                    if (comment.user_email !== req.session.email) {
                        return res.json({ code: 1, message: "not your comment" })
                    } else {
                        if (comment.cloudinary_id) {
                            await cloudinary.destroys(comment.cloudinary_id)
                        }

                        await Comment.deleteOne({ _id: commentId })
                            .then(() => res.json({ code: 0, message: "delete comment successfully" }))
                            .catch(err => res.json({ code: 2, message: err.message }))
                    }
                } else {
                    return res.json({ code: 1, message: "invalid comment id" })
                }
            })
            .catch(() => res.json({ code: 1, message: "invalid format comment id" }))
    }

    async editComment(req, res) {
        const commentId = req.params.comment_id

        if (!req.body.content) return res.json({ code: 1, message: "content is required" })
        else {
            await Comment.findOne({ _id: commentId })
                .then(async comment => {
                    if (comment) {
                        if (comment.user_email !== req.session.email) {
                            return res.json({ code: 1, message: "not your comment" })
                        } else {
                            let result

                            if (req.file) {
                                const iH = JSON.parse(imageHelper(req.file))
                                if (iH.code === 0) {
                                    await cloudinary.destroys(comment.cloudinary_id)
                                    result = await cloudinary.uploads(req.file.path, "advanced-web/comment")
                                } else {
                                    return res.json({ code: 1, message: iH.message })
                                }
                            }

                            await Comment.updateOne({ _id: commentId }, {
                                content: req.body.content,
                                image: result?.url || comment.image,
                                cloudinary_id: result?.cloudinary_id || comment.cloudinary_id,
                            })
                                .then(() => res.json({ code: 0, message: "update comment successfully" }))
                                .catch(err => res.json({ code: 2, message: err.message }))

                        }
                    } else {
                        return res.json({ code: 1, message: "invalid comment id" })
                    }
                })
                .catch(() => res.json({ code: 1, message: "invalid format comment id" }))
        }


    }
}

module.exports = new CommentController()