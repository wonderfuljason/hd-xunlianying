<template>
  <div>
    <!--模糊搜索fundId fundName-->
    <div class="search-idname" >
      <h-row>
        <h-col span="2">
          <h-affix>
            <span class="search1-affix">搜索一支基金</span>
          </h-affix>
        </h-col>
        <h-col span="2" style="margin-left: 70px;">
          <h-tag type="dot" color="blue">基金代码</h-tag>
        </h-col>
        <h-col span="6" style="margin-left: 0px;margin-top: 4.5px;">
          <h-select v-model="searchObject.fundId" 
            filterable
            remote
            remoteIcon="search"
            :remote-method="searchFundId"
            :loading="fundIdLoading"
            style="color: #037df3;"
          >
            <h-option
              @on-keyup="fundIdKeyup"
              v-for="option in fundIdOptions"
              :value="option.fundId"
              :key="option.fundId"
            >
              {{ option.fundId }}
            </h-option>
          </h-select>
        </h-col>
        <h-col span="2" style="margin-left: 30px;">
          <h-tag type="dot" color="blue">基金名称</h-tag>
        </h-col>
        <h-col span="6" style="margin-left: -1px;margin-top: 4.5px;">
          <h-select v-model="searchObject.fundName" style="color: #037df3;" 
            filterable
            remote
            remoteIcon="search"
            :remote-method="searchFundName"
            :loading="fundNameLoading"
          >
            <h-option
              @on-keyup="fundNameKeyup"
              v-for="option in fundNameOptions"
              :value="option.fundId"
              :key="option.fundId"
            >
              {{ option.fundName }}
            </h-option>
          </h-select>
        </h-col>
      </h-row>
    </div>
    <!--条件搜索-->
    <div class="search-fund">
      <h-row>
        <h-col span="2">
          <h-affix>
            <span class="search2-affix">搜索多支基金</span>
          </h-affix>
        </h-col>
        <h-col span="2" style="margin-left: 70px;">
          <h-tag type="dot" style="color: #d9ebfd;">基金类型</h-tag>
        </h-col>
        <h-col span="2" style="margin-left: 0px;margin-top: 4.5px;">
          <h-select v-model="searchObject.fundType" style="color: #037df3;">
            <h-option
              v-for="item in typeList"
              :value="item"
              :key="item"
            >{{ item }}</h-option>
          </h-select>
        </h-col>
        <h-col span="2">
          <h-tag type="dot" style="color: #d9ebfd;">基金状态</h-tag>
        </h-col>
        <h-col span="2" style="margin-left: 0px;margin-top: 4.5px;">
          <h-select v-model="searchObject.fundStatus" style="color: #037df3;">
            <h-option
              v-for="item in statusList"
              :value="item"
              :key="item"
            >{{ item }}</h-option>
          </h-select>
        </h-col>
        <h-col span="2" style="margin-left: 30px;">
          <h-tag type="dot" style="color: #d9ebfd;">风险等级</h-tag>
        </h-col>
        <h-col span="2" style="margin-left: 0px;margin-top: 4.5px;">
          <h-select v-model="searchObject.riskLevel" style="color: #037df3;">
            <h-option
              v-for="item in riskLevelList"
              :value="item"
              :key="item"
            >{{ item }}</h-option>
          </h-select>
        </h-col>
        <h-col span="2">
          <h-tag type="dot" style="color: #d9ebfd;">基金经理</h-tag>
        </h-col>
        <h-col span="2" style="margin-left: 0px;margin-top: 4.5px;">
          <h-input
          style="color: #037df3;"
          v-model="searchObject.fundManager"
          placeholder="请输入..."
        ></h-input>
        </h-col>
        <h-col span="2" style="margin-left: 10px;margin-top: 4.5px;">
          <h-button type="primary" shape="circle" style="width:100px" @on-click="search">搜索基金</h-button>
        </h-col>
      </h-row>
    </div>
    <!-- 表格操作 -->
    <div class="product-action-bar">
      <h-button type="primary" @click="addProduct">新增</h-button>
    </div>
    <!-- 表格 -->
    <h-table
      stripe
      height="450"
      headAlgin="center"
      bodyAlgin="center"
      :loading="productLoading"
      :columns="productColumns"
      :data="productList"
    ></h-table>
    <!-- 分页 -->
    <div v-show="pagination.total > 0" class="pagination-wrap">
      <h-page show-total show-sizer  v-bind="pagination" @on-change="changePagination" @on-page-size-change="changePagination2"></h-page>
    </div>
    <!-- 弹框-产品新增 -->
    <h-msg-box
      v-model="productMsgBoxVisible"
      footerHide
      :escClose="true"
      :title="
        productFormMsgBoxData.fundId
          ? `编辑${productFormMsgBoxData.fundName}`
          : '新增'
      "
      :beforeEscClose="productMsgBoxBeforeEscClose"
      @on-close="productMsgBoxClose"
    >
      <h-form
        ref="productForm"
        :model="productFormData"
        :rules="productRuleValidate"
        :label-width="100"
      >
        <h-form-item label="基金名称" prop="fundName" required>
          <h-input
            v-model="productFormData.fundName"
            placeholder="请输入基金名称"
          />
        </h-form-item>
        <h-form-item label="基金类型" prop="fundType" required >
          <h-input
            v-model="productFormData.fundType"
            placeholder="请输入基金类型"
          />
        </h-form-item>
        <h-form-item label="最小投资金额" prop="minInvestment" required >
          <h-input
            v-model="productFormData.minInvestment"
            placeholder="请输入最小投资金额"
          />
        </h-form-item>
        <h-form-item label="基金经理" prop="fundManager" required>
          <h-input
            v-model="productFormData.fundManager"
            placeholder="请输入基金经理"
          />
        </h-form-item>
        <h-form-item label="风险等级" prop="riskLevel" required>
          <h-input
            v-model="productFormData.riskLevel"
            placeholder="请输入风险等级"
          />
        </h-form-item>
        <h-form-item label="基金状态" prop="fundStatus" required>
          <h-input
            v-model="productFormData.fundStatus"
            placeholder="请输入基金状态"
          />
        </h-form-item>
        <h-form-item label="当前净值" prop="currentNav" required>
          <h-input
            :readonly="productFormMsgBoxData.fundId
              ? true : false"
            v-model="productFormData.currentNav"
            placeholder="请输入当前净值"
          />
        </h-form-item>
        <h-form-item label="当前份额" prop="shares" required>
          <h-input
            :readonly="productFormMsgBoxData.fundId
              ? true : false"
            v-model="productFormData.shares"
            placeholder="请输入当前份额"
          />
        </h-form-item>
        <h-form-item style="text-align: right">
          <h-button type="ghost" @click="productFormCancel"> 取消 </h-button>
          <h-button type="ghost" @click="productFormReset"> 重置 </h-button>
          <h-button type="primary" @click="productFormOk"> 提交 </h-button>
        </h-form-item>
      </h-form>
    </h-msg-box>
  </div>
</template>

<script >
import core from "@hsui/core";
import { PRODUCT_TYPE_ORM, PRODUCT_STATUS_ORM } from "../../constant";
import { get } from "http";

export default {
  data() {
    this.timer = null;
    this.productTypeOrm = PRODUCT_TYPE_ORM;
    this.productStatusOrm = PRODUCT_STATUS_ORM;
    const router = this.$router;
    const that = this;
    return {
      productLoading: true,                //表格加载状态
      productMsgBoxVisible: false,         //弹框可见状态
      productFormMsgBoxData: {},            //弹框中表单数据对象
      productFormData: {},                  //表单数据对象
      productRuleValidate: {                //表单验证规则对象
        productName: [
          {
            required: true,
            message: "产品名称不能为空",
            trigger: "blur",
          },
        ],
        productStatus: [
          {
            required: true,
            message: "请选择产品状态",
            trigger: "change",
          },
        ],
        productType: [
          {
            required: true,
            message: "请选择产品类型",
            trigger: "change",
          },
        ],
      },
      productColumns: [
        {
          title: "序号",
          type:"index"
        },
        {
          title: "基金代码",
          key: "fundId",
          render: (h, { row: { fundId } }) => h("span", {}, fundId),
        },
        {
          title: "基金名称",
          key: "fundName",
          render: (h, { row: { fundName } }) => h("span", {}, fundName)
        },
        {
          title: "基金类型",
          key: "fundType",
          render: (h, { row: { fundType } }) => h("span", {}, fundType)
        },
        {
          title: "风险等级",
          key: "riskLevel",
          render: (h, { row: { riskLevel } }) => h("span", {}, riskLevel)
        },
        {
          title: "基金状态",
          key: "fundStatus",
          render: (h, { row: { fundStatus } }) => h("span", {}, fundStatus)
        },
        {
          title: "基金经理",
          key: "fundManager",
          render: (h, { row: { fundManager } }) => h("span", {}, fundManager)
        },
        // {
        //   title: "证件大类",
        //   key: "productCategory",
        // },
        {
          title: "操作",
          key: "action",
          width: 200,
          render(h, { row, row: { fundId, fundName } = {} }) {
            return h("div", [
              /*h(
                "h-poptip",
                {
                  props: {
                    title: `确认删除${fundName}?`,
                    confirm: true,
                    width: 200,
                    transfer: true,
                  },
                  on: {
                    "on-ok": () => {
                      that.delProduct(fundId, fundName);
                    },
                    "on-cancel": () => {
                      that.$hMessage.info({
                        content: `取消删除${fundName}`,
                        durtion: 3,
                        closable: true,
                      });
                    },
                  },
                },
                [
                  h(
                    "Button",
                    {
                      props: { type: "text", size: "small" },
                    },
                    "删除"
                  ),
                ]
              ),*/
              h(
                "Button",
                {
                  props: { type: "text", size: "small" },
                  on: {
                    click() {
                      that.productMsgBoxVisible = true;
                      that.productFormMsgBoxData = { ...row };
                      that.productFormData = { ...row };
                    },
                  },
                },
                "编辑"
              ),
              h(
                "Button",
                {
                  props: { type: "text", size: "small" },
                  on: {
                    click() {
                      router.push({
                        path: `/module/id`,
                        query: {
                          fundId: fundId
                        }
                      }).catch(err => err);
                    },
                  },
                },
                "查看"
              ),
            ]);
          },
        },
      ],
      productList: [],
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0,
      },
      fundIdLoading: false,
      fundNameLoading: false,
      fundIdOptions: [],
      fundNameOptions: [],
      searchObject:{
        fundId: null,
        fundName: null,
        fundType: null,
        fundManager: null,
        riskLevel: null,
        fundStatus: null
      },
      typeList: [
        "混合",
        "股票",
        "债券",
        "基金",
      ],
      riskLevelList: [
        "低",
        "中",
        "高",
      ],
      statusList: [
        "开放",
        "暂停"
      ],
    };
  },



  created() {
    // 获取产品列表;
    this.getProductList();
  },
  methods: {
    fundIdKeyup(value){
      core 
        .fetch({
          headers: {
            'authorization': localStorage.getItem('token')
          },
          method: "get",
          url: "/api4/fund/" + value,
          
        })
        .then((res) => {
          const { success, data } = res;
          if(success === true){
            console.log("获取基金:")
            console.log(data)
            this.productList = [];
            this.productList.push(data)
            this.searchObject.fundName = null;
          }
        })
    },
    fundNameKeyup(value){
      core 
        .fetch({
          headers: {
            'authorization': localStorage.getItem('token')
          },
          method: "get",
          url: "/api4/fund/" + value,
          
        })
        .then((res) => {
          const { success, data } = res;
          if(success === true){
            console.log("获取基金:")
            console.log(data)
            this.productList = [];
            this.productList.push(data)
            this.searchObject.fundId = null;
          }
        })
    },
    searchFundId(query){
      if(query !== null && query !== ""){
        this.fundIdLoading = true;
        setTimeout(() => {
          this.fundIdLoading = false;
          core 
            .fetch({
              headers: {
            'authorization': localStorage.getItem('token')
          },
              method: "get",
              url: "/api4/fund/fuzzySearch",
              data:{
                page: 1,
                limit: 100,
                fundId: query
              }
            })
            .then((res) => {
              const { success, data } = res;
              if(success === true){
                console.log("fundId模糊搜索:")
                console.log(data)
                this.fundIdOptions = data;
              }
            })
        }, 200);
      }else {
        this.fundIdOptions = [];
      }
    },
    searchFundName(query){
      if(query !== null && query !== ""){
        this.fundNameLoading = true;
        setTimeout(() => {
          this.fundNameLoading = false;
          core 
            .fetch({
              headers: {
            'authorization': localStorage.getItem('token')
          },
              method: "get",
              url: "/api4/fund/fuzzySearch",
              data:{
                page: 1,
                limit: 100,
                fundName: query
              }
            })
            .then((res) => {
              const { success, data } = res;
              if(success === true){
                console.log("fundName模糊搜索:")
                console.log(data)
                this.fundNameOptions = data;
              }
            })
        }, 200);
      }else {
        this.fundNameOptions = [];
      }
    },
    getSearchUrl(fundType, fundManager, riskLevel, fundStatus){
      let searchurl = "";
      if(fundType!==null && fundType!== ""){
        searchurl += "?fundType=" + fundType;
      }
      if(fundManager!==null && fundManager!==""){
        if(searchurl==""){
          searchurl += "?"
        }else{
          searchurl +="&"
        }
        searchurl += "fundManager=" + fundManager;
      }
      if(riskLevel!==null && riskLevel!==""){
        if(searchurl==""){
          searchurl += "?"
        }else{
          searchurl +="&"
        }
        searchurl += "riskLevel=" + riskLevel;
      }
      if(fundStatus!==null && fundStatus!==""){
        if(searchurl==""){
          searchurl += "?"
        }else{
          searchurl +="&"
        }
        searchurl += "fundStatus=" + fundStatus;
      }
      console.log(searchurl)
      return searchurl;
    },
    search(){
      const pageSize = this.pagination.pageSize;
      const fundType = this.searchObject.fundType;
      const fundManager = this.searchObject.fundManager;
      const riskLevel = this.searchObject.riskLevel;
      const fundStatus = this.searchObject.fundStatus;
      const searchurl = this.getSearchUrl(fundType, fundManager, riskLevel, fundStatus);
      core
        .fetch({
          headers: {
            'authorization': localStorage.getItem('token')
          },
          method: "get",
          url: "api4/fund/total" + searchurl,
        })
        .then((res) => {
          const {success, data} = res;
          if(success === true){
            this.pagination.total = data
          }
        });
      core
        .fetch({
          headers: {
            'authorization': localStorage.getItem('token')
          },
          method: "get",
          url: "/api4/fund/pageQuery" + searchurl,
          data: {
            page: this.pagination.current,
            limit: pageSize,
          }
        })
        .then((res) => {
          const { success, data } = res;
          if (success === true) {
            this.productLoading = false;
            this.productList = data;
            console.log(res)
          }else{
            this.productList = []
          }
        })
    },
    addProduct() {
      this.timer = null;
      this.productMsgBoxVisible = true;
    },
    delProduct(fundId, fundName) {
      core
        .fetch({
          headers: {
            'authorization': localStorage.getItem('token')
          },
          method: "post",
          url: "/api/product/del",
          data: {
            fundId,
          },
        })
        .then((res) => {
          if (res.code === 1) {
            this.$hMessage.success(`删除${fundName}成功！`);
            this.getProductList();
          }
        })
        .catch(() => {
          this.$hMessage.error({
            content: `删除${productName}失败`,
            durtion: 3,
            closable: true,
          });
        });
    },
    getProductList() {
      const pageSize = this.pagination.pageSize;
      core
        .fetch({
          headers: {
            'authorization': localStorage.getItem('token')
          },
          method: "get",
          url: "api4/fund/total",
        })
        .then((res) => {
          const {success, data} = res;
          if(success === true){
            this.pagination.total = data
          }
        });
      console.log("pageSize:" + pageSize)
      core
        .fetch({
          headers: {
            'authorization': localStorage.getItem('token')
          },
          method: "get",
          url: "/api4/fund/pageQuery",
          data: {
            page: this.pagination.current,
            limit: pageSize,
          },
        })
        .then((res) => {
          const { success, data } = res;
          if (success === true) {
            this.productLoading = false;
            this.productList = data;
            console.log(res)
          }else{
            this.productList = []
          }
        });
    },
    createProduct() {
      core
        .fetch({
          headers: {
            'authorization': localStorage.getItem('token')
          },
          method: "post",
          url: "/api4/fund",
          data: { ...this.productFormData },
        })
        .then((res) => {
          if (res.success) {
            this.getProductList();
            this.resetProductFormMsgBoxData();
            this.resetProductFormData();
          }
        });
    },
    updateProduct() {
      this.$axios({
          headers: {
            'authorization': localStorage.getItem('token')
          },
          method: "put",
          url: "/api4/fund",
          data: { ...this.productFormData },
        })
        .then((res) => {
          if (res.data.success) {
            console.log("基金更新成功")
            this.getProductList();
            this.resetProductFormMsgBoxData();
            this.resetProductFormData();
          }
        });
    },
    productFormOk() {
      this.$refs["productForm"].validate((valid) => {
        if (valid) {
          if (this.productFormData.fundId) {
            this.updateProduct();
          } else {
            this.createProduct();
          }
        } else {
          this.$Message.error("表单验证失败!");
          return;
        }
      });
    },
    productFormCancel() {
      this.resetProductFormMsgBoxData();
      this.resetProductFormData();
    },
    productFormReset() {
      this.resetProductFormData();
    },
    productMsgBoxBeforeEscClose() {
      this.resetProductFormMsgBoxData();
      this.resetProductFormData();
      return ture;
    },
    productMsgBoxClose() {
      this.resetProductFormMsgBoxData();
      this.resetProductFormData();
    },
    resetProductFormMsgBoxData() {
      this.productMsgBoxVisible = false;
      this.productFormMsgBoxData = {};
    },
    resetProductFormData() {
      this.productFormData = {};
      this.timer = setTimeout(() => {
        this.$refs["productForm"].resetValidate();
      }, 0);
    },
    changePagination(page) {
      const pageSize = this.pagination.pageSize;
      const fundType = this.searchObject.fundType;
      const fundManager = this.searchObject.fundManager;
      const riskLevel = this.searchObject.riskLevel;
      const fundStatus = this.searchObject.fundStatus;
      const searchurl = this.getSearchUrl(fundType, fundManager, riskLevel, fundStatus);
      core
        .fetch({
          headers: {
            'authorization': localStorage.getItem('token')
          },
          method: "get",
          url: "/api4/fund/pageQuery" + searchurl,
          data: {
            page: page,
            limit: pageSize,
          },
        })
        .then((res) => {
          const { success, data } = res;
          if (success === true) {
            this.productLoading = false;
            this.productList = data;
            this.pagination.current = page;
          }else{
            this.productList = []
          }
        });
    },
    changePagination2(pageSize) {
      this.pagination.pageSize = pageSize;
      this.pagination.current = 1;
      const fundType = this.searchObject.fundType;
      const fundManager = this.searchObject.fundManager;
      const riskLevel = this.searchObject.riskLevel;
      const fundStatus = this.searchObject.fundStatus;
      const searchurl = this.getSearchUrl(fundType, fundManager, riskLevel, fundStatus);
      core
        .fetch({
          headers: {
            'authorization': localStorage.getItem('token')
          },
          method: "get",
          url: "/api4/fund/pageQuery" + searchurl,
          data: {
            page: this.pagination.current,
            limit: pageSize,
          },
        })
        .then((res) => {
          const { success, data } = res;
          if (success === true) {
            this.productLoading = false;
            this.productList = data;
          }else{
            this.productList = []
          }
        });
    },
  },
  beforeDestroy() {
    this.timer = null;
  },
};
</script>

<style lang="less" scoped>
.product-action-bar {
  margin-bottom: 12px;
}

.pagination-wrap {
  margin-top: 12px;
  text-align: right;
}

.search-idname .search1-affix{
  margin-top: 5px;
  margin-left: 0px;
  width: 150px;
  display: inline-block;
  font-size: larger;
  color: #595959;
  padding: 5px 30px;
  text-align: center;
  background: rgba(#43a7fd);
}
.search-fund .search2-affix{
  margin-top: 5px;
  margin-left: 0px;
  width: 150px;
  display: inline-block;
  font-size: larger;
  color: #6e6e6e;
  padding: 5px 30px;
  text-align: center;
  background: rgba(#d9ebfd);
}
</style>
