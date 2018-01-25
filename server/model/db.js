// 第一步：引入mongoose
const mongoose = require('mongoose');
// 第二步：连接数据库
mongoose.connect('mongodb://localhost/vue-curd',{useMongoClient:true});
// 第三步：设置mongoose里面的promise是es6的promise
// mongoose.Promise = global.Promise;
// 最后：监听数据库状态
mongoose.connection.on('connected',function(){
    console.log('mongoose is success');
})
mongoose.connection.on('error',function(){
    console.error('mongoose is error');
})
