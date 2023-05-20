<template>
    <div class="order-management">
      <!-- 订单查询 -->
      <div class="section">
        <h3>订单查询</h3>
        <div class="search-bar">
          <input v-model="customerNumber" placeholder="请输入客户编号" />
          <button class="search-btn" @click="searchOrders">查询订单</button>
        </div>
  
        <div class="order-list" v-if="orders.length > 0">
          <table class="order-table">
            <thead>
              <tr>
                <th>订单编号</th>
                <th>订单类型</th>
                <th>产品代码</th>
                <th>申请金额</th>
                <th>状态</th>
                <th>申请时间</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="order in orders" :key="order.orderId">
                <td>{{ order.orderId }}</td>
                <td>{{ order.orderType }}</td>
                <td>{{ order.productCode }}</td>
                <td>{{ order.amount }}</td>
                <td>{{ order.status }}</td>
                <td>{{ order.createdAt }}</td>
                <td>
                  <button @click="viewOrderDetails(order)">详情</button>
                  <button @click="cancelOrder(order)">撤销</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p v-else>没有找到订单</p>
      </div>
  
      <!-- 订单详情 -->
      <div class="section" v-if="selectedOrder">
        <h3>订单详情</h3>
        <div class="order-details">
          <p>订单编号: {{ selectedOrder.orderId }}</p>
          <p>订单类型: {{ selectedOrder.orderType }}</p>
          <p>产品代码: {{ selectedOrder.productCode }}</p>
          <p>申请金额: {{ selectedOrder.amount }}</p>
          <p>状态: {{ selectedOrder.status }}</p>
          <p>申请时间: {{ selectedOrder.createdAt }}</p>
          <!-- 其他订单相关信息 -->
        </div>
      </div>
  
      <!-- 银行卡流水查询 -->
      <div class="section">
        <h3>银行卡流水查询</h3>
        <div class="search-bar">
          <input v-model="bankCardNumber" placeholder="请输入银行卡号" />
          <button class="search-btn" @click="searchBankCardTransactions">查询流水</button>
        </div>
  
        <div class="transaction-list" v-if="bankCardTransactions.length > 0">
          <table class="transaction-table">
            <thead>
              <tr>
                <th>交易类型</th>
                <th>交易金额</th>
                <th>交易时间</th>
                <!-- 其他交易相关信息 -->
              </tr>
            </thead>
            <tbody>
              <tr v-for="transaction in bankCardTransactions" :key="transaction.transactionId">
                <td>{{ transaction.type }}</td>
                <td>{{ transaction.amount }}</td>
                <td>{{ transaction.timestamp }}</td>
                <!-- 其他交易相关信息的表格列 -->
              </tr>
            </tbody>
          </table>
        </div>
        <p v-else>没有找到银行卡流水记录</p>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        customerNumber: "",
        orders: [],
        selectedOrder: null,
        bankCardNumber: "",
        bankCardTransactions: [],
      };
    },
    methods: {
      searchOrders() {
        // 根据客户编号查询订单信息
        // 使用假数据进行示例，实际项目中根据后端接口进行调用
        const response = [
          {
            orderId: "1",
            orderType: "申购",
            productCode: "ABC001",
            amount: 1000,
            status: "已完成",
            createdAt: "2023-05-18 09:00:00",
          },
          {
            orderId: "2",
            orderType: "赎回",
            productCode: "XYZ002",
            amount: 2000,
            status: "处理中",
            createdAt: "2023-05-17 14:30:00",
          },
        ];
        this.orders = response;
        this.selectedOrder = null; // 清空选中的订单详情
      },
      viewOrderDetails(order) {
        this.selectedOrder = order;
      },
      cancelOrder(order) {
        // 将订单标记为撤销状态
        console.log("Canceling order:", order.orderId);
        order.status = "已撤销";
      },
      searchBankCardTransactions() {
        // 根据银行卡号查询银行卡流水记录
        // 使用假数据进行示例，实际项目中根据后端接口进行调用
        const response = [
          {
            transactionId: "1",
            type: "充值",
            amount: 1000,
            timestamp: "2023-05-18 10:00:00",
          },
          {
            transactionId: "2",
            type: "提现",
            amount: 500,
            timestamp: "2023-05-17 15:30:00",
          },
        ];
        this.bankCardTransactions = response;
      },
    },
  };
  </script>
  
  <style scoped>
  .order-management {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  
  .section {
    margin-bottom: 20px;
  }
  
  .search-bar {
    margin-bottom: 10px;
  }
  
  .search-btn {
    margin-left: 10px;
  }
  
  .order-list,
  .transaction-list {
    margin-top: 10px;
  }
  
  .order-table,
  .transaction-table {
    width: 100%;
    border-collapse: collapse;
  }
  
  .order-table th,
  .order-table td,
  .transaction-table th,
  .transaction-table td {
    border: 1px solid #ccc;
    padding: 8px;
  }
  
  .order-table th {
    background-color: #f5f5f5;
    text-align: left;
  }
  
  .order-details {
    margin-top: 10px;
  }
  
  </style>
  