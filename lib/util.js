var request = require('request');
var zlib = require('zlib');
var config = require('../config/config');
var util = {
    isArray: function(val) {
        return Object.prototype.toString.call(val) === '[object Array]';
    },
    isObject: function(val) {
        return Object.prototype.toString.call(val) === '[object Object]';
    },
    isFunction: function(cb) {
        return typeof cb === 'function';
    },
    //深拷贝
    clone: function(obj) {
        var self = this,
            newobj = obj.constructor === Array ? [] : {};
        if (typeof obj !== 'object') {
            return obj;
        } else if (JSON) {
            newobj = JSON.parse(JSON.stringify(obj)); //化对象和还原
        } else {
            for (var i in obj) {
                newobj[i] = typeof obj[i] === 'object' ? self.clone(obj[i]) : obj[i];
            }
        }
        return newobj;
    },
    //深拷贝扩展
    extend: function(dest, src) {
        var self = this;
        for (var key in src) {
            if (src.hasOwnProperty(key)) {
                dest[key] = self.clone(src[key]);
            }
        }
        return dest;
    },
    getOrigin: function(url) {
        var index = url.indexOf('?');
        if (index < 0) {
            return url;
        }
        return url.substring(0, index);
    },
    request: function(option, cb) {
        request({
            url: option.url,
            method: option.method || 'get',
            headers: config.headers,
            form: option.form || {},// 注意：只有method为post的时候，form才会生效
            timeout: option.timeout || 15000,
            encoding: option.encoding || null
        }, function(error, response, data) {
            if (!error && response.statusCode == 200) {
                var buffer = new Buffer(data);
                var encoding = response.headers['content-encoding'];
                if (encoding == 'gzip') {
                    zlib.gunzip(buffer, function(err, decoded) {
                        cb(err && ('unzip error' + err), decoded && decoded.toString());
                    });
                } else if (encoding == 'deflate') {
                    zlib.inflate(buffer, function(err, decoded) {
                        cb(err && ('deflate error' + err), decoded && decoded.toString());
                    });
                } else {
                    cb(null, buffer.toString());
                }
            }
        });
    }
};
module.exports = util;