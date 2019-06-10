// 用express启动一个HTTP Server，来打开编译后输出的文件
let express = require('express');
let config = require('../config/index');
let port = process.env.PORT || config.build.port;
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
  req.url = '/index.html';
  next();
});
app.use(router);

let apiRouter = express.Router();
apiRouter.get('/api/seller', (req, res) => {
  res.json({
    errno: 0,
    data: seller
  });
});
apiRouter.get('/api/goods', (req, res) => {
  res.json({
    errno: 0,
    data: goods
  });
});
apiRouter.get('/api/ratings', (req, res) => {
  res.json({
    errno: 0,
    data: ratings
  });
});
app.use('/api', apiRouter);
app.use(express.static('./dist'));
module.exports = app.listen(port, function (err) {
  if (err) {
    console.log(err);
    return;
  }
  console.log('Listend!')
})

// // express模拟后台接口
// before(app) {
//   app.get('/api/seller', (req, res) => {
//     res.json({
//       errno: 0,
//       data: seller
//     })
//   }),
//     app.get('/api/goods', (req, res) => {
//       res.json({
//         errno: 0,
//         data: goods
//       })
//     }),
//     app.get('/api/ratings', (req, res) => {
//       res.json({
//         errno: 0,
//         data: ratings
//       })
//     })
// }
