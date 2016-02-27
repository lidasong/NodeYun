var connection = require('./base/connection').connection;
var _ = require('underscore');
var dateFormat = require('dateformat');
var Community = {
    create: create,
    update: update,
    get: get,
    getUserCommunity:getUserCommunity,
    getCommunityById:getCommunityById,
    delete: deleteCommunity
};

function get(limit) {
    var getCommunitySql, offset, promise;
    limit = limit || 10;
    getCommunitySql = 'select * from community left join user on creator_id = user_id order by mod_time desc limit '+ limit;
    promise = new Promise(function(resolve, reject) {
        connection.query(getCommunitySql, function(err, communities) {
            if (err) {
                reject(err);
            } else {
                resolve(communities);
            }
        });
    });
    return promise;
}

function getUserCommunity(user_id,limit) {
    var getCommunitySql, offset, promise;
    limit = limit || 10;
    getCommunitySql = 'select * from community left join user on creator_id = user_id where creator_id ='+user_id+' order by mod_time desc limit '+ limit;
    promise = new Promise(function(resolve, reject) {
        connection.query(getCommunitySql, function(err, communities) {
            if (err) {
                reject(err);
            } else {
                resolve(communities);
            }
        });
    });
    return promise;
}

function getCommunityById(comId){
    var getCommunitySql, promise;
    getCommunitySql = 'select * from community left join user on creator_id = user_id where com_id = '+comId;
    promise = new Promise(function(resolve, reject) {
        connection.query(getCommunitySql, function(err, communities) {
            if (err) {
                reject(err);
            } else {
                resolve(communities[0]);
            }
        });
    });
    return promise;
}

function create(data) {
    var values = {
            com_id: Date.now(),
            title:'',
            description:'',
            mod_time:dateFormat(Date.now(), 'yyyy:mm:dd hh:MM:ss'),
            creator_id:'',
            type:''
        },
        insertSql,
        promise;
    _.extendOwn(values, data);
    var insertSql = 'insert community values(' + arrJoin(_.values(values)).join() + ')';
    promise = new Promise(function(resolve, reject) {
        connection.query(insertSql, function(err) {
            if (err) {
                console.log(err.stack + '\n' + err.message);
                reject(err);
            } else {
                resolve(values);
            }
        });
    });
    return promise;
}

function update(where) {
    var updateSql, promise;
    updateSql = 'update community set title = test where creator_id = ' + where.user_id ;
    promise = new Promise(function(resolve, reject) {
        connection.query(updateSql, function(err, res, field) {
            if (err) {
                reject(err);
            } else {
                resolve(res);
            }
        });
    });
    return promise;
}

function deleteCommunity(comId, user_id) {
    var deleteSql, promise;
    deleteSql = 'delete from community where com_id = ' + comId + 'and creator_id = ' + user_id;
    promise = new Promise(function(resolve, reject) {
        connection.query(deleteSql, function(err, res, field) {
            if (err) {
                reject(err);
            } else {
                resolve(true);
            }
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

exports.Community = Community;
