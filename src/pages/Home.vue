<template>
    <div>
        <el-container>
            <el-header>
                <h1>vue-curd 增删改查项目</h1>
            </el-header>
            <el-main>
                <el-row type="flex" justify="end">
                    <el-col :span="6">
                        <el-button type="success" @click="addDialog = true">新增</el-button>  
                        <el-button type="danger" @click="deleteAll()">删除</el-button> 
                        
                        <span id="touxiang">
                            <el-upload
                                class="avatar-uploader"
                                action="https://jsonplaceholder.typicode.com/posts/"
                                :show-file-list="false"
                                :on-success="handleAvatarSuccess"
                                :before-upload="beforeAvatarUpload">
                                <img v-if="imageUrl" :src="imageUrl" class="avatar">
                                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                            </el-upload> 
                        </span>                     
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-table :data="userList" :default-sort = "{prop: 'date', order: 'descending'}"
                        @selection-change="handleSelectionChange"
                        >
                            <el-table-column type="selection" width="55"></el-table-column>
                            <el-table-column label="用户名">
                                <template slot-scope="scope">
                                    {{scope.row.username}}
                                </template>
                            </el-table-column>
                            <el-table-column label="姓名">
                                    <template slot-scope="scope">
                                            {{scope.row.name}}
                                        </template>
                            </el-table-column>
                            <el-table-column label="手机">
                                    <template slot-scope="scope">
                                            {{scope.row.telphone}}
                                        </template>
                            </el-table-column>
                            <el-table-column label="邮箱">
                                    <template slot-scope="scope">
                                            {{scope.row.email}}
                                        </template>
                            </el-table-column>
                            <el-table-column label="日期" prop="date" sortable>
                                    <template slot-scope="scope">
                                            {{scope.row.date|formatDate}}
                                        </template>
                            </el-table-column>
                            <el-table-column label="状态">
                                    <template slot-scope="scope">
                                            <el-tag :type="scope.row.state === true ? 'success' : 'danger' ">
                                                    {{scope.row.state|formatState}}
                                            </el-tag>
                                        </template>
                            </el-table-column>
                            <el-table-column label="操作">
                                <template slot-scope="scope">
                                    <el-button type="success" @click="editForm(scope.row)">编辑</el-button>
                                    <el-button type="danger" @click="deleteOne(scope.row)">删除</el-button>                                    
                                </template>
                            </el-table-column>
                            
                        </el-table>
                    </el-col>
                </el-row>
                <el-row type="flex" justify="end">
                    <el-col :span="5">
                            <el-pagination
                            background
                            layout="prev, pager, next"
                            :total="num"
                            :page-size="5"
                            @current-change="pageChange"
                            >
                          </el-pagination>
                    </el-col>
                </el-row>
            </el-main>
        </el-container>
        <el-dialog title="新增用户" :visible.sync="addDialog">
            <el-form :model="newUser" label-width="70px" :rules="addRules" ref="addForm">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="newUser.username"></el-input>
                </el-form-item>
                <el-form-item label="姓名" prop="name">
                    <el-input v-model="newUser.name"></el-input>
                </el-form-item>
                <el-form-item label="电话" prop="telphone">
                    <el-input v-model.number="newUser.telphone"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="newUser.email"></el-input>
                </el-form-item>
                <el-form-item label="日期" prop="date">
                        <el-date-picker
                        v-model="newUser.date"
                        type="date"
                        placeholder="选择日期">
                      </el-date-picker>
                </el-form-item>
                <el-form-item label="是否启用" prop="state">
                        <el-switch
                        v-model="newUser.state"
                        active-color="#13ce66"
                        inactive-color="#ff4949">
                      </el-switch>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="resetForm('addForm')">取 消</el-button>
                <el-button type="primary" @click="addForm('addForm')">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="编辑用户" :visible.sync="eidtDialog">
            <el-form :model="editUser" label-width="70px" :rules="addRules" ref="editForm">
                <el-form-item label="姓名" prop="name">
                    <el-input v-model="editUser.name"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="editUser.email"></el-input>
                </el-form-item>
                <el-form-item label="是否启用" prop="state">
                        <el-switch
                        v-model="editUser.state"
                        active-color="#13ce66"
                        inactive-color="#ff4949">
                      </el-switch>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="eidtDialog = false">取 消</el-button>
                <el-button type="primary" @click="updateForm('editForm')">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    // 引入axios
    import axios from 'axios'
    export default {
        name:'Home',
        data:function(){
            return{
                // 日期
                pickerOptions1: {
                    disabledDate(time) {
                        return time.getTime() > Date.now();
                    },
                    
                },
                
                //验证规则
                addRules:{
                    username:[
                        {type:"string",required:true,message:"请输入用户名",trigger:'blur'},
                        {min:2,max:10,message:"请输入正确的用户名",trigger:'change'}
                    ],
                    name:[
                        {type:"string",required:true,message:"请输入姓名",trigger:'blur'}
                    ],
                    telphone:[
                        {type:"number",required:true,message:"请输入电话号码",trigger:'blur'}
                        
                    ],
                    email:[
                        {type:"email",required:true,message:"请输入正确的邮箱",trigger:'change'}
                    ],
                    date:[
                        {type:"date",required:true,message:"请输入日期",trigger:'change'}
                    ],
                    state:[]
                }, 
                
                // 打开弹出框
                addDialog:false,
                // 打开编辑
                eidtDialog:false,
                // 新增表单数据
                newUser:
                    {
                        username:'',
                        name:'',
                        telphone:'',
                        email:'',
                        date:'',
                        state:''
                    },
                // 编辑表单数据
                editUser:
                    {
                        name:'',
                        email:'',
                        state:''
                    },
                // 要删除的用户列表
                multipleUser:[],
                userList:[],
                // 条目总数
                num:0,
                // 图片地址
                imageUrl: ''
            }
        },
        methods:{
            // 新增用户
            addForm:function(formName){
                
                this.$refs[formName].validate(valid=>{
                    if(valid){
                        // 验证通过提交数据
                        axios.post('/user/add',this.newUser).then(res=>{
                            // 成功后关掉弹出框
                            this.addDialog = false;
                            this.$refs[formName].resetFields();
                            
                            // console.log(res.data);    
                            //   提示一下
                            this.$message({
                                message:res.data.message,
                                type:'success'
                            })
                            // 主动刷新数据
                            this.getUserList();
                        }).catch(err=>{
                            console.log(err);                
                        })
                    }else{
                        // 验证不通过
                        console.log('验证不通过');   
                        return false;
                    }
                })
                
            },
            // 重置
            resetForm:function(formName){
                this.addDialog = false;
                this.$refs[formName].resetFields();
            },
            // 获取用户列表
            getUserList:function(page){
                // console.log(1);   
                axios.get('/user/list',{
                    params:{
                    page:page || 1,
                    pageSize:5
                }
                }).then(res=>{
                    // console.log(res.data);
                    this.userList = res.data.userList;
  
                    this.num = res.data.count;    
                }).catch(err=>{
                    console.log(err);
                    
                })          
            },
            // 分页：页面改变时执行
            pageChange:function(value){
                this.getUserList(value);
            },
            // 编辑用户 :获取
            editForm:function(row){
                // 打开弹出框
                this.eidtDialog = true;
                // console.log(row);
                // 从数据库获取数据
                axios.get('/user/getUser',{
                    params:{
                    _id:row._id
                    }
                }).then(res=>{
                    this.editUser = res.data;
                }).catch(err=>{
                    console.log(err);  
                })  
            },
            // 修改用户
            updateForm:function(formName){
                this.$refs[formName].validate(valid=>{
                    if(valid){
                        console.log('验证成功');
                        axios.post('/user/updateUser',
                            this.editUser
                        ).then(res=>{
                            this.$message({
                                message:res.data.message,
                                type:'success',
                            })
                            this.eidtDialog = false;
                            // 重新获取最新数据
                            this.getUserList();
                        })
                        
                    }else{
                        console.log('验证失败');
                        return false;
                    }
                })
            },
            // 单个删除用户
            deleteOne:function(row){
                // 确认是否真的删除
                this.$confirm('提示：是否确认删除？','删除用户',{
                    confirmButtonText:'确定', //确定按钮
                    cancelButtonText:'取消', //取消按钮
                    type: 'warning' //类型
                }).then(()=>{
                    axios.get('/user/deleteUser',{
                        params:{
                            _id:row._id
                        }
                    }).then(res=>{
                        this.$message({
                            type:'success',
                            message:'删除成功'
                        })
                        // 重新获取数据
                        this.getUserList();
                    }).catch(err=>{
                        console.log(err);
                        
                    })
                    // this.$message({
                    //     type:'success',
                    //     message:'删除成功'
                    // })
                    // // 重新获取数据
                    // this.getUserList();
                }).catch(()=>{
                    this.$message({
                        type:'info',
                        message:'已取消删除'
                    })
                })
            },
            // 表单选项改变 的时候
            handleSelectionChange:function(val){
                this.multipleUser = val;
            },
            // 批量删除
            deleteAll:function(){
                console.log(this.multipleUser);
                this.$confirm('确认要批量删除吗？','批量删除',{
                    confirmButtonText:'确定', //确定按钮
                    cancelButtonText:'取消', //取消按钮
                    type: 'warning' //类型
                }).then(()=>{
                    axios.post('/user/deleteUserAll',this.multipleUser).then(res=>{
                        this.$message({
                            type:'success',
                            message:res.data.message
                        })
                        // 重新获取数据
                        this.getUserList();
                    }).catch(err=>{
                        console.log(err);
                        
                    })
                    
                }).catch(()=>{
                    this.$message({
                        type:'info',
                        message:'已取消删除'
                    })
                
                })
            },

            // 头像上传
            handleAvatarSuccess(res, file) {
                this.imageUrl = URL.createObjectURL(file.raw);
                console.log(this.imageUrl);
                
            },
            beforeAvatarUpload(file) {
                const isJPG = file.type === 'image/jpeg';
                const isLt2M = file.size / 1024 / 1024 < 2;

                if (!isJPG) {
                this.$message.error('上传头像图片只能是 JPG 格式!');
                }
                if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 2MB!');
                }
                return isJPG && isLt2M;
            }

            // 
        },
        // 生命周期
        mounted:function(){
            this.getUserList(); //在组件渲染完成的时候，获取到所有数据
        }
    }
</script>
<style>
    h1{
        text-align: center;
    }
    .fr {
        clear: both;
    }
    .left{
        float: left;
    }
    .right{
        float:right;
    }

    /* 上传头像样式 */
    #touxiang{
        display: inline-block;
        position: relative;
        bottom: -15px;
        margin-left: 15px;
    }
    .avatar-uploader .el-upload {
        border: 1px solid #d9d9d9;
        border-radius: 39px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 78px;
        height: 78px;
        line-height: 78px;
        text-align: center;
    }
    .avatar {
        width: 78px;
        height: 78px;
        display: block;
    }
</style>