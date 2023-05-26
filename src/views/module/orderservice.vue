<template>
  <div class="order-management">
    <!-- 订单查询 -->
    <div class="section">
      <h2>订单服务</h2>
      <br>
      <!-- 查询表单
      <div class="search-bar">
        <input v-model="searchKeyword" placeholder="请输入关键词" />
        <button class="search-btn" @click="searchOrders">查询订单</button>
        <span v-for="hint in searchHints" :key="hint">{{ hint + ", " }}</span>
      </div> -->

      <!--
      <h3>订单查询</h3>
      <div>
        <div class="search-bar">
          <input type="text" v-model="searchInput" :placeholder="placeholderText">
          <button @click="search">查询</button>
          <span v-for="hint in searchHints" :key="hint">{{ hint + ", " }}</span>
        </div>
        <div>
          <button @click="toggleInput('transactionType')">按订单类型查询</button>
          <button @click="toggleInput('userName')">按用户姓名查询</button>
          <button @click="toggleInput('phoneNumber')">按用户手机号查询</button>
          <button @click="toggleInput('orderStatus')">按订单状态查询</button>
        </div>
      </div>-->

      <h3>订单查询</h3>
      <div class="search-container">
        <div class="search-bar">
          <input type="text" v-model="searchInput.transactionType" placeholder="订单类型">
          <input type="text" v-model="searchInput.userName" placeholder="用户姓名">
          <input type="text" v-model="searchInput.phoneNumber" placeholder="用户手机号">
        </div>
        <div class="search-bar">
          <input type="text" v-model="searchInput.orderStatus" placeholder="订单状态">
          <input type="date" v-model="searchInput.startDate" placeholder="开始时间">
          <input type="date" v-model="searchInput.endDate" placeholder="结束时间">
          <button @click="searchOrders">查询</button>
        </div>
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
              <td>{{ order.fundId }}</td>
              <td>{{ order.orderAmount }}</td>
              <td>{{ order.orderStatus }}</td>
              <td>{{ order.orderDate }}</td>
              <td>
                <button @click="viewOrderDetails(order)">详情</button>
                <button @click="cancelOrder(order)">撤单</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p v-else>没有找到订单</p>
    </div>


    <div class="pagination">
      <button v-for="page in totalPagesfororder" :key="page" @click="changePagefororder(page)">
        {{ page }}
      </button>
    </div>

    <!-- 订单详情 -->
    <div class="section-detials" v-if="selectedOrder">
      <h3>订单详情</h3>
      <div class="order-details">
        <div class="order-details-row">
          <div class="order-details-column">
            <p>订单编号: {{ selectedOrder.orderId }}</p>
            <p>用户编号: {{ selectedOrder.userId }}</p>
          </div>
          <div class="order-details-column">
            <p>基金编号: {{ selectedOrder.fundId }}</p>
            <p>申请时间: {{ selectedOrder.orderDate }}</p>
          </div>
        </div>
        <div class="order-details-row">
          <div class="order-details-column">
            <p>订单类型: {{ selectedOrder.orderType }}</p>
            <p>申请金额: {{ selectedOrder.orderAmount }}</p>
          </div>
          <div class="order-details-column">
            <p>订单状态: {{ selectedOrder.orderStatus }}</p>
            <p>银行卡账号: {{ selectedOrder.cardId }}</p>
          </div>
        </div>
        <div class="order-details-row">
          <div class="order-details-column">
            <p>订单净值: {{ selectedOrder.orderNav }}</p>
            <p>订单确认日期: {{ selectedOrder.settlementDate }}</p>
          </div>
          <div class="order-details-column">
            <p>支付状态: {{ selectedOrder.paymentStatus }}</p>
            <p>申请份额: {{ selectedOrder.orderUnits }}</p>
          </div>
        </div>
        <!-- 其他订单相关信息 -->
      </div>
      <button @click="closeCardDetailsModal">关闭</button>
    </div>

    <!-- 银行卡流水查询 -->
    <div class="section">
      <h3>银行卡流水查询</h3>


      <!--
      <div>
        <div class="search-bar">
          <input type="text" v-model="searchInput" :placeholder="searchPlaceholder">
          <button @click="searchbycard">查询</button>
        </div>
        <div>
          <button @click="toggleInputbycard('bankCard')">按银行卡号查询</button>
          <button @click="toggleInputbycard('transactionType')">按交易类型查询</button>
          <button @click="toggleInputbycard('userNamebycard')">按用户姓名查询</button>
          <button @click="toggleInputbycard('phoneNumberbycard')">按用户手机号查询</button>
        </div>
      </div>
      -->
      <div>
        <div class="search-bar">
          <input type="text" v-model="searchInputbycard.bankCard" placeholder="银行卡号">
          <input type="text" v-model="searchInputbycard.transactionType" placeholder="交易类型">
          <input type="text" v-model="searchInputbycard.userNamebycard" placeholder="用户姓名">
        </div>
        <div class="search-bar">
          <input type="text" v-model="searchInputbycard.phoneNumberbycard" placeholder="用户手机号">
          <input type="date" v-model="searchInputbycard.startDate" placeholder="开始时间">
          <input type="date" v-model="searchInputbycard.endDate" placeholder="结束时间">
          <button @click="searchbycard">查询</button>
        </div>

      </div>

      <!-- 流水列表 -->
      <div class="transaction-list" v-if="bankCardTransactions.length > 0">
        <table class="transaction-table">
          <thead>
            <tr>
              <th>银行卡号</th>
              <th>交易类型</th>
              <th>交易金额</th>
              <th>交易时间</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="transaction in bankCardTransactions" :key="transaction.transactionId">
              <td>{{ transaction.bankAccountNumber }}</td>
              <td>{{ transaction.transactionType }}</td>
              <td>{{ transaction.transactionAmount }}</td>
              <td>{{ transaction.transactionDate }}</td>
              <td>
                <button @click="viewTransactionDetails(transaction)">详情</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p v-else>没有找到银行卡流水记录</p>
    </div>
   
    <!--银行卡分页-->
    <div class="pagination">
      <button v-for="page in totalPagesforcard" :key="page" @click="changePageforcard(page)">
        {{ page }}
      </button>
    </div>

    <!-- 交易详情 -->
    <div class="section-detials" v-if="selectedTransaction">
      <h3>交易详情</h3>
      <div class="transaction-details">
        <div class="transaction-details-row">
          <div class="transaction-details-column">
            <p>交易编号: {{ selectedTransaction.transactionId }}</p>
            <p>用户编号: {{ selectedTransaction.userId }}</p>
          </div>
          <div class="transaction-details-column">
            <p>银行卡账号: {{ selectedTransaction.bankAccountNumber }}</p>
            <p>交易时间: {{ selectedTransaction.transactionDate }}</p>
          </div>
        </div>
        <div class="transaction-details-row">
          <div class="transaction-details-column">
            <p>交易金额: {{ selectedTransaction.transactionAmount }}</p>
            <p>交易类型: {{ selectedTransaction.transactionType }}</p>
          </div>
          <div class="transaction-details-column">
            <p>状态: {{ selectedTransaction.transactionStatus }}</p>

            <!-- 其他交易相关信息 -->
          </div>
        </div>
      </div>
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
      searchKeyword: "",
      orders: [],
      selectedOrder: null,
      bankCardNumber: "",
      bankCardTransactions: [],
      selectedTransaction: null,
      searchHints: ['例:1x', '王x', '188x', '已撤单'],
      searchHintsforcard: ['例:银行卡号', '客户编号'],

      searchInput: {
        transactionType: "",
        userName: "",
        phoneNumber: "",
        orderStatus: "",
        startDate: "",
        endDate: ""
      },
      searchInputbycard: {
        bankCard: "",
        transactionType: "",
        userNamebycard: "",
        phoneNumberbycard: "",
        startDate: "",
        endDate: ""
      },
      currentPagefororder: 1, // 当前订单页数
      pageSize: 10, // 每页数据量 
      totalPagesfororder: 0,  //当前订单总页数
      currentPageforcard: 1,  //当前流水页数
      totalPagesforcard: 0, //当前流水总页数
      requestData: null,
      requestDataforcard: null,
      temp1: null,
      temp2: null,
    };
  },
  methods: {
    searchOrders() {
      // 根据关键字查询订单信息
      // 使用假数据进行示例，实际项目中根据后端接口进行调用
      if (this.searchInput.startDate === '' || this.searchInput.endDate === '') {
        this.requestData = {
          page: this.currentPagefororder,
          limit: this.pageSize,
          phone: this.searchInput.phoneNumber,
          realname: this.searchInput.userName,
          orderType: this.searchInput.transactionType,
          orderStatus: this.searchInput.orderStatus,
        };
      }
      else {
        const startDateParts = this.searchInput.startDate.split('-');
        const formattedStartDate = `${startDateParts[0]}-${parseInt(startDateParts[1])}-${startDateParts[2]} 00:00:00`;
        this.searchInput.startDate = formattedStartDate;
        const endDateParts = this.searchInput.endDate.split('-');
        const formattedEndDate = `${endDateParts[0]}-${parseInt(endDateParts[1])}-${endDateParts[2]} 00:00:00`;
        this.searchInput.endDate = formattedEndDate;
        this.requestData = {
          page: this.currentPagefororder,
          limit: this.pageSize,
          phone: this.searchInput.phoneNumber,
          realname: this.searchInput.userName,
          orderType: this.searchInput.transactionType,
          orderStatus: this.searchInput.orderStatus,
          startTime: this.searchInput.startDate,
          endTime: this.searchInput.endDate,
        };
      }

      // 过滤掉值为空的属性
      const filteredData = Object.fromEntries(
        Object.entries(this.requestData).filter(([_, value]) => value !== '')
      );
      this.temp1={...filteredData};
      const filteredData1 = { ...filteredData };
      filteredData1.limit =500;
      console.log(filteredData)
      core
        .fetch({
          method: "post",
          url: "/api3/fundorder/queryfundorder",
          headers: {
            'authorization': this.token
          },
          data: filteredData1
        })
        .then((res) => {
          const { success, data } = res;
          if (success) {
            const totalOrders = data.length;
            console.log(`data.length${data.length}`)
            this.totalPagesfororder = Math.ceil(totalOrders / this.pageSize);
            console.log(this.totalPagesfororder)
          }
        });
      core
        .fetch({
          method: "post",
          url: "/api3/fundorder/queryfundorder",
          headers: {
            'authorization': this.token
          },
          data: filteredData
        })
        .then((res) => {
          const { success, data } = res;
          if (success) {
            this.orders = data;
          }
        });
      this.searchInput = {
        transactionType: "",
        userName: "",
        phoneNumber: "",
        orderStatus: "",
        startDate: "",
        endDate: ""
      }
        this.selectedOrder = null; // 清空选中的订单详情
      this.requestData = null;
    },
    searchOrders1(){
      this.temp1.page=this.currentPagefororder
      console.log(this.totalPagesfororder)
      core
        .fetch({
          method: "post",
          url: "/api3/fundorder/queryfundorder",
          headers: {
            'authorization': this.token
          },
          data: this.temp1
        })
        .then((res) => {
          const { success, data } = res;
          if (success) {
            this.orders = data;
          }
        });
    },
    viewOrderDetails(order) {
      const id=order.orderId
      core
        .fetch({
          method: "get",
          url: `/api3/fundorder/${id}`,
          headers: {
            'authorization': this.token
          },
          
        })
        .then((res) => {
          if (res.success) {
            
            this.selectedOrder = res.data;
          }
        });
      
    },
    cancelOrder(order) {
      // 将订单标记为撤销状态
      axios({
        method: 'put',
        url: '/api3/fundorder',
        data: {
          orderId: order.orderId,
          userId: order.userId,
          fundId: order.fundId,
          orderDate: order.orderDate,
          orderType: order.orderType,
          orderAmount: order.orderAmount,
          orderNav: order.orderNav,
          orderStatus: "已撤单",
          orderConfirmationDate: order.orderConfirmationDate,
          cardId: order.cardId,
          paymentStatus: order.paymentStatus,
          settlementDate: order.settlementDate,
          orderUnits: order.orderUnits,
        },
        headers: {
          'authorization': this.token
        }
      })
        .then((response) => {
          // 请求成功处理
          if (response.data.success) {
            alert("撤单成功")
          }
          console.log(response.data);
        });
      console.log("Canceling order:", order.orderId);
      order.orderStatus = "已撤单";
    },
    searchbycard() {
      // 根据关键字查询银行卡流水记录
      // 使用假数据进行示例，实际项目中根据后端接口进行调用
      if (this.searchInputbycard.startDate === '' || this.searchInputbycard.endDate === '') {
        this.requestDataforcard = {
          page: this.currentPageforcard,
          limit: this.pageSize,
          phone: this.searchInputbycard.phoneNumberbycard,
          realname: this.searchInputbycard.userNamebycard,
          transactionType: this.searchInputbycard.transactionType,
          bankAccountNumber: this.searchInputbycard.bankCard,
        };
      }
      else {
        const startDateParts = this.searchInputbycard.startDate.split('-');
        const formattedStartDate = `${startDateParts[0]}-${parseInt(startDateParts[1])}-${startDateParts[2]} 00:00:00`;
        this.searchInputbycard.startDate = formattedStartDate;
        const endDateParts = this.searchInputbycard.endDate.split('-');
        const formattedEndDate = `${endDateParts[0]}-${parseInt(endDateParts[1])}-${endDateParts[2]} 00:00:00`;
        this.searchInputbycard.endDate = formattedEndDate;
        this.requestDataforcard = {
          page: this.currentPageforcard,
          limit: this.pageSize,
          phone: this.searchInputbycard.phoneNumberbycard,
          realname: this.searchInputbycard.userNamebycard,
          transactionType: this.searchInputbycard.transactionType,
          bankAccountNumber: this.searchInputbycard.bankCard,
          startTime: this.searchInputbycard.startDate,
          endTime: this.searchInputbycard.endDate,
        };
      }
      // 过滤掉值为空的属性
      const filteredData = Object.fromEntries(
        Object.entries(this.requestDataforcard).filter(([_, value]) => value !== '')
      );
      this.temp2={...filteredData};
      const filteredData1 = { ...filteredData };
      filteredData1.limit =500;
      console.log(filteredData)
      core
        .fetch({
          method: "post",
          url: "/api3/banktransaction/querybanktransaction",
          headers: {
            'authorization': this.token
          },
          data: filteredData1
        })
        .then((res) => {
          const { success, data } = res;
          if (success) {
            const totalOrders = data.length;
            console.log(`data.length${data.length}`)
            this.totalPagesforcard = Math.ceil(totalOrders / this.pageSize) + 1;
            console.log(this.totalPagesforcard)
          }
        });
      
      core
        .fetch({
          method: "post",
          url: "/api3/banktransaction/querybanktransaction",
          headers: {
            'authorization': this.token
          },
          data: filteredData
        })
        .then((res) => {
          const { success, data } = res;
          if (success) {
            this.bankCardTransactions = data;
          }
        });
      this.searchInputbycard = {
        bankCard: "",
        transactionType: "",
        userNamebycard: "",
        phoneNumberbycard: "",
        startDate: "",
        endDate: ""
      },
        this.selectedTransaction = null; // 清空选中的交易详情
        this.requestDataforcard=null;
    },
    searchbycard2(){
      this.temp2.page=this.currentPageforcard
      console.log(this.totalPagesforcard)
      core
        .fetch({
          method: "post",
          url: "/api3/banktransaction/querybanktransaction",
          headers: {
            'authorization': this.token
          },
          data: this.temp2
        })
        .then((res) => {
          const { success, data } = res;
          if (success) {
            this.bankCardTransactions = data;
          }
        });
    },
    viewTransactionDetails(transaction) {
      //
      const id = transaction.transactionId
      core
        .fetch({
          method: "get",
          url: `/api3/banktransaction/${id}`,
          headers: {
            'authorization': this.token
          },

        })
        .then((res) => {
          if (res.success) {
            
            this.selectedTransaction=res.data;
          }
        });

      
    },



    //银行卡流水部分
    toggleInputbycard(input) {
      this.activeInput = input;
      this.searchInput = '';
      this.searchPlaceholder = this.getSearchPlaceholder(input);
    },

    searchByBankCard() {
      // 调用按银行卡号查询的接口方法，传递银行卡号参数 (this.searchInput)
      core
        .fetch({
          method: "post",
          url: "/api3/banktransaction/querybanktransaction",
          headers: {
            'authorization': this.token
          },
          data: {
            page: 1,
            limit: 10,
            realname: "马化",
            startTime: '2023-5-19 00:00:00',
            endTime: '2023-5-20 00:00:00'
          }
        })
        .then((res) => {
          const { success, data } = res;
          if (success) {
            this.bankCardTransactions = data;
          }
        });
      this.selectedTransaction = null; // 清空选中的交易详情
    },
    searchByTransactionTypebycard() {
      // 调用按交易类型查询的接口方法，传递交易类型关键词参数 (this.searchInput)
    },
    searchByUserNamebycard() {
      // 调用按用户姓名查询的接口方法，传递用户姓名关键词参数 (this.searchInput)
    },
    searchByPhoneNumberbycard() {
      // 调用按用户手机号查询的接口方法，传递用户手机号参数 (this.searchInput)
    },
    getSearchPlaceholder(input) {
      if (input === 'bankCard') {
        return '请输入银行卡号';
      } else if (input === 'transactionType') {
        return '请输入交易类型关键词';
      } else if (input === 'userNamebycard') {
        return '请输入用户姓名关键词';
      } else if (input === 'phoneNumberbycard') {
        return '请输入用户手机号';
      }
    },
    closeCardDetailsModal() {
      this.selectedOrder = null;    //关闭订单详情
      this.selectedTransaction = null// 关闭银行卡详情弹窗
    },
    changePagefororder(page) {
      this.currentPagefororder = page;
      this.searchOrders1();
    },
    changePageforcard(page) {
      this.currentPageforcard = page;
      this.searchbycard2();
    }
  },

};
</script>


<style scoped>
.order-management {
  max-width: 1100px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #e6e6e6;
  border-radius: 4px;
  background-color: #f9f9f9;
  font-family: Arial, sans-serif;
}

.section {
  margin-bottom: 20px;

}

.section-detials {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #ffffff;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 600px;
  /* 调整弹窗的宽度 */
  height: 350px;
  /* 调整弹窗的高度 */
}

.search-bar {
  display: flex;
  align-items: center;
  margin-bottom: 3px;
}

.search-bar input {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  width: 280px;
}

.search-bar span {
  margin-left: 10px;
  font-size: 14px;
  color: #999;
}

.search-btn {
  margin-left: 10px;
  padding: 8px 16px;
  background-color: #2196f3;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
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
  padding: 10px;
  font-size: 14px;
  text-align: center;
}

.order-table th {
  background-color: #f5f5f5;
  text-align: left;
}

.order-details,
.transaction-details {
  margin-top: 10px;
  padding: 10px;
  border: 1px solid #e6e6e6;
  border-radius: 4px;
  background-color: #fff;
  font-size: 14px;
}

.order-details p,
.transaction-details p {
  margin-bottom: 5px;
}

p.empty-message {
  font-size: 14px;
  color: #666;
}

button {
  padding: 8px 16px;
  background-color: #2196f3;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
}

button:hover {
  background-color: #0c7cd5;
}

button:disabled,
button[disabled] {
  background-color: #ccc;
  cursor: not-allowed;
}

.order-details-row {
  display: flex;
  margin-bottom: 10px;
}

.order-details-column {
  flex: 1;
}

.transaction-details-row {
  display: flex;
  margin-bottom: 10px;
}

.transaction-details-column {
  flex: 1;
}
</style>
