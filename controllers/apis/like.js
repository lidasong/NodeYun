var express = require('express');

var router = express.Router();

var Like = require('../../model/like.js').Like;

var Comment = require('../../model/comment.js').Comment;

router.route('/:share_id')
    .post(function(req, res) {
        var s_id = req.params.share_id;
        Like.insert({
            s_id: s_id,
            user_id: req.session.user.user_id
        }).then(function(res) {
            res.json(res);
        }).catch(function(err) {
            res.json({
                err_type: 501,
                err_msg: err.message
            });
        });
    })
    .delete(function(req, res) {
        var s_id = req.params.share_id;
        Like.delete({
            s_id: s_id,
            user_id: req.session.user.user_id
        }).then(function(res) {
            res.json({
                delete:true
            });
        }).catch(function(err) {
            res.json({
                err_type: 501,
                err_msg: err.message
            });
        });
    });

exports.like = router;
