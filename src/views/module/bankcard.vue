<template>
  <div class="customer-bank-card-management">
    <!-- 客户编号查询 -->
    <div class="search-bar">
      <input v-model="customerNumber" placeholder="请输入客户编号" />
      <button class="search-btn" @click="searchCustomerBankCards">查询</button>
    </div>

    <!-- 银行卡列表 -->
    <table class="bank-card-table" v-if="bankCards.length > 0">
      <!-- 表头 -->
      <thead>
        <tr>
          <th>银行卡号</th>
          <th>银行名称</th>
          <th>余额</th>
          <th>操作</th>
        </tr>
      </thead>
      <!-- 表格内容 -->
      <tbody>
        <tr v-for="card in bankCards" :key="card.id">
          <td>{{ card.cardId }}</td>
          <td>{{ card.bank }}</td>
          <td>{{ card.balance }}</td>
          <td>
            <button @click="showRechargeForm(card.cardId)">充值</button>
            <button @click="cancelBankCard(card)">解绑</button>
            <button @click="showCardDetailsModal(card)">详情</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- 充值表单 -->
    <div v-if="showRecharge" class="recharge-form">
      <h4>充值</h4>
      <div class="form-row">
        <label for="rechargeCardNumber">银行卡号:</label>
        <input id="rechargeCardNumber" v-model="rechargeForm.cardNumber" disabled />
      </div>
      <div class="form-row">
        <label for="rechargeAmount">充值金额:</label>
        <input id="rechargeAmount" v-model="rechargeForm.amount" />
      </div>
      <div class="button-row">
        <button class="submit-btn" @click="submitRecharge">充值</button>
        <button class="cancel-btn" @click="cancelRecharge">取消</button>
      </div>
    </div>

    <!-- 添加银行卡按钮和银行卡添加表单 -->
    <div class="add-card-section">
      <button class="add-card-btn" @click="showAddBankCardForm">添加银行卡</button>
      <div v-if="showAddForm" class="form-container">
        <h4>银行卡添加</h4>
        <div class="form-row">
          <label for="cardId">银行卡号:</label>
          <input id="cardId" v-model="addForm.cardId" />
        </div>
        <div class="form-row">
          <label for="userId">客户编号:</label>
          <input id="userId" v-model="addForm.userId" />
        </div>
        <div class="form-row">
          <label for="balance">余额:</label>
          <input id="balance" v-model="addForm.balance" />
        </div>
        <div class="form-row">
          <label for="bankCardType">银行卡类型:</label>
          <input id="bankCardType" v-model="addForm.bankCardType" />
        </div>
        <div class="form-row">
          <label for="bank">银行:</label>
          <input id="bank" v-model="addForm.bank" />
        </div>
        <div class="form-row">
          <label for="idNumber">身份证/护照号码:</label>
          <input id="idNumber" v-model="addForm.idNumber" />
        </div>
        <div class="form-row">
          <label for="idCardType">证件类型:</label>
          <input id="idCardType" v-model="addForm.idCardType" />
        </div>
        <div class="button-row">
          <button class="submit-btn" @click="submitAddForm">添加</button>
          <button class="cancel-btn" @click="cancelAddForm">取消</button>
        </div>
      </div>
    </div>

    <!-- 弹窗组件 -->

    <div class="card-details-modal" v-if="showCardDetails">
      <h4>银行卡详情</h4>
      <!-- 在这里展示银行卡的详细信息，使用绑定的数据显示 -->
      <div>ID: {{ cardDetails.id }}</div>
      <div>银行卡号: {{ cardDetails.cardId }}</div>
      <div>客户编号: {{ cardDetails.userId }}</div>
      <div>余额: {{ cardDetails.balance }}</div>
      <div>银行卡类型: {{ cardDetails.type }}</div>
      <div>银行: {{ cardDetails.bank }}</div>
      
      <div>创建时间: {{ cardDetails.createTime }}</div>
      <div>更新时间: {{ cardDetails.updateTime }}</div>
      <button @click="closeCardDetailsModal">关闭</button>
    </div>




  </div>
</template>

<script>
import core from "@hsui/core";
import axios from 'axios';
export default {
  data() {
    return {
      token: localStorage.getItem('token'),
      customerNumber: "",
      bankCards: [],
      showAddForm: false,
      addForm: {
        cardId: "",
        userId: "",
        balance: "",
        bankCardType: "",
        bank: "",
        idNumber: "",
        idCardType: ""
      },
      showRecharge: false,
      rechargeForm: {
        cardNumber: "",
        amount: ""
      },
      showCardDetails: false, // 控制银行卡详情弹窗显示与隐藏
      cardDetails: {} // 存储银行卡详情信息
    };
  },
  methods: {
    searchCustomerBankCards() {
      // 假设后端提供了名为 getCustomerBankCards 的接口，通过客户编号查询客户持有的银行卡信息
      // 在实际项目中，根据后端提供的接口进行修改
      // 示例中使用了假数据
      const userId = this.customerNumber
      core
        .fetch({
          headers: {
            'authorization': this.token
          },
          method: "get",
          url: `/api2/bankcard/bankcardlist/${userId}`,

        })
        .then((res) => {
          const { success, data } = res;
          if (success) {
            this.bankCards = data;
          }
          console.log(res);
        });
      /*const response = [
        { id: 1, cardId: "1234567890", bank: "Bank A", balance: 1000 },
        { id: 2, cardId: "0987654321", bank: "Bank B", balance: 2000 }
      ];
      this.bankCards = response;*/
    },
    showAddBankCardForm() {
      this.showAddForm = true;
    },
    submitAddForm() {
      // 假设后端提供了名为 addCustomerBankCard 的接口，用于添加银行卡
      // 在实际项目中，根据后端提供的接口进行修改
      // 示例中仅将添加的银行卡信息打印到控制台
      core
        .fetch({
          method: "post",
          url: "/api2/bankcard",
          headers: {
            'authorization': this.token
          },
          data: {
            ...this.addForm
          },
        })
        .then((res) => {
          if (res.success) {
            alert("添加成功")
          }
        });
      console.log("Adding bank card:", this.addForm);
      this.cancelAddForm();
    },
    cancelAddForm() {
      this.addForm = {
        cardId: "",
        userId: "",
        balance: "",
        bankCardType: "",
        bank: "",
        idNumber: "",
        idCardType: ""
      },
        this.showAddForm = false;
    },
    showRechargeForm(cardNumber) {
      this.rechargeForm.cardNumber = cardNumber;
      this.showRecharge = true;
    },
    submitRecharge() {
      // 假设后端提供了名为 rechargeBankCard 的接口，用于充值
      // 在实际项目中，根据后端提供的接口进行修改
      // 示例中仅将充值的银行卡号和金额打印到控制台
      core
        .fetch({
          method: "post",
          url: "/api2/bankcard/topup",
          headers: {
            'authorization': this.token
          },
          data: {
            cardId: this.rechargeForm.cardNumber,
            userId: this.customerNumber,
            amount: this.rechargeForm.amount,
          }
        })
        .then((res) => {
          if (res.success) {
            alert("充值成功");
          }
        });
      console.log("Recharging bank card:", this.rechargeForm);
      this.cancelRecharge();
    },
    cancelRecharge() {
      this.rechargeForm = {
        cardNumber: "",
        amount: ""
      };
      this.showRecharge = false;
    },
    cancelBankCard(card) {
      // 假设后端提供了名为 cancelBankCard 的接口，用于注销银行卡
      // 在实际项目中，根据后端提供的接口进行修改
      // 示例中仅将注销的银行卡ID打印到控制台

      axios({
        method: 'delete',
        url: '/api2/bankcard/',
        headers: {
          'authorization': this.token,

        },
        data: {
          userId: card.userId,
          cardId: card.cardId,
        }

      })
        .then((response) => {
          // 请求成功处理
          if (response.data.success) {
            alert("解绑成功")
          }
          console.log(response.data);
        });
      console.log("Canceling bank card:", cardId);
    },
    showCardDetailsModal(card) {
      this.cardDetails = { ...card }; // 将点击的银行卡信息赋值给 cardDetails
      this.showCardDetails = true; // 显示银行卡详情弹窗
    },
    closeCardDetailsModal() {
      this.showCardDetails = false; // 关闭银行卡详情弹窗
    },
  }
};
</script>

<style scoped>

.customer-bank-card-management {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #f7f7f7;
}

.search-bar {
  margin-bottom: 20px;
 
}
.search-bar button{
  width: 30px;
}
.search-bar input,
.search-bar button
{
  height: 30px;
}
.search-btn {
  margin-left: 10px;
}

.bank-card-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

.bank-card-table th,
.bank-card-table td {
  border: 1px solid #ccc;
  padding: 8px;
}

.bank-card-table th {
  background-color: #f5f5f5;
  text-align: left;
}

.add-card-section {
  margin-top: 20px;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 10px;
  margin-bottom: 20px;
  background-color: #ffffff;
}

.add-card-btn {
  margin-bottom: 10px;
  background-color: #4caf50;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  cursor: pointer;
}

.form-container {
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 10px;
  background-color: #ffffff;
}

.form-row {
  margin-bottom: 10px;
}

.form-row label {
  display: inline-block;
  width: 100px;
}

.form-row input {
  padding: 4px 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.button-row {
  margin-top: 10px;
}

.submit-btn {
  background-color: #4caf50;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  cursor: pointer;
}

.cancel-btn {
  background-color: #f44336;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  cursor: pointer;
}

.recharge-form {
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 10px;
  margin-top: 20px;
  background-color: #ffffff;
}
.card-details-modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #ffffff;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

</style>
