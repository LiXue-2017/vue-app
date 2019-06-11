// 用express启动一个HTTP Server，来打开编译后输出的文件
let express = require('express');
let config = require('../config/index');
let port = process.env.PORT || config.build.port;
// 连接的wifi网络的ipv4地址
// let host = '172.28.53.13';
// 手机热点的ipv4地址
let host = '192.168.43.21';
// 导入数据
let appData = require('../data.json')
let goods = appData.goods
let ratings = appData.ratings
let seller = appData.seller
// 启动express
let app = express();
// 定义router
let router = express.Router();
// 定义路由
router.get('/', function (req, res, next) {
  // req.url将结合express.static('./dist')指定的根目录来生成url
  req.url = '/index.html';
  next();
});
router.get('/api/seller', (req, res) => {
  res.json({
    errno: 0,
    data: seller
  });
});
router.get('/api/goods', (req, res) => {
  res.json({
    errno: 0,
    data: goods
  });
});
router.get('/api/ratings', (req, res) => {
  res.json({
    errno: 0,
    data: ratings
  });
});
app.use(router);
// 指定了静态资源的根目录
app.use(express.static('./dist'));
module.exports = app.listen(port, host, function (err) {
  if (err) {
    console.log(err);
    return;
  }
  console.log('Listening at http://' + host + ':' + port + '/?id=1234' + '\n')
})

