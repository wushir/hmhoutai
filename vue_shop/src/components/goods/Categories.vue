<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 添加分类按钮 -->
      <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
      <!-- 表格 -->
      <!-- :data 接收表格数据源  columns 表格各列的配置 selection-type选择框
        expand-type 前面展开箭头 show-index是否显示数据编号 index-text 数据编号名称
        border是否显示纵向边框 show-row-hover鼠标悬停时，是否高亮当前行-->
      <tree-table
        class="treeTable"
        :data="catelist"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        :show-index="true"
        index-text="id"
        border
        :show-row-hover="false"
      >
        <template slot="isok" slot-scope="scope">
          <!-- 判断删除没有scope.row.cat_deleted==false -->
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted == false"
            style="color: lightgreen"
          ></i>
          <i class="el-icon-error" style="color: red" v-else></i>
        </template>
        <template slot="order" slot-scope="scope">
          <!-- 判断删除没有scope.row.cat_deleted==false -->
          <el-tag v-if="scope.row.cat_level == 0" size="mini">一级</el-tag>
          <el-tag v-if="scope.row.cat_level == 1" size="mini" type="success"
            >二级</el-tag
          >
          <el-tag v-if="scope.row.cat_level == 2" size="mini" type="warning"
            >三级</el-tag
          >
        </template>
        <template slot="opt" slot-scope="scope">
          <!-- 判断删除没有scope.row.cat_deleted==false -->
          <!-- 编辑按钮 -->
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
             @click="showEditDialog(scope.row,scope.row.cat_id)"
            >编辑
          </el-button>
          <!-- 删除按钮 -->
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="removeRolesById(scope.row,scope.row.cat_id)"
            >删除</el-button
          >
        </template>
      </tree-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="querInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="querInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
      <!-- 添加分类对话框 -->
      <el-dialog
        title="添加分类"
        :visible.sync="addcateDialogVisible"
        width="50%"
      >
        <!-- 添加分类表单 -->
        <el-form
          :model="addcateForm"
          :rules="addcateFormRules"
          ref="addcateFormRef"
          label-width="100px"
        >
          <el-form-item label="分类名称:" prop="cat_name">
            <el-input v-model="addcateForm.cat_name"></el-input>
          </el-form-item>
          <el-form-item label="父级分类">
            <!-- options用来指定数据源 :props指定了配置对象 -->
            <el-cascader
              :options="parentCateList"
              :props="cascaderProps"
              v-model="selectedKeys"
              @change="parentCateChanged"
              clearable 
            >
            </el-cascader>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addcateDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addCate">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 编辑角色对话框 -->
      <el-dialog
        title="提示"
        :visible.sync="editRolesVisible"
        width="50%"
      >
        <el-form
          :model="editRolesForm"
          :rules="addcateFormRules"
          ref="editRolesFormRef"
          label-width="80px"
        >
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="editRolesForm.cat_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editRolesVisible = false">取 消</el-button>
          <el-button type="primary" @click="editRoles">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //查询条件
      querInfo: {
        // 三层分类列表
        type: 3,
        // 当前页码值
        pagenum: 1,
        // 每页显示多少条数据
        pagesize: 5,
      },
      //商品分类数据列表默认为空
      catelist: [],
      //总数据条数
      total: 0,
      //为table指定的定义
      columns: [
        {
          label: "分类名称",
          prop:"cat_name",
        },
        {
          label: "是否有效",
          //定义为自定义模板
          type: "template",
          // 模板名字
          template: "isok",
        },
        {
          label: "排序",
          //定义为自定义模板
          type: "template",
          // 模板名字
          template: "order",
        },
        {
          label: "操作",
          //定义为自定义模板
          type: "template",
          // 模板名字
          template: "opt",
        },
      ],
      // 添加分类对话框显示与隐藏
      addcateDialogVisible: false,
       // 编辑分类对话框显示与隐藏
      editRolesVisible: false,
      //添加分类的表单数据对象
      addcateForm: {
        //分类表单的名字
        cat_name: "",
        //父级分类id
        cat_pid: 0,
        // 分类层级
        cat_level: 0,
      },
      //编辑用户表单数据
      editRolesForm:[],
      //添加分类表单的校验规则
      addcateFormRules: {
        cat_name: [
          //trigger: "blur"失去焦点
          { required: true, message: "请输入添加分类名字", trigger: "blur" },
        ],
      },
      // 父级分类列表
      parentCateList: [],
      //指定配置对象
      cascaderProps: {
        // 指定你选择的值
        value:"cat_id",
        //  指定你看到的值
        label:"cat_name",
        //  指定父子嵌套的属性
        children: "children",
        expandTrigger:'hover'
      },
      //选择的分级分类id数组
      selectedKeys: [],
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    async getCateList() {
      //参数1 接口地址 参数2 请求参数
      const { data: res } = await this.$http.get("categories", {
        params: this.querInfo,
      });
      //   console.log(res);
      if (res.meta.status != 200) {
        //响应错误提示
        return this.$message.error("获取商品分类失败");
      }
      console.log(res.data);
      //把数据赋值给catelist
      this.catelist = res.data.result;
      //   为总数据条数赋值
      this.total = res.data.total;
    },
     // 展示编辑角色的对话框
    async showEditDialog(row,id) {
      // 根据 ID 查询用户信息
      const { data: res } = await this.$http.get("categories/" + id);
      console.log(res);
      // 用if进行判断 用户请求成功还是失败
      if (res.meta.status != 200) {
        // 失败提示
        return this.$message.error("查询用户失败");
      }
      this.editRolesForm = res.data;

      // console.log("1111111111", this.editRolesForm.cat_name);
      this.editRolesVisible = true;
    },
      //修改角色信息确定并且提交
    editRoles() {
      this.$refs.editRolesFormRef.validate(async (valid) => {
        //打印为true,表示格式校验验证通过
        console.log(this.editRolesForm);
        console.log(valid)
        // 不通过直接结束
        if (!valid) return;
        // 通过发起修改用户信息的请求
        const { data: res } = await this.$http.put(
          "categories/" + this.editRolesForm.cat_id,
          {
            cat_name: this.editRolesForm.cat_name,
           
          }
        );
        // 先判断响应成功没有
        console.log(res);
        console.log(res.cat_name);
        if (res.meta.status !== 200) {
          return this.$message.error("更新商品分类失败");
        }
        // 响应成功之后
        // 关闭对话框 刷新数据表 提示修改成功
        this.editRolesVisible = false;
        this.$message.success("更新商品分类成功");
         this.getCateList();
      });
    },
    // 根据id删除对应的角色信息
    async removeRolesById(row,id) {
      console.log(id);
      //弹框提示
      const confirmResult = await this.$confirm(
        "此操作将永久删除该商品分类列表, 是否继续?",
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
      const { data: res } = await this.$http.delete("categories/" + id);
      if (res.meta.status != 200) {
        //响应错误提示
        return this.$message.error("删除该商品分类列表失败");
      }
      //成功弹出
      this.$message.success("删除该商品分类列表成功");
      //重新获取商品分类列表
      this.getCateList();
    },
    //监听pagesize 就是每次显示多少条
    handleSizeChange(newSize) {
      //这个querInfo里面的pagesize
      this.querInfo.pagesize = newSize;
      this.getCateList();
    },
    //监听pagesize,每次触发拿到新的页码值
    handleCurrentChange(newPage) {
      this.querInfo.pagenum = newPage;
      this.getCateList();
    },
    //点击按钮,展现添加分类的对话框
    showAddCateDialog() {
      // 调用获取父级分类列表,在展示对话框
      this.getParenCateList();
      this.addcateDialogVisible = true;
    },
    //获取父级分类的数据列表
    async getParenCateList() {
      //params方法接收参数
      const { data: res } = await this.$http.get("categories", {
        params: { type: 2 },
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取父级分类失败");
      }
      console.log(res.data);
      //保存父级分类列表里面
      this.parentCateList = res.data;
    },
    // 当选项卡组发生变化自动触发
    // 选择项发生变化触发这个函数
    parentCateChanged() {
      console.log(this.selectedKeys);
      // 如果 selectedKeys 数组中的 length 大于0，证明选中的父级分类
      // 反之，就说明没有选中任何父级分类
      if (this.selectedKeys.length > 0) {
        // 父级分类的Id
        this.addcateForm.cat_pid =
          this.selectedKeys[
            //选择最后一个
            this.selectedKeys.length - 1
          ];
        // 为当前分类的等级赋值
        this.addcateForm.cat_level = this.selectedKeys.length;
        return;
      } else {
        // 如果没有添加一级分类数据
        // 父级分类的Id
        this.addcateForm.cat_pid = 0;
        // 为当前分类的等级赋值
        this.addcateForm.cat_level = 0;
      }
    },
    // 点击按钮，添加新的分类
    addCate() {
      this.$refs.addcateFormRef.validate(async valid=> {
        if (!valid) return;
        const { data: res } = await this.$http.post(
          "categories",
          this.addcateForm
        );

        if (res.meta.status !== 201) {
          return this.$message.error("添加分类失败！");
        }

        this.$message.success("添加分类成功！");
        this.getCateList();
        this.addCateDialogVisible = false;
      });
    },
    // 监听对话框的关闭事件，重置表单数据
    addCateDialogClosed() {
      //重置表单
      this.$refs.addcateFormRef.resetFields();
      //选择的数组清空
      this.selectedKeys = [];
      // 选择表单的值清空
      this.addcateForm.cat_level = 0;
      this.addcateForm.cat_pid = 0;
    },
  },
};
</script>

<style lang="less" scoped>
.treeTable {
  margin-top: 15px;
}
// 级联选择器el-cascader，通过点击label文字部分选中
.el-cascader-panel .el-radio {
  width: 100%;
  height: 100%;
  z-index: 10;
  position: absolute;
  top: 10px;
  right: -10px;
}
.el-cascader-panel .el-radio__input {
  visibility: hidden; //隐藏单选框，不隐藏就不用设置
}
.el-cascader-panel .el-cascader-node__postfix {
  top: 10px;
}
</style>