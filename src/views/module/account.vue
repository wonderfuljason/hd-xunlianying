<template>
    <div>
      <!-- 表格操作 -->
      <div class="customer-action-bar">
        <h-button type="primary" @click="addCustomer">开户</h-button>
      </div>
      <!-- 表格 -->
      <h-table
        :loading="customerLoading"
        :columns="customerColumns"
        :data="customerList"
      ></h-table>
      <!-- 分页 -->
      <div v-show="pagination.total > 0" class="pagination-wrap">
        <h-page v-bind="pagination" @on-change="changePagination"></h-page>
      </div>
      <!-- 弹框-开户 -->
      <h-msg-box
        v-model="customerMsgBoxVisible"
        footerHide
        :escClose="true"
        title="开户"
        :beforeEscClose="customerMsgBoxBeforeEscClose"
        @on-close="customerMsgBoxClose"
      >
        <h-form
          ref="customerForm"
          :model="customerFormData"
          :rules="customerRuleValidate"
          :label-width="80"
        >
          <h-form-item label="客户姓名" prop="customerName" required>
            <h-input
              v-model="customerFormData.customerName"
              placeholder="请输入客户姓名"
            />
          </h-form-item>
          <h-form-item label="客户类型" prop="customerType" required>
            <h-select
              v-model="customerFormData.customerType"
              placeholder="请选择客户类型"
            >
              <h-option
                v-for="(type, key) in customerTypeOrm"
                :key="key"
                :value="key"
              >
                {{ type }}
              </h-option>
            </h-select>
          </h-form-item>
          <h-form-item label="手机号" prop="customerPhone" required>
            <h-input
              v-model="customerFormData.customerPhone"
              placeholder="请输入客户手机号"
            />
          </h-form-item>
          <h-form-item label="身份证号" prop="customerIdCard" required>
            <h-input
              v-model="customerFormData.customerIdCard"
              placeholder="请输入客户身份证号"
            />
          </h-form-item>
          <h-form-item label="银行卡号" prop="bankCardNumber" required>
            <h-input
              v-model="customerFormData.bankCardNumber"
              placeholder="请输入银行卡号"
            />
          </h-form-item>
          <h-form-item style="text-align: right">
            <h-button type="ghost" @click="customerFormCancel">取消</h-button>
            <h-button type="ghost" @click="customerFormReset">重置</h-button>
            <h-button type="primary" @click="customerFormOk">提交</h-button>
          </h-form-item>
        </h-form>
      </h-msg-box>
    </div>
</template>
  
<script>
  import core from "@hsui/core";
  import { CUSTOMER_TYPE_ORM } from "../../constant";
  
  export default {
    data() {
      this.timer = null;
      this.customerTypeOrm = CUSTOMER_TYPE_ORM;
      const that = this;
      return {
        customerLoading: true, // 表格加载状态
        customerMsgBoxVisible: false, // 弹框可见状态
        customerColumns: [
          // 表格列配置
          {
            title: "客户编号",
            key: "customerId",
            width: 150,
          },
          {
            title: "客户手机号",
            key: "customerPhone",
            width: 150,
          },
          {
            title: "客户姓名",
            key: "customerName",
            width: 150,
          },
          {
            title: "客户类型",
            key: "customerType",
            width: 150,
          },
          {
            title: "操作",
            key: "actions",
            width: 150,
            render(h, { row }) {
              return h("div", [
                h(
                  "a",
                  {
                    on: {
                      click: () => that.editCustomer(row),
                    },
                  },
                  "编辑"
                ),
                h(
                  "a",
                  {
                    on: {
                      click: () => that.deleteCustomer(row),
                    },
                  },
                  "删除"
                ),
              ]);
            },
          },
        ],
        customerList: [], // 客户信息列表
        pagination: {
          // 分页配置
          current: 1,
          pageSize: 10,
          total: 0,
        },
        customerFormData: {
          // 开户表单数据
          customerName: "",
          customerType: "",
          customerPhone: "",
          customerIdCard: "",
          bankCardNumber: "",
        },
        customerRuleValidate: {
          // 开户表单验证规则
          customerName: [
            { required: true, message: "请输入客户姓名", trigger: "blur" },
          ],
          customerType: [
            { required: true, message: "请选择客户类型", trigger: "change" },
          ],
          customerPhone: [
            {
              required: true,
              pattern: /^1[3456789]\d{9}$/,
              message: "请输入正确的手机号码",
              trigger: "blur",
            },
          ],
          customerIdCard: [
            {
              required: true,
              pattern: /^(\d{18}|\d{17}X)$/,
              message: "请输入正确的身份证号码",
              trigger: "blur",
            },
          ],
          bankCardNumber: [
            {
              required: true,
              pattern: /^(\d{16}|\d{19})$/,
              message: "请输入正确的银行卡号",
              trigger: "blur",
            },
          ],
        },
      };
    },
    created() {
      // 获取客户信息列表
      this.getCustomerList();
    },
    methods: {
      getCustomerList() {
        // 模拟接口请求，获取客户信息列表
        this.customerLoading = true;
        const params = {
          // 根据分页配置发送请求
          page: this.pagination.current,
          size: this.pagination.pageSize,
        };
        // 发送请求获取数据
        core
          .get("/api/customer", params)
          .then((res) => {
            // 更新客户信息列表和分页配置
            this.customerList = res.data.list;
            this.pagination.total = res.data.total;
          })
          .finally(() => {
            this.customerLoading = false;
          });
      },
      changePagination(page) {
        // 分页改变时触发
        this.pagination.current = page;
        this.getCustomerList();
      },
      addCustomer() {
        // 打开开户弹框
        this.customerMsgBoxVisible = true;
      },
      editCustomer(row) {
        // 编辑客户信息
        // TODO: 编辑客户信息的逻辑
      },
      deleteCustomer(row) {
        // 删除客户信息
        // TODO: 删除客户信息的逻辑
      },
      customerMsgBoxBeforeEscClose() {
        // 开户弹框按下 Esc 键时的回调
        return !this.customerLoading;
      },
      customerMsgBoxClose() {
        // 关闭开户弹框时的回调
        this.$refs.customerForm.resetFields();
      },
      customerFormCancel() {
        // 取消开户表单
        this.customerMsgBoxVisible = false;
      },
      customerFormReset() {
        // 重置开户表单
        this.$refs.customerForm.resetFields();
      },
      customerFormOk() {
        // 提交开户表单
        this.$refs.customerForm.validate((valid) => {
          if (valid) {
            // 表单验证通过，发送请求进行提交
            // TODO: 提交开户表单的逻辑
            this.customerMsgBoxVisible = false;
          } else {
            // 表单验证失败，不做处理
          }
        });
      },
    },
  };
</script>
  
<style scoped>
  .customer-action-bar {
    margin-bottom: 16px;
    text-align: right;
  }
  
  .pagination-wrap {
    margin-top: 16px;
  }
</style>
  