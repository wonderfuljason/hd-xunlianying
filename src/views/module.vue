<template>
  <div class="layout">
    <div class="layout-menu-left">
      <ul class="layout-menu">
        <li class="layout-logo-left"></li>
        <li>
          <router-link to="/module/production">产品管理</router-link>
        </li>
        <li>
          <router-link to="/module/buy">申购</router-link>
        </li>
        <li>
          <router-link to="/module/sell">赎回</router-link>
        </li>
        
        <li>
          <router-link to="/module/account">客户管理</router-link>
        </li>
        <li>
          <router-link to="/module/bankcard">银行卡服务</router-link>
        </li>
        <li>
          <router-link to="/module/orderservice">订单服务</router-link>
        </li>
        <li>
          <router-link to="/module/liquidation">清算</router-link>
        </li>
      </ul>
      <div class="loginout">
        <img src="../assets/loginout.png" alt="loginout">
        <a href="javascript:;" @click="logout">退出登录</a> 
        
      </div>
    </div>
    <div class="layout-content">
      <div class="layout-content-main">
        <router-view />
      </div>
      <div class="layout-footer">&copy;2023 HUNDSUN 版权所有</div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    jump(path) {
      this.$hCore.navigate(path);
    },
    logout(){
      localStorage.setItem('token', '');
      this.$hCore.navigate('/');
    }
  },
};
</script>

<style>
.layout {
  display: flex;
  height: 100vh;
}

.layout-menu-left {
  flex: 0 0 250px;
  background-color: #333;
  color: #fff;
  padding-top: 20px;
}

.layout-menu {
  list-style: none;
  padding: 0;
  margin: 0;
}

.layout-menu li {
  margin-bottom: 10px;
  padding: 10px;
}

.layout-menu li a {
  display: block;
  line-height: 40px;
  color: #fff;
  text-decoration: none;
  font-size: 18px;
}

.layout-menu li a:hover {
  text-decoration: underline;
  background-color: #181818;
}

.layout-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.layout-content-main {
  flex: 1;
  background-color: #fff;
  padding: 20px;
}

.layout-footer {
  text-align: center;
  background-color: #fff;
  color: black;
  height: 30px;
  line-height: 30px;
}

.loginout {
  padding-left: 15px;
 
  margin-top: 40px;
}

.loginout img {
  height: 30px;
  width: 30px;
  display: inline-block;
  background-color: #333;
  vertical-align: bottom;
}

.loginout a {
  display: inline-block;
  line-height: 30px;
}
</style>
