const Post = require('../models/Post')
const User = require('../models/User')
const Comment = require('../models/Comment')
const cloudinary = require('../cloud-images/cloudinary')
const imageHelper = require('../helper/image-helper')
const youtubeParser = require('../helper/youtube-parser')

class PostController {
    async getAllPost(req, res) {
        let _id = req.query._id;
        let limit = req.query.limit;
        let start = req.query.start;

        if (_id != null) {
            await User.findOne({ _id: _id })
                .then(async user => {
                    await Post.find({ user_email: user.email }).sort({ _id: -1 })
                        .then(posts => {
                            if (posts.length) {
                                return res.json({ code: 0, message: "success", posts: posts })
                            } else {
                                return res.json({ code: 1, message: "no post yet" })
                            }
                        })
                        .catch(err => res.json({ code: 2, message: err.message }))
                })

        } else {
            if (start == 0 && limit == 0) {
                return res.json({ code: 1, message: "End post" })
            }
            else {
                await Post.find({}).skip(parseInt(start)).limit(parseInt(limit)).sort({ _id: -1 })
                    .then(posts => {
                        if (posts.length > 0) {
                            return res.json({ code: 0, message: "success", posts: posts })
                        } else {
                            return res.json({ code: 1, message: "no post yet" })
                        }
                    })
                    .catch(err => res.json({ code: 2, message: err.message }))
            }
        }

    }

    async getUserOfPost(req, res) {
        let email = req.query.email;
        let email1 = req.session.passport?.user?.email || req.session.user?.email
        await User.findOne({ email: email })
            .then(async user => {
                await User.findOne({ email: email1 })
                    .then(user1 => {
                        return res.json({ code: 0, message: "success", user: user, user1: user1 });
                    })

            })
            .catch(err => res.json({ code: 1, message: err }))
    }
    async getlikeOfPost(req, res) {
        let id = req.params.id;
        await Post.findOne({ _id: id }).
            then(post => {
                return res.json({ code: 0, message: "success", like: post.like })
            })
            .catch(err => res.json({ code: 1, message: "invalid" }))
    }

    async getUserPost(req, res) {

    }

    async getPost(req, res) {
        const _id = req.params._id

        await Post.findOne({ _id: _id })
            .then(post => {
                if (post) {
                    return res.json({ code: 0, message: "success", post: post })
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

            const email = req.session.passport?.user?.email || req.session.user?.email
            const post = new Post({
                user_email: email,
                description: description,
                image: result?.url || null,
                cloudinary_id: result?.cloudinary_id || null,
                video: youtubeParser(req.body.video) || null,
            })

            post.save()

            return res.json({ code: 0, message: "add post successfully", post: post })
        }
    }

    async editPost(req, res) {
        const { description } = req.body
        const _id = req.params._id

        if (!description) return res.json({ code: 1, message: "description is required" })

        await Post.findOne({ _id: _id })
            .then(async post => {
                if (post) {
                    const email = req.session.passport?.user?.email || req.session.user?.email
                    if (post.user_email !== email) {
                        return res.json({ code: 1, message: "Not your post" })
                    } else {
                        let result

                        if (req.body.video) {
                            const yP = youtubeParser(req.body.video)
                            await cloudinary.destroys(post.cloudinary_id)
                            if (!yP) return res.json({ code: 1, message: "Not a link youtube" })
                            await Post.updateOne({ _id: _id }, {
                                description: description,
                                image: null,
                                cloudinary_id: result?.cloudinary_id || post.cloudinary_id,
                                video: youtubeParser(req.body.video) || post.video
                            })
                                .then(() => res.json({ code: 0, message: "update post successfully" }))
                                .catch(err => res.json({ code: 2, message: err.message }))
                        }

                        if (req.file) {
                            const iH = JSON.parse(imageHelper(req.file))
                            if (iH.code === 0) {
                                await cloudinary.destroys(post.cloudinary_id)
                                result = await cloudinary.uploads(req.file.path, "advanced-web/post")
                                await Post.updateOne({ _id: _id }, {
                                    description: description,
                                    image: result?.url || post.image,
                                    cloudinary_id: result?.cloudinary_id || post.cloudinary_id,
                                    video: null
                                })
                                    .then(() => res.json({ code: 0, message: "update post successfully" }))
                                    .catch(err => res.json({ code: 2, message: err.message }))
                            } else {
                                return res.json({ code: 1, message: iH.message })
                            }
                        }
                        if (!req.body.video && !req.file && post.video || !req.body.video && !req.file && !post.image) {
                            await cloudinary.destroys(post.cloudinary_id)
                            await Post.updateOne({ _id: _id }, {
                                description: description,
                                image: null || post.image,
                                cloudinary_id: result?.cloudinary_id || post.cloudinary_id,
                                video: null || post.video,
                            })
                                .then(() => res.json({ code: 0, message: "update post successfully" }))
                                .catch(err => res.json({ code: 2, message: err.message }))
                        }


                    }
                } else {
                    return res.json({ code: 1, message: "invalid id" })
                }
            })
            .catch(() => res.json({ code: 1, message: "invalid format id" }))
    }

    async deletePostImage(req, res) {
        const _id = req.params._id

        await Post.findOne({ _id: _id })
            .then(async post => {
                if (post) {
                    const email = req.session.passport?.user?.email || req.session.user?.email
                    if (post.user_email !== email) {
                        return res.json({ code: 1, message: "not your post" })
                    } else {
                        if (post.cloudinary_id) {
                            await cloudinary.destroys(post.cloudinary_id)

                            await Post.updateOne({ _id: _id }, { cloudinary_id: null, image: null })
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
        await Post.findOne({ _id: _id })
            .then(async post => {
                if (post) {
                    const email = req.session.passport?.user?.email || req.session.user?.email
                    console.log(email)
                    if (post.user_email !== email) {
                        return res.json({ code: 1, message: "not your post" })
                    } else {
                        if (post.video) {
                            await Post.updateOne({ _id: _id }, { video: null })
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

        await Post.findOne({ _id: _id })
            .then(async post => {
                if (post) {
                    const email = req.session.passport?.user?.email || req.session.user?.email
                    if (post.user_email !== email) {
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

                                } else {
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

    async updateLike(req, res) {
        const _id = req.params._id

        await Post.findOne({ _id: _id })
            .then(async post => {
                if (post) {
                    let isLiked = false

                    let message = "unlike success"
                    const email = req.session.passport?.user?.email || req.session.user?.email
                    for (let i = 0; i < post.users_like.length; i++) {
                        if (post.users_like[i] === email) {
                            post.users_like.splice(i, 1)
                            isLiked = true
                            await Post.updateOne({ _id: _id }, { like: post.users_like.length })
                            break
                        }
                    }

                    if (!isLiked) { //chua like
                        post.users_like.push(email)
                        await Post.updateOne({ _id: _id }, { like: post.users_like.length })
                        message = "like success"
                    }

                    await User.findOne({ email: email })
                        .then(async user => {
                            if (user) {
                                for (let i = 0; i < user.posts_like.length; i++) {
                                    if (user.posts_like[i] === _id) {
                                        user.posts_like.splice(i, 1)
                                        break
                                    }
                                }

                                if (!isLiked) { //chua like
                                    user.posts_like.push(_id)

                                }

                                await User.updateOne({ email: email }, { posts_like: user.posts_like })
                            }
                        })

                    await Post.updateOne({ _id: _id }, { users_like: post.users_like })

                    return res.json({ code: 0, message: message, isLiked: !isLiked })

                } else {
                    return res.json({ code: 1, message: "invalid post id" })
                }
            })
            .catch(() => res.json({ code: 1, message: "invalid format id" }))
    }
    async checkLiked(req, res) {
        const _id = req.params._id
        const email = req.session.passport?.user?.email || req.session.user?.email
        await User.findOne({ email: email })
            .then(async user => {
                if (user) {
                    for (let i = 0; i < user.posts_like.length; i++) {
                        if (user.posts_like[i] === _id) {
                            user.posts_like.splice(i, 1)
                            return res.json({ code: 0, like: true })
                        }
                    }
                    return res.json({ code: 0, like: false })
                }
            }).catch(err => { return res.json({ code: 1, message: err.message }) })
    }
    async checkUserPost(req, res) {
        const _id = req.params._id
        const email = req.session.passport?.user?.email || req.session.user?.email
        await Post.findOne({ _id: _id })
            .then(async post => {
                if (post) {
                    if (post.user_email == email) {
                        return res.json({ code: 0, message: "this is your post" })
                    } else {
                        return res.json({ code: 1, message: "this is not your post" })
                    }

                }
            }).catch(err => { return res.json({ code: 1, message: err.message }) })
    }
    async getAllUserLikePost(req, res) {
        const _id = req.params._id
        await Post.findOne({ _id: _id })
            .then(async post => {
                if (post) {
                    return res.json({ code: 0, message: "Success", users_like: post.users_like });
                }
            }).catch(err => { return res.json({ code: 1, message: err.message }) })
    }

}

module.exports = new PostController()
