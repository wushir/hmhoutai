<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
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
            @clear="getOrdersList"
          >
           <el-button
              slot="append"
              icon="el-icon-search"
              @click="getOrdersList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary">添加订单</el-button
          >
        </el-col>
      </el-row>
      <!-- 表格 -->
      <el-table :data="orderlist" border stripe>
        <el-table-column type="index" label="id"></el-table-column>
        <el-table-column prop="order_number" label="订单编号"></el-table-column>
        <el-table-column prop="order_price" label="订单价格" width="80px"></el-table-column>
        <el-table-column prop="pay_status" label="是否付款" width="140px">
          <template slot-scope="scope">
           <el-tag type="success" v-if="scope.row.pay_status==1">已付款</el-tag>
           <el-tag type="danger" v-if="scope.row.pay_status==0">未付款</el-tag>
          </template>
         </el-table-column>
        <el-table-column prop="is_send" label="是否发货" width="140px"> </el-table-column>
        <el-table-column prop="create_time" label="下单时间" width="160px">
          <template slot-scope="scope">
            {{scope.row.create_time|dateFormat}}
          </template>
         </el-table-column>
        <el-table-column label="操作" width="160px" class="caozuo">
          <template slot-scope="scope">
            <!-- 修改地址按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showBox"
            ></el-button>
            
            <el-button
              type="success"
              icon="el-icon-location-outline"
              size="mini"
             @click="showProgressBox"
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
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 修改地址的对话框  -->
    <el-dialog
      title="修改地址"
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
        <el-form-item label="省市区/县" prop="editress1" label-width="100px">
          <el-cascader :options="cityData" v-model="editForm.editress1"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="editress2"  label-width="100px">
          <el-input v-model="editForm.editress2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary"  > 确 定</el-button>
      </span>
    </el-dialog>
    <!-- 物流进度对话框 -->
    <el-dialog
      title="物流进度"
      :visible.sync="progressVisible"
      width="50%"
      >
      <!-- 时间线 -->
      <el-timeline>
       <el-timeline-item
        v-for="(activity, index) in progressInfo"
        :key="index"
        :timestamp="activity.time">
         {{activity.context}}
      </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import cityData from "./citydata.js";
export default {
  data() {
    return {
      //获取订单列表的参数
      queryInfo: {
        query: "",
        //当前页数
        pagenum: 1,
        //每页显示多少条
        pagesize: 10,
        //搜索输入框里面的值
      },
      //保存订单列表
      orderlist: [],
      //保存总数据条数
      total: 0,
      //修改地址的对话框隐藏
      editDialogVisible: false,
      //修改地址的数据
      editForm: {
        editress1: "",
        editress2: "",
      },
      //修改地址的数据验证规则
      editFormRules: {
        editress1: [
          { required: true, message: "请选择省市区县", trigger: "blur" },
        ],
        editress2: [
          { required: true, message: "请填写详细地址", trigger: "blur" },
        ],
      },
      cityData: cityData,
      //物流信息对话框显示和隐藏
      progressVisible: false,
      progressInfo:''
    };
  },
  created() {
    this.getOrdersList();
  },
  methods: {
    // 获取用户列表
    async getOrdersList() {
      //users接口 this.queryInfo参数 params别名
      const { data: res } = await this.$http.get("orders", {
        params: this.queryInfo,
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取用户列表失败");
      }
      console.log(res.data.goods);
      //保存用户列表
      this.orderlist = res.data.goods;
      //保存总数据条数
      this.total = res.data.total;
      console.log(this.total);
    },
    //监听pagesize改变的事件
    handleSizeChange(newSize) {
      // console.log(11111,newSize);
      this.queryInfo.pagesize = newSize;
      this.getOrdersList();
    },
    //监听页码值改变的事件
    handleCurrentChange(newPage) {
      //  console.log(newPage);
      this.queryInfo.pagenum = newPage;
      this.getOrdersList();
    },
    //展示修改地址的对话框
    showBox() {
      this.editDialogVisible = true;
    },
    //修改对话框的关闭事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },
    async showProgressBox() {
      // 这部分有问题
      // const { data: res } = await this.$http.get('/kuaidi/804909574412544580')
      // if (res.meta.status !== 200) {
      // return this.$http.error('获取物流信息失败')
      // }
      this.progressInfo = [
        {
          time: "2018-05-10 09:39:00",
          ftime: "2018-05-10 09:39:00",
          context: "已签收,感谢使用顺丰,期待再次为您服务",
          location: "",
        },
        {
          time: "2018-05-10 08:23:00",

          ftime: "2018-05-10 08:23:00",

          context:
            "[北京市]北京海淀育新小区营业点派件员 顺丰速运 95338正在为您派件",

          location: "",
        },
        {
          time: "2018-05-10 07:32:00",
          ftime: "2018-05-10 07:32:00",
          context: "快件到达 [北京海淀育新小区营业点]",
          location: "",
        },
        {
          time: "2018-05-10 02:03:00",
          ftime: "2018-05-10 02:03:00",
          context:
            "快件在[北京顺义集散中心]已装车,准备发往 [北京海淀育新小区营业点]",
          location: "",
        },
        {
          time: "2018-05-09 23:05:00",
          ftime: "2018-05-09 23:05:00",
          context: "快件到达 [北京顺义集散中心]",
          location: "",
        },
        {
          time: "2018-05-09 21:21:00",
          ftime: "2018-05-09 21:21:00",
          context: "快件在[北京宝胜营业点]已装车,准备发往 [北京顺义集散中心]",
          location: "",
        },
        {
          time: "2018-05-09 13:07:00",
          ftime: "2018-05-09 13:07:00",
          context: "顺丰速运 已收取快件",
          location: "",
        },
        {
          time: "2018-05-09 12:25:03",
          ftime: "2018-05-09 12:25:03",
          context: "卖家发货",
          location: "",
        },
        {
          time: "2018-05-09 12:22:24",
          ftime: "2018-05-09 12:22:24",
          context: "您的订单将由HLA（北京海淀区清河中街店）门店安排发货。",
          location: "",
        },
        {
          time: "2018-05-08 21:36:04",
          ftime: "2018-05-08 21:36:04",
          context: "商品已经下单",
          location: "",
        },
      ];
      console.log(this.progressInfo);
      this.progressVisible = true;
    },
  },
};
</script>

<style lang="less" scoped>
@import '../../plugins/timeline/timeline.css';
@import '../../plugins/timeline-item/timeline-item.css';
.el-cascader {
  width: 100%;
}
</style>