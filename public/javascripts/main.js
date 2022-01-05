$(document).ready(function () {
    // display password
    {
        const password = document.querySelector("#password")

        const eye = document.querySelector("#eye")

        if (eye) {
            eye.onclick = () => {
                if (password.type === "password") {
                    password.type = "text"
                    eye.classList.remove("fa-eye")
                    eye.classList.add("fa-eye-slash")
                } else {
                    password.type = "password"
                    eye.classList.remove("fa-eye-slash")
                    eye.classList.add("fa-eye")
                }
            }
        }
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
                        $(".error-text").html(res.message)
                    }
                },
            });
        })

        $("#gg-login-btn").click(() => {
            window.location.href = "/account/auth/google"
        })
    }

    //add post --------------------------------------------------------
    if (!location.pathname.includes("account"))
        loadIndex10Post(0, 10)

    $('#add-form').submit((e) => {
        e.preventDefault();
        const data = new FormData($('#add-form')[0])
        $('#video').val('');
        // $('#description').val('');
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
        } else {
            media += `<img class="image-up" src="${check.image}" width="100%" ><br><br>`
        }
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

    function showPost(posts) {
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
                            <img src="${res.user.avatar}" alt="" class="image-40">
                            <div class="name-group">
                                <div class="name">${res.user.name}</div>
                                <div class="time">${new Date(post.createdAt).toLocaleString('en-JM')}</div>
                            </div>
                            <div class="action  ${post._id}">
                                <i class="fas fa-ellipsis-h"></i>
                                <div class="action-dropdown">
                                    <div class="action-dropdown-item">
                                        <i class="fas fa-edit"></i>
                                        Chỉnh sửa bài viết
                                    </div>
                                    <div class="action-dropdown-item">
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
                                    ${post.like}
                                </div>
                                <div class="comment">${loadComment(post._id)} bình luận</div>
                            </div>
                        </div>
                        <div class="post-bottom">
                            <div class="like-btn react-btn">
                                <i class="like-btn${post._id} far fa-thumbs-up active"></i> Like
                            </div>
                            <div class="comment-btn ${post._id} react-btn">
                                <i class="far fa-comment-alt"></i>Comment
                            </div>
                        </div>
                        <div class="comment-area" id="${post._id}" >
                            <div class="comment-box">
                                <img src="${res.user.avatar}" alt="" class="image-34">
                                <form id="comment-form${post._id}" action="" enctype="multipart/form-data" class="comment-form">
                                    <input name="content" type="text" placeholder="Aa...">
                                    <label for="comment-image" title="Đính kèm ảnh"><i class="fas fa-camera"></i></label>
                                    <input name="comment-image" type="file" id="comment-image" accept="image/png, image/jpeg">
                                </form>
                            </div>
                            <div class="comment-list">
                                
                            </div>
                            <div class="more-comment">
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
                                <div class="modal-body">
                                    <div class="like-list">
                                        <a href="">
                                            <img src="" class="image-34" alt="">
                                            <span>Anh Khoa</span>
                                        </a href="">
                                        <i class="fas fa-thumbs-up"></i>
                                    </div>
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    `;
                        $('#post-list').append(html);
                    }

                    handleDropdown(post._id)
                    displayCommentBox()
                    // showComment(post._id)
                    showLikeList(post._id)
                    addComment(post._id)
                    handleLikeReact(post._id)
                }
            });
        })
    }

    handleDropdown("dropdown")
    function handleDropdown(className) {
        $("." + className).click(function (e) {
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
            if ($("." + className).hasClass("active"))
                $("." + className).removeClass("active")
        })
    }

    //Load comment--------------------------
    function loadComment(postId) {
        let count = 0;
        $.ajax({
            type: 'GET',
            url: `/comment/get-comment/${postId}`,
            success: function (res) {
                count = res.comments?.length
                if (res.code === 0) {
                    showComment(res.comments)
                }
            }
        });

        function showComment(comments) {
            console.log(comments)
            // comments.forEach(function (data) {
            //     $.ajax({
            //         type: 'GET',
            //         url: `/comment/get-comment/${data.user_email}`,
            //         cache: false,
            //         success: function (res) {
            //             let html = `
            //             <div class="comment">
            //                 <img src="${res.user.avatar}" alt="" class="image-34">
            //                 <div class="content">
            //                     <div class="name">
            //                         <span>${res.name}</span>
            //                         <span>${new Date(data.createdAt).toLocaleString('en-JM')}</span>
            //                     </div>
            //                     <div class="description">
            //                         <div>
            //                             ${data.content}
            //                         </div>
            //                     </div>
            //                 </div>
            //             </div>`
            //             $("#cmt" + data._id).append(html);
            //         }
            //     });
            // })
        }

        return count;
    }
    
    // display comment
    function displayCommentBox() {
        $(".comment-btn").click(function (e) {
            const post = e.target.parentNode.parentNode
            post.children[3].style.display = "block"
        })
    }

    //----Add new comment
    function addComment(postID) {
        $("#comment-form" + postID).submit(e => {
            e.preventDefault();
            $("#content").val('');
            const data = new FormData($('#comment-form' + postID)[0])
            $.ajax({
                type: 'POST',
                url: `/comment/add-comment/${postID}`,
                data: data,
                processData: false,
                contentType: false,
                cache: false,
                success: function (res) {
                    // console.log(res);
                }
            });
        })
    }

    ///Like react
    function handleLikeReact(className) {
        $(window).click(function () {
            if ($(".like-btn" + className).hasClass("active"))
                $(".like-btn" + className).removeClass("active")
            else {
                $(".like-btn" + className).addClass("active")
            }
        })
    }

    //logout 
    $('.logout').click(function () {
        $.ajax({
            type: 'GET',
            url: '/account/logout',
            cache: false,
            success: function (data) {
                if (data.code == 0) {
                    window.location.href = "http://localhost:3000/account/login"
                }
            }
        });
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