var express = require('express');

var router = express.Router();

var Message = require('../../model/message.js').Message;

var _ = require('underscore');

router.route('/').get(function(req, res) {

    var user_id = req.session.user.user_id;

    Promise.all([
        Message.getUnreadCount(user_id),
        Message.get(user_id)
    ]).then(function(results) {
        var msgNums = {};
        results[0].forEach(function(item, index) {
            msgNums[item.type] = item.count;
        });
        res.render('message', {
            msgNums: msgNums,
            messages: results[1],
            sessionUser: req.session.user
        });
    }).catch(function(err) {
        res.render('error');
    });
}).post(function(req, res) {
    var type = req.body.type;
    Message.update({
        user_id: req.session.user.user_id,
        type: type
    }).then(function(result) {
        res.json(result);
    }).catch(function(err) {
        console.log(err);
        res.json({
            err_type: '502'
        });
    });
});

router.get('/:type', function(req, res) {
    var page = req.query.page,
        type = req.params.type,
        user_id = req.session.user.user_id;
    Message.getMessageByType(user_id, type, page).then(function(result) {
        result = _.where(result, {
            type: type
        });
        res.json(result);
    }).catch(function(err) {
        res.json({
            err_type: 502
        });
    });
});

exports.message = router;
