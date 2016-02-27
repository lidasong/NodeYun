var router = require('express').Router();
var _ = require('underscore');
var User = require('../../model/user.js').User;
var Share = require('../../model/share.js').Share;
var Relation = require('../../model/relation.js').Relation;
router.get('/:id/:type', function(req, res) {
    var userId = req.params.id,
        type = req.params.type,
        isHost,
        cloudUrl = 'http://7xoszw.com1.z0.glb.clouddn.com/';

    isHost = req.session.user.user_id == userId;
    switch (type) {
        case 'share':
            Promise.all([User.get(userId),
                    Share.getUserShareCount(userId),
                    Relation.getFollowerCount(userId),
                    Relation.getFollowingCount(userId),
                    Share.getShareByUserId(userId,req.session.user.user_id)
                ])
                .then(function(results) {
                    _.extend(results[0],
                        results[1], {
                            followerCount: results[2].length
                        }, {
                            followingCount: results[3].length
                        });
                    results[0].isFollow = _.findWhere(results[2], {
                        follower_id: req.session.user.user_id
                    }) != undefined;
                    results[0].isHost = isHost;
                    res.render('user', {
                        cloudUrl: cloudUrl,
                        sessionUser: req.session.user,
                        user: results[0],
                        shares: results[4],
                        type: 'share'
                    });
                });
            break;
        case 'follower':
            Promise.all([User.get(userId),
                    Share.getUserShareCount(userId),
                    Relation.getFollowerCount(userId),
                    Relation.getFollowingCount(userId),
                    Relation.get(userId),
                    Relation.getFollowingCount(req.session.user.user_id)
                ])
                .then(function(results) {
                    _.extend(results[0],
                        results[1], {
                            followerCount: results[2].length
                        }, {
                            followingCount: results[3].length
                        });
                    results[0].isFollow = _.findWhere(results[2], {
                        follower_id: req.session.user.user_id
                    }) != undefined;
                    results[0].isHost = isHost;
                    results[4].forEach(function(follower, index) {
                        results[4][index].followed = _.findWhere(results[5], {
                            followed_id: follower.follower_id
                        }) != undefined;
                    });

                    res.render('user', {
                        cloudUrl: cloudUrl,
                        sessionUser: req.session.user,
                        user: results[0],
                        follows: results[4],
                        type: 'follower'
                    });
                }).catch(function(err) {
                    res.render('error');
                    console.log(err);
                });
            break;
        case 'following':
            Promise.all([User.get(userId),
                        Share.getUserShareCount(userId),
                        Relation.getFollowerCount(userId),
                        Relation.getFollowingCount(userId),
                        Relation.getFollowing(userId),
                        Relation.getFollowingCount(req.session.user.user_id)
                    ]).then(function(results) {
                    _.extend(results[0],
                        results[1], {
                            followerCount: results[2].length
                        }, {
                            followingCount: results[3].length
                        });
                    results[0].isFollow = _.findWhere(results[2], {
                        follower_id: req.session.user.user_id
                    }) != undefined;
                    results[0].isHost = isHost;
                    results[4].forEach(function(follower, index) {
                        results[4][index].followed = _.findWhere(results[5], {
                            followed_id: follower.followed_id
                        }) != undefined;
                    });
                    res.render('user', {
                        cloudUrl: cloudUrl,
                        sessionUser: req.session.user,
                        user: results[0],
                        follows: results[4],
                        type: 'following'
                    });
                }).catch(function(err) {
                    res.render('error');
                    console.log(err);
                });
            break;
        default:
            break;
    }
});


router.route('/:id').get(function(req, res) {
        var userId = req.params.id;
        res.redirect('/user/' + userId + '/share');
    })
    .put(function(req, res) {
        var user = {
            user_id: req.session.user.user_id
        };
        User.update(req.body, user).then(function(result) {
            _.extendOwn(req.session.user, result)
            res.json(result);
        }).catch(function(err) {
            console.log(err);
            res.json({
                error_type: 501
            });
        });
    });

exports.user = router;
