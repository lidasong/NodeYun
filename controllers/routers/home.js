var express = require('express');

var router = express.Router();

var Share = require('../../model/share.js').Share;

var Message = require('../../model/message.js').Message;

var _ = require('underscore');

var redisClient = require('../../model/base/redis.js');

function checkFileType(fileType) {
    var type;
    return _.some(share.shares, function(item) {
        type = item.type;
        return type == fileType;
    });
}

function pageRenderRequest(req, res, type) {
    var cloudUrl = 'http://7xoszw.com1.z0.glb.clouddn.com/',
        newMsgNum,
        redisResp;
    redisClient.get(type + 'Redis', function(err, redisResults) {
        if (err) {
            console.log(err);
            res.json({
                redis: err
            });
            return;
        } else {
            try {
                redisResults = redisResults.toString();
                Message.getUnreadCount(req.session.user.user_id).then(function(msgs) {
                    newMsgNum = msgs.reduce(function(prev, cur) {
                        return prev + cur.count;
                    }, 0);
                    redisResp = _.extend(JSON.parse(redisResults), {
                        sessionUser: req.session.user,
                        msgNum: newMsgNum
                    });
                    res.render('home', redisResp);
                });
            } catch (e) {
                Promise.all([Message.getUnreadCount(req.session.user.user_id),
                    Share.get(req.session.user.user_id, 0)
                ]).then(function(result) {
                    switch (type) {
                        case 'images':
                            result[1] = _.filter(result[1], function(share) {
                                var type;
                                return _.some(share.shares, function(item) {
                                    type = item.type;
                                    return type == 0;
                                });
                            });
                            break;
                        case 'docs':
                            result[1] = _.filter(result[1], function(share) {
                                var type;
                                return _.some(share.shares, function(item) {
                                    type = item.type;
                                    return type == 1 || type == 2 || type == 3;
                                });
                            });
                            break;
                        case 'audios':
                            result[1] = _.filter(result[1], function(share) {
                                var type;
                                return _.some(share.shares, function(item) {
                                    type = item.type;
                                    return type == 4;
                                });
                            });
                            break;
                        case 'vedios':
                            result[1] = _.filter(result[1], function(share) {
                                var type;
                                return _.some(share.shares, function(item) {
                                    type = item.type;
                                    return type == 5;
                                });
                            });
                            break;
                        case 'others':
                            result[1] = _.filter(result[1], function(share) {
                                var type;
                                return _.some(share.shares, function(item) {
                                    type = item.type;
                                    return type == 6 || type == 7;
                                });
                            });
                            break;
                        default:
                            break;
                    }
                    newMsgNum = result[0].reduce(function(prev, cur) {
                        return prev + cur.count;
                    }, 0);
                    redisClient.set(type + 'Redis', JSON.stringify({
                        shares: result[1],
                        type: type,
                        cloudUrl: cloudUrl
                    }));
                    redisClient.expire(type + 'Redis', 60);
                    res.render('home', {
                        msgNum: newMsgNum,
                        shares: result[1],
                        sessionUser: req.session.user,
                        type: type,
                        cloudUrl: cloudUrl
                    });
                }).catch(function(err) {
                    res.status(500);
                    res.render('error');
                });
            }
        }
    });
}

router.get('/', function(req, res) {
    res.redirect('/home/all');
});

router.get('/all', function(req, res) {
    var isRouter = req.query.router,
        page = req.query.page || 0;
    if (isRouter) {
        Share.get(req.session.user.user_id, page).then(function(shares) {
            res.json(shares);
        }).catch(function(err) {
            res.json({
                error_type: 501
            });
        });
    } else {
        pageRenderRequest(req, res, 'all');
    }
});

router.get('/images', function(req, res) {
    var isRouter = req.query.router,
        page = req.query.page || 0;
    if (isRouter) {
        Share.get(req.session.user.user_id, page).then(function(shares) {
            shares = _.filter(shares, function(share) {
                var type;
                return _.some(share.shares, function(item) {
                    type = item.type;
                    return type == 0;
                });
            });
            res.json(shares);
        }).catch(function(err) {
            res.json({
                error_type: 501
            });
        });

    } else {
        pageRenderRequest(req, res, 'images');
    }
});

router.get('/docs', function(req, res) {
    var isRouter = req.query.router,
        page = req.query.page || 0;
    if (isRouter) {
        Share.get(req.session.user.user_id, page).then(function(shares) {
            shares = _.filter(shares, function(share) {
                var type;
                return _.some(share.shares, function(item) {
                    type = item.type;
                    return type == 1 || type == 2 || type == 3;
                });
            });
            res.json(shares);
        }).catch(function(err) {
            res.json({
                error_type: 501
            });
        });

    } else {
        pageRenderRequest(req, res, 'docs');
    }
});

router.get('/audios', function(req, res) {
    var isRouter = req.query.router,
        page = req.query.page || 0;
    if (isRouter) {
        Share.get(req.session.user.user_id, page).then(function(shares) {
            shares = _.filter(shares, function(share) {
                var type;
                return _.some(share.shares, function(item) {
                    type = item.type;
                    return type == 4;
                });
            });
            res.json(shares);
        }).catch(function(err) {
            res.json({
                error_type: 501
            });
        });

    } else {
        pageRenderRequest(req, res, 'audios');
    }
});

router.get('/vedios', function(req, res) {
    var isRouter = req.query.router,
        page = req.query.page || 0;
    if (isRouter) {
        Share.get(req.session.user.user_id, page).then(function(shares) {
            shares = _.filter(shares, function(share) {
                var type;
                return _.some(share.shares, function(item) {
                    type = item.type;
                    return type == 5;
                });
            });
            res.json(shares);
        }).catch(function(err) {
            res.json({
                error_type: 501
            });
        });

    } else {
        pageRenderRequest(req, res, 'vedios');
    }
});

router.get('/others', function(req, res) {
    var isRouter = req.query.router,
        page = req.query.page || 0;
    if (isRouter) {
        Share.get(req.session.user.user_id, page).then(function(shares) {
            shares = _.filter(shares, function(share) {
                var type;
                return _.some(share.shares, function(item) {
                    type = item.type;
                    return type == 6 || type == 7;
                });
            });
            res.json(shares);
        }).catch(function(err) {
            res.json({
                error_type: 501
            });
        });

    } else {
        pageRenderRequest(req, res, 'others');
    }
});

router.route('/share/:page_num').get(function(req, res) {
    var pageNum = req.params.page_num - 1;
    console.log(req.session.user.user_id);
    Share.get(req.session.user.user_id, pageNum).then(function(results) {
        res.json(results);
    }).catch(function(err) {
        res.status(500);
        res.json({
            error_type: 501
        });
    });
});

exports.home = router;
