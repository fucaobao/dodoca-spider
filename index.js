var fs = require('fs');

var archiver = require('archiver');         //压缩文件
var archive = archiver('zip');

var cheerio = require('cheerio');
var log = require('./lib/log');             //日志系统
var util = require('./lib/util');
var config = require('./config/config');
var dao = require('./models/dao');

var eventproxy = require('eventproxy');     //并发控制
var ep = new eventproxy();

var colors = require('colors');             //控制台颜色
var info = console.log,
    warn = function(s) {
        info(s.yellow);
    },
    error = function(s) {
        info(s.red);
    },
    success = function(s) {
        info(s.green);
    };

// 模版的存放路径
var baseTemplatePath = __dirname + '\\template\\';
var baseUrl = config.url.substring(0, config.url.indexOf('/', 7));
var currentTime = new Date().getTime();     //当前时间戳

util.request({
    url: util.getOrigin(config.url)
}, parseContent);

/**
 * 解析代码
 */
function parseContent(err, data) {
    if (err || !data) {
        return process.exit();
    }
    var $ = cheerio.load(data);
    var loginName = $('.topBar p').eq(1).find('span a').text().trim();
    if (loginName) {
        success('登录成功，当前登录名:' + loginName);
    } else {
        error('登录失败！');
        return process.exit();
    }
    var countDB = 0;    //执行次数
    var countFile = 0;  //执行次数
    var templateList = $('.micro_site_ul li');
    var max = templateList.length;
    [].forEach.call(templateList, function(item, index) {
        item = $(item);
        var img = item.find('.img_w img').attr('src');
        var sid = img.substring(img.lastIndexOf('/') + 1, img.lastIndexOf('.'));
        var title = item.find('span').text();
        util.request({
            url: baseUrl + '/microsite/insertwebsite',
            method: 'post',
            form: {
                'tid': sid,
                'weiid': 0,
                'contentid': 0,
                'menuid': 0
            }
        }, function(error, data) {
            var obj = JSON.parse(data);
            var url = baseUrl + '/microsite/updatewebsite?id=' + obj.id + '&weicontenttile=' + obj.weicontenttile + '&type=1';
            util.request({
                url: url,
                method: 'post'
            }, function(error, data) {
                var _ = cheerio.load(data);
                var css = _('.lf-bg .phone link').attr('href');
                if (css.indexOf('http') !== 0) {
                    css = baseUrl + css;
                    _('.lf-bg .phone link').attr('href', css);
                }
                var html = _('.lf-bg').html();
                fs.mkdir(baseTemplatePath, function(){
                    fs.writeFile(baseTemplatePath + sid + '.html', html, function(){
                        // 完成则触发generateTemplate事件
                        countFile += 1;
                        ep.emit('generateTemplate');
                    });
                });
                dao.findOneAndUpdate({
                    sid: sid,
                    image: img,
                    title: title,
                    sub: {
                        url: url,
                        html: html,
                        css: css
                    },
                    date: new Date()
                }).then(function(result) {
                    // 完成则触发upsert事件
                    countDB += 1;
                    ep.emit('upsert');
                });
            });
        });
    });

    // 如果upsert事件触发了max次，则提示出来
    ep.after('upsert', max, function() {
        success('成功写入数据库的模版数量：' + countDB + '，花费时间：' + (new Date().getTime() - currentTime) + 'ms');
        ep.emit('done');
    });

    // 如果generateTemplate事件触发了max次，则提示出来
    ep.after('generateTemplate', max, function() {
        success('成功写入文件的模版数量：' + countFile + '，花费时间：' + (new Date().getTime() - currentTime) + 'ms');
        ep.emit('done');
    });

    // 如果done事件触发了2次，则提示出来
    ep.after('done', 2, function() {
        success('成功抓取，花费时间：' + (new Date().getTime() - currentTime) + 'ms');
        var output = fs.createWriteStream('template.zip');
        archive.pipe(output);
        archive.bulk([{
            src: ['template/**']
        }]);
        archive.finalize();
        output.on('close', function() {
            success('成功压缩文件，总共：' + archive.pointer() + '字节！');
            process.exit();
        });
    });
}