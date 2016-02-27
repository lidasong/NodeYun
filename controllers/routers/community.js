var express = require('express');

var router = express.Router();

var Community = require('../../model/community.js').Community;
var Answer = require('../../model/answer.js').Answer;
var xss = require('xss');
var _ = require('underscore');

router.route('/demand').get(function(req, res) {
    res.render('demand', {
        sessionUser: req.session.user
    });

}).post(function(req, res) {
    var demand = {};
    demand.title = encodeURIComponent(xss(req.body.title));
    demand.description = encodeURIComponent(xss(req.body.description));
    demand.type = req.body.type;
    demand.creator_id = req.session.user.user_id;
    Community.create(demand).then(function(results) {
        res.redirect('/community');
    }).catch(function(err) {
        console.log(err);
    });
});

router.get('/', function(req, res) {
    Promise.all([Community.get(),
        Answer.getAnswerCounts()
    ]).then(function(results) {
        res.render('community', {
            communities: results[0],
            answerCount: results[1],
            sessionUser: req.session.user,
            type:'all'
        });
    }).catch(function(err) {
        console.log(err);
    });
});

router.get('/my',function(req,res){
    var user_id = req.session.user.user_id;
    Promise.all([
        Community.getUserCommunity(user_id),
        Answer.getUserAnswerCounts(user_id)
    ]).then(function(results){
        res.render('community', {
            communities: results[0],
            answerCount: results[1],
            sessionUser: req.session.user,
            type:'my'
        });
    }).catch(function(err){
        console.log(err);
    });
});

router.route('/:id').get(function(req, res) {
    var comId = req.params.id;
    Promise.all([Community.getCommunityById(comId),
        Answer.get(comId)
    ]).then(function(results) {
        res.render('community_detail', {
            community: results[0],
            sessionUser: req.session.user,
            answers: results[1],
            comId: comId
        });
    }).catch(function(err) {
        console.log(err);
    });
}).post(function(req, res) {
    var comId = req.params.id,
        comment = encodeURIComponent(xss(req.body.comment));
    Answer.create({
        community_id: comId,
        answer_user_id: req.session.user.user_id,
        content: comment,
    }).then(function(results) {
        results.username = req.session.user.username;
        results.time = new Date();
        res.render('templates/answer', {
            answer: results
        });
    }).catch(function(err) {
        console.log(err);
    });
});

exports.community = router;
