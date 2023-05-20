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
          <td>{{ card.cardNumber }}</td>
          <td>{{ card.bankName }}</td>
          <td>{{ card.balance }}</td>
          <td>
            <button @click="showRechargeForm(card.cardNumber)">充值</button>
            <button @click="cancelBankCard(card.id)">注销</button>
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

      <!-- 银行卡添加表单 -->
      <div v-if="showAddForm" class="form-container">
        <h4>银行卡添加</h4>
        <div class="form-row">
          <label for="cardNumber">银行卡号:</label>
          <input id="cardNumber" v-model="addForm.cardNumber" />
        </div>
        <div class="form-row">
          <label for="bankName">银行名称:</label>
          <input id="bankName" v-model="addForm.bankName" />
        </div>
        <div class="button-row">
          <button class="submit-btn" @click="submitAddForm">添加</button>
          <button class="cancel-btn" @click="cancelAddForm">取消</button>
        </div>
      </div>
    </div>

    

  </div>
</template>

<script>
export default {
  data() {
    return {
      customerNumber: "",
      bankCards: [],
      showAddForm: false,
      addForm: {
        cardNumber: "",
        bankName: ""
      },
      showRecharge: false,
      rechargeForm: {
        cardNumber: "",
        amount: ""
      }
    };
  },
  methods: {
    searchCustomerBankCards() {
      // 假设后端提供了名为 getCustomerBankCards 的接口，通过客户编号查询客户持有的银行卡信息
      // 在实际项目中，根据后端提供的接口进行修改
      // 示例中使用了假数据
      const response = [
        { id: 1, cardNumber: "1234567890", bankName: "Bank A", balance: 1000 },
        { id: 2, cardNumber: "0987654321", bankName: "Bank B", balance: 2000 }
      ];
      this.bankCards = response;
    },
    showAddBankCardForm() {
      this.showAddForm = true;
    },
    submitAddForm() {
      // 假设后端提供了名为 addCustomerBankCard 的接口，用于添加银行卡
      // 在实际项目中，根据后端提供的接口进行修改
      // 示例中仅将添加的银行卡信息打印到控制台
      console.log("Adding bank card:", this.addForm);
      this.cancelAddForm();
    },
    cancelAddForm() {
      this.addForm = {
        cardNumber: "",
        bankName: ""
      };
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
    cancelBankCard(cardId) {
      // 假设后端提供了名为 cancelBankCard 的接口，用于注销银行卡
      // 在实际项目中，根据后端提供的接口进行修改
      // 示例中仅将注销的银行卡ID打印到控制台
      console.log("Canceling bank card:", cardId);
    }
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
</style>
