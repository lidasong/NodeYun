var express = require('express');

var router = express.Router();

var Share = require('../../model/share.js').Share;

var Upload = require('../../model/upload.js').Upload;

var Comment = require('../../model/comment.js').Comment;

var _ = require('underscore');

router.route('/:id').get(function(req, res) {
    var shareId = req.params.id,
        cloudUrl = 'http://7xoszw.com1.z0.glb.clouddn.com/';
    Share.getOne(shareId).then(function(shares) {
        res.render('share', {
            shares: shares,
            cloudUrl:cloudUrl,
            sessionUser:req.session.user
        });
    }).catch(function(err) {
        res.render('error');
    });
}).delete(function(req,res){
    var shareId = req.params.id;
    Share.delete(req.session.user.user_id,shareId).then(function(result){
        res.json(result);
    }).catch(function(err){
        console.log(err);
    });
});

router.get('/:s_id/:folder_id',function(req,res){
    var shareId = req.params.s_id,
        folderId = req.params.folder_id,
        cloudUrl = 'http://7xoszw.com1.z0.glb.clouddn.com/';

        Upload.getChildren(folderId).then(function(result) {
            res.render('share', {
                shares: result,
                cloudUrl:cloudUrl,
                sessionUser:req.session.user
            });
        }).catch(function(err) {
            res.status(500);
            res.redirect('/error');
        });
});

router.route('/parent/:parent_id').get(function(req, res) {
    var uploadParentId = req.params.parent_id;
    Upload.getChildren(uploadParentId).then(function(children) {
        res.json(children);
    }).catch(function(err) {
        res.json({
            error_type: 501
        });
    });
});

router.route('/').get(function(req,res){
    Share.get(1).then(function(shares){
        res.json(shares);
    }).catch(function(err){
        res.json({
            error_type:501
        });
    });
}).post(function(req,res){
    var uIds = req.body['uIds[]'];
    uIds = _.isArray(uIds) ? uIds : [uIds];
    Share.create({
        user_id:req.session.user.user_id,
        u_ids:uIds
    }).then(function(result){
        res.json({
            share:true
        });
    }).catch(function(err){
        console.log(err);
        res.json({
            share:false
        });
    });
});

exports.share = router;
