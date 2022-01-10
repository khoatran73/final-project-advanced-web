$(document).ready(function () {
    // display loading
    $(document).ajaxStart(function () {
        $('#loading').show()
    }).ajaxStop(function () {
        $('#loading').hide()
    })

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
    let postaction = "inactive"
    if (!location.pathname.includes("account")) {
        let start = 0;
        let limit = 10;
        loadIndex10Post(start, limit)
        $(window).scroll(function () {
            if ($(window).scrollTop() + $(window).height() > $("#post-list").height() && postaction == "inactive") {
                postaction = "active"
                start = start + limit;
                setTimeout(function () {
                    loadIndex10Post(start, limit)
                }, 1500);
            }
        })
    }


    $('#add-form').submit((e) => {
        e.preventDefault();
        const data = new FormData($('#add-form')[0])

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
                    $('#video').val('');
                    $('#description').val('');
                    $('#image').val('');
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
                if (res.code === 0) {
                    postaction = 'inactive'
                    showPost(res.posts)
                } else {
                    postaction = 'active'
                }
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
                    async: false,
                    type: 'GET',
                    url: '/post/get-user-post/?email=' + post.user_email,
                    cache: false,
                    success: function (res) {
                        if (res.code === 0) {
                            html +=
                                `<div class="main-center-item post" id="${post._id}">
                            <div id="post-top${post._id}" class="post-top">
                                <a href="/profile/${res.user._id}">
                                    <img src="${res.user.avatar}" alt="" class="image-40">
                                </a>
                                <div class="name-group">
                                    <a href="/profile/${res.user._id}">
                                        <div class="name">${res.user.name}</div>
                                    </a>
                                    <div class="time">${new Date(post.createdAt).toLocaleString('en-JM')}</div>
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
                                    <img src="${res.user1.avatar}" alt="" class="image-34">
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
                            checkHandlePost(post, res.user)
                        }

                        displayCommentBox(post._id)
                        showLikeList(post._id)
                        addComment(post._id)
                        handleLikeReact(post)
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
    function checkHandlePost(post, user) {
        $.ajax({
            type: 'GET',
            url: `/post/check-user-post/${post._id}`,
            success: function (res) {
                let html = `
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
                `
                if (res.code == 0) {
                    $("#post-top" + post._id).append(html)
                    if (!window.location.pathname.includes("profile")) {
                        handleDropdown(post._id)
                        handlePost(post, user)
                    }
                }
            }

        })
    }
    //show users like posts 
    function showUserLike(post) {
        $("#modal-body" + post._id).html("");
        $.ajax({
            type: 'GET',
            url: `/post/get-all-user-like-post/${post._id}`,
            cache: false,
            success: function (postLike) {
                postLike.users_like.forEach(email => {
                    $.ajax({
                        type: 'GET',
                        async: false,
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
        })
    }
    function showUserLikeProfile(post) {
        $("#modal-body-profile" + post._id).html("")
        $.ajax({
            type: 'GET',
            url: `/post/get-all-user-like-post/${post._id}`,
            cache: false,
            success: function (postLike) {
                postLike.users_like.forEach(email => {
                    $.ajax({
                        type: 'GET',
                        async: false,
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
            swal({
                title: "DELETE",
                text: "Bạn có chắc muốn xóa bài viết này ?",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            })
                .then((willDelete) => {
                    if (willDelete) {
                        $.ajax({
                            type: 'DELETE',
                            url: `/post/delete-post/${post._id}`,
                            success: function (res) {
                                if (res.code == 0) {
                                    swal({
                                        title: "SUCCESS",
                                        text: "Post was deleted",
                                        icon: "success",
                                        buttons: true,
                                        dangerMode: true,
                                    })
                                    $('#post-list').html("");
                                    loadIndex10Post(0, 10);
                                }
                            }
                        })
                    }
                })
        })
        $("#updatePost" + post._id).click(function () {
            let html
            
            $.ajax({
                type: 'GET',
                async: false,
                url: `/post/get-post/${post._id}`,
                success: function (res) {
                    if (res.code === 0) {
                        
                        $("#update-modal").modal("show")
                        $("#update-description").val(res.post.description)
                        checkMediaUpdate(res.post)
                    }
                }
            })

            // console.log($("#update-media").html())

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
                $('#image-update').val('');
                $.ajax({
                    type: "PUT",
                    url: `/post/edit-post/${post._id}`,
                    data: data,
                    processData: false,
                    contentType: false,
                    cache: false,
                    success: function (res) {
                        if (res.code === 0) {
                            if (window.location.pathname.includes("profile")) {
                                $("#update-modal").modal("hide")
                                $('#post-list').html("");
                                loadProfilePost(window.location.pathname.split('/')[2])
                            } else {
                                $("#update-modal").modal("hide")
                                $('#post-list').html("");
                                loadIndex10Post(0, 10);
                            }
                        } else {
                            $(".error-text").css("visibility", "visible")
                            $(".error-text").html(res.message)
                        }
                    }
                })
            })

        })

        function checkMediaUpdate(post) {
            media = ``;
            
            if (post.video != null) {
                media += `<iframe src="https://www.youtube.com/embed/${post.video}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`
            } else if (post.image != null) {
                media += `<img class="image-up" src="${post.image}" width="100%" ><br><br>`
            } else { media = `` }

            $("#update-media").html("")
            $("#update-media").append(media)

            console.log(media)
        }

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
                } else {
                    $("#comment" + postId).html('');
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
                async: false,
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
                            <div class="comment-dropdown">
                                <div class="comment-dropdown-menu">
                                    <div class="faculty-notify comment-dropdown-item">
                                        <i class="fas fa-users"></i>
                                        Theo Phòng Ban
                                    </div>
                                    <div class="all-notify comment-dropdown-item">
                                        <i class="fas fa-bell"></i>
                                        Tất Cả Thông Báo
                                    </div>
                                </div>
                            </div>
                        </div>`
                        $("#comment" + data.post_id).append(html);
                        handleComment(data)

                    }
                }
            });
        })
    }
    function handleComment(data) {
        $("#comment" + data.post_id).mousedown(function () {
            $.ajax({
                type: 'GET',
                url: `/comment/check-user-comment/${data._id}`,
                cache: false,
                success: function (res) {
                    if (res.code == 0) {
                        timer = setTimeout(function () {
                            swal({
                                title: "DELETE",
                                text: "Bạn có muốn xóa bình luận này ?",
                                icon: "warning",
                                buttons: true,
                                dangerMode: true,
                            })
                                .then((willDelete) => {
                                    if (willDelete) {
                                        $.ajax({
                                            type: 'DELETE',
                                            url: `/comment/delete-comment/${data._id}`,
                                            cache: false,
                                            success: function (res) {
                                                if (res.code == 0) {
                                                    swal({
                                                        title: "SUCCESS",
                                                        text: "Comment was deleted",
                                                        icon: "success",
                                                        buttons: true,
                                                        dangerMode: true,
                                                    })
                                                    loadComment(0, 1, data.post_id)
                                                    countComments(data.post_id)
                                                }
                                            }
                                        });
                                    }
                                })
                        }, 1000);
                    }
                }
            });
        })
    }
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
    function handleLikeReact(post) {
        $("#like-icon" + post._id).click(function () {
            if ($(".like-btn" + post._id).hasClass("active")) {
                $(".like-btn" + post._id).removeClass("active")
                $.ajax({
                    type: 'PUT',
                    url: `/post/update-like/${post._id}`,
                    processData: false,
                    contentType: false,
                    cache: false,
                    success: function (res) {
                        showUserLike(post)
                        getCountLike(post._id)
                    }
                });
            }
            else {
                $(".like-btn" + post._id).addClass("active")
                $.ajax({
                    type: 'PUT',
                    url: `/post/update-like/${post._id}`,
                    processData: false,
                    contentType: false,
                    cache: false,
                    success: function (res) {
                        showUserLike(post)
                        getCountLike(post._id)
                    }
                });
            }
        })
        $("#like-icon-profile" + post._id).click(function () {
            if ($(".like-btn" + post._id).hasClass("active")) {
                $(".like-btn" + post._id).removeClass("active")
                $.ajax({
                    type: 'PUT',
                    url: `/post/update-like/${post._id}`,
                    processData: false,
                    contentType: false,
                    cache: false,
                    success: function (res) {
                        showUserLikeProfile(post)
                        getCountLike(post._id)
                    }
                });
            }
            else {
                $(".like-btn" + post._id).addClass("active")
                $.ajax({
                    type: 'PUT',
                    url: `/post/update-like/${post._id}`,
                    processData: false,
                    contentType: false,
                    cache: false,
                    success: function (res) {
                        showUserLikeProfile(post)
                        getCountLike(post._id)
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
                $('#user-post-list').html('');
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
                    async: false,
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
                        handleLikeReact(post)
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
        window.location.href = "/account/logout"
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
        $("#search-input").keyup(function (e) {
            $(".search-list").css("display", "flex")
            const name = e.target.value

            $.ajax({
                type: 'GET',
                url: '/account/search-users/?name=' + name,
                cache: false,
                success: function (res) {
                    if (res.code === 0) {
                        updateSearchList(res.users)
                    }
                }
            })

            function updateSearchList(users) {
                const searchList = document.querySelector("#search-list")
                searchList.innerHTML = ""

                if (users.length === 0) {
                    searchList.innerHTML = "Không tìm thấy người dùng"
                    return
                }
                users.map(user => {
                    const userSearch = document.createElement("a")
                    userSearch.classList.add("user-search")
                    userSearch.setAttribute("href", `/profile/${user._id}`)
                    userSearch.innerHTML = `<img src=${user.avatar} alt="${user.name}" class="image-34">
                    <span>${user.name}</span>`
                    searchList.appendChild(userSearch)
                })
            }
        })

        $(window).click(function () {
            $(".search-list").css("display", "none")
        })
        // $("#search-input").focusout(function () {
        //     $(".search-list").css("display", "none")
        // })
    }

    {
        $("input[name=media-checked]").change(() => displayMedia())

        function displayMedia() {
            const mediaChecked = $("input[name=media-checked]:checked").val()
            const mediaUnChecked = $("input[name=media-checked]:not(:checked)").val()

            if (mediaChecked === "media-image") {
                $("#video").val("")
            } else if (mediaChecked === "media-video") {
                $("#image").val("")
            }

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

        $(".add-notify").click(function () {
            window.location.href = "/notification/add-notify"
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
                    if (res.code === 0) {
                        swal("Good Job!", "Thêm Đơn vị thành công!!", "success")
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

    // edit user role 
    {
        $("#edit-role-btn").click(function () {
            $.ajax({
                type: "GET",
                url: "/admin/get-all-users",
                success: function (res) {
                    if (res.code === 0) {
                        updateEditRoleModal(res.users)
                    }
                }
            })
        })

        function updateEditRoleModal(users) {
            const userSelect = document.querySelector("#user-select-list")
            users.forEach(user => {
                const opt = document.createElement("option")
                opt.value = user.email
                opt.innerHTML = user.email
                userSelect.appendChild(opt)
            })
        }

        $("#edit-role-form").submit(e => {
            e.preventDefault()

            const data = JSON.stringify({
                email: $("#user-select-list").val(),
                faculty: $("#edit-faculty").val()
            })

            $.ajax({
                type: "PUT",
                url: "/admin/edit-user-role",
                data: data,
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                success: function (res) {
                    if (res.code === 0) {
                        swal("Good Job!", "Thêm Đơn vị thành công!!", "success")
                            .then(() => {
                                $('#edit-role-modal').modal('hide')
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

    const facultyHelper = {
        1: "Phòng Công tác học sinh sinh viên",
        2: "Phòng Đại Học",
        3: "Phòng Sau đại học",
        4: "Phòng điện toán và máy tính",
        5: "Phòng khảo thí và kiểm định chất lượng",
        6: "Phòng tài chính",
        7: "Trung tâm tin học",
        8: "Trung tâm đào tạo phát triển xã hội",
        9: "Trung tâm phát triển Khoa học quản lý và Ứng dụng công nghệ",
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

    function convertFaculty() {
        document.querySelectorAll(".user-faculty")?.forEach(faculty => {
            const facultyInner = parseInt(faculty.innerHTML.trim())
            if (facultyHelper[facultyInner])
                faculty.innerHTML = facultyHelper[facultyInner]
        })
    }

    convertFaculty()

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

    function converTime() {
        document.querySelectorAll(".time-convert").forEach(time => {
            const inner = time.innerHTML.toString().trim()
            const timeConverted = new Date(inner).toLocaleString('en-JM')

            time.innerHTML = timeConverted
        })
    }

    converTime()

    // socket io
    const socket = io()

    // Hiện toast
    socket.on("message", notify => {
        renderToast(notify)

        function renderToast(notify) {
            if (location.pathname.includes("add-notify")) {
                return
            }

            const strong = document.createElement("strong")
            strong.classList.add("user-faculty")
            strong.innerHTML = notify.faculty.toString()
            const toastTitle = document.querySelector("#toast-title")
            toastTitle.innerHTML = ""
            toastTitle.appendChild(strong)
            toastTitle.innerHTML += ` vừa đăng một thông báo mới`

            const link = document.createElement("a")
            link.classList.add("noti-title")
            link.innerHTML = notify.title
            link.setAttribute("href", `/notification/${notify.faculty}/${notify._id}`)
            document.querySelector("#toast-body").innerHTML = ""
            document.querySelector("#toast-body").appendChild(link)

            convertFaculty()

            $(".toast").toast("show")
        }
    })


    // Editor
    if (location.pathname.includes("add-notify") || location.pathname.includes("edit-notify")) {
        const editor = new EditorJS({
            holder: 'editorjs',
            tools: {
                header: {
                    class: Header,
                    inlineToolbar: true,
                    config: {
                        placeholder: 'header...',
                        defaultLevel: 3
                    }
                },
                list: {
                    class: List,
                    inlineToolbar: true
                },
                table: {
                    class: Table,
                    inlineToolbar: true,
                    config: {
                        rows: 2,
                        cols: 3,
                    }
                },
                paragraph: {
                    config: { placeholder: 'Nội dung...' }
                },
            },
        })

        const _id = location.search.replace("?_id=", "").replace("/", "")
        if (location.pathname.includes("edit-notify")) {
            $.ajax({
                type: 'GET',
                url: `/notification/get-notify-detail/${_id}`,
                success: function (res) {
                    if (res.code === 0) {
                        updateEditor(res.notification)
                    }
                }
            })
        }

        function updateEditor(notification) {
            $("#title").val(notification.title)

            editor.isReady
                .then(() => {
                    editor.render({
                        "blocks": notification.content
                    })
                })
                .catch((reason) => {
                    console.log(`Editor.js initialization failed because of ${reason}`)
                })
        }

        const editorjs = document.querySelector("#editorjs")
        editorjs.addEventListener("keyup", function () {
            editor.save().then((data) => {
                showResult(data)
            })
        })

        $("#save-notify-btn").click(function () {
            editor.save().then((data) => {
                const notify = JSON.stringify({
                    title: $("#title").val(),
                    content: data.blocks
                })

                if (location.pathname.includes("add-notify")) {
                    $.ajax({
                        type: "POST",
                        url: "/notification/add-notification",
                        data: notify,
                        processData: false,
                        dataType: "json",
                        contentType: "application/json; charset=utf-8",
                        success: function (res) {
                            if (res.code === 0) {
                                socket.emit("newNotification", res.notification)
                                swal("Good Job!", "Thêm thông báo thành công!!", "success")
                                    .then(() => {
                                        window.location.href = "/notification/all"
                                    })
                            } else {
                                swal("Opps..!!", res.message, "warning")
                            }
                        }
                    })
                } else if (location.pathname.includes("edit-notify")) {
                    $.ajax({
                        type: "PUT",
                        url: `/notification/edit-notification/${_id}`,
                        data: notify,
                        processData: false,
                        dataType: "json",
                        contentType: "application/json; charset=utf-8",
                        success: function (res) {
                            if (res.code === 0) {
                                swal("Good Job!", "Sửa báo thành công!!", "success")
                                    .then(() => {
                                        window.location.href = `/notification/${res.notification.faculty}/${res.notification._id}`
                                    })
                            } else {
                                swal("Opps..!!", res.message, "warning")
                            }
                        }
                    })
                }
            })
        })
    }

    function showResult(data) {
        const result = document.querySelector("#result")
        result.innerHTML = ""

        const blocks = data.blocks

        blocks.forEach((block) => {
            if (block.type === "header") {
                const header = document.createElement(`h${block.data.level}`)
                header.classList.add("ce-header")
                header.innerHTML = block.data.text
                result.appendChild(header)
            } else if (block.type === "paragraph") {
                const p = document.createElement("p")
                p.classList.add("ce-paragraph")
                p.classList.add("cdx-block")
                p.innerHTML = block.data.text
                result.appendChild(p)
            } else if (block.type === "list") {
                if (block.data.style === "ordered") {
                    const ol = document.createElement("ol")
                    ol.classList.add("cdx-block")
                    ol.classList.add("cdx-list")
                    ol.classList.add("cdx-list--ordered")
                    block.data.items.forEach((item) => {
                        const li = document.createElement("li")
                        li.classList.add("cdx-list__item")
                        li.innerHTML = item
                        ol.appendChild(li)
                    })
                    result.appendChild(ol)
                } else {
                    const ul = document.createElement("ul")
                    ul.classList.add("cdx-block")
                    ul.classList.add("cdx-list")
                    ul.classList.add("cdx-list--unordered")
                    block.data.items.forEach((item) => {
                        const li = document.createElement("li")
                        li.classList.add("cdx-list__item")
                        li.innerHTML = item
                        ul.appendChild(li)
                    })
                    result.appendChild(ul)
                }
            } else if (block.type === "table") {
                const table = document.createElement("table")
                table.classList.add("table")
                table.classList.add("table-bordered")

                block.data.content.forEach((trText, index) => {
                    const tr = document.createElement("tr")
                    trText.map(tdText => {
                        let td = document.createElement("td")
                        if (block.data.withHeadings && index === 0)
                            td = document.createElement("th")

                        td.innerHTML = tdText
                        tr.appendChild(td)
                    })
                    table.appendChild(tr)
                })
                result.appendChild(table)
            } else if (!block.type) {
                result.appendChild(document.createElement("br"))
            }
        })
    }

    // delete notify
    {
        $("#delete-notify").click(e => {
            e.preventDefault()
            const url = e.target.href
            swal({
                title: "DELETE",
                text: "Xóa thông báo này ?",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            })
                .then((willDelete) => {
                    if (willDelete) {
                        $.ajax({
                            type: 'DELETE',
                            url: url,
                            success: function (res) {
                                if (res.code == 0) {
                                    swal({
                                        title: "SUCCESS",
                                        text: "Xóa Thông báo thành công!",
                                        icon: "success",
                                        buttons: true,
                                        dangerMode: true,
                                    }).then(() => window.location.href = "/notification/all")
                                }
                            }
                        });
                    }
                })
        })
    }

    // faculty list
    if (location.pathname.includes("faculty")) {
        const facultyList = document.querySelector("#faculty-list")
        facultyList.innerHTML = ""
        for (let i = 1; i <= 21; i++) {
            const faculty = document.createElement("div")
            faculty.classList.add("faculty")
            faculty.innerHTML = `<a href="/notification/${i}">
                <div class="faculty-img">
                    <img src="/image/logo.png" alt="">
                </div>
                <div class="faculty-name">${facultyHelper[i]}</div>
            </a>`

            facultyList.appendChild(faculty)
        }
    }

    {
        // hold input search
        const titleSearchValue = location.search.slice(7)
        let facultySearchValue = location.pathname.slice(14)
        facultySearchValue = facultySearchValue.includes("/") ? facultySearchValue.replace("/", "") : facultySearchValue
        facultySearchValue = facultySearchValue ? facultySearchValue : "all"

        $("#notification-title").val(titleSearchValue)
        $("#notification-faculty").val(facultySearchValue).change()


        $("#notify-form-search").submit(e => {
            e.preventDefault()

            const titleSearch = $("#notification-title").val()
            const facultySearch = $("#notification-faculty").val()

            $.ajax({
                type: 'GET',
                url: `/notification/search/${facultySearch}/?title=${titleSearch}`,
                success: function (res) {
                    if (res.code === 0) {
                        updateURL(facultySearch, titleSearch)
                        paging(res.notifications)
                    }
                }
            })

            function updateURL(faculty, titleSearch) {
                window.history.pushState({}, '', `/notification/${faculty}/?title=${titleSearch}`)
            }
        })
    }

    // Paging
    if (location.pathname.includes("notification")) {
        let faculty = location.pathname.slice(14)
        faculty = faculty.includes("/") ? faculty.replace("/", "") : faculty

        $.ajax({
            type: 'GET',
            url: `/notification/get-notification/${faculty}/${location.search}`,
            success: function (res) {
                if (res.code === 0) {
                    paging(res.notifications)
                }
            }
        })
    }

    function paging(datas) {
        let start = 0
        let end = 9
        let currentPage = datas.length === 0 ? 0 : 1
        const totalPages = Math.ceil(datas.length / 10)

        loadData()
        function loadData() {
            const notificationList = document.querySelector("#notification-list")
            notificationList.innerHTML = ""

            if (datas.length === 0) {
                notificationList.innerHTML = `<div class="notification-item none-border"><h5>Không tìm thấy thông báo phù hợp</h5></div>`
                return
            }

            const userEmail = $("#user-email").html().trim()

            datas.map((data, index) => {
                if (start <= index && index <= end) {
                    let newTag = `<div class="new-tag">New</div>`
                    let seen = false

                    if (data.user_read.includes(userEmail)) {
                        seen = true
                        newTag = ``
                    }

                    div = document.createElement("div")
                    div.classList.add("notification-item")
                    if (seen) div.classList.add("notify-seen")
                    div.innerHTML = `
                        <a href="/notification/${data.faculty}/${data._id}">
                            <div class="title" title="Title">
                                ${data.title}
                            </div>
                            ${newTag}
                            <div class="time">[<span class="user-faculty">${data.faculty}</span>] - <span class="time-convert">${data.createdAt}</span></div>
                        </a>
                    `
                    notificationList.appendChild(div)
                }
            })
            converTime()
            convertFaculty()
        }

        function changeStartAndEnd(currentPage) {
            if (currentPage > totalPages) {
                return
            }
            start = (currentPage - 1) * 10
            end = start + 9
        }

        renderPageNumber()
        function renderPageNumber() {
            const paging = document.querySelector("#paging")
            paging.innerHTML = ""

            if (currentPage === 0) {
                return
            }

            const prevPage = document.createElement("li")
            prevPage.classList.add("page-item")
            prevPage.classList.add("prev-page")
            if (currentPage === 1) {
                prevPage.classList.add("disabled")
            }
            prevPage.innerHTML = `<a class="page-link" href="#" tabindex="-1">Previous</a>`
            paging.appendChild(prevPage)

            for (let i = 1; i <= totalPages; i++) {
                const page = document.createElement("li")
                page.classList.add("page-item")
                if (currentPage === i) {
                    page.classList.add("active")
                    page.innerHTML = `<a class="page-link page-number" href="#">${i}</a>`
                } else {
                    page.innerHTML = `<a class="page-link page-number" href="#">${i}<span class="sr-only">(current)</span></a>`
                }
                paging.appendChild(page)
            }
            const nextPage = document.createElement("li")
            if (currentPage === totalPages) {
                nextPage.classList.add("disabled")
            }
            nextPage.classList.add("page-item")
            nextPage.classList.add("next-page")
            nextPage.innerHTML = `<a class="page-link" href="#">Next</a>`
            paging.appendChild(nextPage)

            $(".page-number").click(e => {
                e.preventDefault()
                setCurrentPage(parseInt(e.target.innerHTML.toString()))
                renderPageNumber()
                loadData()
            })

            $(".prev-page").click(e => {
                e.preventDefault()
                if (currentPage === 1) {
                    return
                }

                setCurrentPage(currentPage - 1)
                renderPageNumber()
                loadData()
            })

            $(".next-page").click(e => {
                e.preventDefault()
                if (currentPage === totalPages)
                    return
                setCurrentPage(currentPage + 1)
                renderPageNumber()
                loadData()
            })
        }

        function setCurrentPage(pageNumber) {
            currentPage = pageNumber
            changeStartAndEnd(currentPage)
        }
    }
})