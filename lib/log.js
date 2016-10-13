//日志系统，需要完善
var log4js = require('log4js');
log4js.configure({
    appenders: [{
            type: 'console',
            category: "dateFile"
        }, //控制台输出
        {
            type: "dateFile",
            filename: 'logs/log.log',
            pattern: "_yyyy-MM-dd",
            alwaysIncludePattern: false,
            category: 'normal'
        } //日期文件格式
    ],
    replaceConsole: false, //替换console.log
    levels: {
        dateFileLog: 'INFO'
    }
});
// var log = log4js.getLogger('dateFileLog');
var log = log4js.getLogger('normal');
module.exports = log;
