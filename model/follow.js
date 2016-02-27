var connection = require('./base/connection').connection;
var _ = require('underscore');
var arrJoin = require('./base/arrJoin.js');
var dateFormat = require('dateformat');

var Follow = {
	insert:create,
	delete:remove
};

function create(data) {
    var insertSql,
        promise,
        follow = {
            followed_id: '',
            follower_id: '',
            follow_time: dateFormat(Date.now(),'yyyy:mm:dd hh:MM:ss')
        };
    _.extendOwn(follow, data);
    insertSql = 'insert relations values(' + arrJoin(_.values(follow)).join() + ')';
    promise = new Promise(function(resolve, reject) {
        connection.query(insertSql, function(err) {
            if (err) {
                reject(err);
            } else {
                resolve(follow);
            }
        });
    });
    return promise;
}

function remove(where) {
    var deleteSql,
        promise;
    deleteSql = 'delete from relations where followed_id='+where.followed_id+' and follower_id='+where.follower_id;
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

exports.Follow = Follow;
