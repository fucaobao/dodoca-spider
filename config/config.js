var config = {
    'url': 'http://oauth.dodoca.com/microsite/templatelist', //jslxswbg
    'subUrl' : 'http://oauth.dodoca.com/microsite/updateplace',
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
        'Cookie': 'sem_user=bnN4ZFc5dkJ6WjNMWG5QVmMwYkc=; td_cookie=166836956; rem_u=jslxswbg; rem_p=jslxswbg; aliyungf_tc=AQAAALvfu3AgKggAbj48OpTvN5+Um8gq; PHPSESSID=ot5pe2vq3cn3e03c7kfnn40ho0; novice=value'
    }
};
module.exports = config;