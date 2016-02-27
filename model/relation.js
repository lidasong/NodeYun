var connection = require('./base/connection').connection;
var _ = require('underscore');
var dateFormat = require('dateformat');
var Relation = {
    create: follow,
    get: getFollowers,
    getFollowing:getFollowing,
    getFollowerCount:getFollowerCount,
    getFollowingCount:getFollowingCount,
    delete: unfollow
};


function getFollowers(user_id, page_num, limit) {
    var getSql, offset, promise;
    page_num = page_num || 0;
    limit = limit || 10;
    offset = page_num * limit;
    getSql = 'select * from relations,user where user.user_id = relations.follower_id and followed_id = ' + user_id + ' limit ' + offset + ',' + limit;
    promise = new Promise(function(resolve, reject) {
        connection.query(getSql, function(err, followers) {
            if (err) {
                reject(err);
            } else {
                resolve(followers);
            }
        });
    });
    return promise;
}

function getFollowing(user_id, page_num, limit) {
    var getSql, offset, promise;
    page_num = page_num || 0;
    limit = limit || 10;
    offset = page_num * limit;
    getSql = 'select * from relations,user where user.user_id = relations.followed_id and follower_id = ' + user_id + ' limit ' + offset + ',' + limit;
    promise = new Promise(function(resolve, reject) {
        connection.query(getSql, function(err, followers) {
            if (err) {
                reject(err);
            } else {
                resolve(followers);
            }
        });
    });
    return promise;
}

function getFollowerCount(userId) {
    var getCountSql, promise;
    getCountSql = 'select * from relations where followed_id = ' + userId;
    promise = new Promise(function(resolve, reject) {
        connection.query(getCountSql, function(err, count) {
            if (err) {
                reject(err);
            } else {
                resolve(count);
            }
        });
    });
    return promise;
}

function getFollowingCount(userId) {
    var getCountSql, promise;
    getCountSql = 'select * from relations where follower_id = ' + userId;
    promise = new Promise(function(resolve, reject) {
        connection.query(getCountSql, function(err, count) {
            if (err) {
                reject(err);
            } else {
                resolve(count);
            }
        });
    });
    return promise;
}

function _isFollowed(followed_id, follower_id) {
    var promise, isFollowedSql;
    isFollowedSql = 'select count(*) as isFollowed from relations where followed_id=' + followed_id + ' and follower_id = ' + follower_id;
    promise = new Promise(function(resolve, reject) {
        connection.query(isFollowedSql, function(err, follower) {
            if (err) {
                reject(err);
            } else {
                resolve(follower[0]);
            }
        });
    });
    return promise;
}

function follow(data) {
    var values = {
            followed_id: '',
            follower_id: '',
            follow_time: dateFormat(Date.now(),'yyyy:mm:dd hh:MM:ss')
        },
        insertSql,
        promise;
    _.extendOwn(values, data);
    insertSql = 'insert relations values(' + arrJoin(_.values(values)).join() + ')';
    promise = new Promise(function(resolve, reject) {
        _isFollowed(values.followed_id, values.follower_id).then(function(follower) {
            if (follower.isFollowed) {
                resolve(values);
            } else {
                connection.query(insertSql, function(err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(values);
                    }
                });
            }
        }).catch(function(err) {
            reject(err);
        });
    });
    return promise;
}

function unfollow(followed_id, follower_id) {
    var deleteSql, promise;
    deleteSql = 'delete from relations where followed_id = ' + followed_id + ' and follower_id = ' + follower_id;
    promise = new Promise(function(resolve, reject) {
        connection.query(deleteSql, function(err, pkt, field) {
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

exports.Relation = Relation;
