var express = require('express');

var router = express.Router();

var Comment = require('../../model/comment.js').Comment;

var _ = require('underscore');

router.get('/:s_id',function(req, res) {
    var s_id = req.params.s_id;
    Comment.get(s_id).then(function(results) {
        res.json(results);
    }).catch(function(err) {
        console.log(err);
    });
});


exports.comment = router;
