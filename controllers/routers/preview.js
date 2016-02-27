var router = require('express').Router();
var request = require('request');

var Upload = require('../../model/upload').Upload;

router.route('/:id').get(function(req, res) {
    var preview_id = req.params.id;
    Upload.get(preview_id).then(function(data) {
        data = data[0];
        data.cloud_url = 'http://7xoszw.com1.z0.glb.clouddn.com/';
        res.render('preview', {
            sessionUser:req.session.user,
            data: data
        });
    });
}).put(function(req, res) {
    res.write('this is method put');
    res.end();
}).post(function(req, res) {
    res.end('post');
});
router.get('/download/:id', function(req, res) {
    var url = 'http://7xoszw.com1.z0.glb.clouddn.com/';
    Upload.get(req.params.id).then(function(data) {
		res.writeHead(200, {
		    'Content-Disposition': 'attachment;filename='+encodeURI(data[0].file_name)
		});
        url += data[0].id + '/' + encodeURI(data[0].file_name);
        request.get(url).pipe(res);
    });
});

exports.preview = router;
