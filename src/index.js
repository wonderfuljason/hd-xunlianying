import Vue from 'vue'
import hCore, { store } from "@hsui/core";
import "./reset.css";
import * as echarts from 'echarts'
import h_ui from 'h_ui'
import "h_ui/dist/h_ui.min.css"

Vue.use(h_ui)
Vue.prototype.$echarts=echarts;

const app = hCore({
  extraModelOptions: {
    store,
  },
});

app.middleware('before-route-change', (to, from, next) =>{
  const pathArr=['/module','/module/account','/module/bankcard','/module/buy','/module/liquidation','/module/orderservice','/module/production','/module/sell','/module/id']
  if (pathArr.indexOf(to.path) !== -1) {
    const token = localStorage.getItem('token')
    if (token) {
      next()
    } else {
      next('/')
    }
  } else {
  next()
  }
});


app.start();
