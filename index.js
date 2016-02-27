var express = require('express');

var config = require('./config.js');

var app = module.exports = express();
// config

app.set('view engine', 'ejs');
// app.set('view cache',true);
app.set('views', __dirname + '/views');

// middleware
app.use('/public', express.static(__dirname + '/public'));


config(app);

/* istanbul ignore next */
if (!module.parent) {
    app.listen(process.env.port || 3000);
    console.log('Express started on port 3000');
}

app.use(function(err,req,res,next){
	console.log(err.stack);
	res.redirect('/error?err_msg='+err.msg||'Not Found');
});

//启动服务器
//forever -p . -l ./logs/access.log -e ./logs/error.log -a -w start app.js