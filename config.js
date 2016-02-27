var logger = require('./controllers/logger').logger;
var bodyParser = require('body-parser');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var compression = require('compression');
//routers
var login = require('./controllers/routers/login.js').login;
var user = require('./controllers/routers/user.js').user;
var upload = require('./controllers/routers/upload.js').upload;
var preview = require('./controllers/routers/preview.js').preview;
var content = require('./controllers/routers/content.js').content;
var home = require('./controllers/routers/home.js').home;
var share = require('./controllers/routers/share.js').share;
var message = require('./controllers/routers/message.js').message;
var community = require('./controllers/routers/community.js').community;
var interConnect = require('./controllers/routers/inter-connect.js').connect;

var SocketMsg = require('./controllers/utils/message.js');
var favicon = require('serve-favicon');


//apis

// var follow = require('./controllers/apis/follow.js').follow;
// var like = require('./controllers/apis/like.js').like;
var contentApi = require('./controllers/apis/content.js').content;
var folder = require('./controllers/apis/upload.js').upload;
var comment = require('./controllers/apis/comment.js').comment;

//Message Model
var Message = require('./model/message').Message;

function config(app) {
    baseConfig(app);
    routersConfig(app);
    apiConfig(app);
}

function baseConfig(app) {
    //socket连接
    SocketMsg.initSocket();
    //log4js 日志
    app.use(logger);

    app.use(bodyParser.urlencoded({
        extended: false
    }));

    //gzip
    app.use(compression()); 
    
    //session 记录
    app.use(session({
        resave: false, // don't save session if unmodified
        saveUninitialized: false, // don't create session until something stored
        secret: 'secret session',
        store: new RedisStore({
            host: '127.0.0.1',
            port: 6379,
            pass: 'lidasong'
        })
    }));
    app.use(favicon(__dirname + '/favicon.ico'));
}

function routersConfig(app) {
    //login router
    app.use('/', login);

    //home router
    app.use('/home', isLogin, home);

    //user router
    app.use('/user', isLogin, user);

    //preview router
    app.use('/preview', isLogin, preview);

    //upload router
    app.use('/upload', isLogin, upload);

    //根据要获取的内容显示
    app.use('/content', isLogin, content);

    //share router
    app.use('/share', isLogin, share);

    app.use('/views/*',function(req,res){
        res.sendFile(__dirname+'/views/'+req.params[0]);
    });

    //message
    app.use('/messages',isLogin,message);
    //error router
    app.use('/error',function(req,res){
        var errMsg = req.query.msg;
        res.render('error',{
            errMsg:errMsg
        });
    });
    app.use('/community',isLogin,community);

    //mobile pc connect
    app.use('/connect',isLogin,interConnect);
}

function apiConfig(app) {
    app.use('/api/content',isLogin,contentApi);
    app.use('/api/file',isLogin,folder);
    // app.use('/api/follow', isLogin, follow);
    // app.use('/api/like', isLogin, like);
    app.use('/api/comment',isLogin,comment);
}

// var User = require('./model/user.js').User;

// function isLogin(req, res, next) {
//     User.isLogin('1584809032@qq.com', 'acc801aaf80d6f8f8e8b542102ea9e78').then(function(user) {
//         console.log(user);
//         if (user) {
//             req.session.regenerate(function() {
//                 req.session.user = user;
//             });
//             next();
//         }else{
//             res.redirect('/sign_in');
//         }
//     });
// }

function isLogin(req, res, next) {
    if (!req.session.user) {
        res.redirect('/sign_in');
    } else {
        next();
    }
}

module.exports = config;
