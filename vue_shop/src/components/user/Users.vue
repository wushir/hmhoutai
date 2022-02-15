<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 搜索 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <!-- v-model="queryInfo.query" 获取用户输入的值  
           clearable清空 @clear="getUserlist"点击清空后重新获取-->
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getUserlist"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserlist"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>
      <!-- 表格 -->
      <el-table :data="userlist" border stripe>
        <el-table-column type="index" label="id"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="手机号"> </el-table-column>
        <el-table-column prop="create_time" label="创建时间"> </el-table-column>
        <el-table-column prop="role_name" label="权限"> </el-table-column>
        <el-table-column label="状态">
          <!-- slot-scope="scope" 来取得作用域插槽:data绑定的数据，scope可以随便替换其他名称，
         只是定义对象来代表取得的data数据，便于使用 -->
          <!-- scope.row 获取当前行所有数据-->
          <!-- template模板插糟 -->
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="userStateChanged(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px" class="caozuo">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.id)"
            ></el-button>
            <!-- 删除按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeUserById(scope.row.id)"
            ></el-button>
            <!-- 分配角色 -->
            <el-tooltip
              class="item"
              effect="dark"
              content="分配权限"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="setRole(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加用户的对话框 -->
    <!-- :visible.sync="addDialogVisible"控制对话框显示隐藏 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <!-- 内容主体区 -->
      <!-- :model="addForm" 表单数据
       :rules="addFormRules"验证规则
       -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="70px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            type="password"
            v-model="addForm.password"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email" clearable></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addForm.mobile" clearable></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser"> 确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户的对话框 -->
    <el-dialog
      title="修改用户"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <!-- 内容主体区 -->
      <!-- :model="addForm" 表单数据
       :rules="addFormRules"验证规则
       -->
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="70px"
      >
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email" clearable></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editForm.mobile" clearable></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser"> 确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配用户的角色对话框 -->
    <el-dialog
      title="分配角色"
      :visible.sync="setRoleDialogVisible"
      @close="setRoleDialogClosed"
      width="50%"
    >
      <div>
        <p>当前用户:{{ userInfo.username }}</p>
        <p>当前角色:{{ userInfo.role_name }}</p>
        <p> 选择新角色
          <el-select v-model="selectedRoleId" placeholder="请选择">
            <el-option
              v-for="item in rolelist"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setRoleInfo"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    // 校验邮箱的规则
    var checkEmail = (rule, value, cb) => {
      // 验证邮箱的正则表达式
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
      // 如果验证邮箱正确，返回回调函数，输入框显示绿色
      if (regEmail.test(value)) {
        // 合法的邮箱
        return cb();
      }
      // 如果验证不正确
      cb(new Error("请输入合法的邮箱"));
    };
    // 校验手机号的规则
    var checkMobile = (rule, value, cb) => {
      // 验证手机号的正则表达式
      const regMobile =
        /^(((13[0-9]{1})|(14[0-9]{1})|(15[0-9]{1})|(16[0-9]{1})|(17[0-9]{1})|(19[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
      // 如果验证手机号正确，返回回调函数，输入框显示绿色
      if (regMobile.test(value)) {
        return cb();
      }
      // 如果验证不正确
      cb(new Error("请输入合法的手机号"));
    };
    return {
      //获取用户列表的参数
      queryInfo: {
        query: "",
        //当前页数
        pagenum: 1,
        //每页显示多少条
        pagesize: 2,
        //搜索输入框里面的值
      },
      //保存用户列表
      userlist: [],
      //保存总数据条数
      total: 0,
      //控制添加用户对话框显示隐藏
      addDialogVisible: false,
      //控制修改用户对话框显示隐藏
      editDialogVisible: false,
      // 分配用户的角色对话框显示隐藏
      setRoleDialogVisible: false,
      //添加用户表单数据
      addForm: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      //查询用户表单信息对象
      editForm: {
        // username:'',
        // password:'',
        // email:'',
        // mobile:'',
      },
      //修改表单的验证规则对象
      editFormRules: {
        username: [
          //trigger: "blur"失去焦点
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "用户名的长度在3~10个字符之间",
            trigger: "blur",
          },
        ],
        //验证密码是否合法
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "长度在 6 到 15 个字符",
            trigger: "blur",
          },
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: checkMobile },
        ],
      },
      //添加用户表单验证规则
      addFormRules: {
        username: [
          //trigger: "blur"失去焦点
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "用户名的长度在3~10个字符之间",
            trigger: "blur",
          },
        ],
        //验证密码是否合法
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "长度在 6 到 15 个字符",
            trigger: "blur",
          },
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: checkMobile },
        ],
      },
      //需要分配角色的用户信息
      userInfo: {},
      //所有角色以后列表
      rolelist: [],
      //用户角色选择的新角色id的值
      selectedRoleId:''
    };
  },
  created() {
    this.getUserlist();
  },
  methods: {
    // 获取用户列表
    async getUserlist() {
      //users接口 this.queryInfo参数 params别名
      const { data: res } = await this.$http.get("users", {
        params: this.queryInfo,
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取用户列表失败");
      }
      //保存用户列表
      this.userlist = res.data.users;
      //保存总数据条数
      this.total = res.data.total;
      console.log(this.total);
    },
    //监听pagesize改变的事件
    handleSizeChange(newSize) {
      // console.log(11111,newSize);
      this.queryInfo.pagesize = newSize;
      this.getUserlist();
    },
    //监听页码值改变的事件
    handleCurrentChange(newPage) {
      //  console.log(newPage);
      this.queryInfo.pagenum = newPage;
      this.getUserlist();
    },
    //监听switch开关状态的改变
    async userStateChanged(userinfo) {
      console.log(userinfo);
      const { data: res } = await this.$http.put(
        `users/${userinfo.id}/state/${userinfo.mg_state}`
      );
      //判断状态码响应成功没有
      if (res.meta.status !== 200) {
        //把状态变成原样,并提示更新用户状态失败
        userinfo.mg_state = !userinfo.mg_state;
        return this.$message.error("更新用户状态失败");
      }
      //提示成功
      this.$message.success("更新用户状态成功");
    },
    //添加用户对话框关闭事件
    addDialogClosed() {
      //resetFields对整个表单进行重置，将所有字段值重置为初始值并移除校验结果
      this.$refs.addFormRef.resetFields();
    },
    // 点击按钮添加新用户
    addUser() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.post("users", this.addForm);
        if (res.data.status !== 201) {
          this.$message.error("添加用户失败");
        }
        this.$message.success("添加用户成功");
        //对话框隐藏
        this.addDialogVisible = false;
        //重新获取用户列表
        this.getUserlist();
        //所有角色的数据列表
      });
    },
    // 展示编辑用户的对话框
    async showEditDialog(id) {
      this.editDialogVisible = true;
      // 根据 ID 查询用户信息
      const { data: res } = await this.$http.get("users/" + id);
      //用if进行判断 用户请求成功还是失败
      if (res.meta.status != 200) {
        //失败提示
        return this.$message.error("查询用户失败");
      }
      this.editForm = res.data;
    },
    //修改用户对话框的关闭事件
    editDialogClosed() {
      // resetFields	对整个表单进行重置，将所有字段值重置为初始值并移除校验结果
      this.$refs.editFormRef.resetFields();
    },
    //修改用户信息并且提交
    editUser() {
      this.$refs.editFormRef.validate(async (valid) => {
        //打印为true,表示格式校验验证通过
        console.log(this.editForm);
        //不通过直接结束
        if (!valid) return;
        //通过发起修改用户信息的请求
        const { data: res } = await this.$http.put(
          "users/" + this.editForm.id,
          {
            email: this.editForm.email,
            mobile: this.editForm.mobile,
          }
        );
        //先判断响应成功没有
        if (res.meta.status !== 200) {
          return this.$message.error("更新用户信息失败");
        }
        //响应成功之后
        //关闭对话框 刷新数据表 提示修改成功
        this.editDialogVisible = false;
        this.getUserlist();
        this.$message.success("更新用户信息成功");
      });
    },
    //根据id删除对应的用户信息
    async removeUserById(id) {
      console.log(id);
      //弹框提示
      const confirmResult = await this.$confirm(
        "此操作将永久删除该用户, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      //如果确认删除 返回confirm
      //取消删除 返回cancel
      console.log(confirmResult);
      if (confirmResult !== "confirm") {
        return this.$message.info("已经取消删除");
      }
      const { data: res } = await this.$http.delete("users/" + id);
      if (res.meta.status != 200) {
        //响应错误提示
        return this.$message.error("删除用户失败");
      }
      //成功弹出
      this.$message.success("删除用户成功");
      //重新获取用户列表
      this.getUserlist();
    },
    // 展示分配角色对话框
    async setRole(userInfo) {
      console.log(userInfo);
      this.userInfo = userInfo;
      //展示对话框获取所有权限列表
      const { data: res } = await this.$http.get("roles");
      //提示失败
      if (res.meta.status !== 200) {
        return this.$message.error("获取列表失败");
      }
      this.rolelist = res.data;
      // console.log(this.rolelist);
      // 显示对话框
      this.setRoleDialogVisible = true;
    },
    //点击按钮分配角色
    async setRoleInfo(){
      //判断用户是否选择新的角色
      console.log(this.selectedRoleId);
      if(!this.selectedRoleId){
        return this.$message.error('请选择要分配的角色')
      }
       const { data: res } = await this.$http.put(`users/${this.userInfo.id}/role`,{rid:this.selectedRoleId});
      //  console.log(res);
       //提示失败
      if (res.meta.status !== 200) {
        return this.$message.error("更新角色失败");
      }
      this.$message.success('更新角色成功')
       //重新获取用户列表
      this.getUserlist();
      this.setRoleDialogVisible = false
    },
    // 监听分配角色对话框的关闭事件 当他关闭数据全部清零
    setRoleDialogClosed(){
      this.selectedRoleId=''
      this.userInfo=''
    }
  },
};
</script>

<style scoped >
</style>