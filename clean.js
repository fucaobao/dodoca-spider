var cheerio = require('cheerio');
var util = require('./lib/util');

var eventproxy = require('eventproxy');     //并发控制
var ep = new eventproxy();

var baseUrl = 'http://oauth.dodoca.com';
var ownerId = '282242';                     //客户自己的模版id，不能删除
var idList = [];
var currentTime = new Date().getTime();     //当前时间戳

start();

function start() {
    util.request({
        url: baseUrl + '/microsite/micrositelist?type=1&modelkey=micrositemicrositelist'
    }, function(err, data) {
        var $ = cheerio.load(data);
        var maxPage = $('.point').text().replace(/\D/g, '');
        console.log('maxPage:' + maxPage);
        cleanWeb(maxPage);
    });
}

function cleanWeb(max) {
    var url = baseUrl + '/microsite/micrositelist?title=&type=1&currpage=';
    for (var i = 1; i <= max; i++) {
        util.request({
            url: url + i
        }, function(err, data) {
            var $ = cheerio.load(data);
            var imgs = $('.checkimg1');
            [].forEach.call(imgs, function(item, index) {
                item = $(item);
                var id = item.attr('id');
                if (id != ownerId && id != 'checkimgallid') {
                    idList.push(id);
                }
            });
            ep.emit('spider');
        });
    }
    ep.after('spider', max, function() {
        util.request({
            url: baseUrl + '/microsite/deletereds?id=' + idList.join(','),
        }, function(err, data) {
            console.log('删除完成！');
        });
    });
}
