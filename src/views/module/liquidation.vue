<template>
    
    <div class="clearing-l">
      <h1>清算模块</h1>
  
      <div class="clearing-info-l">
        <div class="status-l">
          <h3>今日清算状态:</h3>
          <p :class="{ 'completed-l': isClearingComplete }">
            {{ isClearingComplete ? '已完成' : '未完成' }}
          </p>
        </div>
  
        <div class="system-time-l">
          <h3>系统当前时间:</h3>
          <p>{{ currentSystemTime }}</p>
        </div>

      </div>

      <div class="logo-l">
            <h1>能运行就行队</h1>
            <h2>杭电-恒生金融科技训练营</h2>
      </div>

    </div>
    
</template>
  
<script >
  export default {
    data() {
      return {
        isClearingComplete: false,
        currentSystemTime: ''
      };
    },
    mounted() {
      this.getCurrentSystemTime();
      this.updateSystemTime();
    },
    methods: {
      getCurrentSystemTime() {
        const now = new Date();
        this.currentSystemTime = now.toLocaleString();
      },
      updateSystemTime() {
        setInterval(() => {
          this.getCurrentSystemTime();
        }, 1000);
      }
    }
  };
</script>
  
<style >
  .clearing-l {
    text-align: center;
    background-color: #f5f7fa;
    padding: 20px;
    border-radius: 8px;
  }
  
  .clearing-info-l {
    margin-top: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 200px;
    background-color: #f1f3f4;
  }
  
  .status-l,
  .system-time-l {
    margin-right: 40px;
  }
  
  h2 {
    text-align: center;
    color: #333;
    margin-bottom: 20px;
  }
  
  h3 {
    font-weight: bold;
    font-size: 18px;
    margin-bottom: 10px;
    color: #555;
  }
  
  p {
    margin-top: 10px;
    font-size: 16px;
  }
  
  .completed-l {
    color: #28a745; /* 绿色 */
  }
  
  .logo-l {
    margin-top: 200px;
  }
</style>
  