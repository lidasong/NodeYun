var connection = require('./base/connection').connection;
var _ = require('underscore');

var User = {
    create: create,
    update: update,
    get: getUser,
    getUserByEmail:getUserByEmail,
    resetPassword:resetPassword,
    isLogin: isLogin
};

function isLogin(email, password) {
    var promise, isLoginSql;
    isLoginSql = 'select * from user where email = \"' + email + '\" and password = \"' + password + '\"';
    promise = new Promise(function(resolve, reject) {
        connection.query(isLoginSql, function(err, user) {
            if (err) {
                reject(err);
            }
            if (_.isEmpty(user))
                resolve(false);
            else
                resolve(user[0]);
        });
    });
    return promise;
}

function getUser(userId) {
    var promise, getSql;
    getSql = 'select * from user where user_id = ' + userId;
    promise = new Promise(function(resolve, reject) {
        connection.query(getSql, function(err, user) {
            if (err) {
                console.log('getUser error');
                reject(err);
            } else {
                resolve(user[0]);
            }
        });
    });
    return promise;
}

function getUserByEmail(email){
    var promise, getSql;
    getSql = 'select * from user where email =  \"' + email + '\"';
    promise = new Promise(function(resolve, reject) {
        connection.query(getSql, function(err, user) {
            if (err) {
                console.log('getUser error');
                reject(err);
            } else {
                resolve(user[0]);
            }
        });
    });
    return promise;
}

function create(data) {
    var values = {
            user_id: Date.now(),
            username: '',
            email: '',
            home_url: '',
            user_intro: '暂无介绍',
            s_avatar: 'http://7xoszw.com1.z0.glb.clouddn.com/avatar.png?imageView2/1/w/40/h/40',
            b_avatar:'http://7xoszw.com1.z0.glb.clouddn.com/avatar.png?imageView2/1/w/160/h/160',
            sex: '',
            password: '',
            u_key:''
        },
        insertSql,
        promise;
    _.extendOwn(values, data);
    insertSql = 'insert user values(' + arrJoin(_.values(values)).join() + ')';
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
}

function update(values, where) {
    var updateSql, setValues, promise;
    setValues = _.pairs(values).map(function(item, index) {
        if (typeof item[1] == 'string') {
            item[1] = '\"' + item[1] + '\"';
        }
        return item.join('=');
    });
    updateSql = 'update user set ' + setValues.join() + ' where user_id = ' + where.user_id;
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

function resetPassword(password, email) {
    var updateSql, promise;
    
    updateSql = 'update user set password = \"' + password + '\" where email = \"' + email + '\"';
    promise = new Promise(function(resolve, reject) {
        connection.query(updateSql, function(err, res, field) {
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

exports.User = User;
