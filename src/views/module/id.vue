<template>
  <div class="product-detail">
    <h2>详情页</h2>
    <h-row >
      <h-col span="10" style="margin-top: -20px;">
        <h-field-panel collapse >
        <span slot="title">基本信息</span>
        <h-row>
          <h-col span="12">
            <ul>
              <li>产品代码：{{ fundData.fundId }}</li>
              <li>产品名称：{{ fundData.fundName }}</li>
              <li>产品类型：{{ fundData.fundType }}</li>
              <li>产品状态：{{ fundData.fundStatus }}</li>
              <li>产品经理：{{ fundData.fundManager }}</li>
            </ul>
          </h-col>
          <h-col span="12">
            <ul>
              <li>风险等级：{{ fundData.riskLevel }}</li>
              <li>最小起投金额：{{ fundData.minInvestment }}</li>
              <li>单位净值：{{ fundData.currentNav }}</li>
              <li>总份额：{{ fundData.shares }}</li>
            </ul>
          </h-col>
        </h-row>
        </h-field-panel>
      </h-col>
    </h-row>
    <h-row style="margin-top: 20px;">
      <h-col span="10">
        <div id="lineEchart" class="line-echart"></div>
      </h-col>
      <h-col span="10" style="margin-left: 150px;margin-top: -200px;">
        <h2>基金业绩</h2>
        <h-table
          height="450" 
          headAlgin="center"
          bodyAlgin="center"
          :row-class-name="rowClassName"
          :columns = "tablecolumns"
          :data="fundHistory"
        ></h-table>
      </h-col>
    </h-row>
  </div>
</template>

<script>
import core from "@hsui/core";
import { PRODUCT_TYPE_ORM, PRODUCT_STATUS_ORM } from "../../constant";

export default {
  data() {
    this.productTypeOrm = PRODUCT_TYPE_ORM;
    this.productStatusOrm = PRODUCT_STATUS_ORM;
    return {
      startDate: "2023-03-01",  //数据开始日期
      limit: 100,   //数据条数
      fundId: null, //详情页产品id
      fundData: {},  //详情页产品信息
      fundHistory: [], //基金历史信息
      dailyGrowthRate: [], //净值涨幅历史
      navHistory:[],  //净值历史
      dateHistory: [], //日期信息
      funds: [],
      tablecolumns: [
        {
          title: "日期",
          key: "recordDate",
        },
        {
          title: "净值",
          key: "nav",
        },
        {
          title: "涨幅",
          key: "dailyGrowthRate",
        }
      ],
    };
  },
  created() {
    const fundId = this.$route.query.fundId;
    this.fundId = fundId;
    console.log("产品详情: " + fundId);
    this.getFund(this.fundId);
    this.getFundHistory(this.fundId);
  },
  mounted() {
    setTimeout(() => {
      this.historyInit();
      this.drawLineEchart();
    },300)
    
  },
  
  methods: {
    getFund(fundId){
      core
      .fetch({
        headers: {
            'authorization': localStorage.getItem('token')
          },
        method: "get",
        url: `/api4/fund/${fundId}`,
      })
      .then((res) => {
        const {success, data} = res;
        if(success){
          this.funds.push(data.fundName)
          this.funds.push("涨幅")
          this.fundData = data;
        }
      });
    },
    getFundHistory(fundId){
      core
      .fetch({
        headers: {
            'authorization': localStorage.getItem('token')
          },
        method: "get",
        url: `/api4/fundHistory/pageQuery`,
        data:{
          page: 1,
          limit: this.limit,
          recordDate: this.startDate,
          fundId: fundId
        }
      })
      .then((res) => {
        const {success, data} = res;
        if(success){
          console.log(data)
          this.fundHistory = data;
        }
      });
    },
    historyInit(){
      const fundHistory = this.fundHistory;
      for(let i = 0; i<fundHistory.length; i++){
        this.navHistory.push(fundHistory[i].nav)
        this.dateHistory.push(fundHistory[i].recordDate)
        this.dailyGrowthRate.push(fundHistory[i].dailyGrowthRate)
      }
    },
    drawLineEchart() {
      // 基于准备好的dom，初始化echarts实例
      const echart = this.$echarts.init(document.getElementById("lineEchart"));
      
      // 指定图表的配置项和数据
      const option = {
        title: {
          text: '净值走势'
        },
        tooltip: {
          trigger: "axis",
        },
        legend: {
          data: this.funds,
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        toolbox: {
          feature: {
            saveAsImage: {},
          },
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: this.dateHistory,
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            name: this.funds[0],
            type: "line",
            stack: "Total",
            data: this.navHistory,
          },
          {
            name: this.funds[1],
            type: "line",
            stack: "Total",
            data: this.dailyGrowthRate,
          },
        ],
      };
      // 使用刚指定的配置项和数据显示图表。
      echart.setOption(option);
    },
    rowClassName(row, index){
      if(row.dailyGrowthRate >0 ){
        return "table-red-row";
      }else{
        return "table-green-row"
      }
    },
  },
};
</script>

<style lang="less">
.product-detail {
  h2 {
    font-size: 18px;
    margin-bottom: 24px;
  }

  ul {
    margin-bottom: 24px;
  }

  li {
    line-height: 30px;
  }
}

.line-echart {
  width: 600px;
  height: 400px;
}

.h-table .table-green-row td {
  background-color: #fff;
  color: #03e012;
}
.h-table .table-red-row td {
  background-color: #fff;
  color: #ff0000;
}

</style>
