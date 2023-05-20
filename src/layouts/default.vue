<template>
  <div class="header">
    
    <img src="../assets/logo.png" alt="Logo" class="logo-icon">
    <h1>理财销售交易系统</h1>
    
    
    <div class="items">
      <router-link to="/">登录&注册</router-link>
      
    </div>
    
    <div>
      <router-view></router-view>
    </div>

  </div>
</template>

<script></script>

<style scoped>
.header {
  height: 70px;
  background-color: #16202e;
  
  
}

h1 {
  margin-bottom: 10px;
  text-align: center;
  color: aliceblue;
}



.logo-icon {
  float: left;
  width: 70px;
  height: 70px;
}
.items {
  text-align: center;
  line-height: 24px;
}

</style>