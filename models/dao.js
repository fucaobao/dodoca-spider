var mongodb = require('./mongodb');
var Q = require('q');
var Schema = mongodb.mongoose.Schema;
var DAOSchema = new Schema({
    'sid': Number,
    'title': String,
    'image': String,
    'sub': Object,
    'date': String
});
var model = mongodb.mongoose.model('dodoca', DAOSchema);
var DAO = function() {};

/**
 * [findOneAndUpdate description]
 * @param  {Object}   params upsert对象
 */
DAO.prototype.findOneAndUpdate = function(params) {
    var deferred = Q.defer();
    // https://docs.mongodb.com/manual/reference/command/findAndModify/
    model.findOneAndUpdate({
        sid: params.sid
    }, params, {
        // 如果要求变化了就修改，则需要增加update属性
        upsert: true
    }, function(error, result) {
        if (error) {
            deferred.reject(error.toString());
        }
        deferred.resolve(result);
    });
    return deferred.promise;
};

/**
 * 查询所有对象
 * @param  {Object}   params JSON对象，查询条件
 */
DAO.prototype.findOne = function(params) {
    var deferred = Q.defer();
    model.findOne(params, function(error, result) {
        if (error) {
            deferred.reject(error.toString());
        }
        deferred.resolve(result);
    });
    return deferred.promise;
};
module.exports = new DAO();