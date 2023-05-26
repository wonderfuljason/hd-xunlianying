<template>
  <div>
    <!-- 表格操作 -->
    <div class="customer-action-bar">
      <button class="btn btn-primary" @click="addCustomer">开户</button>
      <div class="search-bar">
        <input v-model="all" type="text" placeholder="查询全部客户" class="search-input" />
        <button class="btn btn-primary" @click="searchCustomer">查询</button>

      </div>
    </div>


    <!--
    <div class="search-bar">
      <input v-model="searchKeywordbyphone" type="text" placeholder="请输入电话" class="search-input" />
      <button class="btn btn-primary" @click="searchCustomerbyphone">查询</button>
      <input v-model="searchKeywordbyname" type="text" placeholder="请输入姓名" class="search-input" />
      <button class="btn btn-primary" @click="searchCustomerbyname">查询</button>
    </div>
    -->

    <div class="search-bar">
      <input v-model="searchKeyword.phone" type="text" placeholder="请输入电话" class="search-input" />
      <input v-model="searchKeyword.name" type="text" placeholder="请输入姓名" class="search-input" />
      <button class="btn btn-primary" @click="searchbywords">查询</button>
    </div>

    <div class="search-hints">
      <span v-for="hint in searchHints" :key="hint">{{ hint + ", " }}</span>
    </div>




    <!-- 表格 -->
    <table class="customer-table">
      <thead>
        <tr>
          <th width="150">客户编号</th>
          <th width="150">客户手机号</th>
          <th width="150">客户姓名</th>
          <th width="150">客户风险等级</th>
          <th width="150">客户类型</th>
          <th width="150">操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="customer in customerList" :key="customer.customerId">
          <td>{{ customer.userId }}</td>
          <td>{{ customer.phone }}</td>
          <td>{{ customer.nickname }}</td>
          <td>{{ customer.riskLevel }}</td>
          <td>{{ customer.type }}</td>
          <td>
            <a href="javascript:;" @click="editCustomer(customer)">编辑</a>
            <a href="javascript:;" @click="deleteCustomer(customer)">删除</a>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- 分页 -->
    <div v-show="pagination.total > 0" class="pagination-wrap">
      <div class="pagination">
        <button class="pagination-btn" :class="{ 'pagination-btn-active': page === pagination.current }"
          v-for="page in pagination.pages" :key="page" @click="changePagination(page)">
          {{ page }}
        </button>
      </div>
    </div>

    <!-- 弹框-开户 -->
    <div v-show="customerMsgBoxVisible" class="customer-msg-box">
      <h2 class="customer-msg-box-title">开户</h2>
      <form @submit.prevent="customerFormOk" class="customer-form">
        <div class="form-item">
          <label for="customerId">客户编号</label>
          <input id="customerId" type="text" v-model="customerFormData.userId" placeholder="请输入客户编号" required />
        </div>
        <div class="form-item">
          <label for="customerName">客户姓名</label>
          <input id="customerName" type="text" v-model="customerFormData.customerName" placeholder="请输入客户姓名" required />
        </div>
        <div class="form-item">
          <label for="customerriskLevel">客户风险等级</label>
          <select id="customerriskLevel" v-model="customerFormData.riskLevel" required>
            <option value="" disabled selected hidden>请选择客户风险等级</option>
            <option value="低">低</option>
            <option value="中">中</option>
            <option value="高">高</option>
          </select>
        </div>
        <div class="form-item">
          <label for="customerPhone">手机号</label>
          <input id="customerPhone" type="text" v-model="customerFormData.customerPhone" placeholder="请输入客户手机号"
            required />
        </div>
        <div class="form-item">
          <label for="customertype">客户类型</label>
          <input id="customertype" type="text" v-model="customerFormData.customerType" placeholder="请输入客户类型" required />
        </div>

        <div class="form-buttons">
          <button class="btn btn-secondary" @click="cancelForm">取消</button>
          <button class="btn btn-primary" type="submit">提交</button>
          <button class="btn btn-secondary" @click="resetForm">重置</button>
        </div>
      </form>
    </div>
    <!-- 弹框-编辑客户 -->
    <div v-show="editCustomerFormVisible" class="customer-msg-box">
      <h2 class="customer-msg-box-title">编辑客户</h2>
      <form @submit.prevent="editCustomerFormOk" class="customer-form">
        <div class="form-item">
          <label for="editCustomerName">客户姓名：</label>
          <input id="editCustomerName" type="text" v-model="customerFormData.customerName" placeholder="请输入客户姓名"
            required />
        </div>
        <div class="form-item">
          <label for="editCustomerriskLevel">客户风险等级：</label>
          <select id="editCustomerriskLevel" v-model="customerFormData.riskLevel" required>
            <option value="" disabled selected hidden>请选择客户风险等级</option>
            <option value="低">低</option>
            <option value="中">中</option>
            <option value="高">高</option>
          </select>
        </div>
        <div class="form-item">
          <label for="editCustomerPhone">手机号：</label>
          <input id="editCustomerPhone" type="text" v-model="customerFormData.customerPhone" placeholder="请输入手机号"
            required />
        </div>
        <div class="form-item">
          <label for="editCustomertype">客户类型：</label>
          <input id="editCustomertype" type="text" v-model="customerFormData.customerType" placeholder="请输入客户类型"
            required />
        </div>
        <div class="form-item">
          <button class="btn btn-primary" type="submit">保存</button>
          <button class="btn btn-secondary" @click="cancelEditCustomerForm">取消</button>
        </div>
      </form>
    </div>

    <!-- 删除确认 -->
    <div v-if="confirmDeleteVisible" class="confirm-delete-modal">
      <h2>确认删除</h2>
      <p>确定要删除该客户吗？</p>
      <div class="modal-buttons">
        <button class="btn btn-secondary" @click="cancelDelete">取消</button>
        <button class="btn btn-primary" @click="confirmDelete">确认</button>
      </div>
    </div>

  </div>
</template>

<script>
import { customerTypeOrm } from "../../constant"; // 导入客户类型的常量
import core from "@hsui/core";
import axios from 'axios';
const qs = require('qs');
export default {
  data() {
    return {
      token: localStorage.getItem('token'),
      customerList: [], // 客户列表
      pagination: {
        current: 1,
        pageSize: 15,
        total: 0,
        pages: [],
      },
      all: '',
      searchKeywordbyphone: '', // 查询关键字
      searchKeywordbyname: '',
      searchHints: ['例:电话188xxx', '姓名:张三', '(支持模糊查询)'], // 查询提示
      customerFormData: {
        userId: '',
        customerName: '',
        riskLevel: '',
        customerPhone: '',
        customerType: '',
      },
      customerMsgBoxVisible: false, // 是否显示开户弹框
      editCustomerFormVisible: false, //是否编辑
      confirmDeleteVisible: false,
      deletingCustomer: null,
      customerEdit: null, //编辑对象
      searchKeyword: {
        name: '',
        phone: '',
      }
    };
  },

  methods: {
    searchCustomerbyphone() {
      // 查询客户的逻辑
      // 调用后端接口传入 this.searchKeyword
      // 使用 this.customerList = data; 更新客户列表数据     

      core
        .fetch({
          method: "post",
          url: "/api2/customer/queryuserlist",
          headers: {
            'authorization': this.token
          },
          data: {
            page: 1,
            limit: 10,
            phone: this.searchKeywordbyphone,
          },
        })
        .then((res) => {
          const { success, data } = res;
          if (success === true) {
            this.customerList = data;
            this.pagination.total = this.customerList.length;
            this.pagination.pageSize = 10;
            console.log(res)
          }
        });
      this.searchKeywordbyphone = ''
      this.pagination.current = 1; // 重置当前页码
    },
    searchCustomerbyname() {
      // 查询客户的逻辑
      // 调用后端接口传入 this.searchKeyword
      // 使用 this.customerList = data; 更新客户列表数据

      core
        .fetch({
          method: "post",
          url: "/api2/customer/queryuserlist",
          headers: {
            'authorization': this.token
          },
          data: {
            page: 1,
            limit: 10,
            nickname: this.searchKeywordbyname,
          },
        })
        .then((res) => {
          const { success, data } = res;
          if (success === true) {
            this.customerList = data;
            this.pagination.total = this.customerList.length;
            this.pagination.pageSize = 10;
            console.log(res)
          }
        });
      this.searchKeywordbyname = ''
      this.pagination.current = 1; // 重置当前页码
    },
    searchCustomer() {
      // 查询客户的逻辑
      // 调用后端接口传入 this.searchKeyword
      // 使用 this.customerList = data; 更新客户列表数据
      core
        .fetch({
          method: "post",
          url: "/api2/customer/queryuserlist",
          headers: {
            'authorization': this.token
          },
          data: {
            page: 1,
            limit: 10,

          },
        })
        .then((res) => {
          const { success, data } = res;
          if (success === true) {
            this.customerList = data;
            this.pagination.total = this.customerList.length;
            this.pagination.pageSize = 10;
            console.log(res)
          }
        });
      this.searchKeywordbyphone = ''
      this.pagination.current = 1; // 重置当前页码
    },
    searchbywords(){
      const requestData ={
        page:1,
        limit:15,
        phone:this.searchKeyword.phone,
        realname:this.searchKeyword.name,
      }
      const filteredData = Object.fromEntries(
        Object.entries(requestData).filter(([_, value]) => value !== '')
      );
      core
        .fetch({
          method: "post",
          url: "/api2/customer/queryuserlist",
          headers: {
            'authorization': this.token
          },
          data: filteredData
        })
        .then((res) => {
          const { success, data } = res;
          if (success === true) {
            this.customerList = data;
            this.pagination.total = this.customerList.length;
            this.pagination.pageSize = 15;
            console.log(res)
          }
        });
      this.searchKeywordbyphone = ''
      this.pagination.current = 1; // 重置当前页码
    },
    addCustomer() {
      // 打开开户弹框
      this.customerMsgBoxVisible = true;
    },

    deleteCustomer(customer) {
      // 删除客户的逻辑
      // 调用后端接口传入 customer
      // 删除成功后，重新获取客户列表数据
      this.deletingCustomer = customer;
      this.confirmDeleteVisible = true;

    },
    changePagination(page) {
      // 切换页码
      this.pagination.current = page;
      // 调用后端接口获取对应页码的客户列表数据
    },
    customerFormOk() {
      // 提交开户表单的逻辑
      // 调用后端接口传入 this.customerFormData
      // 添加成功后，重新获取客户列表数据
      core
        .fetch({
          method: "post",
          url: "/api2/customer",
          headers: {
            'authorization': this.token
          },
          data: {
            userId: this.customerFormData.userId,
            nickname: this.customerFormData.customerName,
            phone: this.customerFormData.customerPhone,
            icon: '',
            createTime: '',
            updateTime: '',
            password: '123',
            permissions: '',
            riskLevel: this.customerFormData.riskLevel,
            type: this.customerFormData.customerType,
            realname: this.customerFormData.customerName,
          }
        })
        .then((res) => {
          if (res.success) {
            alert("开户成功");
          }
        });
      this.resetForm();
      this.customerMsgBoxVisible = false; // 关闭开户弹框
    },
    cancelForm() {
      // 取消开户表单的逻辑
      this.customerMsgBoxVisible = false; // 关闭开户弹框
    },
    resetForm() {
      // 重置开户表单的逻辑
      this.customerFormData = {
        userId: '',
        customerName: '',
        riskLevel: '',
        customerPhone: '',
        customerType: '',
      };
    },
    editCustomer(customer) {
      this.editCustomerFormVisible = true;
      this.customerEdit = customer;
      this.customerFormData.customerPhone = customer.phone;
      this.customerFormData.customerName = customer.nickname;
      this.customerFormData.customerType = customer.type;
      this.customerFormData.riskLevel = customer.riskLevel;
    },

    // 取消编辑客户信息
    cancelEditCustomerForm() {
      this.editCustomerFormVisible = false;
      this.customerFormData.customerPhone = '';
      this.customerFormData.customerName = '';
      this.customerFormData.customerType = '';
      this.customerFormData.riskLevel = '';
      this.customerEdit = null;
    },

    // 提交编辑客户信息
    editCustomerFormOk() {
      // 处理提交逻辑
      // 调用后端接口传入 this.customerFormData
      // 编辑成功后，重新获取客户列表数据

      axios({
        method: 'put',
        url: '/api2/customer',
        data: {
          userId: this.customerEdit.userId,
          nickname: this.customerFormData.customerName,
          phone: this.customerFormData.customerPhone,
          icon: this.customerEdit.icon,
          createTime: this.customerEdit.createTime,
          updateTime: this.customerEdit.updateTime,
          password: this.customerEdit.password,
          permissions: this.customerEdit.permissions,
          riskLevel: this.customerFormData.riskLevel,
          type: this.customerFormData.customerType,
          realname: this.customerFormData.customerName,
        },
        headers: {
          'authorization': this.token
        }
      })
        .then((response) => {
          // 请求成功处理
          console.log(response.data);
        });
      this.editCustomerFormVisible = false;
      this.customerFormData.phone = '';
      this.customerFormData.name = '';
      this.customerFormData.type = '';
      this.customerFormData.riskLevel = '';
      this.customerEdit = null;
    },
    cancelDelete() {
      this.confirmDeleteVisible = false;
      this.deletingCustomer = null;
    },

    confirmDelete() {
      // Perform the delete operation here using this.deletingCustomer
      // Call the backend API to delete the customer
      //确认删除，调用删除接口
      // After successful deletion, update the customer list
      // and close the confirmation dialog
      const id = this.deletingCustomer.userId
      axios({
        method: 'delete',
        url: `/api2/customer/${id}`,
        headers: {
          'authorization': this.token,
          'Content-Type': 'application/x-www-form-urlencoded',
        },

      })
        .then((response) => {
          // 请求成功处理
          if (response.data.success) {
            alert("删除成功")
          }
          console.log(response.data);
        });
      this.customerList = this.customerList.filter(
        (customer) => customer !== this.deletingCustomer
      );
      this.confirmDeleteVisible = false;
      this.deletingCustomer = null;
    },
    showPhoneSearch() {
      this.isPhoneSearch = true;
      this.isNameSearch = false;
    },
    showNameSearch() {
      this.isPhoneSearch = false;
      this.isNameSearch = true;
    },
  },
  filters: {
    // 过滤器
    customerTypeText(value) {
      return customerTypeOrm[value];
    },
  },
};
</script>

<style scoped>

.customer-action-bar .search-bar{
  float: left;
}
.search-bar {
  margin-bottom: 0px;
  display: flex;
  align-items: center;

}

.search-bar button{
  margin-right: 50px;
}

.search-input {
  width: 300px;
  height: 32px;
  padding: 4px 8px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.search-hints {
  display: block;
  margin-left: 10px;
  font-size: 14px;
  color: #999;
  margin-bottom: 30px;
}

.customer-action-bar {
  margin-bottom: 20px;
  text-align: right;
}

.customer-table {
  width: 100%;
  border-collapse: collapse;
}

.customer-table th,
.customer-table td {
  padding: 8px;
  border: 1px solid #ccc;
}

.customer-table th {
  background-color: #f5f5f5;
  font-weight: bold;
}

.customer-table td {
  text-align: center;
}

.pagination-wrap {
  margin-top: 20px;
  text-align: center;
}

.pagination-btn {
  margin: 0 5px;
  padding: 6px 12px;
  font-size: 14px;
  color: #333;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.pagination-btn:hover {
  cursor: pointer;
  background-color: #e6e6e6;
}

.pagination-btn-active {
  background-color: #007bff;
  color: #fff;
}

.customer-msg-box {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  border-radius: 4px;
  padding: 20px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
}

.customer-msg-box-title {
  margin: 0 0 20px;
  font-size: 18px;
  font-weight: bold;
}

.customer-form {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
}

.form-item {
  flex-basis: 48%;
  margin-bottom: 10px;
}

.form-item label {
  display: inline-block;
  width: 100px;
  font-size: 14px;
  margin-right: 10px;
}

.form-item input,
.form-item select {
  width: 200px;
  height: 32px;
  padding: 4px 8px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.form-buttons {
  margin-top: 20px;
  text-align: right;
}

.form-buttons button {
  margin-left: 10px;
}

.btn {
  display: inline-block;
  padding: 6px 12px;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.42857143;
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  cursor: pointer;
  border: 1px solid transparent;
  border-radius: 4px;
}

.btn-primary {
  color: #fff;
  background-color: #007bff;
  border-color: #007bff;
}

.btn-primary:hover {
  background-color: #0069d9;
  border-color: #0062cc;
}

.btn-secondary {
  color: #fff;
  background-color: #6c757d;
  border-color: #6c757d;
}

.btn-secondary:hover {
  background-color: #5a6268;
  border-color: #545b62;
}

.confirm-delete-modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  border-radius: 4px;
  padding: 20px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
}

.confirm-delete-modal h2 {
  margin: 0 0 20px;
  font-size: 18px;
  font-weight: bold;
}

.confirm-delete-modal p {
  margin-bottom: 20px;
}

.confirm-delete-modal .modal-buttons {
  text-align: right;
}
</style>
