var express = require('express');
var router = express.Router();
var db = require('../model/db')
var User = require('../model/user')
/* GET home page. */
router.post('/add', function(req, res) {
    // console.log(req.body);
    req.body.telphone = req.body.telphone.toString();
    let newUser = new User(req.body);
    newUser.save().then(data=>{
        res.status(200).json({message:'添加用户成功'});
    }).catch(err=>{
        console.log(err);
        
    })
});
// 获取用户列表
router.get('/list',function(req,res,next){
    
    
    // User.find({}).exec().then(result=>{
    //     return res.status(200).json(result);
    // }).catch(err=>{
    //     console.log(err);
        
    // })
    var page = parseInt(req.query.page);
    var pageSize = parseInt(req.query.pageSize);
    var skip = parseInt((page - 1) * pageSize);
    console.log(page);
    console.log(pageSize);
    console.log(skip);
    
    User.find({}).sort({'date':-1}).skip(skip).limit(pageSize).exec().then(userlist=>{
        if(userlist){
            User.count({},function(err,count){
                return res.json({
                    status:'0',
                    userList:userlist,
                    count:count
                })
            })
        }
    }).catch(err=>{
        return res.json({
        status:'1',
        message:err
        })
    })
})
// 获取修改的弹出框里的数据
router.get('/getUser',function(req,res){
    let id = req.query._id;
    // console.log(id);
    User.findOne({_id:id},['name','email','state']).exec().then(result=>{
        // 数据在传输过程中必须是字符串
        return res.status(200).json(result);
    }).catch(err=>{
        console.log(err);
        
    })
    
})
// 修改编辑过的数据
router.post('/updateUser',function(req,res){
    // console.log(req.body);
    User.update({_id:req.body._id},{
        name:req.body.name,
        email:req.body.email,
        state:req.body.state
    }).then(result=>{
        return res.status(200).json({message:'修改成功'})
    }).catch(err=>{
        console.log(err);
        
    })
    
})
// 删除
router.get('/deleteUser',function(req,res){
    User.remove({_id:req.query._id}).then(result=>{
        return res.status(200).json({massage:'删除成功'})
    }).catch(err=>{
        console.log(err);
        
    })
})
//批量删除
router.post('/deleteUserAll',function(req,res){
    // console.log(req.body);
    let list = req.body;
    let idList = [];
    list.forEach(function(item){
        idList.push(item._id);
    })
    User.remove({_id:{$in:idList}}).then(result=>{
        return res.status(200).json({message:'批量删除成功'});
    }).catch(err=>{
        console.log(err);
        
    })
})
module.exports = router;