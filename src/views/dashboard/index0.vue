<template>
  <div class="app-container dashboard-container">
    <el-row :gutter="60" class="panel-group">
      <el-col :span="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-people">
            <svg-icon icon-class="peoples" class-name="card-panel-icon"/>
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              工单数量（未完成）
            </div>
            <count-to :start-val="0" :end-val="incompleteWorkOrderQuantity" :duration="1800" class="card-panel-num"/>
          </div>
        </div>
      </el-col>
      <el-col :span="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-message">
            <svg-icon icon-class="message" class-name="card-panel-icon"/>
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              待完成重量
            </div>
            <count-to :start-val="0" :end-val="incompleteWeight" :duration="1800" class="card-panel-num"/>
            <span class="card-panel-num">kg</span>
          </div>
        </div>
      </el-col>
      <el-col :span="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-money">
            <svg-icon icon-class="money" class-name="card-panel-icon"/>
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              当月成品入库
            </div>
            <count-to :start-val="0" :end-val="currentMonthInboundFinishedProductWeight" :duration="1800"
                      class="card-panel-num"/>
            <span class="card-panel-num">kg</span>
          </div>
        </div>
      </el-col>
      <el-col :span="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-shopping">
            <svg-icon icon-class="shopping" class-name="card-panel-icon"/>
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              准时完成率
            </div>
            <count-to :start-val="0" :end-val="onTimeCompletionRate" :duration="1800" class="card-panel-num"/>
            <span class="card-panel-num">%</span>
          </div>
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="panel-group">
      <el-col :span="6" class="card-panel-col">
        <completion id="completion-chart" width="350px" height="300px" class="card-panel"/>
      </el-col>
      <el-col :span="12" class="card-panel-col">
        <work-order-count/>
      </el-col>
      <el-col :span="6" class="card-panel-col">
        <pie-chart id="defect-chart" width="350px" height="300px" class="card-panel"/>
      </el-col>

    </el-row>
    <el-row :gutter="20" class="panel-group">

      <el-col :span="24" class="card-panel-col">
        <operation-board/>
      </el-col>
    </el-row>

  </div>

</template>

<script>
  import CountTo from 'vue-count-to'
  import Completion from './components/completion'
  import PieChart from './components/PieChart'
  import WorkOrderCount from './components/WorkOrderCount'
  import OperationBoard from './components/OperationBoard'

  import { getCompletionBasicInfos } from '@/api/workorder'

  export default {
    components: {
      CountTo, Completion, PieChart,WorkOrderCount,OperationBoard
    },
    created() {
      this.getInfos()
    },

    data() {
      return {
        incompleteWorkOrderQuantity: 0,
        incompleteWeight: 0,
        currentMonthInboundFinishedProductWeight: 0,
        onTimeCompletionRate: 0
      }
    },
    methods: {
      getInfos() {
        this.getCompletionBasicInfos()
        setInterval(this.getCompletionBasicInfos, 3000)
      },
      getCompletionBasicInfos() {
        getCompletionBasicInfos().then(res => {
          this.incompleteWorkOrderQuantity = res.model.incompleteWorkOrderQuantity
          this.incompleteWeight = res.model.incompleteWeight
          this.currentMonthInboundFinishedProductWeight = res.model.currentMonthInboundFinishedProductWeight
          this.onTimeCompletionRate = res.model.onTimeCompletionRate * 100
        })
      }
    }

  }
</script>

<style lang="scss">
  .panel-group {
    margin-top: 0px;

  .card-panel-col {
    margin-bottom: 10px;
  }

  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);

  &
  :hover {

  .card-panel-icon-wrapper {
    color: #fff;
  }

  .icon-people {
    background: #40c9c6;
  }

  .icon-message {
    background: #36a3f7;
  }

  .icon-money {
    background: #f4516c;
  }

  .icon-shopping {
    background: #34bfa3
  }

  }

  .icon-people {
    color: #40c9c6;
  }

  .icon-message {
    color: #36a3f7;
  }

  .icon-money {
    color: #f4516c;
  }

  .icon-shopping {
    color: #34bfa3
  }

  .card-panel-icon-wrapper {
    float: left;
    margin: 14px 0 0 14px;
    padding: 16px;
    transition: all 0.38s ease-out;
    border-radius: 6px;
  }

  .card-panel-icon {
    float: left;
    font-size: 48px;
  }

  .card-panel-description {
    float: right;
    font-weight: bold;
    margin: 26px;
    margin-left: 0px;

  .card-panel-text {
    line-height: 18px;
    color: rgba(0, 0, 0, 0.45);
    font-size: 16px;
    margin-bottom: 12px;
  }

  .card-panel-num {
    font-size: 20px;
  }

  }
  }
  }

  @media (max-width: 550px) {
    .card-panel-description {
      display: none;
    }

    .card-panel-icon-wrapper {
      float: none !important;
      width: 100%;
      height: 100%;
      margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }

  }
</style>
