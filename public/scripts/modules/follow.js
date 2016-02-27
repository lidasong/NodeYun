define([
    'jquery',
    'modules/constant'
], function($, Const) {

    'use strict';
    var user_id = $('#user-id').val(),
        $currentBtnFollow;

    function initFollow(socket) {
        $('.follows').on('click.follow', '.btn-follow', function(evt) {
            var receiver, type;
            $currentBtnFollow = $(this);
            receiver = $currentBtnFollow.parents('.follow').data('fid');
            type = $currentBtnFollow.data('follow') == 1 ? 'delete' : 'post';
            socket.emit('follow', {
                follower_id: user_id,
                followed_id: receiver,
                type: type
            });
        });
        $('.detail-info').on('click.follow', '.btn-follow', function(evt) {
            var receiver, type;
            $currentBtnFollow = $(this);
            receiver = $currentBtnFollow.data('fid');
            type = $currentBtnFollow.data('follow') == 1 ? 'delete' : 'post';
            socket.emit('follow', {
                follower_id: user_id,
                followed_id: receiver,
                type: type
            });
        });
    }

    function changeFollowStatus() {
        var type = $currentBtnFollow.data('follow') == 1 ? 'delete' : 'post';
        $currentBtnFollow.data('follow', type == 'post' ? 1 : 0)
            .find('span')
            .text(type == 'post' ? '取消关注' : '关注');
    }

    return {
        initFollow: initFollow,
        changeFollowStatus: changeFollowStatus
    }
});
