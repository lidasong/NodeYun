var connection = require('./base/connection').connection;
var _ = require('underscore');
var Upload = require('./upload.js').Upload;
var dateFormat = require('dateformat');
var Share = {
    create: create,
    delete: deleteShare,
    get: getSharedContent,
    getOne: getSharedById,
    getShareByUserId: getUserShare,
    getUserShareCount: getUserShareCount
};

/*
 * ToDo添加like功能，使用左外链接left join likes
 */

function getSharedContent(sess_id, page, limit) {
    var getSql, promise, offset, shareIds;
    limit = limit || 10;
    page = page * limit;
    offset = page || 0;
    getSql = 'select share.*,user.*,likes.is_like from user,share left join likes on share.s_id=likes.s_id and likes.user_id=' + sess_id + ' where share.user_id=user.user_id order by share_time desc limit ' + offset + ',' + limit;
    promise = new Promise(function(resolve, reject) {
        connection.query(getSql, function(err, shares) {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                shareIds = _.pluck(shares, 's_id');
                if (!shareIds.length) {
                    resolve([]);
                    return ;
                }
                _getSharedUpload(shareIds).then(function(uploads) {
                    _.each(shares, function(share, index) {
                        share['shares'] = _.where(uploads, {
                            s_id: share.s_id
                        })
                    });
                    resolve(shares);
                }).catch(function(err) {
                    console.log(err);
                    reject(err);
                });
            }
        });
    });
    return promise;
}

function getUserShare(userId,sess_id) {
    var getSql, promise;
    getSql = 'select share.*,likes.is_like from share left join likes on share.s_id=likes.s_id and likes.user_id=' + sess_id+' where share.user_id=' + userId;
    promise = new Promise(function(resolve, reject) {
        connection.query(getSql, function(err, shares) {
            if (err) {
                reject(err);
            } else {
                shareIds = _.pluck(shares, 's_id');
                if (!shareIds.length) {
                    resolve([]);
                }
                _getSharedUpload(shareIds).then(function(uploads) {
                    _.each(shares, function(share, index) {
                        share['shares'] = _.where(uploads, {
                            s_id: share.s_id
                        })
                    });
                    resolve(shares);
                }).catch(function(err) {
                    console.log(err);
                    reject(err);
                });
            }
        });
    });
    return promise;
}

function getUserShareCount(userId) {
    var getCountSql, promise;
    getCountSql = 'select count(*) as shareCount from share where user_id = ' + userId;
    promise = new Promise(function(resolve, reject) {
        connection.query(getCountSql, function(err, count) {
            if (err) {
                reject(err);
            } else {
                resolve(count[0]);
            }
        });
    });
    return promise;
}

function _getSharedUpload(shareIds) {
    var promise, getSql = 'select * from package,upload where s_id in(' + shareIds.join() + ') and package.u_id=upload.u_id';
    promise = new Promise(function(resolve, reject) {
        connection.query(getSql, function(err, uploads) {
            if (err) {
                reject(err);
            } else {
                resolve(uploads);
            }
        });

    });
    return promise;
}

function getSharedById(shareId) {
    var getOneSql, promise;
    getOneSql = 'select * from share,package,user,upload where share.s_id = package.s_id and share.user_id=user.user_id and package.u_id=upload.u_id and share.s_id=' + shareId;
    promise = new Promise(function(resolve, reject) {
        connection.query(getOneSql, function(err, shares) {
            if (err) {
                reject(err);
            } else if (shares.length == 1 && shares[0].is_dir == 1) {
                Upload.getChildren(shares[0].u_id).then(function(children) {
                    shares = shares.concat(children);
                    resolve(shares);
                }).catch(function(err) {
                    reject(err);
                });
            } else {
                resolve(shares);
            }
        });
    });
    return promise;
}

/*
* @param {Object} 插入的数据
* @example
    create({
        user_id: 2,
        u_ids: [111, 1449387862633]
    })
**/

function create(data) {
    var values = {
            s_id: Date.now(),
            user_id: '',
            share_time: dateFormat(Date.now(),'yyyy:mm:dd hh:MM:ss')
        },
        insertSql,
        promise,
        packageValues;
    values.user_id = data.user_id;
    packageValues = data.u_ids.map(function(u_id, index) {
        return '(' + values.s_id + ',' + u_id + ')';
    });
    insertShareSql = 'insert share values(' + arrJoin(_.values(values)).join() + ')';
    insertPackageSql = 'insert package values' + packageValues.join();
    promise = new Promise(function(resolve, reject) {
        connection.beginTransaction(function(err) {
            if (err) {
                reject(err);
            }
            connection.query(insertShareSql, function(err, result) {
                if (err) {
                    connection.rollback(function(err) {
                        reject(err);
                    });
                    reject(err);
                }
                connection.query(insertPackageSql, function(err, result) {
                    if (err) {
                        connection.rollback(function(err) {
                            reject(err);
                        });
                        reject(err);
                    }
                    connection.commit(function(err) {
                        if (err) {
                            connection.rollback(function(err) {
                                reject(err);
                            });
                            reject(err);
                        } else {
                            resolve(true);
                        }
                    });
                });
            })
        });

    });
    return promise;
}

function deleteShare(user_id,s_id) {
    var deleteSql, promise;
    deleteSql = 'delete from share where user_id = '+ user_id + ' and s_id = ' + s_id;
    promise = new Promise(function(resolve, reject) {
        connection.query(deleteSql, function(err, res) {
            if (err) {
                reject(err);
            } else {
                resolve(res);
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

exports.Share = Share;
