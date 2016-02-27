var http = require('http');

var bucket = require('../model/bucket');


var qiniu = require('qiniu');

var qiniu_config = {
    AK: 'b4AlinZFNGDEbDOJkjKEJipeRuoeK95P5PaBpgfi',
    SK: 'fRbAFpzyWHvQVNxo9D-kwwzcX6Iho5CFWQjx0uo_',
    bucket: 'sample',
    domain: 'http://7xoszw.com1.z0.glb.clouddn.com/'
}


qiniu.conf.ACCESS_KEY = qiniu_config.AK;
qiniu.conf.SECRET_KEY = qiniu_config.SK;

var uptoken = new qiniu.rs.PutPolicy(qiniu_config.bucket).token();

function format() {
    var chunks = [];
    var request = http.get('http://7xoszw.com1.z0.glb.clouddn.com/ppt4794.ppt?odconv/pdf/', function(res) {
        res.on('data', function(chunk) {
            chunks.push(chunk);
        });
        res.on('end', function() {
            var body = Buffer.concat(chunks);
            qiniu.io.put(token, key, body, '', function(err, res) {
                if (err) {
                    conosle.error(err);
                } else {
                    console.log(res);
                }
            });
        });
    });
}

exports = {
  token:token,
  format:format
};
