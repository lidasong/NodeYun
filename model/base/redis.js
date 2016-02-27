var redis = require('redis');
	client = redis.createClient();
	
client.auth('lidasong')
client.on('error',function(err){
	console.log(err);
});

module.exports = client;


/**
* @description redis 使用实例
* @key {String} hash
* @value {String|Object}
	client.set("key",JSON.stringify({name:[1,2,3]}), function (err, res) {
		client.get('key',function(err,results){
			if(err){
				console.log(err);
				return;
			}
			results = results.toString()
			try{
				results = JSON.parse(results);
			}catch(e){
				console.log(e);
			}
			console.log(results);
			client.quit();
		})
	});
*/
// var times = 0;
// client.set('name','lidasong',function(err,res){
// 	if(err){
// 		console.log(err);
// 	}else{
// 		setInterval(function(){
// 			client.get('name',function(err,results){
// 				if(err){
// 					cosnole.log(err);
// 				}else{
// 					console.log(results);
// 					++times;
// 					console.log('times',times);
// 				}
// 			});
// 		},1000);
// 	}
// });
// client.expire('name',10);