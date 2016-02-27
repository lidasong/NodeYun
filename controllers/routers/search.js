var connection = require('./base/connection').connection;
var _ = require('underscore');

function searchByFilename(filename) {
    var getSql, promise;
    offset = offset || 0;
    if (limit && typeof limit == 'number') {
        getSql = 'select * from upload limit ' + offset + ',' + limit;
    } else {
        getSql = 'select * from upload where id = ' + id;
    }
    promise = new Promise(function(resolve, reject) {
        connection.query(getSql, function(err, uploads) {
            if (err) {
                console.log('upload info get error');
                reject(err);
            }
            resolve(uploads);
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

exports.Upload = {
    create: create,
    update: update,
    get: getUploadInfo,
    delete: deleteUploadInfo,
    getChildren:getChilrenInfo
};
