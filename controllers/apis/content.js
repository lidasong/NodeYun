var express = require('express');

var router = express.Router();

var Data = require('../../model/data.js').Data;

var _ = require('underscore');

router.route('/:type')
    .get(function(req, res) {
        var type = req.params.type,
            page = req.query.page,
            user_id = req.session.user.user_id,
            getTypes = {
                'images': 'getImage',
                'docs': 'getDocument',
                'audios': 'getAudio',
                'videos': 'getVideo',
                'others': 'getOthers',
                'all': 'get'
            },
            method = getTypes[type];

        Data[method](user_id, page).then(function(data) {
            if(type == 'images'){
                data = _.groupBy(data,function(img){
                    return img.mod_time.toLocaleDateString();
                });
            }
            res.json(data);
        }).catch(function(err) {
            res.status(501);
            res.json({
                error_type: 'database err'
            });
        });
    });

exports.content = router;
