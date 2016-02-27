var connection = require('./base/connection').connection;
var _ = require('underscore');

var Data = {
    getImage: getImage,
    getDocument:getDocument,
    getAudio:getAudio,
    getVideo:getVideo,
    getOthers:getOthers,
    get:get
};

function getImage(user_id,page_num){
	var promise,selectImgSql;
	page_num = page_num || 0;
	selectImgSql = 'select * from upload where type = 0 and owner_id =' + user_id + ' order by mod_time desc limit '+page_num*10+',10';
	promise = new Promise(function(resolve, reject) {
	    connection.query(selectImgSql, function(err, imgs) {
	        if (err) {
	            reject(err);
	        }else{
	        	resolve(imgs);
	        }
	    });
	});
	return promise;
}

function getDocument(user_id,page_num){
	var promise,selectDocSql;
	page_num = page_num || 0;
	selectDocSql = 'select * from upload where type in(1,2,3) and owner_id =' + user_id + ' order by mod_time desc limit '+page_num*10+',10';
	promise = new Promise(function(resolve, reject) {
	    connection.query(selectDocSql, function(err, docs) {
	        if (err) {
	            reject(err);

	        }else{
	        	resolve(docs);
	        }
	    });
	});
	return promise;
}

function getAudio(user_id,page_num){
	var promise,selectAudioSql;
	page_num = page_num || 0;
	selectAudioSql = 'select * from upload where type=4 and owner_id =' + user_id + ' order by mod_time desc limit '+page_num*10+',10';
	promise = new Promise(function(resolve, reject) {
	    connection.query(selectAudioSql, function(err, audios) {
	        if (err) {
	            console.log('getAudios error');
	            reject(err);

	        }else{
	        	resolve(audios);        	
	        }
	    });
	});
	return promise;
}

function getVideo(user_id,page_num){
	var promise,selectAudioSql;
	page_num = page_num || 0;
	selectAudioSql = 'select * from upload where type=5 and owner_id =' + user_id + ' order by mod_time desc limit '+page_num*10+',10';
	promise = new Promise(function(resolve, reject) {
	    connection.query(selectAudioSql, function(err, videos) {
	        if (err) {
	            reject(err);
	        }else{
	        	resolve(videos);
	        }
	    });
	});
	return promise;
}

function getOthers(user_id,page_num){
	var promise,selectOthersSql;
	page_num = page_num || 0;
	selectOthersSql = 'select * from upload where type=6 and owner_id =' + user_id + ' order by mod_time desc limit '+page_num*10+',10';
	promise = new Promise(function(resolve, reject) {
	    connection.query(selectOthersSql, function(err, others) {
	        if (err) {
	            reject(err);
	        }else{
	        	resolve(others);
	        }
	    });
	});
	return promise;
}

function get(user_id,page_num){
	var promise,selectSql;
	page_num = page_num || 0;
	selectSql = 'select * from upload where owner_id =' + user_id + ' and parent_id = \'\' order by mod_time desc limit '+page_num*10+',10';
	promise = new Promise(function(resolve, reject) {
	    connection.query(selectSql, function(err, content) {
	        if (err) {
	            reject(err);
	        }
	        resolve(content);
	    });
	});
	return promise;
}

function arrJoin(values) {
    return values.map(function(value) {
        if (typeof value == 'string') {
            return '\"' + value + '\"'
        }
        return value;
    });
}

exports.Data = Data;
