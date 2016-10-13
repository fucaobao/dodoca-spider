## 点点客爬虫
爬取[点点客](http://www.dodoca.com/)上的模版。

1. npm install
2. 安装[mongodb](https://www.mongodb.com/download-center)并运行(如果不需要把数据存到mongodb中，则这一步可以省略)
3. npm start

难点：由于登录需要验证码，因此采用帐号密码的登录方式不可取，故而采用cookie的登录方式。

需要注意的是：由于cookie有时间限制，当登录失败的时候，需要在浏览器中手动登录，抓包获取cookie，修改config/config.js中的cookie字段，重新npm start即可~~