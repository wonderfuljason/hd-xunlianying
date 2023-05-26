<template>
    
  <div class="clearing-l">
    <h1>清算模块</h1>

    
    <div class="clearing-info-l">
      <div class="status-l">
        <button @click="getCompleted">清算:</button>
        <p :class="{ 'completed-l': isClearingComplete }">
          {{ isClearingComplete ? '清算成功' : '未完成清算' }}
        </p>
      </div>

      <div class="system-time-l">
        <button @click="getCurrentSystemTime">更新日期:</button>
        <p>{{ currentSystemTime }}</p>
      </div>

    </div>

    <div class="clearing-info-l">
      <div class="status-l">
        <button @click="backup">备份</button>
        <p :class="{ 'completed-l': isbackup }">
          {{ isbackup ? '已备份' : '未备份' }}
        </p>
      </div>

      <div class="system-time-l">
        <input type="text" v-model="route" placeholder="请输入文件路径">
        <button @click="recovery">数据恢复</button>
      </div>

    </div>

    <div class="logo-l">
          <h1>能运行就行队</h1>
          <h2>杭电-恒生金融科技训练营</h2>
    </div>

  </div>
  
</template>

<script >
import core from "@hsui/core";
export default {
  data() {
    return {
      isClearingComplete: false,
      currentSystemTime: '',
      token: localStorage.getItem('token'),
      route: '',
      isbackup: false,
    };
  },
  
  methods: {
    getCurrentSystemTime() {
      core 
         .fetch({
          method: 'post',
          url: '/api6/date',
          headers: {
          'authorization': this.token,
          
          },
         })
         .then((res)=>{
          if(res.success){
            this.currentSystemTime=res.data;
          }
          console.log(res)
         });

      
    },
    getCompleted(){
      core 
         .fetch({
          method: 'post',
          url: '/api6/clear',
          headers: {
          'authorization': this.token
          },
         })
         .then((res)=>{
          if(res.success){
            this.isClearingComplete=true;
          }
          console.log(res)
         });
    },
    backup(){
      core
          .fetch({
            method: 'post',
            url: '/api6/db/backup',
            headers: {
          'authorization': this.token
           },
          })
          .then((res)=>{
            if(res.success){
              this.isbackup=true;
            }
          });
    },
    recovery(){
      const formData = new FormData();
      formData.append('file', this.route);
      core 
          .fetch({
            method: 'post',
            url: '/api6/db/recover',
            headers: {
            'authorization': this.token
           },
           body: formData
          })
          .then((res)=>{
            if(res.success){
              alert("恢复成功")
            }
          });
    }
  }
};
</script>

<style scoped>
.clearing-l {
  text-align: center;
  background-color: #f5f7fa;
  padding: 20px;
  border-radius: 8px;
}

.clearing-info-l {
  margin-top: 90px;
  display: flex;
  justify-content: center;
  align-items: center;
  
  background-color: #f1f3f4;
}

.status-l,
.system-time-l {
  margin-right: 40px;
}

.system-time-l input {
  height: 30px;
}
/*.system-time-l button {
  text-align: center;
  color: #333;
  margin-bottom: 20px;
}
*/
 button{
  font-weight: bold;
  font-size: 18px;
  margin-top: 0px;
  color: #555;
}

p {
  margin-top: 10px;
  font-size: 16px;
  height: 24px;
}

.completed-l {
  color: #28a745; /* 绿色 */
}

.logo-l {
  margin-top: 200px;
}
</style>
