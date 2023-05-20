<template>
    <div class="fund-redemption">
      <div class="form-container">
        <h2>基金赎回</h2>
        <form @submit.prevent="submitRedemption" class="sell">
          <div class="form-row">
            <div class="form-group">
              <label for="customerNumber">客户编号:</label>
              <input type="text" id="customerNumber" v-model="customerNumber" required />
            </div>
  
            <div class="form-group">
              <label for="fundCode">基金代码:</label>
              <input type="text" id="fundCode" v-model="fundCode" required />
            </div>
          </div>
  
          <div class="form-row">
            <div class="form-group">
              <label for="redemptionShares">赎回份额:</label>
              <input type="text" id="redemptionShares" v-model="redemptionShares" required />
            </div>
  
            <div class="form-group">
              <label for="bankCard">银行卡号:</label>
              <input type="text" id="bankCard" v-model="bankCardNumber" required />
              <span v-if="!isBankCardValid" class="error-message">请输入有效的中国银行卡号</span>
            </div>
          </div>
  
          <button type="submit">提交</button>
        </form>
  
        <div v-if="redemptionTime" class="info">
          <h3>赎回时间</h3>
          <p>{{ redemptionTime }}</p>
        </div>
  
        <div v-if="estimatedArrivalDate" class="info">
          <h3>预计到账日期</h3>
          <p>{{ estimatedArrivalDate }}</p>
        </div>
      </div>
    </div>
</template>
  
<script>
  export default {
    data() {
      return {
        customerNumber: '',
        fundCode: '',
        redemptionShares: '',
        bankCardNumber: '',
        isBankCardValid: true,
        redemptionTime: '1',
        estimatedArrivalDate: '1'
      };
    },
    methods: {
      submitRedemption() {
        // 在这里调用后端接口提交表单数据，并处理返回的结果
        // 替换以下示例代码为实际的接口调用逻辑
        if (!this.validateBankCardNumber()) {
          return;
        }
  
        // 模拟接口调用成功后的返回结果
        this.redemptionTime = '赎回时间';
        this.estimatedArrivalDate = '预计到账日期';
      },
      validateBankCardNumber() {
        // 在这里编写验证银行卡号的逻辑
        // 这里简单示例只检查是否为纯数字且长度为16位
        const bankCardRegex = /^\d{16}$/;
        this.isBankCardValid = bankCardRegex.test(this.bankCardNumber);
  
        return this.isBankCardValid;
      }
    }
  };
</script>
  
<style>
  .fund-redemption {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .form-container {
    width: 600px;
  }
  
  h2 {
    text-align: center;
  }
  
  .sell {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-top: 50px;
    border-radius: 5px;
    background-color: #ecefef;
    border: 1px solid #ccc;
    padding: 20px;
  }
  
  .form-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    width: 100%;
  }
  
  .form-group {
    flex: 1;
    display: flex;
    flex-direction: column;
    margin-right: 10px;
  }
  
  label {
    font-weight: bold;
  }
  
  input[type="text"] {
    padding: 8px;
    width: 100%;
  }
  
  .error-message {
    color: red;
  }
  
  button[type="submit"] {
    padding: 10px 20px;
    background-color: #4caf50;
    color: #fff;
    border: none;
    cursor: pointer;
  }
  
  .info {
    margin-top: 20px;
    text-align: center;
  }
</style>
  