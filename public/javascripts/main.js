$(document).ready(function () {
    // display loading
    $(document).ajaxStart(function () {
        $('#loading').show()
    }).ajaxStop(function () {
        $('#loading').hide()
    })

    // display password
    {
        $(".eye").click(e => {
            const eye = e.target
            const input = e.target.parentNode.children[1]

            if (input.type === "password") {
                input.type = "text"
                eye.classList.remove("fa-eye")
                eye.classList.add("fa-eye-slash")
            } else {
                input.type = "password"
                eye.classList.remove("fa-eye-slash")
                eye.classList.add("fa-eye")
            }
        })
    }

    // hide error text
    {
        $("input").keydown(() => {
            $(".error-text").css("visibility", "hidden")
        })
    }

    // Login
    {
        $('#login-form').submit(function (e) {
            e.preventDefault()

            const data = JSON.stringify({
                email: $('#email').val(),
                password: $('#password').val()
            })

            $.ajax({
                type: 'POST',
                url: '/account/login',
                data: data,
                processData: false,
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                success: function (res) {
                    if (res.code === 0) {
                        window.location.href = "/"
                    } else {
                        $(".error-text").css("visibility", "visible")
                        $(".error-text").html("Email hoặc mật khẩu không đúng!")
                    }
                },
            });
        })

        $("#gg-login-btn").click(() => {
            window.location.href = "/account/auth/google"
        })
    }

    // reset password
    {
        $('#reset-password-form').submit(function (e) {
            e.preventDefault()

            const url = location.pathname

            const data = JSON.stringify({
                oldPassword: $('#oldPassword').val(),
                newPassword: $('#newPassword').val(),
                reNewPassword: $('#reNewPassword').val()
            })

            $.ajax({
                type: 'PUT',
                url: url,
                data: data,
                processData: false,
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                success: function (res) {
                    if (res.code === 0) {
                        window.location.href = "/account/logout"
                    } else {
                        $(".error-text").css("visibility", "visible")
                        $(".error-text").html(res.message)
                    }
                },
            });
        })
    }

    //add post --------------------------------------------------------
    if (!location.pathname.includes("account"))
        loadIndex10Post(0, 10)

    $('#add-form').submit((e) => {
        e.preventDefault();
        const data = new FormData($('#add-form')[0])
        $('#video').val('');
        $.ajax({
            type: "POST",
            url: "/post/add-post",
            data: data,
            processData: false,
            contentType: false,
            cache: false,
            success: function (res) {
                if (res.code == 0) {
                    $('#post-list').html("");
                    loadIndex10Post(0, 10);
                    $('#add-modal').modal('hide');
                } else {
                    $(".error-text").css("visibility", "visible")
                    $(".error-text").html(res.message)
                }
            }
        })

    })

    function checkMedia(data) {
        media = ``;
        let check = data.post != null ? data.post : data;
        if (check.video != null) {
            media += `<iframe src="https://www.youtube.com/embed/${check.video}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`
        } else if (check.image != null) {
            media += `<img class="image-up" src="${check.image}" width="100%" ><br><br>`
        } else { media = `` }
        return media;
    }
    //Load post-------------------------------------------------------------------------------------------

    function loadIndex10Post(start, limitpost) {
        $.ajax({
            type: 'GET',
            url: '/post/get-all-post',
            data: { limit: limitpost, start: start },
            cache: false,
            success: function (res) {

                showPost(res.posts)
            }
        });
    }
    function getCountLike(postID) {
        $.ajax({
            type: 'GET',
            url: `/post/get-countlike-post/${postID}`,
            cache: false,
            success: function (res) {
                $("#count-like" + postID).html(res.like)
            }
        });
    }

    function showPost(posts) {
        if (posts) {
            posts.forEach(function (post) {
                let html = ``;
                $.ajax({
                    type: 'GET',
                    url: '/post/get-user-post/?email=' + post.user_email,
                    cache: false,
                    success: function (res) {
                        if (res.code === 0) {
                            html += `<div class="main-center-item post" id="${post._id}">
                            <div class="post-top">
                                <a href="/profile/${res.user._id}">
                                    <img src="${res.user.avatar}" alt="" class="image-40">
                                </a>
                                <div class="name-group">
                                    <a href="/profile/${res.user._id}">
                                        <div class="name">${res.user.name}</div>
                                    </a>
                                    <div class="time">${new Date(post.createdAt).toLocaleString('en-JM')}</div>
                                </div>
                                <div class="action  ${post._id}">
                                    <i class="fas fa-ellipsis-h"></i>
                                    <div class="action-dropdown">
                                        <div id="updatePost${post._id}" class="action-dropdown-item">
                                            <i class="fas fa-edit"></i>
                                            Chỉnh sửa bài viết
                                        </div>
                                        <div id="deletePost${post._id}" class="action-dropdown-item">
                                            <i class="fas fa-trash-alt"></i>
                                            Xóa bài viết
                                        </div>
                                    </div>
                                </div>
                                
                            </div>
                            <div class="post-main">
                                <div class="content">
                                    <div>
                                        ${post.description}
                                    </div>
                                    ${checkMedia(post)}
                                    
                                </div>
                                <div class="info">
                                    <div class="like" id="like${post._id}">
                                        <i class="fas fa-thumbs-up"></i>
                                        <span id="count-like${post._id}"></span>
                                        
                                    </div>
                                    <div id="count-cmt${post._id}" class="comment"> </div>
                                </div>
                            </div>
                            <div class="post-bottom">
                                <div id="like-icon${post._id}" class="like-btn react-btn">
                                    
                                </div>
                                <div class="comment-btn ${post._id} react-btn">
                                    <i class="far fa-comment-alt"></i>Comment
                                </div>
                            </div>
                            <div class="comment-area" id="${post._id}" >
                                <div class="comment-box">
                                    <img src="${res.user.avatar}" alt="" class="image-34">
                                    <form id="comment-form${post._id}" action="" enctype="multipart/form-data" class="comment-form">
                                        <input id="content${post._id}" name="content" type="text" placeholder="Aa...">
                                        <label for="comment-image" title="Đính kèm ảnh"><i class="fas fa-camera"></i></label>
                                        <input name="comment-image" type="file" id="comment-image" accept="image/png, image/jpeg">
                                    </form>
                                </div>
                                <div id="comment${post._id}" class="comment-list">
                                   
                                </div>
                                <div id="more-comment${post._id}" class="more-comment">
                                    Xem them comment
                                </div>
                            </div>
                        </div>
                        <div class="modal fade" id="like-list-modal${post._id}" tabindex="-1" role="dialog" aria-hidden="true">
                            <div class="modal-dialog" role="document">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <h5 class="modal-title">Những người thích</h5>
                                    </div>
                                    <div id="modal-body${post._id}" class="modal-body">
                                        
                                    </div>
                                    <div class="modal-footer">
                                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        `;
                            $('#post-list').append(html);
                            handlePost(post, res.user)
                        }

                        handleDropdown(post._id)
                        displayCommentBox(post._id)
                        showLikeList(post._id)
                        addComment(post._id)
                        handleLikeReact(post._id)
                        moreComments(post._id)
                        countComments(post._id)
                        checkLike(post._id)
                        getCountLike(post._id)
                        showUserLike(post)

                    }
                });
            })
        }
    }
    //show users like posts 
    function showUserLike(post) {
        post.users_like.forEach(email => {
            $.ajax({
                type: 'GET',
                url: '/post/get-user-post/?email=' + email,
                cache: false,
                success: function (res) {
                    if (res.code == 0) {
                        let html = `
                        <div  class="like-list">
                            <a href="/profile/${res.user._id}">
                                <img src="${res.user.avatar}" class="image-34" alt="">
                                <span>${res.user.name}</span>
                            </a>
                            <i class="fas fa-thumbs-up"></i>
                        </div>
                        `
                        $("#modal-body" + post._id).append(html)

                    }
                }
            })
        })
    }
    function showUserLikeProfile(post) {
        post.users_like.forEach(email => {
            $.ajax({
                type: 'GET',
                url: '/post/get-user-post/?email=' + email,
                cache: false,
                success: function (res) {
                    if (res.code == 0) {
                        let html = `
                        <div  class="like-list">
                            <a href="/profile/${res.user._id}">
                                <img src="${res.user.avatar}" class="image-34" alt="">
                                <span>${res.user.name}</span>
                            </a>
                            <i class="fas fa-thumbs-up"></i>
                        </div>
                        `
                        $("#modal-body-profile" + post._id).append(html)

                    }
                }
            })
        })
    }
    handleDropdown("dropdown")
    // read more comments
    function moreComments(postID) {
        $("#more-comment" + postID).click(() => {
            let start = 0;
            let limit = 0;
            loadComment(start, limit, postID)
        })
    }
    function checkLike(postID) {
        $.ajax({
            type: 'GET',
            url: `/post/check-like/${postID}`,
            success: function (res) {
                if (res.code == 0) {
                    if (res.like) {
                        $("#like-icon" + postID).append(`<i class="like-btn${postID} far fa-thumbs-up active"></i> Like`)
                    } else {
                        $("#like-icon" + postID).append(`<i class="like-btn${postID} far fa-thumbs-up "></i> Like`)
                    }
                }
            }
        })

    }
    function checkLikeprofile(postID) {
        $.ajax({
            type: 'GET',
            url: `/post/check-like/${postID}`,
            success: function (res) {
                if (res.code == 0) {
                    if (res.like) {
                        $("#like-icon-profile" + postID).append(`<i class="like-btn${postID} far fa-thumbs-up active"></i> Like`)
                    } else {
                        $("#like-icon-profile" + postID).append(`<i class="like-btn${postID} far fa-thumbs-up "></i> Like`)
                    }
                }
            }
        })

    }
    function handlePost(post, user) {
        $("#deletePost" + post._id).click(function () {
            $.ajax({
                type: 'DELETE',
                url: `/post/delete-post/${post._id}`,
                success: function (res) {
                    console.log(res)
                    if (res.code == 0) {
                        alert('Delete post successfully')
                        $('#post-list').html("");
                        loadIndex10Post(0, 10);
                    }
                }
            })
        })
        $("#updatePost" + post._id).click(function () {
            let html = `
                <div class="modal fade" id="update-modal${post._id}" tabindex="-1" role="dialog" aria-hidden="true">
                    <div class="modal-dialog" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <img src="${user.avatar}" alt="" class="image-40">
                                <b>${user.name}</b>
                            </div>
                            <div class="modal-body">
                                <form action="" enctype="multipart/form-data" id="update-form">
                                    <div class="form-group">
                                        <textarea  class="form-control" id="description" rows="4" name="description"
                                            id="description" placeholder="Bạn đang nghĩ gì vậy">${post.description}</textarea>
                                    </div>
                                    <div class="form-group">
                                        <label for="image-checked" class="media-label">Đăng ảnh hoặc video </label>
                                        <div class="form-check form-check-inline">
                                            <input class="form-check-input" type="radio" name="media-update-checked"
                                                value="media-update-image" id="image-update-checked">
                                            <label class="form-check-label" for="image-update-checked">
                                                Ảnh
                                            </label>
                                        </div>
                                        <div class="form-check form-check-inline">
                                            <input class="form-check-input"  type="radio" name="media-update-checked"
                                                value="media-update-video" id="video-update-checked">
                                            <label class="form-check-label" for="video-update-checked">
                                                Video
                                            </label>
                                        </div>
                                    </div>
                                    <div class="form-group media-update-image">
                                        <label for="image-update">Up ảnh</label>
                                        <div class="custom-file">
                                            <input type="file" class="custom-file-input" id="image-update" name="image">
                                            <label class="custom-file-label" for="image-update">Chọn ảnh...</label>
                                        </div>
                                    </div>
                                    <div class="form-group media-update-video">
                                        <label for="video-update">Video youtube</label>
                                        <input type="text" class="form-control" id="video-update" name="video"
                                            placeholder="Link video youtube">
                                    </div>
                                    <div class="alert alert-danger error-text" role="alert">
                                        Error Message
                                    </div>
                                    <div class="form-group">
                                    ${checkMedia(post)}
                                    </div>
                                    <div class="text-right">
                                        <button type="button" class="btn btn-secondary"
                                            data-dismiss="modal">Đóng</button>
                                        <button type="submit" class="btn btn-success">Lưu</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            `
            if (window.location.pathname.includes("profile")) {
                $("#wrapper-profile").append(html)
            } else {
                $("#main-wrapper").append(html)
            }
            $("#update-modal" + post._id).modal("show");
            $("input[name=media-update-checked]").change(() => displayupdateMedia())

            function displayupdateMedia() {
                const mediaChecked = $("input[name=media-update-checked]:checked").val()
                const mediaUnChecked = $("input[name=media-update-checked]:not(:checked)").val()
                $(`.${mediaChecked}`).css("display", "block")
                $(`.${mediaUnChecked}`).css("display", "none")
            }
            $("#update-form").submit(e => {
                e.preventDefault()
                const data = new FormData($('#update-form')[0])
                $('#video-update').val('');
                $.ajax({
                    type: "PUT",
                    url: `/post/edit-post/${post._id}`,
                    data: data,
                    processData: false,
                    contentType: false,
                    cache: false,
                    success: function (res) {
                        if (res.code == 0) {
                            if (window.location.pathname.includes("profile")) {
                                $('#user-post-list').html('');
                                loadProfilePost(window.location.pathname.split('/')[2])
                                $('#update-modal' + post._id).modal('hide');
                            } else {
                                $('#post-list').html("");
                                loadIndex10Post(0, 10);
                                $('#update-modal' + post._id).modal('hide');
                            }
                        } else {
                            $(".error-text").css("visibility", "visible")
                            $(".error-text").html(res.message)
                        }
                    }
                })
            })

        })
    }

    function handleDropdown(postID) {
        $("." + postID).click(function (e) {
            e.stopPropagation()
            let parent = e.target
            if (e.target.children.length === 0) {
                parent = e.target.parentNode
            }
            if (!parent.classList.contains("active"))
                parent.classList.add("active")
            else
                parent.classList.remove("active")
        })

        $(window).click(function () {
            if ($("." + postID).hasClass("active"))
                $("." + postID).removeClass("active")
        })
    }

    //Load comment--------------------------
    function loadComment(start, limitCmt, postId) {
        let count = 0;
        $.ajax({
            type: 'GET',
            url: `/comment/get-comment/${postId}`,
            data: { start: start, limitCmt: limitCmt },
            success: function (res) {
                count = res.comments?.length
                if (res.code === 0) {
                    $("#comment" + postId).html('');
                    showComment(res.comments)
                }
            }
        });
        return count;
    }
    //count comment
    function countComments(postId) {
        let count = 0;
        $.ajax({
            type: 'GET',
            url: `/comment/get-count-comment/${postId}`,
            cache: false,
            success: function (res) {
                if (res.code == 0) {
                    count = res.count;
                    $("#count-cmt" + postId).html(`${count} bình luận`)
                } else {
                    $("#count-cmt" + postId).html(`0 bình luận`)
                }
            }
        });
        return count;

    }
    //show comments
    function showComment(comments) {
        comments.forEach(function (data) {
            $.ajax({
                type: 'GET',
                url: `/comment/get-user-comment/${data.user_email}`,
                cache: false,
                success: function (res) {
                    if (res.code === 0) {
                        let html = `
                        <div id="comment${data._id}" class="comment">
                            <a href="/profile/${res.user._id}">
                                <img src="${res.user.avatar}" alt="" class="image-34">
                            </a>
                            <div class="content">
                                <div class="name">
                                    <a href="/profile/${res.user._id}">${res.user.name}</a>
                                    <span>${new Date(data.createdAt).toLocaleString('en-JM')}</span>
                                </div>
                                <div class="description">
                                    <div>
                                        ${data.content}
                                    </div>
                                    ${checkImageCmt(data)}
                                </div>
                            </div>
                        </div>`
                        $("#comment" + data.post_id).append(html);

                    }

                }
            });
        })

    }

    // <div class="comment-dropdown">
    //     <i class="fas fa-ellipsis-h"></i>
    //     <ul class="comment-dropdown-menu">
    //         <div class="comment-dropdown-item">
    //             <i class="fas fa-trash-alt"></i>
    //             Xóa comment
    //         </div>
    //     </ul>
    // </div>

    function checkImageCmt(data) {
        let img = ``;
        if (data.image != null) {
            img += `<img src="${data.image}" alt="">`
        }
        return img;
    }
    //show comment box
    function displayCommentBox(postID) {
        $(".comment-btn").click(function (e) {
            const post = e.target.parentNode.parentNode
            post.children[3].style.display = "block"
            loadComment(0, 1, postID)
        })
    }


    //----Add new comment
    function addComment(postID) {
        $("#comment-form" + postID).submit(e => {
            e.preventDefault();

            const data = new FormData($('#comment-form' + postID)[0])
            $("#content").val('');
            $.ajax({
                type: 'POST',
                url: `/comment/add-comment/${postID}`,
                data: data,
                processData: false,
                contentType: false,
                cache: false,
                success: function (res) {
                    $("#count-cmt" + postID).html(``)
                    $("#content" + postID).val('')
                    loadComment(0, 1, postID)
                    countComments(postID)
                }
            });
        })
    }

    ///Like react
    function handleLikeReact(postID) {
        $("#like-icon" + postID).click(function () {
            if ($(".like-btn" + postID).hasClass("active")) {
                $(".like-btn" + postID).removeClass("active")
                $.ajax({
                    type: 'PUT',
                    url: `/post/update-like/${postID}`,
                    processData: false,
                    contentType: false,
                    cache: false,
                    success: function (res) {
                        getCountLike(postID)
                    }
                });
            }
            else {
                $(".like-btn" + postID).addClass("active")
                $.ajax({
                    type: 'PUT',
                    url: `/post/update-like/${postID}`,
                    processData: false,
                    contentType: false,
                    cache: false,
                    success: function (res) {
                        getCountLike(postID)
                    }
                });
            }
        })
        $("#like-icon-profile" + postID).click(function () {
            if ($(".like-btn" + postID).hasClass("active")) {
                $(".like-btn" + postID).removeClass("active")
                $.ajax({
                    type: 'PUT',
                    url: `/post/update-like/${postID}`,
                    processData: false,
                    contentType: false,
                    cache: false,
                    success: function (res) {
                        getCountLike(postID)
                    }
                });
            }
            else {
                $(".like-btn" + postID).addClass("active")
                $.ajax({
                    type: 'PUT',
                    url: `/post/update-like/${postID}`,
                    processData: false,
                    contentType: false,
                    cache: false,
                    success: function (res) {
                        getCountLike(postID)
                    }
                });
            }
        })
    }

    //load post profile
    if (location.pathname.includes("profile"))
        loadProfilePost(window.location.pathname.split('/')[2])
    function loadProfilePost(id) {
        $.ajax({
            type: 'GET',
            url: '/post/get-all-post',
            cache: false,
            data: { _id: id },
            success: function (res) {
                showprofilePost(res.posts)
            }
        });
    }
    function showprofilePost(posts) {
        if (posts) {
            posts.forEach(function (post) {
                let html = ``;
                $.ajax({
                    type: 'GET',
                    url: '/post/get-user-post/?email=' + post.user_email,
                    cache: false,
                    success: function (res) {
                        if (res.code === 0) {
                            html += `<div class="main-center-item post" id="${post._id}">
                            <div class="post-top">
                                <a href="/profile/${res.user._id}">
                                    <img src="${res.user.avatar}" alt="" class="image-40">
                                </a>
                                <div class="name-group">
                                    <a href="/profile/${res.user._id}">
                                        <div class="name">${res.user.name}</div>
                                    </a>
                                    <div class="time">${new Date(post.createdAt).toLocaleString('en-JM')}</div>
                                </div>
                                <div class="action  ${post._id}">
                                    <i class="fas fa-ellipsis-h"></i>
                                    <div class="action-dropdown">
                                        <div id="updatePost${post._id}" class="action-dropdown-item">
                                            <i class="fas fa-edit"></i>
                                            Chỉnh sửa bài viết
                                        </div>
                                        <div id="deletePost${post._id}" class="action-dropdown-item">
                                            <i class="fas fa-trash-alt"></i>
                                            Xóa bài viết
                                        </div>
                                    </div>
                                </div>
                                
                            </div>
                            <div class="post-main">
                                <div class="content">
                                    <div>
                                        ${post.description}
                                    </div>
                                    ${checkMedia(post)}
                                    
                                </div>
                                <div class="info">
                                    <div class="like" id="like${post._id}">
                                        <i class="fas fa-thumbs-up"></i>
                                        <span id="count-like${post._id}"></span>
                                        
                                    </div>
                                    <div id="count-cmt${post._id}" class="comment"> </div>
                                </div>
                            </div>
                            <div class="post-bottom">
                                <div id="like-icon-profile${post._id}" class="like-btn react-btn">
                            
                                </div>
                                <div class="comment-btn ${post._id} react-btn">
                                    <i class="far fa-comment-alt"></i>Comment
                                </div>
                            </div>
                            <div class="comment-area" id="${post._id}" >
                                <div class="comment-box">
                                    <img src="${res.user.avatar}" alt="" class="image-34">
                                    <form id="comment-form${post._id}" action="" enctype="multipart/form-data" class="comment-form">
                                        <input id="content${post._id}" name="content" type="text" placeholder="Aa...">
                                        <label for="comment-image" title="Đính kèm ảnh"><i class="fas fa-camera"></i></label>
                                        <input name="comment-image" type="file" id="comment-image" accept="image/png, image/jpeg">
                                    </form>
                                </div>
                                <div id="comment${post._id}" class="comment-list">
                                   
                                </div>
                                <div id="more-comment${post._id}" class="more-comment">
                                    Xem them comment
                                </div>
                            </div>
                        </div>
                        <div class="modal fade" id="like-list-modal${post._id}" tabindex="-1" role="dialog" aria-hidden="true">
                            <div class="modal-dialog" role="document">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <h5 class="modal-title">Những người thích</h5>
                                    </div>
                                    <div id="modal-body-profile${post._id}" class="modal-body">
                                        
                                    </div>
                                    <div class="modal-footer">
                                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        `;
                            $('#user-post-list').append(html);
                            handlePost(post, res.user)
                        }

                        handleDropdown(post._id)
                        displayCommentBox(post._id)
                        showLikeList(post._id)
                        addComment(post._id)
                        handleLikeReact(post._id)
                        moreComments(post._id)
                        countComments(post._id)
                        checkLikeprofile(post._id)
                        getCountLike(post._id)
                        showUserLikeProfile(post)

                    }
                });
            })
        }
    }


    //logout 
    $('.logout').click(function () {
        window.location.href = "http://localhost:3000/account/logout"
    })

    // display modal add post
    $("#add-post-input").click(function () {
        $("#add-modal").modal("show")
    })

    // display list like
    function showLikeList(postID) {
        $("#like" + postID).click(function () {
            $("#like-list-modal" + postID).modal("show")
        })
    }

    // display search list
    {
        $("#search-input").focus(function () {
            $(".search-list").css("display", "flex")
        })

        $("#search-input").focusout(function () {
            $(".search-list").css("display", "none")
        })
    }

    {
        $("input[name=media-checked]").change(() => displayMedia())

        function displayMedia() {
            const mediaChecked = $("input[name=media-checked]:checked").val()
            const mediaUnChecked = $("input[name=media-checked]:not(:checked)").val()
            $(`.${mediaChecked}`).css("display", "block")
            $(`.${mediaUnChecked}`).css("display", "none")
        }
    }

    {
        $("#navbar-icon").click(function () {
            $(".nav-ipad-container").css("transform", "translateX(0px)")
            $(".nav-ipad-container").css("opacity", "1")
            $(".nav-ipad-overlay").css("display", "block")
            $(".nav-ipad-overlay").css("opacity", "1")
        })

        $(".nav-ipad-overlay").click(function () {
            $(".nav-ipad-container").css("transform", "translateX(-100%)")
            $(".nav-ipad-container").css("opacity", "0")
            $(".nav-ipad-overlay").css("display", "none")
            $(".nav-ipad-overlay").css("opacity", "0")
        })
    }

})

// Noti dropdown
{
    $(".notification-dropdown").click(function (e) {
        const children = e.target.children.length === 0 ? e.target : e.target.children[0]

        if (children.classList.toString().includes("fa-chevron-up")) {
            children.classList.remove("fa-chevron-up")
            children.classList.add("fa-chevron-down")
            $(".notification-dropdown-menu").css("display", "block")
            $(".notification-dropdown-menu").css("transform", "translateY(0px)")
        } else if (children.classList.toString().includes("fa-chevron-down")) {
            children.classList.remove("fa-chevron-down")
            children.classList.add("fa-chevron-up")
            $(".notification-dropdown-menu").css("display", "none")
            $(".notification-dropdown-menu").css("transform", "translateY(-100%)")
        }
    })
}


// notification bar click
{
    $(".notification-direction").click(function () {
        window.location.href = "/notification/all"
    })

    $(".all-notify").click(function () {
        window.location.href = "/notification/all"
    })

    $(".faculty-notify").click(function () {
        window.location.href = "/notification/faculty"
    })
}

// Admin add user
{
    $("#add-user-form").submit(e => {
        e.preventDefault()

        const data = new FormData($("#add-user-form")[0])

        $.ajax({
            type: "POST",
            url: "/admin/add-user",
            data: data,
            processData: false,
            contentType: false,
            success: function (res) {
                console.log(res)
                if (res.code === 0) {
                    swal("Good Job!", "Thêm Phòng - Khoa thành công!!", "success")
                        .then(() => {
                            $('#add-user-modal').modal('hide')
                            location.reload()
                        })
                } else {
                    $(".error-text").css("visibility", "visible")
                    $(".error-text").html(res.message)
                }
            }
        })
    })
}

{
    const facultyHelper = {
        1: "Phòng Công tác học sinh sinh viên (CTHSSV)",
        2: "Phòng Đại Học",
        3: "Phòng Sau đại học",
        4: "Phòng điện toán và máy tính",
        5: "Phòng khảo thí và kiểm định chất lượng",
        6: "Phòng tài chính",
        7: "Trung tâm tin học",
        8: "Trung tâm đào tạo phát triển xã hội (SDTC)",
        9: "Trung tâm phát triển Khoa học quản lý và Ứng dụng công nghệ (ATEM)",
        10: "Trung tâm hợp tác doanh nghiệp và cựu sinh viên",
        11: "Khoa Luật",
        12: "Trung tâm ngoại ngữ - tin học - bồi dưỡng văn hóa",
        13: "Viện chính sách kinh tế và kinh doanh",
        14: "Khoa Mỹ thuật công nghiệp",
        15: "Khoa Điện - Điện tử",
        16: "Khoa Công nghệ thông tin",
        17: "Khoa Quản trị kinh doanh",
        18: "Khoa Môi trường và bảo hộ lao động",
        19: "Khoa Lao động công đoàn",
        20: "Khoa Tài chính ngân hàng",
        21: "Khoa giáo dục quốc tế",
    }

    document.querySelectorAll(".user-faculty")?.forEach(faculty => {
        const facultyInner = parseInt(faculty.innerHTML.trim())
        if (facultyHelper[facultyInner])
            faculty.innerHTML = facultyHelper[facultyInner]
    })
}

// edit user image
{
    $("#user-image").change(function () {
        const data = new FormData($("#image-form")[0])

        $.ajax({
            type: "PUT",
            url: "/account/edit-user-avatar/",
            data: data,
            processData: false,
            contentType: false,
            success: function (res) {
                if (res.code === 0) {
                    location.reload()
                }
            },
            error: function (err) {

            }
        })
    })
}

// edit Khoa + lop
{
    $("#edit-profile-btn").click(function () {
        $("#faculty").val($("#user-faculty").html().toString().trim()).change()
    })

    $("#edit-profile-form").submit(function (e) {
        e.preventDefault()

        const data = JSON.stringify({
            name: $("#name").val(),
            faculty: $("#faculty").children("option:selected").val() || null,
            class: $("#class").val() || null,
        })

        $.ajax({
            type: 'PUT',
            url: '/account/edit-user-info',
            data: data,
            processData: false,
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function (res) {
                if (res.code === 0) {
                    $("#edit-profile-modal").modal("hide")
                    location.reload()
                } else {
                    $(".error-text").css("visibility", "visible")
                    $(".error-text").html("Email hoặc mật khẩu không đúng!")
                }
            },
        });
    })
}