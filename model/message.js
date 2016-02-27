var connection = require('./base/connection').connection;
var _ = require('underscore');
var dateFormat = require('dateformat');
var Message = {
    create: create,
    update: update,
    get: getMessage,
    getMessageByType:getMessageByType,
    getUnreadCount: getUnreadCount,
    delete: deleteMessage
};

function getMessage(user_id, limit) {
    var getUnreadSql, offset, promise;
    limit = limit || 10;
    getUnreadSql = 'select * from message  left join user on sender_id = user_id  where receiver_id = ' + user_id + ' order by is_read limit '+ limit;
    promise = new Promise(function(resolve, reject) {
        connection.query(getUnreadSql, function(err, msg) {
            if (err) {
                reject(err);
            } else {
                resolve(msg);
            }
        });
    });
    return promise;
}

function getMessageByType(user_id, type, page_num, limit) {
    var getSql, offset, promise;
    page_num = page_num || 1;
    limit = limit || 10;
    offset = page_num * limit;
    getSql = 'select * from message  left join user on sender_id = user_id  where receiver_id = ' + user_id + ' order by is_read limit ' + offset + ',' + limit;
    promise = new Promise(function(resolve, reject) {
        connection.query(getSql, function(err, msg) {
            if (err) {
                reject(err);
            } else {
                resolve(msg);
            }
        });
    });
    return promise;
}

function getUnreadCount(user_id) {
    var getUnreadCountSql, promise;
    getUnreadCountSql = 'select type, count(type) as count from message where is_read = 0 and receiver_id = ' + user_id + ' group by type';
    promise = new Promise(function(resolve, reject) {
        connection.query(getUnreadCountSql, function(err, count) {
            if (err) {
                reject(err);
            } else {
                resolve(count);
            }
        });
    });
    return promise;
}

function create(data) {
    var values = {
            m_id: Date.now(),
            msg_time: dateFormat(Date.now(), 'yyyy:mm:dd hh:MM:ss'),
            is_read: 0,
            sender_id: '',
            receiver_id: '',
            type: '',
            data: ''
        },
        insertSql,
        promise;
    _.extendOwn(values, data);
    var insertSql = 'insert message values(' + arrJoin(_.values(values)).join() + ')';
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
    updateSql = 'update message set is_read = 1 where is_read = 0 and receiver_id = ' + where.user_id + ' and type = ' + where.type;
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

function deleteMessage(mId, user_id) {
    var deleteSql, promise;
    deleteSql = 'delete from message where m_id = ' + mId + 'and user_id = ' + user_id;
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

exports.Message = Message;
