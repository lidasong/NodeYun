var connection = require('./base/connection').connection;
var _ = require('underscore');
var dateFormat = require('dateformat');

function getUploadInfo(id, limit, offset) {
    var getSql, promise;
    offset = offset || 0;
    if (limit && typeof limit == 'number') {
        getSql = 'select * from upload limit ' + offset + ',' + limit;
    } else {
        getSql = 'select * from upload where u_id = ' + id;
    }
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

function createFolder(data) {
    var values = {
            u_id: '',
            type: 7,
            parent_id: '',
            owner_id: '',
            file_name: '',
            order_x: '',
            is_processing: '',
            is_publish: 1,
            create_time: dateFormat(Date.now(), 'yyyy:mm:dd hh:MM:ss'),
            mod_time: dateFormat(Date.now(), 'yyyy:mm:dd hh:MM:ss'),
            is_dir: 1,
            bucket: '',
            file_size: 0,
            persistent_id: '',
            mime_type: '',
            key_original: '',
            key_preview: '',
            key_thumb: ''
        },
        insertSql,
        promise;
    _.extendOwn(values, data);
    insertSql = 'insert upload values(' + arrJoin(_.values(values)).join() + ')';
    promise = new Promise(function(resolve, reject) {
        connection.query(insertSql, function(err) {
            if (err) {
                reject(err);
            } else {
                resolve(values);
            }
        });
    });
    return promise;
    console.log(data);
}

function create(data) {
    var values = {
            u_id: '',
            type: '',
            parent_id: '',
            owner_id: '',
            file_name: '',
            order_x: '',
            is_processing: '',
            is_publish: 1,
            create_time: dateFormat(Date.now(), 'yyyy:mm:dd hh:MM:ss'),
            mod_time: dateFormat(Date.now(), 'yyyy:mm:dd hh:MM:ss'),
            is_dir: '',
            bucket: '',
            file_size: 0,
            persistent_id: '',
            mime_type: '',
            key_original: '',
            key_preview: '',
            key_thumb: ''
        },
        insertSql,
        promise,
        results = [];
    data = data.map(function(item){
        var result = {}; 
        _.extendOwn(result,values, item);
        results.push(result);
        return '(' + arrJoin(_.values(result)).join() + ')';
        
    });
    insertSql = 'insert upload values'+data.join();
    promise = new Promise(function(resolve, reject) {
        connection.query(insertSql, function(err) {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
    return promise;
}

function update(values, where) {
    var updateSql, setValues, promise;
    values.mod_time = dateFormat(Date.now(), 'yyyy:mm:dd hh:MM:ss');
    setValues = _.pairs(values).map(function(item, index) {
        if (typeof item[1] == 'string') {
            item[1] = '\"' + item[1] + '\"';
        }
        return item.join('=');
    });
    updateSql = 'update upload set ' + setValues.join() + 'where u_id = ' + where.id;
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

function deleteUploadInfo(ids, owner_id) {
    var promise,
        deleteSql = 'delete from upload where u_id in(' + ids.join() + ')' + ' and owner_id=' + owner_id;
    promise = new Promise(function(resolve, reject) {
        connection.query(deleteSql, function(err, res, field) {
            if (err) {
                reject(err);
            } else {
                resolve(res);
            }
        });
    });
    return promise;
}


function getChilrenInfo(parentId) {
    var getChildrenSql, promise;
    getChildrenSql = 'select * from upload where parent_id = ' + parentId;
    promise = new Promise(function(resolve, reject) {
        connection.query(getChildrenSql, function(err, uploads) {
            if (err) {
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
    createFolder: createFolder,
    update: update,
    get: getUploadInfo,
    delete: deleteUploadInfo,
    getChildren: getChilrenInfo
};
