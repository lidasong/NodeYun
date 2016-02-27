define([
    'jquery',
    'modules/constant'
], function($, Const) {
    'use strict';

    var $currentLike,
        user_id = $('#user-id').val();

    function initEvent(container, socket) {
        var $shares = $(container);
        $shares.on('click.like', '.like', function(evt) {
            var s_id, type, receiver;
            $currentLike = $(this)
            s_id = $currentLike.parents('.share').data('sid');
            receiver = $currentLike.parents('.share-info').data('user');
            type = $currentLike.data('like') == 1 ? 'delete' : 'post';
            socket.emit('like', {
                s_id: s_id,
                user_id: user_id,
                receiver:receiver,
                type: type
            });
        });
    }

    function changeLike() {
        var type = $currentLike.data('like') == 1 ? 'delete' : 'post';
        $currentLike.data('like', type == 'post' ? 1 : 0)
            .find('.fa')
            .removeClass(type == 'post' ? 'fa-heart-o' : 'fa-heart')
            .addClass(type == 'post' ? 'fa-heart' : 'fa-heart-o');
    }

    return {
        init: initEvent,
        changeLike: changeLike
    }
});
