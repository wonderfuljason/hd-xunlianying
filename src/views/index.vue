<template>
  <div class="login-container">
    <div class="login-box">
      <div class="avatar-box">
        <img src="../assets/logo.png" class="avatar" alt="" />
      </div>
      <div class="form-login">
        <div class="form-group">
          <label for="phone">手机号</label>
          <input type="text" class="form-control" id="phone" placeholder="请输入手机号" autocomplete="off"
            v-model.trim="phone" />
        </div>
        <div class="form-group">
          <label for="verification">验证码</label>
          <input type="text" class="form-control" id="verification" placeholder="请输入验证码" v-model.trim="verification" />
          <button type="button" class="btn btn-verification" @click="sendVerificationCode">{{ verificationButtonText
          }}</button>
        </div>
        <div class="form-group d-flex justify-content-end">
          <button type="button" class="btn btn-reset" @click="reset">重置</button>
          <button type="button" class="btn btn-login" @click="login">登录</button>
        </div>
      </div>
    </div>
  </div>
</template>
 
<script >
import core from "@hsui/core";
export default {
  name: 'Login',
  data() {
    return {
      phone: '',
      verification: '',
      disableSendVerification: false,
      verificationButtonText: '发送验证码'
    };
  },
  methods: {
    reset() {
      this.phone = '';
      this.verification = '';
    },

    sendVerificationCode() {
      // 构造请求参数


      // 发送 POST 请求
      core.
        fetch({
          method: 'post',
          url:'http://124.220.32.107:3000/mock/11/user/code',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          data: { phone: this.phone }
        })
        .then(data => {
          if (data.success) {
            console.log('验证码发送成功');
            this.disableSendVerification = true;
            this.verificationButtonText = '60s 后重发';

            let count = 60;
            const intervalId = setInterval(() => {
              count--;
              this.verificationButtonText = `${count}s 后重发`;
              if (count === 0) {
                clearInterval(intervalId);
                this.disableSendVerification = false;
                this.verificationButtonText = '发送验证码';
              }
            }, 1000);
          } else {
            console.log('验证码发送失败:', data.errorMsg);
          }
        })
        .catch(error => {
          console.error('接口调用失败:', error);
        });
    },

    login() {
      if (this.phone === '123456' && this.verification === '666') {
        // 登录成功
        // 1. 存储 token
        localStorage.setItem('token', 'Bearer xxxx');
        // 2. 跳转到后台主页
        this.$router.push('/module');
      } else {
        // 登录失败
        localStorage.removeItem('token');
      }
    }
  }
};
</script>

  
<style scoped>
.login-container {
  background-color: #f5f5f5;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-box {
  width: 400px;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.avatar-box {
  text-align: center;
  padding: 20px 0;
}

.avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin: 0 auto;
}

.form-login {
  padding: 20px;
}

.form-group {
  margin-bottom: 20px;
}

label {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.form-control {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 3px;
}

.btn-reset,
.btn-login {
  padding: 10px 20px;
  font-size: 16px;
  font-weight: bold;
  border-radius: 3px;
  cursor: pointer;
}

.btn-reset {
  background-color: #eee;
  color: #333;
  margin-right: 10px;
}

.btn-login {
  background-color: #007bff;
  color: #fff;
}

.btn-reset:hover,
.btn-login:hover {
  opacity: 0.8;
}
</style>
    