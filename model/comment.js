var connection = require('./base/connection').connection;
var _ = require('underscore');
var dateFormat = require('dateformat');
var Comment = {
    create: create,
    update: update,
    get: getComments,
    getOne:getCommentById,
    delete: deleteCommment
};


function getComments(share_id, page_num, limit) {
    var getSql, offset, promise;
    page_num = page_num || 0;
    limit = limit || 10;
    offset = page_num * limit;
    getSql = 'select * from comments left join user on  user.user_id=comments.user_id where share_id = ' + share_id + ' limit ' + offset + ',' + limit;
    promise = new Promise(function(resolve, reject) {
        connection.query(getSql, function(err, comments) {
            if (err) {
                reject(err);
            } else {
                resolve(comments);
            }
        });
    });
    return promise;
}

function getCommentById(c_id){
    var getSql,promise;
    getSql = 'select * from comments where c_id = ' + c_id;
    promise = new Promise(function(resolve, reject) {
        connection.query(getSql, function(err, comment) {
            if (err) {
                reject(err);
            } else {
                resolve(comment[0]);
            }
        });
    });
    return promise;

}

function create(data) {
    var values = {
            c_id: Date.now(),
            user_id: '',
            comment: '',
            share_id: '',
            comment_time: dateFormat(Date.now(),'yyyy:mm:dd hh:MM:ss'),
            reply_to_user: ''
        },
        insertSql,
        promise;
    _.extendOwn(values, data);
    var insertSql = 'insert comments values(' + arrJoin(_.values(values)).join() + ')';
    promise = new Promise(function(resolve, reject) {
        connection.query(insertSql, function(err) {
            if (err) {
                reject(err);
            }else{
                resolve(values);
            }
        });
    });
    return promise;
}

function update(values, where) {
    var updateSql, setValues, promise;
    setValues = _.pairs(values).map(function(item, index) {
        if (typeof item[1] == 'string') {
            item[1] = '\"' + item[1] + '\"';
        }
        return item.join('=');
    });
    updateSql = 'update comments set ' + setValues.join() + 'where c_id = ' + where.c_id;
    promise = new Promise(function(resolve, reject) {
        connection.query(updateSql, function(err, res, field) {
            if (err) {
                reject(err);
            } else {
                resolve(values);
            }
        });
    });
    return promise;
}

function deleteCommment(){
    
}

function arrJoin(values) {
    return values.map(function(value) {
        if (typeof value == 'string') {
            return '\"' + value + '\"'
        }
        return value;
    });
}

exports.Comment = Comment;
