<template>
  <div>
    <!-- 表格操作 -->
    <div class="product-action-bar">
      <h-button type="primary" @click="addProduct">新增</h-button>
    </div>
    <!-- 表格 -->
    <h-table
      :loading="productLoading"
      :columns="productColumns"
      :data="productList"
    ></h-table>
    <!-- 分页 -->
    <div v-show="pagination.total > 0" class="pagination-wrap">
      <h-page v-bind="pagination" @on-change="changePagination"></h-page>
    </div>
    <!-- 弹框-产品新增/编辑 -->
    <h-msg-box
      v-model="productMsgBoxVisible"
      footerHide
      :escClose="true"
      :title="
        productFormMsgBoxData.id
          ? `编辑${productFormMsgBoxData.productName}`
          : '新增'
      "
      :beforeEscClose="productMsgBoxBeforeEscClose"
      @on-close="productMsgBoxClose"
    >
      <h-form
        ref="productForm"
        :model="productFormData"
        :rules="productRuleValidate"
        :label-width="80"
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
            v-model="productFormData.currentNav"
            placeholder="请输入当前净值"
          />
        </h-form-item>
        <h-form-item label="当前份额" prop="shares" required>
          <h-input
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
              h(
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
              ),
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
                        path: `/module/production/${fundId}`,
                      });
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
        "page-size": 2,
        total: 0,
      },
    };
  },
  created() {
    // 获取产品列表;
    this.getProductList();
  },
  methods: {
    addProduct() {
      this.timer = null;
      this.productMsgBoxVisible = true;
    },
    delProduct(fundId, fundName) {
      core
        .fetch({
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
      const pageSize = 4;
      core
        .fetch({
          method: "get",
          url: "http://yapi.smart-xwork.cn/mock/246049/fund/pageQuery",
          data: {
            page: 1,
            limit: pageSize,
          },
        })
        .then((res) => {
          const { success, data } = res;
          if (success === true) {
            this.productLoading = false;
            this.productList = data;
            this.pagination.total = this.productList.length;
            this.pagination.pageSize=pageSize;
            console.log(res)
          }
        });
    },
    createProduct() {
      core
        .fetch({
          method: "post",
          url: "http://yapi.smart-xwork.cn/mock/246049/fund",
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
      core
        .fetch({
          method: "put",
          url: "http://yapi.smart-xwork.cn/mock/246049/fund",
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
      const pageSize = 4;
      core
        .fetch({
          method: "get",
          url: "http://yapi.smart-xwork.cn/mock/246049/fund/pageQuery",
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
            this.pagination.total = this.productList.length;
            this.pagination.pageSize=pageSize;
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
</style>
