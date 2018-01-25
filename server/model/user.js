// 建表

const mongoose = require('mongoose');
const shortid = require('shortid');
const db = require('./db');
// 创建架构
const UserSchema = mongoose.Schema({
    _id:{
        type:String,
        index:true,  //索引
        default:shortid.generate //默认值
    },
    username:{
        type:String,
        required:true,//必填
    },
    name:{
        type:String,
        required:true,//必填
    },
    telphone:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    date:{
        type:String,
        default:Date.now
    },
    state:{
        type:Boolean,
        default:false
    }
})
// 虚拟字段
// const fillZero = function(value){
//     return value > 10? value : '0' + value;
// }
// UserSchema.virtual('date_now').get(function(){
//     let year = fillZero(this.date.getFullYear());
//     let month = fillZero(this.date.GetMonth()+1);
//     let day = fillZero(this.date.getDate());
//     let hours = fillZero(this.date.getHours());
//     let second = fillZero(this.date.getSeconds())
//     return '${year}-${month}-${day} ${hours}:${second}'
// })
// 创建模型
const User = mongoose.model('User',UserSchema);
module.exports = User;