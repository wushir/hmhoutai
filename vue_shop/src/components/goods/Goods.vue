<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <!-- v-model="queryInfo.query" 获取用户输入的值  
           clearable清空 @clear="getUserlist"点击清空后重新获取-->
          <el-input placeholder="请输入内容"  v-model="queryInfo.query"  @clear="getGoodsList" clearable>
            <el-button slot="append"  icon="el-icon-search"  @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
           <el-button type="primary" @click="goAddpage">添加商品</el-button>
        </el-col>
        </el-row>
      <el-table :data="goodslist" border stripe>
        <el-table-column type="index" label="id"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column label="商品价格" prop="goods_price" width="90px"></el-table-column>
        <el-table-column label="商品重量" prop="goods_weight" width="80px"></el-table-column>
        <el-table-column label="创建时间" prop="add_time" width="160px">
          <template slot-scope="scope">
            {{scope.row.add_time|dateFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px" class="caozuo">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              @click="showEditDialog(scope.row.goods_id)"
              size="mini"
            ></el-button>
            <!-- 删除按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
               @click="removergoodsById(scope.row.goods_id)"
              size="mini"
            ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分页 -->
    <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[20, 50, 100, 150]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
    </el-pagination>
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
        <el-form-item label="商品名" prop="goods_name">
          <el-input v-model="editForm.goods_name"></el-input>
        </el-form-item>
        <el-form-item label="价格" prop="goods_price">
          <el-input v-model="editForm.goods_price" clearable></el-input>
        </el-form-item>
        <el-form-item label="数量" prop="goods_number">
          <el-input v-model="editForm.goods_weight" clearable></el-input>
        </el-form-item>
        <el-form-item label="重量" prop="goods_weight">
          <el-input v-model="editForm.goods_weight" clearable></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser"> 确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
     // 校验价格的规则
    var checkMobile = (rule, value, cb) => {
      // 验证价格的正则表达式
      const regMobile =
        /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
      // 如果验证价格正确，返回回调函数，输入框显示绿色
      if (regMobile.test(value)) {
        return cb();
      }
      // 如果验证不正确
      cb(new Error("请输入正确的价格"));
    };
    // 校验商品重量的规则
    var numbers = (rule, value, cb) => {
      // 验证商品重量的正则表达式
      const regMobile =
        /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
      // 如果验证重量正确，返回回调函数，输入框显示绿色
      if (regMobile.test(value)) {
        return cb();
      }
      // 如果验证不正确
      cb(new Error("请不要出现空格,字母,汉字,特殊符号"));
    };
    return {
      //获取用户列表的参数
      queryInfo: {
        query: "",
        //当前页数
        pagenum: 1,
        //每页显示多少条
        pagesize: 20,
      },
      //保存商品列表
      goodslist: [],
      total:0,
      //控制修改用户对话框显示隐藏
      editDialogVisible: false,
      //查询用户表单信息对象
      editForm: {},
      // 编辑用户需要的id
      showEd:0,
      //修改表单的验证规则对象
      editFormRules: {
        goods_name: [
          //trigger: "blur"失去焦点
          { required: true, message: "商品名称", trigger: "blur" },
          {
            min: 1,
            max: 60,
            message: "商品名称的长度在1~60个字符之间",
            trigger: "blur",
          },
        ],
       goods_price: [
          { required: true, message: "请输入正确的价格", trigger: "blur" },
          { validator: checkMobile },
        ],
         goods_number:[
          { required: true, message: "请输入正确的商品数量", trigger: "blur" },
          { validator: numbers},
       ],
        goods_weight:[
          { required: true, message: "请输入正确的商品重量", trigger: "blur" },
          { validator: numbers},
       ],
      },
    }
  },
  created(){
    this.getGoodsList()
  },
  methods: {
    // 获取分页对应的商品列表
    async getGoodsList() {
      //users接口 this.queryInfo参数 params别名
      const { data: res } = await this.$http.get("goods", {
        params: this.queryInfo,
      });
      console.log(res);
      if (res.meta.status !== 200) {
        return this.$message.error("获取商品列表失败");
      }
      // //保存商品 列表
      this.goodslist = res.data.goods;
      console.log(this.goodslist);
      // //保存总数据条数
      this.total = res.data.total;
      console.log(this.total);
    },
    //监听pagesize改变的事件
    handleSizeChange(newSize) {
      // console.log(11111,newSize);
      this.queryInfo.pagesize = newSize;
      this.getGoodsList()
    },
    //监听页码值改变的事件
    handleCurrentChange(newPage) {
      //  console.log(newPage);
      this.queryInfo.pagenum = newPage;
      this.getGoodsList()
    },
    //根据id删除对应的用户信息
    async removergoodsById (id) {
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
      const { data: res } = await this.$http.delete("goods/" + id);
      if (res.meta.status != 200) {
        //响应错误提示
        return this.$message.error("删除商品失败");
      }
      //成功弹出
      this.$message.success("删除商品成功");
      //重新获取用户列表
      this.getGoodsList()
    },
    // 展示编辑用户的对话框
    async showEditDialog(id) {
      // 根据 ID 查询用户信息
      const { data: res } = await this.$http.get("goods/" + id);
      console.log(res);
      //用if进行判断 用户请求成功还是失败
      if (res.meta.status != 200) {
        //失败提示
        return this.$message.error("查询用户失败");
      }
      this.editForm = res.data;
      console.log(this.editForm,'大幅度发');
      this.editDialogVisible = true;
      this.showEd=id,
      console.log(this.showEd);
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
          "goods/"+this.editForm.goods_id,
          {
            goods_name: this.editForm.goods_name,
            goods_price: this.editForm.goods_price,
            goods_weight: this.editForm.goods_weight,
            goods_number: this.editForm.goods_number,
            goods_cat: this.editForm. goods_cat,
          }
        );
        console.log(res);
        //先判断响应成功没有
        if (res.meta.status !== 200) {
          return this.$message.error("更新用户信息失败");
        }
        //响应成功之后
        //关闭对话框 刷新数据表 提示修改成功
        this.editDialogVisible = false;
        //重新获取用户列表
      this.getGoodsList()
        this.$message.success("更新用户信息成功");
      });
    },
    goAddpage(){
      this.$router.push('/goods/add')
    }
  },
};
</script>

<style lang="scss" scoped>
</style>