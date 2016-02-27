var connection = require('./base/connection').connection;
var _ = require('underscore');
var dateFormat = require('dateformat');
var Answer = {
    create: create,
    update: update,
    get: get,
    getUserAnswerCounts:getUserAnswerCounts,
    getAnswerCounts:getAnswerCounts,
    delete: deleteAnswer
};

function get(comId, limit) {
    var getAnswerSql, offset, promise;
    limit = limit || 100;
    getAnswerSql = 'select answers.*,community.*,user.* from answers,community,user where community_id=com_id and user_id = answer_user_id and community_id=' + comId + ' limit ' + limit;
    promise = new Promise(function(resolve, reject) {
        connection.query(getAnswerSql, function(err, answers) {
            if (err) {
                reject(err);
            } else {
                resolve(answers);
            }
        });
    });
    return promise;
}

function getAnswerCounts() {
    var promise,
        getCountSql = 'select community_id,count(*) as counts from answers group by community_id order by time desc';
    promise = new Promise(function(resolve, reject) {
        connection.query(getCountSql, function(err, counts) {
            if (err) {
                reject(err);
            } else {
                resolve(counts);
            }
        });
    });
    return promise;
}

function getUserAnswerCounts(user_id) {
    var promise,
        getCountSql = 'select community_id,creator_id,count(*) as counts from answers left join community on community_id = com_id where creator_id='+user_id+' group by community_id order by time desc';
    promise = new Promise(function(resolve, reject) {
        connection.query(getCountSql, function(err, counts) {
            if (err) {
                reject(err);
            } else {
                resolve(counts);
            }
        });
    });
    return promise;
}

function create(data) {
    var values = {
            answer_id: Date.now(),
            community_id: '',
            answer_user_id: '',
            content: '',
            time: dateFormat(Date.now(), 'yyyy:mm:dd hh:MM:ss')
        },
        insertSql,
        promise;
    _.extendOwn(values, data);
    var insertSql = 'insert answers values(' + arrJoin(_.values(values)).join() + ')';
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
    updateSql = 'update answers set content = test where community_id = ' + where.comId;
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

function deleteAnswer(comId, user_id) {
    var deleteSql, promise;
    deleteSql = 'delete from answer where com_id = ' + comId + 'and creator_id = ' + user_id;
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

exports.Answer = Answer;
