<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加角色按钮区域 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addRolesVisible = true"
            >添加角色</el-button
          >
        </el-col>
      </el-row>
      <!-- 角色列表区域 -->
      <el-table :data="rolelist" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <!-- json数据格式化展示时用过我认为就是可以识别\n\t等转义字符 -->
            <!-- :class="['bdbottom']  每一行都绑定  i1===0 就是第一个位置 加上顶部边框线-->
            <el-row
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
              :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter']"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag
                  closable
                  @close="removeRightById(scope.row, item1.id)"
                  >{{ item1.authName }}</el-tag
                >
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染一级到3级权限 -->
              <el-col :span="19">
                <!-- 通过for渲染二级权限 -->
                <el-row
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                  :class="[i1 === 0 ? '' : 'bdtop', 'vcenter']"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightById(scope.row, item2.id)"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      v-for="(item3, i3) in item2.children"
                      :key="item3.id"
                      closable
                      @close="removeRightById(scope.row, item3.id)"
                    >
                      {{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="id"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <!-- 编辑按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.id)"
              >编辑</el-button
            >
            <!-- 删除按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeRolesById(scope.row.id)"
              >删除</el-button
            >
            <!-- 分配角色 -->
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="showSetRightDialog(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 添加角色角色 -->
      <el-dialog
        title="添加角色"
        :visible.sync="addRolesVisible"
        width="50%"
        @close="addRolesDialogClosed"
      >
        <el-form
          :model="addRolesForm"
          :rules="addRolesFormRules"
          ref="addRolesFormRef"
          label-width="80px"
        >
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="addRolesForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="addRolesForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addRolesVisible = false">取 消</el-button>
          <el-button type="primary" @click="addRoles">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 编辑角色对话框 -->
      <el-dialog
        title="提示"
        :visible.sync="editRolesVisible"
        width="50%"
        @close="editRolesDialogClosed"
      >
        <el-form
          :model="editRolesForm"
          :rules="addRolesFormRules"
          ref="editRolesFormRef"
          label-width="80px"
        >
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="editRolesForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="editRolesForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editRolesVisible = false">取 消</el-button>
          <el-button type="primary" @click="editRoles">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 分配角色权限对话框 -->
      <el-dialog
        title="分配权限"
        :visible.sync="setRightDialogVisible"
        width="50%"
         @close="setRightDialogClosed"
      >
        <!-- 树形控件 -->
        <!-- default-expand-all 是否默认展开所有节点 default-checked-keys	默认勾选的节点的 key 的数组
      show-checkbox勾选框 -->
        <el-tree
          :data="rightslist"
          :props="treeProps"
          show-checkbox
          node-key="id"
          default-expand-all
          :default-checked-keys="defkeys"
          ref="treeRef"
        ></el-tree>
        <span slot="footer" class="dialog-footer">
          <el-button @click="setRightDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="allotRights">确 定</el-button
          >
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //所有角色列表数据
      rolelist: [],
      //所有角色权限数据
      rightslist: [],
      //保存点击分配权限的id
      roleId:'',
      //树形控件的绑定对象
      treeProps: {
        //authName 权限说明
        label: "authName",
        //在那个里面嵌套
        children: "children",
      },
      //树形控件的节点默认勾选的
      defkeys: [],
      //控制添加角色对话框显示隐藏
      addRolesVisible: false,
      //控制编辑角色对话框显示隐藏
      editRolesVisible: false,
      //控制分配角色权限对话框显示隐藏
      setRightDialogVisible: false,
      //添加用户表单数据
      addRolesForm: {
        roleName: "",
        roleDesc: "",
      },
      //创建一个保存编辑的表单数据
      editRolesForm: {},
      //修改表单的验证规则对象
      addRolesFormRules: {
        roleName: [
          //trigger: "blur"失去焦点
          { required: true, message: "请输入角色名", trigger: "blur" },
          {
            min: 2,
            max: 10,
            message: "角色名的长度在2~10个字符之间",
            trigger: "blur",
          },
        ],
        roleDesc: [
          //trigger: "blur"失去焦点
          { required: true, message: "添加角色描述", trigger: "blur" },
          {
            min: 0,
            max: 50,
            message: "角色描述名的长度在0~50个字符之间",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    this.getRolesList();
  },
  methods: {
    //获取所有的角色列表
    async getRolesList() {
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status !== 200) {
        return this.$message.error("获取列表失败");
      }
      this.rolelist = res.data;
      console.log(this.rolelist);
    },
    //根据id删除对应的角色信息
    async removeRolesById(id) {
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
      const { data: res } = await this.$http.delete("roles/" + id);
      if (res.meta.status != 200) {
        //响应错误提示
        return this.$message.error("删除用户失败");
      }
      //成功弹出
      this.$message.success("删除用户成功");
      //重新获取用户列表
      this.getRolesList();
    },
    // 点击按钮添加新用户
    addRoles() {
      this.$refs.addRolesFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.post("roles", this.addRolesForm);
        if (res.data.status !== 201) {
          this.$message.error("添加用户失败");
        }
        this.$message.success("添加用户成功");
        //对话框隐藏
        this.addDialogVisible = false;
        //重新获取用户列表
        this.getRolesList();
      });
    },
    //添加角色对话框关闭事件
    addRolesDialogClosed() {
      //resetFields对整个表单进行重置，将所有字段值重置为初始值并移除校验结果
      this.$refs.addRolesFormRef.resetFields();
    },
    //监听修改角色对话框的关闭事件
    editRolesDialogClosed() {
      // resetFields	对整个表单进行重置，将所有字段值重置为初始值并移除校验结果
      this.$refs.editRolesFormRef.resetFields();
    },
    // 展示编辑角色的对话框
    async showEditDialog(id) {
      this.editRolesVisible = true;
      // 根据 ID 查询用户信息
      const { data: res } = await this.$http.get("roles/" + id);
      //用if进行判断 用户请求成功还是失败
      if (res.meta.status != 200) {
        //失败提示
        return this.$message.error("查询用户失败");
      }
      this.editRolesForm = res.data;
      console.log("1111111111", this.editRolesForm.roleId);
    },
    //修改角色信息并且提交
    editRoles() {
      this.$refs.editRolesFormRef.validate(async (valid) => {
        //打印为true,表示格式校验验证通过
        console.log(this.editRolesForm);
        // console.log(valid)
        // //不通过直接结束
        if (!valid) return;
        //通过发起修改用户信息的请求
        const { data: res } = await this.$http.put(
          "roles/" + this.editRolesForm.roleId,
          {
            roleName: this.editRolesForm.roleName,
            roleDesc: this.editRolesForm.roleDesc,
          }
        );
        //先判断响应成功没有
        console.log(res);
        console.log(res.roleName);
        console.log(res.roleDesc);
        if (res.meta.status !== 200) {
          return this.$message.error("更新用户信息失败");
        }
        //响应成功之后
        //关闭对话框 刷新数据表 提示修改成功
        this.editRolesVisible = false;
        this.getRolesList();
        this.$message.success("更新用户信息成功");
      });
    },
    //根据id删除对应的权限
    //role 角色   id3 权限 ID
    //删除指定的角色的id
    async removeRightById(role, rightId) {
      console.log(role, rightId);
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
      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightId}`
      );
      if (res.meta.status != 200) {
        //响应错误提示
        return this.$message.error("删除用户失败");
      }
      //成功弹出
      this.$message.success("删除用户成功");
      //重新获取用户列表
      //this.getRolesList();不推荐因为他是刷新整个页面
      // this.getRolesList();
      //因为返回的data, 是当前角色下最新的权限数据
      //角色id下数据重新渲染 res.data用户最新数据   role.children 指定用户下的数据
      role.children = res.data;
    },
    //展示分配权限的对话框
    async showSetRightDialog(role) {
      console.log(role);
      //保存当前角色id 以后分配权限好用
      this.roleId=role.id
      //获取所有的权限数据
      //获取用户所有的权限的数据
      //值 list 或 tree , list 列表显示权限, tree 树状显示权限
      const { data: res } = await this.$http.get("rights/tree");
      if (res.meta.status !== 200) {
        //提示
        return this.$message.error("获取列表失败");
      }
      //获取的权限数据 用空数组保存
      this.rightslist = res.data;
      console.log(this.rightslist);
      // 递归获取3级节点的id role当前角色 this.defkeys data申明的空数组
      this.getLeafkeys(role, this.defkeys);
         this.getRolesList();
      //对话框显示
      this.setRightDialogVisible = true;
       //重新获取用户列表

    },
    //用递归的形式,获取角色下面所有的3级权限的id,并保存到defkeys
    //node 节点  arr 数组保存
    getLeafkeys(node, arr) {
      // 判断每个节点是否有children 没有就是最后一个 也就是第3级
      if (!node.children) {
        //arr表示数组 push往后添加 node.id 就是拥有的id
        return arr.push(node.id);
      }
      //如果有children 就一直自己调自己 找到没有children才结束 item节点
      node.children.forEach((item) => {
        return this.getLeafkeys(item, arr);
      });
    },
    //解决点击时候数组里面的值累加 关闭对话框defKeys保存的值清零
    // 监听分配权限对话框的关闭事件 
    setRightDialogClosed() {
      this.defkeys= []
    },
    //点击角色分配权限
    async allotRights(){
      // 获取已经选择的id数组 
      //因为this.$refs.treeRef.getCheckedKeys()是个数组所以用...打开
      // getCheckedKeys 若节点可被选择（即 show-checkbox 为 true），则返回目前被选中的节点的 key 所组成的数组
      //getHalfCheckedNodes 若节点可被选择（即 show-checkbox 为 true），则返回目前半选中的节点所key组成的数组
      const keys=[...this.$refs.treeRef.getCheckedKeys(),...this.$refs.treeRef.getHalfCheckedKeys()]
      console.log(keys);
      //中间用 ,拼接
      const idStr=keys.join(',')
      // console.log(idStr);
      const{data:res}= await this.$http.post(`roles/${this.roleId}/rights`,{rids:idStr})
      if (res.meta.status !== 200) {
        //提示
        return this.$message.error("分配权限失败");
      }
       //提示
      this.$message.success("分配权限成功");
      //刷新列表
       this.getRolesList();
       //对话框隐藏
       this.setRightDialogVisible = false
    }
  },
};
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
}
</style>