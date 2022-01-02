$(document).ready(function() {
    //add post --------------------------------------------------------
    loadIndex10Post(0,10)
    $('input[type="radio"]').change(function() {
        if ($('#videoRadio').is(":checked")) {
            $('#post-video').attr('type', 'text');
            $('#post-img').attr('style',"display:none")
        }else{
            $('#post-video').attr('type', 'hidden');
            $('#post-img').attr('style',"display:block")
        }
    })
    $('#form-post').submit((e)=>{
        e.preventDefault();
        const data = new FormData($('#form-post')[0])
        $('#post-video').val('');
        
        $.ajax({
            type: "POST",
            url: "/post/add-post",
            data: data,
            processData: false,
            contentType: false,
            cache: false,
            success: function(data) {
                if(data.code==0){
                    $('#new-post').html("");
                    loadIndex10Post(0,10);
                    $('#exampleModal').modal('hide');
                }
            }
        })
        
    })
    function checkMedia(data){
        media=``;
        let check= data.post!=null?data.post: data;
        if(check.video!=null){
            media += `<iframe width="100%" height="400" src="https://www.youtube.com/embed/${check.video}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`
        }else{
            media+= `<img class="image-up" src="${check.image}" width="100%" ><br><br>`
        }
        return media;
    }
    //-------------------------------------------------------------------------------------------
    function loadIndex10Post(start,limitpost){
        $.ajax({
            type: 'GET',
            url: '/post/get-all-post',
            data: { limit: limitpost, start: start },
            cache: false,
            success: function(posts) {
                showPost(posts)
            }
        });
    }
    function showPost(posts) {
        posts.posts.forEach(function(data){
            let html = ``;
            $.ajax({
                type: 'GET',
                url: '/post/get-user-post',
                data: {email: data.user_email},
                cache: false,
                success: function(data1) {
                    if(data1.code==0){
                        html += `<div class="card" id="post-${data1.user._id}">
                            <div class="card__body">
                            
                                <a href="/personal?id=${data1.user._id}">
                                    <img  class="mr-2" src="${data1.user.avatar}" width="40" height="40">
                                    <span class="card__username">${data1.user.name}</span>
                                </a> °
                                <span class="card__time-up">${new Date(data.createdAt).toLocaleString('en-JM')}</span>
                                <br>
                                
                                <div>
                                    <p class="card__content-up">${data.description}</p>
                                    ${checkMedia(data)}
                                    <p class="card__comments">0 Bình luận</p>
                                </div><hr>
                                <div class="card__bottom-up">
                                    <a href="#favorite" class="favorite614c62209d078343e87f8f38"><span class="fa-heart614c62209d078343e87f8f38">
                                        <i class="far fa-heart fa-heart614c62209d078343e87f8f38" style="margin-right=10px;"></i></span> ${data.like} Thích
                                    </a>
                                        &emsp;
                                    <a href="#comment" class="">
                                        <i class="fa fa-comments"></i> Bình luận
                                    </a>
                                        &emsp;
                                </div>
                            </div>
                        </div>`;
                        $('#new-post').append(html);
                    }
                }
            });
        })
    }
    //logout 
    $('#btn-logout').click(function(){
        $.ajax({
            type: 'GET',
            url: '/account/logout',
            cache: false,
            success: function(data) {
                if(data.code ==0){
                    window.location.href="http://localhost:3000/account/login"
                }
            }
        });
    })



})