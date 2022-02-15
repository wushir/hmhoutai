<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="" />
      </div>
      <!-- 登录表单区域 -->
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" label-width="0px" class="login_form">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" prefix-icon="el-icon-user-solid" ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" prefix-icon="el-icon-lock" type="password"></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetloginFrom">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      //这是登录表单的数据绑定对象
      loginForm: {
        //用户名
        username: "admin",
        //密码
        password: "123456",
      },
      //这是登录表单的验证规则对象
      loginFormRules: {
        //验证用户名是否合法
        username: [
          //trigger: "blur"失去焦点
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
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
      },
    };
  },
  methods: {
    resetloginFrom() {
      console.log(this);
      //重置表单  $refs代表一组ref 
      //resetFields 这个方法是出自 element-ui 框架里面，作用是移除校验结果并重置字段值
      this.$refs.loginFormRef.resetFields();
    },
    login() {
      //验证表单  async异步 表示这是个异步函数
      //异步可以直接返回拿到的数据
      this.$refs.loginFormRef.validate(async (valid) => {
        //console.log(valid);
        if (!valid) return;
        //请求的接口  this.loginForm表单的数据
        //this.$http.post('login',this.loginForm) 发起登录请求 用一个变量保存
        // const result=await this.$http.post('login',this.loginForm)
        //去除多余的数据 打印里面的data属性是真实数据 用一个变量保存
        //使用结构语法 并且重命名
        const { data: res } = await this.$http.post("login", this.loginForm);
        console.log(res);
        //如果返回的状态码不等于200 打印登录失败
        if (res.meta.status !== 200) {
          // console.log('登录失败');
          //弹出提示框 失败error success成功
          // if(res.meta.status !==200)
          this.$message.error("登录失败");
          //如果有 就成功
        } else {
          // console.log(登录成功);
          this.$message.success("登录成功");
          // 存储数据：sessionStorage.setItem(名,保存的值);
          window.sessionStorage.setItem("token", res.data.token);
          //跳转网页
          //this.$router.push() 可以通过修改url实现路由跳转 push末尾添加
          this.$router.push("/home");
        }
      });
    },
  },
};
</script>
<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
  .login_box {
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    .avatar_box {
      height: 130px;
      width: 130px;
      border: 1px solid #eee;
      border-radius: 50%;
      overflow: hidden;
      padding: 10px;
      box-shadow: 0 0 10px #ddd;
      //定位
      position: absolute;
      transform: translate(-50%, -50%);
      background-color: #fff;
      left: 50%;
      img {
        width: 100%;
        height: 100%;
        display: block;
        border-radius: 50%;
        background-color: #eee;
      }
    }
    .login_form {
      position: absolute;
      bottom: 0;
      padding: 0 20px;
      width: 100%;
      box-sizing: border-box;
      .btns {
        display: flex;
        justify-content: flex-end;
      }
    }
  }
}
</style>