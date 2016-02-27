var express = require('express');

var router = express.Router();
var _ = require('underscore');

var Data = require('../../model/data.js').Data;
var Upload = require('../../model/upload.js').Upload;
var Message = require('../../model/message.js').Message;

router.get('/', function(req, res) {
    var cloudUrl = 'http://7xoszw.com1.z0.glb.clouddn.com/';
    Promise.all([Message.get(req.session.user.user_id), Data.get(req.session.user.user_id), Message.getUnreadCount(req.session.user.user_id)]).then(function(result) {
        var newMsgNum = result[2].reduce(function(prev, cur) {
            return prev + cur.count;
        }, 0);
        res.render('content', {
            messages: result[0],
            contents: result[1],
            cloudUrl: cloudUrl,
            msgNum: newMsgNum,
            sessionUser: req.session.user,
            type: 'all',
            parentId: null
        });
    }).catch(function(err) {
        res.status(500);
        res.redirect('/error');
    });
});

/*
 * 获取特定文件夹内容
 */
router.get('/folder/:id', function(req, res) {
    var cloudUrl = 'http://7xoszw.com1.z0.glb.clouddn.com/',
        id = req.params.id;

    Promise.all([Message.get(req.session.user.user_id), Upload.getChildren(id), Message.getUnreadCount(req.session.user.user_id)]).then(function(result) {
        var newMsgNum = result[2].reduce(function(prev, cur) {
            return prev + cur.count;
        }, 0);
        res.render('content', {
            messages: result[0],
            contents: result[1],
            cloudUrl: cloudUrl,
            msgNum: newMsgNum,
            sessionUser: req.session.user,
            type: 'all',
            parentId: id
        });
    }).catch(function(err) {
        res.status(500);
        res.redirect('/error');
    });
});

router.get('/:type', function(req, res) {
    var type = req.params.type,
        cloudUrl = 'http://7xoszw.com1.z0.glb.clouddn.com/';
    switch (type) {
        case 'images':
            Promise.all([Message.get(req.session.user.user_id), Data.getImage(req.session.user.user_id), Message.getUnreadCount(req.session.user.user_id)]).then(function(result) {
                result[1] = _.groupBy(result[1], function(img) {
                    return new Date(img.mod_time).toLocaleDateString();
                });
                var newMsgNum = result[2].reduce(function(prev, cur) {
                    return prev + cur.count;
                }, 0);
                res.render('images', {
                    messages: result[0],
                    images: result[1],
                    cloudUrl: cloudUrl,
                    msgNum: newMsgNum,
                    sessionUser: req.session.user,
                    type: type,
                    parentId: null
                });
            }).catch(function(err) {
                res.status(500);
                res.redirect('/error');
            });
            break;
        case 'docs':
            Promise.all([Message.get(req.session.user.user_id), Data.getDocument(req.session.user.user_id), Message.getUnreadCount(req.session.user.user_id)]).then(function(result) {
                var newMsgNum = result[2].reduce(function(prev, cur) {
                    return prev + cur.count;
                }, 0);
                res.render('document', {
                    messages: result[0],
                    docs: result[1],
                    cloudUrl: cloudUrl,
                    msgNum: newMsgNum,
                    sessionUser: req.session.user,
                    type: type,
                    parentId: null
                });
            }).catch(function(err) {
                res.status(500);
                res.redirect('/error');
            });

            break;
        case 'audios':
            Promise.all([Message.get(req.session.user.user_id), Data.getAudio(req.session.user.user_id), Message.getUnreadCount(req.session.user.user_id)]).then(function(result) {
                var newMsgNum = result[2].reduce(function(prev, cur) {
                    return prev + cur.count;
                }, 0);
                res.render('audios', {
                    messages: result[0],
                    audios: result[1],
                    cloudUrl: cloudUrl,
                    msgNum: newMsgNum,
                    sessionUser: req.session.user,
                    type: type,
                    parentId: null
                });
            }).catch(function(err) {
                res.status(500);
                res.redirect('/error');
            });

            break;
        case 'videos':
            Promise.all([Message.get(req.session.user.user_id), Data.getVideo(req.session.user.user_id), Message.getUnreadCount(req.session.user.user_id)]).then(function(result) {
                var newMsgNum = result[2].reduce(function(prev, cur) {
                    return prev + cur.count;
                }, 0);
                res.render('videos', {
                    messages: result[0],
                    videos: result[1],
                    cloudUrl: cloudUrl,
                    msgNum: newMsgNum,
                    sessionUser: req.session.user,
                    type: type,
                    parentId: null
                });
            }).catch(function(err) {
                res.status(500);
                res.redirect('/error');
            });
            break;
        case 'others':
            Promise.all([Message.get(req.session.user.user_id), Data.getOthers(req.session.user.user_id), Message.getUnreadCount(req.session.user.user_id)]).then(function(result) {
                var newMsgNum = result[2].reduce(function(prev, cur) {
                    return prev + cur.count;
                }, 0);
                res.render('others', {
                    messages: result[0],
                    others: result[1],
                    cloudUrl: cloudUrl,
                    msgNum: newMsgNum,
                    sessionUser: req.session.user,
                    type: type,
                    parentId: null
                });
            }).catch(function(err) {
                res.status(500);
                res.redirect('/error');
            });
            break;
        default:

            break;
    }
});


exports.content = router;
