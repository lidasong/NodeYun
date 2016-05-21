var http = require('http');
var express = require('express');
var router = express.Router();
var _ = require('underscore');
var mime = require('mime');

var Upload = require('../../model/upload').Upload;
var User = require('../../model/user').User;
var multer = require('multer');


var qiniu = require('qiniu');

var qiniu_config = {
    AK: 'b4AlinZFNGDEbD***********RuoeK95P5PaBpgfi',
    SK: 'fRbAFpzyWHvQV************Iho5CFWQjx0uo_',
    bucket: 'sample',
    domain: 'http://7xoszw.com1.z0.glb.clouddn.com/'
}

var mimeTypes = {
    'image/gif': '0',
    'image/jpeg': '0',
    'image/png': '0',
    'image/jpg': '0',
    'image/bmp': '0',
    'application/vnd.ms-powerpoint': 1,
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': 1,
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 2,
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 2,
    'application/msword': 2,
    'text/plain': 2,
    'application/json': 2,
    'application/pdf': 3,
    'audio/mpeg': 4,
    'audio/mp3': 4,
    'audio/mp4': 4,
    'audio/midi': 4,
    'application/vnd.rn-realmedia-vbr': 5,
    'video/mp4': 5,
    'video/webm': 5,
    'video/ogg': 5
};


qiniu.conf.ACCESS_KEY = qiniu_config.AK;
qiniu.conf.SECRET_KEY = qiniu_config.SK;

var uptoken = new qiniu.rs.PutPolicy(qiniu_config.bucket).token();

var client = new qiniu.rs.Client();

var storage = multer.memoryStorage();
var upload = multer({
    storage: storage,
    limits: {
        fileSize: 2 * 1000 * 1000
    }
});

router.get('/uptoken', function(req, res) {
    var uptoken = new qiniu.rs.PutPolicy(qiniu_config.bucket).token();
    res.json({
        uptoken: uptoken
    });
});

router.route('/').get(function(req, res) {
    var title = 'Upload';
    res.render('upload.ejs', {
        title: title,
        sessionUser: req.session.user
    });
}).post(function(req, res) {
    var files = req.body['files[]'],
        options;

    files = _.isArray(files) ? files : [files];
    files = files.map(function(file) {
        file = JSON.parse(file);
        options = {
            type: mimeTypes[file.type] || 6,
            owner_id: req.session.user.user_id,
            bucket: qiniu_config.bucket,
            u_id: Date.now()+Math.floor(Math.random()*100)
        };
        return _.extend(file, options);
    });
    Upload.create(files).then(function(results) {
        res.json(results);
    }).catch(function(err) {
        console.log(err);
    });
}).delete(function(req, res) {
    var ids = req.body['uIds[]'],
        keys = req.body['keys[]'],
        folders = req.body['folder[]'],
        paths = [];
    ids = _.isArray(ids) ? ids :  ids != undefined ? [ids] : [];
    if (folders) {
        folders = _.isArray(folders) ? folders : [folders];
        deleteFolder(folders, req.session.user.user_id);
        if(!ids.length){
            res.json(req.body);
        }
    }

    keys = _.isArray(keys) ? keys : keys != undefined ? [keys] : [];

    keys.forEach(function(key, index) {
        var path = new qiniu.rs.EntryPath(qiniu_config.bucket, key);
        paths.push(path);
    });
    if (paths.length) {
        client.batchDelete(paths, function(err, ret) {
            if (!err) {
                for (i in ret) {
                    if (ret[i].code !== 200) {
                        console.log(ret[i].code, ret[i].data);
                    }
                }
                Upload.delete(ids, req.session.user.user_id).then(function(result) {
                    res.json(req.body);
                }).catch(function(err) {
                    console.log(err);
                });
            } else {
                console.log(err);
            }
        });
    }
});

router.post('/avatar', upload.array('files'), function(req, res) {
    req.files.forEach(function(file, index) {
        var upload_id,
            key;
        upload_id = Date.now();
        key = upload_id + '/' + file.originalname;
        qiniu.io.put(uptoken, key, file.buffer, '', function(err, body) {
            if (err) {
                reject(err);
            } else {
                var u_key = body.key,
                    updateUserInfo,
                    formal_key = req.session.user.u_key;

                body.key = qiniu_config.domain + body.key;
                updateUserInfo = {
                    s_avatar: body.key + '?imageView2/1/w/40/h/40',
                    b_avatar: body.key + '?imageView2/1/w/160/h/160',
                    u_key: u_key
                };

                User.update(updateUserInfo, {
                    user_id: req.session.user.user_id
                }).then(function() {
                    if (req.session.user.u_key) {
                        client.remove(qiniu_config.bucket, formal_key, function(err, ret) {
                            if (!err) {
                                res.json([body.key]);
                            } else {
                                res.json({
                                    error_type: 501
                                });
                            }
                        });
                    } else {
                        res.json([body.key]);
                    }
                    //更新session.user
                    _.extendOwn(req.session.user, updateUserInfo);
                }).catch(function(err) {
                    res.json({
                        error_type: 501
                    });
                });
            }
        });
    });
});


function deleteFolder(folders, user_id) {
    var ids = [],
        keys = [];
    folders.forEach(function(folder, index) {
        ids.push(folder);
        Upload.getChildren(folder).then(function(files) {
            files.forEach(function(file) {
                if (file.type != 7) {
                    ids.push(file.u_id);
                    keys.push(file.key_original);
                } else {
                    deleteFolder([file.u_id], user_id);
                }
            });
            deleteFolderFile(ids, keys, user_id);
        }).catch(function(err) {
            console.log(err);
        });
    });
}

function deleteFolderFile(ids, keys, user_id) {
    var paths = [];
    if (!keys.length) {
        Upload.delete(ids, user_id);
    } else {
        keys.forEach(function(key, index) {
            var path = new qiniu.rs.EntryPath(qiniu_config.bucket, key);
            paths.push(path);
        });
        client.batchDelete(paths, function(err, ret) {
            if (!err) {
                for (i in ret) {
                    if (ret[i].code !== 200) {
                        console.log(ret[i].code, ret[i].data);
                    }
                }
                Upload.delete(ids, user_id);
            } else {
                console.log(err);
            }
        });
    }
}

exports.upload = router;
