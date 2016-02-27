require([
    'jquery',
    'EJS',
    'modules/like',
    'modules/comment',
    'modules/loadmore',
    'modules/video',
    'modules/share_img_view',
    'modules/s_message',
    'modules/audio',
    // 'modules/niceScroll',
    'bootstrap_dropdown',
    'ImageViewer'
], function($, EJS, Like, Comment,loadMore,Video,ShareImageView,SocketMsg) {

    'use strict';

    var routers = [],
        type = $('#type').val(),
        userId = $('#user-id').val();

    function initTabEvent(){
        var $segment = $('.segments');
        $segment.on('click', '.router', function(evt) {
            var router = $(this).attr('href');
            type = $(this).data('type'),
                evt.preventDefault();
            history.pushState({
                router: router
            }, '', router);
            loadMore.resetPage(1)
                .reset({
                    url: '/home/' + type + '?router=true',
                    success: loadMoreDone,
                    fail: loadMoreFail
                });
            routerChangeRender(router);
        });
    }

    function initShareEvent(){
        $('.shares').on('click.cancel', '.cancel-share', function() {
            var $share = $(this).parents('.share'),
                s_id = $(this).parents('.share').data('sid');
            $.ajax({
                url: '/share/' + s_id,
                type: 'delete'
            }).done(function(resp) {
                $share.remove();
            }).fail(function(err) {
                console.log(err);
            });
        });
    }

    function routerChangeRender(router) {
        var templateUrl = 'views/templates/share-item.ejs',
            $shareList = $('.share-list'),
            html = '';
        $.get(router, {
            router: true
        }).done(function(results){
            results.forEach(function(item, index) {
                html += new EJS({
                    url: templateUrl
                }).render({
                    item: item,
                    sessionUser: {
                        user_id: userId
                    }
                });
            });
            $shareList.html(html);
        }).fail(function(err){
            console.log(err);
        });
    }

    function initH5Router() {
        window.addEventListener('popstate', function(evt) {
            var routerUrl = evt.state.router;
            routerChangeRender(routerUrl);
        })
    }

    initH5Router();
    initTabEvent();
    initShareEvent();
    
    var socket = SocketMsg.initWsSocket();
    // window.socket = socket;
    Like.init('.shares',socket);

    Comment.initComment(socket);

    Video.initVideo();

    ShareImageView.initImgView();


    loadMore.initLoadMore({
        url: '/home/' + type + '?router=true',
        success: loadMoreDone,
        fail: loadMoreFail
    });

    function loadMoreDone(res) {
        var templateUrl = 'views/templates/share-item.ejs',
            $shareList = $('.share-list'),
            html = '';
        res.forEach(function(item, index) {
            html += new EJS({
                url: templateUrl
            }).render({
                item: item,
                sessionUser: {
                    user_id: userId
                }
            });
        });
        $shareList.append(html);
    }

    function loadMoreFail(err) {
        console.log(err);
    }

});
