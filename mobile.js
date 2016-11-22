var fs = require('fs');

var cheerio = require('cheerio');
var log = require('./lib/log');             //日志系统
var util = require('./lib/util');
var config = require('./config/config');

var superagent = require('superagent');

var archiver = require('archiver');         //压缩文件
var archive = archiver('zip');

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

// 模版所在的文件夹
var templateName = 'h5_template';
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
            var url = config.mobileBaseLink + obj.id;
            // ATTENTION：这里用util.request没有返回，所以改用superagent
            superagent.get(url).end(function(err, res) {
                if (err || !res || !res.text) {
                    return process.exit();
                }
                var html = res.text;
                var _ = cheerio.load(html);
                var imgs = _('img');
                var imgList = [];
                [].forEach.call(imgs, function(item, index){
                    item = _(item);
                    var src = item.attr('src');
                    if (imgList.indexOf(src) === -1) {
                        imgList.push(src);
                        if (src.indexOf('http') !== 0) {
                            var targetSrc = baseUrl + src;
                            var regExp = new RegExp(src, 'gmi');
                            html = html.replace(regExp, targetSrc);
                        }
                    }
                });
                var baseTemplatePath = __dirname + '\\' + templateName + '\\';
                fs.mkdir(baseTemplatePath, function() {
                    fs.writeFile(baseTemplatePath + obj.id + '-' + title + '.html', html, function() {
                        // 完成则触发generateTemplate事件
                        countFile += 1;
                        ep.emit('generateTemplate');
                    });
                });
            });
        });
    });

    // 如果generateTemplate事件触发了max次，则提示出来
    ep.after('generateTemplate', max, function() {
        success('成功写入文件的模版数量：' + countFile + '，花费时间：' + (new Date().getTime() - currentTime) + 'ms');
         zip();
    });

    function zip(){
        var output = fs.createWriteStream(templateName + '.zip');
        archive.pipe(output);
        archive.bulk([{
            src: [templateName + '/**']
        }]);
        archive.finalize();
        output.on('close', function() {
            success('成功压缩文件，总共：' + archive.pointer() + '字节！');
            process.exit();
        });
    }
}