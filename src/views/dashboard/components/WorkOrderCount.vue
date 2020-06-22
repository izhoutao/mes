<template>
  <el-row :gutter="20">
    <el-col :span="8" class="card-panel-col">
      <table class="card-panel work-order-table">
        <tr>
          <th colspan="2">本月新增工单</th>
        </tr>
        <tr>
          <td>工单数</td>
          <td>{{newWorkOrderCountOfThisMonth}}</td>
        </tr>
        <tr>
          <td>需求总重量</td>
          <td>{{newWorkOrderWeightOfThisMonth}}</td>
        </tr>
        <tr>
          <td>已完成重量</td>
          <td>{{newWorkOrderCompletedWeightOfThisMonth}}</td>
        </tr>
      </table>
    </el-col>
    <el-col :span="8" class="card-panel-col">
      <table class="card-panel work-order-table">
        <tr>
          <th colspan="2">今日需完成工单</th>
        </tr>
        <tr>
          <td>工单数</td>
          <td>{{todayWorkOrderCount}}</td>
        </tr>
        <tr>
          <td>需求总重量</td>
          <td>{{todayWorkOrderWeight}}</td>
        </tr>
        <tr>
          <td>线上重量</td>
          <td>{{todayWorkOrderOnlineWeight}}</td>
        </tr>
      </table>
    </el-col>
    <el-col :span="8" class="card-panel-col">
      <table class="card-panel work-order-table">
        <tr>
          <th colspan="2">七日内需完成工单</th>
        </tr>
        <tr>
          <td>工单数</td>
          <td>{{future7daysWorkOrderCount}}</td>
        </tr>
        <tr>
          <td>需求总重量</td>
          <td>{{future7daysWorkOrderWeight}}</td>
        </tr>
        <tr>
          <td>线上重量	</td>
          <td>{{future7daysWorkOrderOnlineWeight}}</td>
        </tr>
      </table>
    </el-col>

  </el-row>
</template>

<script>
  import { getWorkOrderBasicInfos } from '@/api/workorder'

  export default {
    name: 'WorkOrderCount',
    data() {
      return {
        newWorkOrderCountOfThisMonth: 0,
        newWorkOrderWeightOfThisMonth: 0,
        newWorkOrderCompletedWeightOfThisMonth: 0,
        todayWorkOrderCount: 0,
        todayWorkOrderWeight: 0,
        todayWorkOrderOnlineWeight: 0,
        future7daysWorkOrderCount: 0,
        future7daysWorkOrderWeight: 0,
        future7daysWorkOrderOnlineWeight: 0
      }
    },
    mounted() {
      this.refreshData()
      this.timer = setInterval(this.refreshData, 3000)
    },
    destroyed(){
      clearInterval(this.timer)
    },
    methods: {
      refreshData() {
        getWorkOrderBasicInfos().then(res => {
          this.newWorkOrderCountOfThisMonth = res.model.newWorkOrderCountOfThisMonth
          this.newWorkOrderWeightOfThisMonth = res.model.newWorkOrderWeightOfThisMonth
          this.newWorkOrderCompletedWeightOfThisMonth = res.model.newWorkOrderCompletedWeightOfThisMonth
          this.todayWorkOrderCount = res.model.todayWorkOrderCount
          this.todayWorkOrderWeight = res.model.todayWorkOrderWeight
          this.todayWorkOrderOnlineWeight = res.model.todayWorkOrderOnlineWeight
          this.future7daysWorkOrderCount = res.model.future7daysWorkOrderCount
          this.future7daysWorkOrderWeight = res.model.future7daysWorkOrderWeight
          this.future7daysWorkOrderOnlineWeight = res.model.future7daysWorkOrderOnlineWeight
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .card-panel-col {
    height: 300px;
  }

  .work-order-table {
    width: 100%;
    height: 100% !important;
    font-size: 16px !important;

  th {
    height: 50px;
  }

  th, td {
    text-align: center;
  }

  }
</style>
