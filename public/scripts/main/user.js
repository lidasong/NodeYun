require([
    'jquery',
    'EJS',
    'modules/avatar',
    'modules/follow',
    'modules/like',
    'modules/loadmore',
    'modules/video',
    'modules/share_img_view',
    'modules/s_message',
    'modules/comment',
    'modules/audio',
    'bootstrap_dropdown'
], function($,EJS, Avatar, Follow, Like, loadMore,Video,ShareImageView,SocketMsg,Comment) {

    'use strict';

    Avatar.initAvatar();

    var socket = SocketMsg.initWsSocket();

    Comment.initComment(socket);

    Like.init('.shares',socket);

    Follow.initFollow(socket);
    
    Video.initVideo();

    ShareImageView.initImgView();

    initUpdateUserInfo();

    initEditEvent();

    initShareEvent();


    function initUpdateUserInfo() {
        $('form').on('submit', function(evt) {
            evt.preventDefault();
            var data = $(this).serialize(),
                userId = $('#session-id').val();
            $.ajax({
                url: '/user/' + userId,
                type: 'put',
                data: data
            }).done(function(res) {
                updateInfo(res);
                $('.edit-user').hide();
            }).fail(function(err) {
                console.log(err);
            });
        });
    }

    function updateInfo(data) {
        var $username = $('.username'),
            $userIntro = $('.user-intro'),
            $sex = $('.sex'),
            $home = $('.user-home'),
            sexClass = data['sex'] == 'F' ? 'fa-female' : 'fa-male';
        $username.text(data['username']);
        $userIntro.text(data['user_intro']);
        $home.attr('href',data['home_url']).text(data['home_url']);
        $sex.removeClass('fa-female fa-male').addClass(sexClass);
    }

    function initEditEvent() {
        var $btnEditUser = $('.btn-edit-user');
        $btnEditUser.on('click', function(evt) {
            $('.edit-user').show();
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

});
