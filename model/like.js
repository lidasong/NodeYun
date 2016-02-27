var connection = require('./base/connection').connection;
var _ = require('underscore');
var arrJoin = require('./base/arrJoin.js');

var Like = {
	insert:create,
	delete:remove
};

function create(data) {
    var insertSql,
        promise,
        like = {
            s_id: '',
            user_id: '',
            is_like:1
        };
    _.extendOwn(like, data);
    insertSql = 'insert likes values(' + arrJoin(_.values(like)).join() + ')';
    promise = new Promise(function(resolve, reject) {
        connection.query(insertSql, function(err) {
            if (err) {
                reject(err);
            } else {
                resolve(like);
            }
        });
    });
    return promise;
}

function remove(where) {
    var deleteSql,
        promise;
    deleteSql = 'delete from likes where s_id='+where.s_id+' and user_id='+where.user_id;
    promise = new Promise(function(resolve, reject) {
        connection.query(deleteSql, function(err) {
            if (err) {
                reject(err);
            } else {
                resolve(true);
            }
        });
    });
    return promise;
}

exports.Like = Like;
