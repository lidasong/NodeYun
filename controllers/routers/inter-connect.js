var express = require('express');

var router = express.Router();

require('peertc').listen(8080);

router.get('/pc',function(req, res) {
	res.render('pc');
});

router.get('/mobile',function(req, res) {
    res.render('mobile');
});

exports.connect = router;
