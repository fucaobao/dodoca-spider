var config = {
    'url': 'http://oauth.dodoca.com/microsite/templatelist?type=1', //jslxswbg
    'mobileBaseLink': 'http://mobile.dodoca.com/251747/phonewebsite/website?uid=251747&id=', //对同一个用户uid是相同的
    // 发送的请求头部
    'headers': {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Encoding': 'gzip, deflate, sdch',
        'Accept-Language': 'zh-CN,zh;q=0.8,en;q=0.6,zh-TW;q=0.4',
        'Upgrade-Insecure-Requests': '1',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.143 Safari/537.36',
        'Connection': 'keep-alive',
        'Cache-Control': 'max-age=0',
        'Host': 'oauth.dodoca.com',
        //cookie,可能会变化
        'Cookie': 'aliyungf_tc=AQAAAOtnKHroXwQAbj48OoGCw6EYSxrS; PHPSESSID=1dsjgg8svnm4afc9qqnqh85rn1; novice=value; rem_u=jslxswbg; rem_p=jslxswbg'
    }
};
module.exports = config;