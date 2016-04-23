var email = require('emailjs');
var _ = require('underscore');
var EJS = require('ejs');
var User = require('../../model/user.js').User;
var serverConfig = {
    user: "*******",//用户名
    password: "*****",//密码
    host: "smtp.163.com",
    ssl: true
};



var server = email.server.connect(serverConfig);

var message = {
    text: "发送密码失败",
    from: "****@**.com",//邮箱
    to: "",
    cc: "",
    subject: "找回密码"
};


// send the message and get a callback with an error or details of the message that was sent
module.exports = function(to, key, cb) {
    message.to = to;
    cb = cb || function() {};
    User.getUserByEmail(to).then(function(user) {
        var data = {
            username: user.username,
            resetKey: key
        };
        EJS.renderFile('./views/email_tpl.ejs', data, function(err, result) {
            if (err) {
                console.log(err);
            } else {
                message.attachment = [{
                    data: result,
                    alternative: true
                }];
                server.send(message, function(err, msg) {
                    cb(err, msg);
                });
            }
        });
    }).catch(function(err) {
        cb(err);
    });
}
