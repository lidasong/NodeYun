var io = require('socket.io')(8000);

var Like = require('../../model/like.js').Like;

var Message = require('../../model/message.js').Message;

var Follow = require('../../model/follow.js').Follow;

var Comment = require('../../model/comment.js').Comment;

var xss = require('xss');

var userIdSocketMap = {},
    socketIdUserMap = {};

function initSocket() {
    io.on('connection', function(socket) {

        //socket连接打开
        socket.emit('open');

        socket.on('socket', function(data) {
            socketIdUserMap[socket.id] = data.user_id;
            Array.isArray(userIdSocketMap[data.user_id]) ? userIdSocketMap[data.user_id].push(socket) : userIdSocketMap[data.user_id] = [socket];
        });

        //点赞消息
        initLike(socket);

        //关注消息
        initFollow(socket);

        //评论消息
        initComment(socket);

        //断开连接
        socket.on('disconnect', function() {
            userIdSocketMap[socketIdUserMap[socket.id]].forEach(function(s,index){
                if(s.id == socket.id){
                    userIdSocketMap[socketIdUserMap[socket.id]].splice(index,1);
                }
            });
            // delete userIdSocketMap[socketIdUserMap[socket.id]];
            delete socketIdUserMap[socket.id];
        });
    });
}

function initComment(socket) {
    socket.on('comment', function(data) {
        Promise.all([
            Comment.create({
                user_id: data.user_id,
                comment: xss(data.comment),
                share_id: data.share_id
            }),
            Message.create({
                sender_id: data.user_id,
                receiver_id: data.receiver,
                type: '1',
                data: '/share/' + data.share_id
            })
        ]).then(function(res) {
            if (userIdSocketMap[data.receiver]) {
                userIdSocketMap[data.receiver].forEach(function(s) {
                    s.emit('msg', true);
                });
            }
            // if(userIdSocketMap[data.receiver])
            //     userIdSocketMap[data.receiver].emit('msg', true);
            userIdSocketMap[data.user_id].forEach(function(s){
                s.emit('comment', res[0]);
            });
        }).catch(function(err) {
            userIdSocketMap[data.user_id].forEach(function(s){
                s.emit('comment', false);
            });
        });
    });
}

function initFollow(socket) {
    socket.on('follow', function(data) {
        switch (data.type) {
            case 'post':
                Promise.all([
                    Follow.insert({
                        follower_id: data.follower_id,
                        followed_id: data.followed_id
                    }),
                    Message.create({
                        sender_id: data.follower_id,
                        receiver_id: data.followed_id,
                        type: '0',
                    })
                ]).then(function(res) {
                    if (userIdSocketMap[data.followed_id]) {
                        userIdSocketMap[data.followed_id].forEach(function(s) {
                            s.emit('msg', true);
                        });
                    }
                    userIdSocketMap[data.follower_id].forEach(function(s){
                        s.emit('follow', res);
                    });
                }).catch(function(err) {
                    if (userIdSocketMap[data.followed_id])
                        userIdSocketMap[data.followed_id].forEach(function(s){
                            s.emit('msg', false);
                        });
                });

                break;
            case 'delete':
                Follow.delete({
                    follower_id: data.follower_id,
                    followed_id: data.followed_id
                }).then(function(res) {
                    userIdSocketMap[data.follower_id].forEach(function(s){
                        s.emit('follow', true);
                    });
                }).catch(function(err) {
                    userIdSocketMap[data.follower_id].forEach(function(s){
                        s.emit('follow', false);
                    });
                });
                break;
            default:
                break;
        }
    });
}

function initLike(socket) {
    
    socket.on('like', function(data) {
        switch (data.type) {
            case 'post':
                Promise.all([
                    Like.insert({
                        s_id: data.s_id,
                        user_id: data.user_id
                    }),
                    Message.create({
                        sender_id: data.user_id,
                        receiver_id: data.receiver,
                        type: '2',
                        data: '/share/' + data.s_id
                    })
                ]).then(function(res) {
                    if (userIdSocketMap[data.receiver]) {
                        userIdSocketMap[data.receiver].forEach(function(s) {
                            s.emit('msg', true);
                        });
                    }
                    // if(userIdSocketMap[data.receiver]){
                    //     userIdSocketMap[data.receiver].emit('msg', true);
                    // }
                    userIdSocketMap[data.user_id].forEach(function(s){
                        s.emit('like', res);
                    });
                }).catch(function(err) {
                    if (userIdSocketMap[data.receiver])
                        userIdSocketMap[data.receiver].forEach(function(s){
                            s.emit('msg', false);
                        });
                });

                break;
            case 'delete':
                Like.delete({
                    s_id: data.s_id,
                    user_id: data.user_id
                }).then(function(res) {
                    userIdSocketMap[data.user_id].forEach(function(s){
                        s.emit('like', res);
                    });
                }).catch(function(err) {
                    userIdSocketMap[data.user_id].forEach(function(s){
                        s.emit('like', {
                            error_type: 502
                        });
                    });
                });
                break;
            default:
                break;
        }
    });
}

exports.initSocket = initSocket;
