var connection = require('./base/connection').connection;

var _ = require('underscore');

module.exports = {
    create: createBucket,
    get: getBucket,
    put: putBucket,
    delete:deleteBucket
}

function createBucket(data) {
    var values = {
            bucket_name: '',
            access_key: '',
            secret_key: '',
            domain: ''
        },
        insertSql,
        promise;
    _.extendOwn(values, data);
    var insertSql = 'insert bucket values(' + arrJoin(_.values(values)).join() + ')';
    promise = new Promise(function(resolve, reject) {
        connection.query(insertSql, function(err) {
            if (err) {
                console.log(err.stack + '\n' + err.message);
                reject(err);
            }
        });
        resolve(values);
    });
    return promise;
}

function putBucket(values, where) {
    var updateSql, setValues, promise;
    setValues = _.pairs(values).map(function(item, index) {
        if (typeof item[1] == 'string') {
            item[1] = '\"' + item[1] + '\"';
        }
        return item.join('=');
    });
    updateSql = 'update bucket set ' + setValues.join() + 'where bucket_name = \"' + where.bucketName + '\"';
    promise = new Promise(function(resolve, reject) {
        connection.query(updateSql, function(err, res, field) {
            if (err){
                reject(err);
            }else{
                resolve(values);
            }
        });
    });
    return promise;
}

function getBucket(bucketName, limit, offset) {
    var getSql, promise;
    offset = offset || 0;
    if (limit && typeof limit == 'number') {
        getSql = 'select * from message limit ' + offset + ',' + limit;
    } else {
        getSql = 'select * from bucket where bucket_name = \"' + bucketName +'\"';
    }
    promise = new Promise(function(resolve, reject) {
        connection.query(getSql, function(err, res) {
            if (err) {
                console.error('get find error');
                reject(err);
            }else{
                resolve(res[0]);
            }
        });
    });
    return promise;
}



function deleteBucket(bucketName) {
    var deleteSql, promise;

    getSql = 'delete from bucket where bucket_name = ' + bucketName;
    promise = new Promise(function(resolve, reject) {
        connection.query(getSql, function(err, msg) {
            if (err) {
                console.log('getUser error');
                reject(err);
            }else{
                resolve(msg);
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
