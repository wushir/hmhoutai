<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/heima.png" alt="" />
        <span>电商后台管理系统</span>
      </div>
      <!-- 点击删除按钮执行logout方法 -->
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <!-- 用3目运算符进行判断 isCollapse为true 为64px 否则为200px -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-botton" @click="toggleCollapse">|||</div>
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409eff"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="activePath"
        >
        <!-- 开启路由跳转 搭配:index来进行跳转 -->
          <!-- collapse 是否水平折叠收起菜单 collapse-transition是否开启折叠动画 -->
          <!-- 一级菜单 -->
          <!-- 用v-for进行变遍历 用:key绑定唯一id -->
          <el-submenu
            :index="item.id + ''"
            v-for="item in menulist"
            :key="item.id"
          >
            <!-- 一级菜单模板 -->
            <template slot="title" >
              <!-- 图标 -->
              <!-- 通过item.id唯一的id  -->
              <i :class="iconsList[item.id]"></i>
              <!-- 文本 -->
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/'+subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
              @click="saveNavState('/'+subItem.path)"
            >
            <!-- 通过点击触发函数 saveNavState函数名  '/'+subItem.path传递的参数 -->
              <!-- 二级菜单模板 -->
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>{{ subItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右边主体 -->
      <el-main>
       <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>


<script>
import Welcome from './Welcome.vue';
export default {
  components: { Welcome },
  //created:在模板渲染成html前调用  就是组件创建之后调用getMenuList这个函数
  created() {
    this.getMenuList();
    this.activePath=window.sessionStorage.getItem('activePath')
  },
  data() {
    return {
      // 创建一个空对象 保存左侧菜单数据
      menulist: [],
      iconsList: {
        125: "el-icon-s-check",
        103: "el-icon-setting",
        101: "el-icon-s-goods",
        102: "el-icon-s-order",
        145: "el-icon-data-line",
      },
      //是否折叠
      isCollapse: false,
      //被激活的地址 
      activePath:''
    };
  },
  methods: {
    logout() {
      //删除会话存储对象 就是销毁本地的token
      window.sessionStorage.clear();
      //删除之后调回登录页
      this.$router.push("/login");
    },
    //获取所有的菜单
    async getMenuList() {
      //发送请求 menus是接口
      // const a = this.$http.get("menus");
      // console.log(a);
      //但是接受的但是出现Promise 所以通过asyns 和 await来简化Promisech操作 也可以.then
      //Promisech简单来说 就是一个构造函数 用处把多个异步操作, 用Promise分别封装
      // await this.$http.get("menus")
      //但是里面又有很多无效数据 我们可以通过解构语法解构
      const { data: res } = await this.$http.get("menus");
      //res.meta.status!==200就是请求失败  //弹出提示框提示
      if (res.meta.status !== 200) return this.$message.error(res.mata.msg);
      //创建一个数组保存菜单数据
      this.menulist = res.data;
      console.log(this.menulist);
    },
    //点击按钮,切换菜单的折叠与展开
    toggleCollapse() {
      this.isCollapse = !this.isCollapse;
    },
     //存储会话存储对象  saveNavState(activePath)里面的activePath是接收的数据
    saveNavState(activePath){
      //setItem('activePath',activePath) 第一个保存的函数名 第二个接收的是参数
      window.sessionStorage.setItem('activePath',activePath)
      this.activePath=activePath
    }
  },
};
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
  .el-header {
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    padding-left: 0px;
    align-items: center;
    color: #fff;
    font-size: 20px;
    > div {
      display: flex;
      align-items: center;
      span {
        margin-left: 15px;
      }
    }
  }
  .el-aside {
    background-color: #333744;
    .el-menu{
      border-right: none;
    }
  }
  .el-main {
    background-color: #eaedf1;
  }
  i {
    margin-right: 10px;
  }
}
.toggle-botton {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>
