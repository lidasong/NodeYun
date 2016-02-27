var express = require('express');
var router = express.Router();
var forgetPassword = require('../utils/email.js');

var User = require('../../model/user.js').User;

var redisClient = require('../../model/base/redis.js');

router.get('/', function(req, res) {
    res.redirect('/sign_in');
});


router.route('/sign_up').get(function(req, res) {
    res.render('sign_up', {
        sessionUser: null
    });
}).post(function(req, res) {
    var data;
    data = {
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
        sex: req.body.sex
    };
    User.create(data).then(function(values) {
        res.redirect('/sign_in');
    }).catch(function(err) {
        if(err.errno == 1062)
            res.redirect('/error?msg='+'Repeat Email');
        else res.redirect('/error');
    });
});

router.get('/logout', function(req, res) {
    req.session.destroy(function() {
        res.redirect('/sign_in');
    });
});

router.route('/sign_in').get(function(req, res) {
    if (req.session.user) {
        res.redirect('/home');
    } else {
        res.render('sign_in', {
            sessionUser: null
        });
    }
}).post(function(req, res) {
    var email = req.body.email,
        password = req.body.password;
    User.isLogin(email, password).then(function(user) {
        if (user) {
            req.session.regenerate(function() {
                req.session.user = user;
                res.redirect('/home');
            });
        } else {
            req.session.error = 'Authentication failed, please check your ' + ' email and password.' + ' (use "tj" and "foobar")';
            res.render('sign_in', {
                sessionUser: null,
                forget: true
            });
        }
    });
});

router.route('/forget').get(function(req, res) {
    res.render('forget', {
        sessionUser: null,
        resetKey: null
    });
}).post(function(req, res) {
    var email = req.body.email,
        key = Date.now();
    redisClient.set(key,email);
    redisClient.expire(key,3600);
    forgetPassword(email, key, function(err, msg) {
        if (err) {
            console.log(err)
            res.status(501);
            res.json({
                type: 0
            });
        } else {
            res.status(200);
            res.json({
                type: 1
            });
        }
    });
});

router.route('/reset').get(function(req, res) {
    var resetKey = req.query.resetKey || null;
    res.render('forget', {
        sessionUser: null,
        resetKey: resetKey
    });
}).post(function(req, res) {
    var password = req.body.password,
        email = redisClient.get(req.body.resetKey);
    User.resetPassword(password, email).then(function() {
        res.json({
            key: true
        });
    }).catch(function() {
        res.json({
            key: false
        });
    });
});

exports.login = router;
