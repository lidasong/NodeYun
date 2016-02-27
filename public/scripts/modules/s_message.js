define([
    'SocketIO',
    'modules/constant',
    'modules/like',
    'modules/comment',
    'modules/follow'
], function(SocketIO, Const,Like,Comment,Follow) {

    'use strict';

    var user_id = $('#user-id').val();

    function initWsSocket() {
        var socket;
        socket = SocketIO(Const.s_message);
        socket.on('open', connection.bind(socket));
        socket.on('comment', listenComment.bind(socket));
        socket.on('like', listenLike.bind(socket));
        socket.on('follow', listenFollow.bind(socket));
        socket.on('msg',listenMessage.bind(socket))
        socket.on('disconnect', disconnect.bind(socket));
        return socket;
    }

    function connection() {
        var self = this;
        $(window).on('unload', function() {
            self.destroy();
        });
        this.emit('socket',{
            user_id:user_id
        });
        return this;
    }

    function listenMessage(data){
        updateBadge();
    }

    function listenComment(data) {
        Comment.renderComment(data);
        return this;
    }
    function listenLike(data) {
        Like.changeLike();
        return this;
    }
    function listenFollow(data) {
        Follow.changeFollowStatus();
        return this;
    }

    function disconnect(){
        console.log('socket disconnected:',this.id);
        return this;
    }

    function updateBadge(){
        console.log('update badge');
        var $badge = $('aside .badge'),
            msgNum = parseInt($badge.text());
        if(msgNum>=99){
            $badge.text('99+');
            return;
        }
        $badge.text(++msgNum).removeClass('hidden');
    }

    return {
        initWsSocket: initWsSocket
    };
});
