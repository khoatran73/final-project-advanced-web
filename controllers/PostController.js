const Post = require('../models/Post')
const Comment = require('../models/Comment')
const cloudinary = require('../cloud-images/cloudinary')
const imageHelper = require('../helper/image-helper')
const youtubeParser = require('../helper/youtube-parser')

class PostController {
    async getPost(req, res) {
        await Post.find({ user_email: req.session.email })
            .then(posts => {
                if (posts.length) {
                    return res.json({ code: 0, message: "success", posts: posts })
                } else {
                    return res.json({ code: 1, message: "no post yet" })
                }
            })
            .catch(err => res.json({ code: 2, message: err.message }))
    }

    async addPost(req, res) {
        const { description } = req.body

        if (!description) return res.json({ code: 1, message: "description is required" })
        else {
            let result
            if (req.file) {
                const iH = JSON.parse(imageHelper(req.file))
                if (iH.code === 0) {
                    result = await cloudinary.uploads(req.file.path, "advanced-web/post")
                } else {
                    return res.json({ code: 1, message: iH.message })
                }
            }

            if (req.body.video) {
                const yP = youtubeParser(req.body.video)
                if (!yP) return res.json({ code: 1, message: "Not a link youtube" })
            }

            const post = new Post({
                user_email: req.session.email,
                description: description,
                image: result?.url || null,
                cloudinary_id: result?.cloudinary_id || null,
                video: req.body.video || null,
            })

            post.save()

            return res.json({ code: 0, message: "add post successfully" })
        }
    }

    async editPost(req, res) {
        const { description } = req.body
        const _id = req.params._id

        if (!description) return res.json({ code: 1, message: "description is required" })

        await Post.findOne({ _id: _id })
            .then(async post => {
                if (post) {
                    if (post.user_email !== req.session.email) {
                        return res.json({ code: 1, message: "Not your post" })
                    } else {
                        let result

                        if (req.file) {
                            const iH = JSON.parse(imageHelper(req.file))
                            if (iH.code === 0) {
                                await cloudinary.destroys(post.cloudinary_id)
                                result = await cloudinary.uploads(req.file.path, "advanced-web/post")
                            } else {
                                return res.json({ code: 1, message: iH.message })
                            }
                        }

                        if (req.body.video) {
                            const yP = youtubeParser(req.body.video)
                            if (!yP) return res.json({ code: 1, message: "Not a link youtube" })
                        }

                        await Post.updateOne({ _id: _id }, {
                            description: description,
                            image: result?.url || post.image,
                            cloudinary_id: result?.cloudinary_id || post.cloudinary_id,
                            video: req.body.video || post.video
                        })
                            .then(() => res.json({ code: 0, message: "update post successfully" }))
                            .catch(err => res.json({ code: 2, message: err.message }))
                    }
                } else {
                    return res.json({ code: 1, message: "invalid id" })
                }
            })
            .catch(() => res.json({ code: 1, message: "invalid format id" }))
    }

    async deletePostImage(req, res) {
        const _id = req.params._id

        Post.findOne({ _id: _id })
            .then(async post => {
                if (post) {
                    if (post.user_email !== req.session.email) {
                        return res.json({ code: 1, message: "not your post" })
                    } else {
                        if (post.cloudinary_id) {
                            await cloudinary.destroys(post.cloudinary_id)

                            Post.updateOne({ _id: _id }, { cloudinary_id: null, image: null })
                                .then(() => res.json({ code: 0, message: "delete post image successfully" }))
                                .catch(err => res.json({ code: 2, message: err.message }))
                        } else {
                            return res.json({ code: 1, message: "Có ảnh đâu mà xóa ?" })
                        }
                    }
                } else {
                    return res.json({ code: 1, message: "invalid id" })
                }
            })
            .catch(() => res.json({ code: 1, message: "invalid format id" }))
    }

    async deletePostVideo(req, res) {
        const _id = req.params._id

        Post.findOne({ _id: _id })
            .then(async post => {
                if (post) {
                    if (post.user_email !== req.session.email) {
                        return res.json({ code: 1, message: "not your post" })
                    } else {
                        if (post.video) {
                            Post.updateOne({ _id: _id }, { video: null })
                                .then(() => res.json({ code: 0, message: "delete post video successfully" }))
                                .catch(err => res.json({ code: 2, message: err.message }))
                        } else {
                            return res.json({ code: 1, message: "Có video đâu mà xóa ?" })
                        }
                    }
                } else {
                    return res.json({ code: 1, message: "invalid id" })
                }
            })
            .catch(() => res.json({ code: 1, message: "invalid format id" }))
    }

    async deletePost(req, res) {
        const _id = req.params._id

        Post.findOne({ _id: _id })
            .then(async post => {
                if (post) {
                    if (post.user_email !== req.session.email) {
                        return res.json({ code: 1, message: "not your post" })
                    } else {
                        await Comment.find({ post_id: post._id })
                            .then(async comments => {
                                if (comments.length > 0) {
                                    comments.forEach(async comment => {
                                        if (comment.cloudinary_id) {
                                            await cloudinary.destroys(comment.cloudinary_id)
                                        }

                                        await Comment.deleteOne({ _id: comment._id })
                                    })

                                    if (post.cloudinary_id)
                                        await cloudinary.destroys(post.cloudinary_id)

                                    await Post.deleteOne({ _id: _id })
                                        .then(() => res.json({ code: 0, message: "delete post successfully" }))
                                        .catch(err => res.json({ code: 2, message: err.message }))

                                }
                            })
                    }
                } else {
                    return res.json({ code: 1, message: "invalid id" })
                }
            })
            .catch(() => res.json({ code: 1, message: "invalid format id" }))
    }
}

module.exports = new PostController()
