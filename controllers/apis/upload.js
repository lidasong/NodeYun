var express = require('express');

var router = express.Router();

var Upload = require('../../model/upload.js').Upload;

var _ = require('underscore');

/*
* 创建文件夹
*/
router.route('/folder').post(function(req, res) {
    var data = req.body;
    data.u_id = Date.now();
    Upload.createFolder(data).then(function(results) {
        res.json(results);
    }).catch(function(err) {
        console.log(err);
        res.json({
            err_type:502
        });
    });
});

/*
* 文件更新
*/
router.route('/:u_id')
    .put(function(req, res) {
        var u_id = req.params.u_id;
        Upload.update(req.body, {
            id: u_id
        }).then(function(results) {
            res.json(results);
        }).catch(function(err) {
            console.log(err);
        });
    });

exports.upload = router;
