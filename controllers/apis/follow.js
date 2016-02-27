var express = require('express');

var router = express.Router();

var Follow = require('../../model/follow').Follow;

router.route('/:user_id')
    .post(function(req, res) {
        var followed_id = req.params.user_id;
        Follow.insert({
        	followed_id:followed_id,
        	follower_id:req.session.user.user_id
        }).then(function(result) {
            res.json(result);
        }).catch(function(err) {
            res.json({
                err_type: 501,
                err_msg: err.message
            });
        });;
    })
    .delete(function(req, res) {
        var followed_id = req.params.user_id;
        Follow.delete({
        	followed_id:followed_id,
        	follower_id:req.session.user.user_id
        }).then(function(result) {
            res.json({
                delete:true
            });
        }).catch(function(err) {
            res.json({
                err_type: 501,
                err_msg: err.message
            });
        });;
    });

exports.follow = router;
