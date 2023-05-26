<template>
  <div class="fund-purchase">
    <h1>基金交易</h1>
    <div class="search-bar">
      <input v-model="userId" placeholder="请输入用户ID" />
      <button class="search-btn" @click="searchUserFunds">查询</button>
    </div>

    <!-- 基金列表 -->
    <table class="fund-table" v-if="userFunds.length > 0">
      <!-- 表头 -->
      <thead>
        <tr>
          <th>基金编号</th>
          <th>基金名称</th>
          <th>基金类型</th>
          <th>风险等级</th>
          <th>用户持有份额</th>
          <th>当前净值</th>
          <th>操作</th>
        </tr>
      </thead>
      <!-- 表格内容 -->
      <tbody>
        <tr v-for="fund in userFunds" :key="fund.fundId">
          <td>{{ fund.fundId }}</td>
          <td>{{ fund.fundName }}</td>
          <td>{{ fund.fundType }}</td>
          <td>{{ fund.riskLevel }}</td>
          <td>{{ fund.holdShare }}</td>
          <td>{{ fund.currentNav }}</td>
          <td>
            <button @click="showFundDetails(fund)">查看详情</button>
            <button @click="showPurchaseForm = true; resetForm();">申购</button>
            <button @click="showRedemptionForm = true; resetForm();">赎回</button>
          </td>
        </tr>
      </tbody>
    </table>

    <div class="form-container" v-if="showPurchaseForm">
      <h2>基金申购</h2>
      <form @submit.prevent="submitPurchase" class="buy">
        <!-- 表单内容 -->
        <div class="form-row">
          <div class="form-group">
            <label for="customerNumber">客户编号:</label>
            <input type="text" id="customerNumber" v-model="purchaseCustomerNumber" required />
          </div>

          <div class="form-group">
            <label for="fundCode">基金代码:</label>
            <input type="text" id="fundCode" v-model="purchaseFundCode" required  />
            <!-- ... -->
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="purchaseAmount">购买金额:</label>
            <input type="text" id="purchaseAmount" v-model="purchaseAmount" required />
          </div>

          <div class="form-group">
            <label for="bankCardNumber">银行卡号:</label>
            <input type="text" id="bankCardNumber" v-model="purchaseBankCardNumber" required />
          </div>
        </div>

        
        <div class="form-actions">
          <button type="submit">提交</button>
          <button type="button" @click="resetForm">重置</button>
          <button type="button" @click="showPurchaseForm = false">关闭</button>
        </div>
      </form>
      <div class="form-row">
          <div v-if="customerRiskMatchInfo" class="form-group">
            <h3>客户风险匹配信息</h3>
            <p>{{ customerRiskMatchInfo }}</p>
          </div>
            
          <div v-if="purchaseSuccessTime" class="form-group">
            <h3>申购成功时间</h3>
            <p>{{ purchaseSuccessTime }}</p>
          </div>

          <div v-if="estimatedConfirmationTime" class="form-group">
            <h3>预计确认时间</h3>
            <p>{{ estimatedConfirmationTime }}</p>
          </div>
        </div>
    </div>

    <div class="form-container" v-if="showRedemptionForm">
      <h2>基金赎回</h2>
      <form @submit.prevent="submitRedemption" class="sell">
        <!-- 表单内容 -->
        <div class="form-row">
          <div class="form-group">
            <label for="customerNumber">客户编号:</label>
            <input type="text" id="customerNumber" v-model="redemptionCustomerNumber" required />
          </div>

          <div class="form-group">
            <label for="fundCode">基金代码:</label>
            <input type="text" id="fundCode" v-model="redemptionFundCode"  required />
            <!-- ... -->
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="redemptionShares">赎回份额:</label>
            <input type="text" id="redemptionShares" v-model="redemptionShares" required />
          </div>
        </div>



        <div class="form-actions">
          <button type="submit">提交</button>
          <button type="button" @click="resetForm">重置</button>
          <button type="button" @click="showRedemptionForm = false">关闭</button>
        </div>

      </form>
      <div class="form-row" v-if="redemptionTime">
        <div v-if="redemptionTime" class="form-group">
          <h3>赎回成功时间</h3>
          <p>{{ redemptionTime }}</p>
        </div>

        <div v-if="estimatedArrivalDate" class="form-group">
          <h3>预计确认时间</h3>
          <p>{{ estimatedArrivalDate }}</p>
        </div>
      </div>

      <!-- ... -->
    </div>




    <div class="form-container" v-if="showFundDetailsForm">
      <h2>基金详情</h2>
      <div class="fund-details">
        <div class="form-row">
          <div class="form-group">
            <label for="fundId">基金编号:</label>
            <span>{{ selectedFund.fundId }}</span>
          </div>
          <div class="form-group">
            <label for="fundName">基金名称:</label>
            <span>{{ selectedFund.fundName }}</span>
          </div>
          <div class="form-group">
            <label for="fundType">基金类型:</label>
            <span>{{ selectedFund.fundType }}</span>
          </div>
          <div class="form-group">
            <label for="riskLevel">风险等级:</label>
            <span>{{ selectedFund.riskLevel }}</span>
          </div>
          <div class="form-group">
            <label for="holdingShares">用户持有份额:</label>
            <span>{{ selectedFund.holdShare }}</span>
          </div>
          <div class="form-group">
            <label for="currentNetValue">当前净值:</label>
            <span>{{ selectedFund.currentNav }}</span>
          </div>
          <div class="form-group">
            <label for="currentNetValue">最小投资金额:</label>
            <span>{{ selectedFund.minInvestment }}</span>
          </div>
          <div class="form-group">
            <label for="currentNetValue">基金经理:</label>
            <span>{{ selectedFund.fundManager }}</span>
          </div>
          <div class="form-group">
            <label for="currentNetValue">基金状态:</label>
            <span>{{ selectedFund.fundStatus }}</span>
          </div>
        </div>
        <div class="form-actions">
          <button type="button" @click="showFundDetailsForm = false">关闭</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import core from "@hsui/core";
export default {
  data() {
    return {
      userId: '',
      userFunds: [],
      customerRiskMatchInfo: "",
      purchaseSuccessTime: "",
      estimatedConfirmationTime: "",
      token: localStorage.getItem('token'),
      showPurchaseForm: false,
      showRedemptionForm: false,
      showFundDetailsForm: false,
      purchaseCustomerNumber: "",
      purchaseFundCode: "",
      purchaseAmount: "",
      purchaseBankCardNumber: "",
      redemptionCustomerNumber: "",
      redemptionFundCode: "",
      redemptionShares: "",
      selectedFund: null,
      redemptionTime: '',
      estimatedArrivalDate: '',
    };
  },
  methods: {

    searchUserFunds() {
      // 根据用户ID查询持有基金信息
      // 使用假数据进行示例，实际项目中根据后端接口进行调用
      // 替换以下代码
      const userId = this.userId;
      this.userFunds = [];
      core
        .fetch({
          headers: {
            'authorization': this.token
          },
          url: `/api4/fundHold/${userId}`,
          method: 'get',
          data: {
            page: 1,
            limit: 15,
          }
        })
        .then((res) => {
          if (res.success) {
            this.userFunds = res.data;
            this.userId = '';
            /*if (!res.data) {
              this.showPurchaseForm = true;
            }*/
          }
        });

    },
    showFundDetails(fund) {
      // 查看基金详情逻辑
      // 使用基金对象fund进行相应操作
      this.showFundDetailsForm = true;
      this.selectedFund = fund;
    },
    submitPurchase() {
      // 调用申购的后端接口
      core
        .fetch({
          headers: {
            'authorization': this.token
          },
          method: "post",
          url: "/api5/transaction/subscribe",
          data: {
            userId: this.purchaseCustomerNumber,
            fundId: this.purchaseFundCode,
            cardId: this.purchaseBankCardNumber,
            orderAmount: this.purchaseAmount,
          },
        })
        .then((res) => {
          const { success, data } = res;
          if (success) {
            this.customerRiskMatchInfo = data.riskMatching ? '匹配' : '不匹配';
            this.purchaseSuccessTime = data.orderDate;
            this.estimatedConfirmationTime = data.orderConfirmationDate;
            alert("申购成功")
          }
        });
      this.resetForm();
    },

    submitRedemption() {
      // 调用赎回的后端接口
      core
        .fetch({
          headers: {
            'authorization': this.token
          },
          method: "post",
          url: "/api5/transaction/redeem",
          data: {
            userId: this.redemptionCustomerNumber,
            fundId: this.redemptionFundCode,
            orderUnits: this.redemptionShares,
          }
        })
        .then((res) => {
          const { success, data } = res
          if (success) {
            this.redemptionTime = data.orderDate;
            this.estimatedArrivalDate = data.orderConfirmationDate;
            alert("赎回成功");
          }
        });
      this.resetForm();
    },

    resetForm() {
      // 重置申购和赎回表单的数据
      this.purchaseCustomerNumber = "";
      this.purchaseFundCode = "";
      this.purchaseAmount = "";
      this.purchaseBankCardNumber = "";
      this.redemptionCustomerNumber = "";
      this.redemptionFundCode = "";
      this.redemptionShares = "";
    },

    // ...

  },

};
</script>

<style scoped>
.fund-purchase {
  max-width: 800px;
  margin: 0 auto;
}

.search-bar {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.search-bar input {
  flex: 1;
  padding: 8px;
  font-size: 14px;
}

.search-btn {
  margin-left: 10px;
  padding: 8px 12px;
  font-size: 14px;
  background-color: #007bff;
  color: #fff;
  border: none;
  cursor: pointer;
}

.fund-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

.fund-table th,
.fund-table td {
  padding: 10px;
  border: 1px solid #ccc;
}

.fund-table th {
  background-color: #f0f0f0;
  text-align: left;
}

.fund-table tbody tr:nth-child(even) {
  background-color: #f9f9f9;
}

.fund-table tbody tr:hover {
  background-color: #f5f5f5;
  cursor: pointer;
}

.fund-table button {
  padding: 6px 12px;
  font-size: 14px;
  background-color: #007bff;
  color: #fff;
  border: none;
  cursor: pointer;
}

.form-container {
  border: 1px solid #ccc;
  padding: 20px;
  margin-bottom: 20px;
}

.form-container h2 {
  margin-top: 0;
  margin-bottom: 20px;
}

.form-row {
  display: flex;
  margin-bottom: 10px;
}

.form-group {
  margin-right: 20px;
}

.form-group label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
}

.form-actions {
  text-align: right;
}

.form-actions button {
  margin-left: 10px;
  padding: 8px 12px;
  font-size: 14px;
  background-color: #007bff;
  color: #fff;
  border: none;
  cursor: pointer;
}

.form-actions button[type="submit"] {
  background-color: #28a745;
}

.form-actions button[type="button"] {
  background-color: #dc3545;
}
</style>
