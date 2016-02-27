var log4js = require('log4js');
log4js.configure({
	appenders:[
		{type:'console'},
		{
			type:'file',
			filename:'./public/logs/access.log',
			maxLogSize:1024*1024,
			backups:3,
			category:'normal'
		}
	],
	replaceConsole:true
});
var logger = log4js.getLogger('normal');
exports.logger = log4js.connectLogger(logger,{
	level:log4js.levels.INFO,
	format:':method :url'
});