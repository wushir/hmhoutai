<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 头部警告区域 -->
      <el-alert
        title="注意:只允许第3级分类设置相关参数!"
        type="warning" show-icon :closable="false"
      >
      </el-alert>
      <!-- 选择商品分类区域 -->
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类分类:</span>
          <!-- 级联选择框 -->
          <!-- options用来指定数据源 :props指定了配置对象 -->
          <el-cascader
           :options="catelist" :props="cateProps"
            v-model="selectedCateKeys" @change="handleChange">
          </el-cascader>
        </el-col>
      </el-row>
      <!-- tab页签区域 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <!-- 添加动态参数面板 -->
        <el-tab-pane label="动态参数" name="many">
          <!-- 添加按钮 -->
           <el-button type="primary" size="mini" :disabled=" isBtnDisabled"
           @click="addDialogVisible = true"> 添加参数</el-button>
           <!-- 动态参数表格 -->
           <el-table :data='manyTableData' border stripe>
             <!-- 展开列 -->
             <el-table-column type="expand">
               <template slot-scope="scope">
                 <!-- 循环渲染Tag标签 -->
                 <el-tag v-for="(item,index) in scope.row.attr_vals" :key="index"
                  closable @close='handleCleose(index,scope.row)'>
                   {{item}}
                 </el-tag>
                 <!-- 输入框 -->
                 <el-input class="input-new-tag" v-if="scope.row.inputVisible"
                    v-model="scope.row.inputValue" ref="saveTagInput" size="small"
                    @keyup.enter.native="handleInputConfirm(scope.row)"
                   @blur="handleInputConfirm(scope.row)">
                 </el-input>
                 <!-- 添加按钮 -->
                <el-button v-else class="button-new-tag" size="small"
                 @click="showInput(scope.row)">+ New Tag</el-button>
               </template>
             </el-table-column>
             <!-- 索引列 -->
             <el-table-column type="index" label="id"></el-table-column>
             <el-table-column label="参数名称" prop="attr_name"></el-table-column>
             <el-table-column label="操作">
              <template slot-scope="scope">
                <!-- 编辑按钮 -->
                <el-button type="primary" icon="el-icon-edit"
                size="mini" @click="showEditDialog(scope.row.attr_id)">编辑
                </el-button>
                <!-- 删除按钮 -->
                <el-button type="danger" icon="el-icon-delete" 
                size="mini" @click="removeRolesById(scope.row.attr_id)">删除
                </el-button>
              </template>
            </el-table-column>
           </el-table>
          </el-tab-pane>
        <!-- 静态属性 -->
        <el-tab-pane label="静态属性" name="only">
          <!-- 添加按钮 -->
         <el-button type="primary" size="mini" :disabled="isBtnDisabled"
         @click="addDialogVisible = true"> 添加属性</el-button>
         <!-- 静态属性表格 -->
         <el-table :data='onlyTableData' border stripe>
           <!-- 展开列 -->
            <el-table-column type="expand">
               <template slot-scope="scope">
                 <!-- 循环渲染Tag标签 -->
                 <el-tag v-for="(item,index) in scope.row.attr_vals" :key="index"
                  closable @close='handleCleose(index,scope.row)'>
                   {{item}}
                 </el-tag>
                 <!-- 输入框 -->
                 <el-input class="input-new-tag" v-if="scope.row.inputVisible"
                    v-model="scope.row.inputValue" ref="saveTagInput" size="small"
                    @keyup.enter.native="handleInputConfirm(scope.row)"
                   @blur="handleInputConfirm(scope.row)">
                 </el-input>
                 <!-- 添加按钮 -->
                <el-button v-else class="button-new-tag" size="small"
                 @click="showInput(scope.row)">+ New Tag</el-button>
               </template>
            </el-table-column>
           <!-- 索引列 -->
            <el-table-column type="index" label="id"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
               <template slot-scope="scope">
                <!-- 编辑按钮 -->
                <el-button type="primary" icon="el-icon-edit"
                size="mini" @click="showEditDialog(scope.row.attr_id)">编辑
                </el-button>
                <!-- 删除按钮 -->
                <el-button type="danger" icon="el-icon-delete" 
                size="mini" @click="removeRolesById(scope.row.attr_id)">删除
                </el-button>
              </template>
            </el-table-column>
         </el-table>
          </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加参数对话框 -->
    <el-dialog :title="'添加'+titleText" :visible.sync="addDialogVisible"
     width="50%" @close="addDialogClosed">
     <!-- 添加参数表单 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
         <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
         </el-form-item>
      </el-form>
       <span slot="footer" class="dialog-footer">
         <el-button @click="addDialogVisible = false">取 消</el-button>
         <el-button type="primary" @click="addParams">确 定</el-button>
       </span>
   </el-dialog>
   <!-- 修改参数对话框 -->
    <el-dialog :title="'修改'+titleText" :visible.sync="editDialogVisible"
     width="50%" @close="editDialogClosed">
     <!-- 修改参数表单 -->
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
         <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
         </el-form-item>
      </el-form>
       <span slot="footer" class="dialog-footer">
         <el-button @click="editDialogVisible = false">取 消</el-button>
         <el-button type="primary" @click="editParams">确 定</el-button>
       </span>
   </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //商品分类数据列表默认为空
      catelist: [],
      //指定配置对象
      cateProps: {
        // 指定你选择的值
        value: "cat_id",
        //  指定你看到的值
        label: "cat_name",
        //  指定父子嵌套的属性
        children: "children",
        expandTrigger: 'hover'
      },
      //选择的分级分类id数组
      selectedCateKeys: [],
      //tab页签的被选中激活'
      activeName:"many",
      //这是动态参数
      manyTableData:[],
      //这是静态属性的参数
      onlyTableData:[],
      //添加对话框显示与隐藏
      addDialogVisible:false,
      //修改对话框显示与隐藏
      editDialogVisible:false,
      //添加参数是表单数据对象
      addForm:{
        attr_name:''
      },
      //修改表单的数据对象
      editForm:{},
      //添加分类表单的校验规则
      addFormRules: {
        attr_name: [
          //trigger: "blur"失去焦点
          { required: true, message: "请输入添加分类名字", trigger: "blur" },
        ],
      },
      //修改分类表单的校验规则
      editFormRules: {
        attr_name: [
          //trigger: "blur"失去焦点
          { required: true, message: "请输入添加分类名字", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    // 获取所有的商品分类列表
    async getCateList() {
      const { data: res } = await this.$http.get("categories");
      if (res.meta.status !== 200) {
        return this.$message.error("获取商品分类失败！");
      }
      this.catelist = res.data;
      console.log(this.catelist);
    },
    // 级联选择框选中项变化，会触发这个函数
    async handleChange() {
      this.getParamsData()
    },
    // tab页签的处理函数
    handleTabClick(){
      console.log(this.activeName);
      this.getParamsData()
    },
    //获取参数列表数据
    async getParamsData(){
      //选中不是三级分类,清空数组
      if (this.selectedCateKeys.length !== 3) {
        this.selectedCateKeys = [];
         this.manyTableData = []
        this.onlyTableData = []
        return 
      }
      //是三级分类
      console.log(this.selectedCateKeys);
      //根据所选分类的id和当初设置的面板,获取对应的参数
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`,{
        params:{sel:this.activeName}
      })
      // console.log(res);
      //参看获取的状态码是否为200
       if (res.meta.status != 200) {
        //响应错误提示
        return this.$message.error("获取参数列表失败");
      }
      //获取参数成功了
      console.log(res.data);
       res.data.forEach(item => {
         //判断里面是否有数据
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        //要每一行都有自己的 inputVisible和inputValue
        // 控制文本框的显示与隐藏
        item.inputVisible = false
        // 文本框中输入的值
        item.inputValue = ''
        console.log(item.attr_vals);
      })
      //判断是哪个列表请求的参数 让相应列表使用
      //如果获取的是动态参数
      if(this.activeName==='many'){
        this.manyTableData=res.data
      }else{
        this.onlyTableData=res.data
      }
    },
    //监听添加对话框关闭事件重置表单
    addDialogClosed(){
      // resetFields	对整个表单进行重置，
      // 将所有字段值重置为初始值并移除校验结果
      this.$refs.addFormRef.resetFields()
    },
    //监听修改对话框关闭事件,重置表单
    editDialogClosed(){
      // resetFields	对整个表单进行重置，
      // 将所有字段值重置为初始值并移除校验结果
      this.$refs.editFormRef.resetFields()
    },
    // 点击按钮添加参数
    async addParams(){
       this.$refs.addFormRef.validate( async valid=>{
        if(!valid)return
        const { data: res } = await this.$http.post(`categories/${this.cateId}/attributes`,{
          attr_name:this.addForm.attr_name,
          attr_sel:this.activeName
        })
        // 先判断响应成功没有
        if (res.meta.status !== 201) {
          return this.$message.error("添加参数失败");
        }
        // 响应成功之后
        // 关闭对话框 刷新数据表 提示修改成功
        this.addDialogVisible = false;
        this.$message.success("添加参数成功");
        this.getParamsData()
      })
    },
    //点按钮展示修改的对话框
     // 展示修改商品的对话框
    async showEditDialog(id) {
      // 根据 ID 查询用户信息
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes/${id}`,{
        params:{attr_sel:this.activeName}
      });
      console.log(res);
      // 用if进行判断 用户请求成功还是失败
      if (res.meta.status != 200) {
        // 失败提示
        return this.$message.error("查询用户失败");
      }
      this.editForm = res.data;

      // console.log("1111111111", this.editRolesForm.cat_name);
      this.editDialogVisible = true;
    },
    //编辑提交按钮
    editParams(){
      //先拿到表单数据
      this.$refs.editFormRef.validate(async (valid) => {
        //打印为true,表示格式校验验证通过
        console.log(this.editForm);
        console.log(valid)
        // 不通过直接结束
        if (!valid) return;
        // 通过发起修改用户信息的请求
        const { data: res } = await this.$http.put(
          `categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
          {
            attr_name:this.editForm.attr_name,
            attr_sel:this.activeName
           
          }
        );
        // 先判断响应成功没有
        console.log(res);
        console.log(res.cat_name);
        if (res.meta.status !== 200) {
          return this.$message.error("修改商品参数失败");
        }
        // 响应成功之后
        // 关闭对话框 刷新数据表 提示修改成功
        this.editRolesVisible = false;
        this.$message.success("修改商品参数成功");
        this.getParamsData()
      })
    },
    // 根据id删除对应的分类信息
    async removeRolesById(id) {
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
      const { data: res } = await this.$http.delete(`categories/${this.cateId}/attributes/${id}`);
      if (res.meta.status != 200) {
        //响应错误提示
        return this.$message.error("删除该商品分类列表失败");
      }
      //成功弹出
      this.$message.success("删除该商品分类列表成功");
      //重新获取商品分类列表
     this.getParamsData()
    },
    //文本框失去焦点 ,或者按下Enter都会触发
     handleInputConfirm(row){
      //trim去除空格
      if (row.inputValue.trim().length === 0) {
        // 输入框里面的值
        row.inputValue = ''
        //输入框隐藏
        row.inputVisible = false
        return
      }
      // 如果没有return，则证明输入的内容，需要做后续处理
      // 添加到循环数组里面 并且清空里面空格
      row.attr_vals.push(row.inputValue.trim())
      //添加之后 把输入框的值清空
      row.inputValue = ''
      // 输入框隐藏
      row.inputVisible = false
      // // 需要发起请求，保存这次操作到数据库
      //调用函数
      this.saveAttrVals(row)
    },
    //编辑提交到数据库
     async saveAttrVals(row){
       const { data: res } = await  this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`,{
        attr_name:row.attr_name,
        attr_sel:row.attr_sel,
        //数组要拼接回原样字符串
        attr_vals:row.attr_vals.join(' '),
      })
      // console.log(res);
      //先与返回值进行判断
       if (res.meta.status !== 200) {
         //失败
        return this.$message.error('修改参数项失败！')
      }
      //成功
      this.$message.success('修改参数项成功！')
    },
    // 删除对应的参数可选项
    handleCleose(index,row) {
      //删除这个字符串
      row.attr_vals.splice(index, 1)
      //调用编辑提交到数据库的函数
      this.saveAttrVals(row)
    },
    // 点击按钮展现文本框
    showInput(row){
    //这一行文本框出现
    row.inputVisible=true
    // 让文本框自动获得焦点
      // $nextTick 方法的作用，就是当页面上元素被重新渲染之后，才会指定回调函数中的代码
    this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
    }
  },
  computed: {
    //如果按钮需要禁用返回true 否则false
    isBtnDisabled() {
      if (this.selectedCateKeys.length !== 3) {
        return true;
      }else{
        return false
      }
    },
    //当前选中的3级分类的id
    cateId(){
      if (this.selectedCateKeys.length === 3) {
        return this.selectedCateKeys[2]
      }else{
        return null
      }
    },
    //动态计算标题的文本
    titleText(){
      if(this.activeName==='many'){
        return '动态参数'
      }else{
        return '静态属性'
      }
    }
  },
};
</script>

<style lang="less" scoped>
.cat_opt {
  margin-top: 15px;
}
.el-tag{
  margin: 5px;
}
.input-new-tag {
  width: 120px;
}
</style>