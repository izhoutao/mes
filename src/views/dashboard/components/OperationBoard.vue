<template>
  <el-row class="operation-board-container">
    <el-col :span="24" class="card-panel-col" style="text-align: center;color: rgba(0,0,0,0.45);font-weight:bold;">
      任务看板
    </el-col>
    <el-col :span="24" class="card-panel-col">
      <el-table :key="tableKey" :data="list" border fit highlight-current-row
                style="width: 100%;font-size: 16px;"
                class="card-panel">
        <el-table-column label="序" width="60px" type="index" align="center" fixed>
        </el-table-column>
        <el-table-column label="当前工序" min-width="160px" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.nextOperationLabel }}</span>
          </template>
        </el-table-column>

        <el-table-column label="工单号" min-width="160px" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.workOrderNumber }}</span>
          </template>
        </el-table-column>

        <el-table-column label="原料编号" min-width="160px" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.materialNumber }}</span>
          </template>
        </el-table-column>
        <el-table-column label="钢卷编号" min-width="160px" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.productNumber }}</span>
          </template>
        </el-table-column>
        <el-table-column label="工单规定结束日期" min-width="160px" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.schCloseTime | parseTime('{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="生产进度" min-width="160px" align="center">
          <template slot-scope="scope">
            <el-progress :text-inside="true" :stroke-width="20" :percentage="scope.row.progress*100"></el-progress>
          </template>
        </el-table-column>

      </el-table>
    </el-col>

  </el-row>
</template>

<script>
  import { getOperationBoardPage } from '@/api/outboundorderrawitem'

  export default {
    name: 'OperationBoard',
    data() {
      return {
        tableKey: 0,
        list: [],
        total: 0,
        listQuery: {
          current: 1,
          size: 5
        }
      }
    },
    created() {
      this.refreshData()
      setInterval(this.refreshData, 3000)
    },
    methods: {
      getProgress(jsonTextWorkflow, nextOperationLabel) {
        let workflow = JSON.parse(jsonTextWorkflow)
        let nextOperation = workflow[0]
        let total = 0
        let rem = 0
        let flag = false
        while (nextOperation) {
          total++
          if (nextOperationLabel == nextOperation.label) {
            flag = true
          }
          if (flag) {
            rem++
          }
          if (!nextOperation.next.length) {
            return total ? (total - rem) / total : 0
          }
          for (let i = 0; i < nextOperation.next.length; i++) {
            if (!nextOperation.next[i].condition || nextOperation.next[i].condition == 'OK') {
              nextOperation = workflow[nextOperation.next[i].index]
              break
            }
          }
        }
      },

      refreshData() {
        let totalPage = Math.ceil(this.total / this.listQuery.size)
        if (this.listQuery.current > totalPage) {
          this.listQuery.current = 1
        }
        getOperationBoardPage(this.listQuery).then(res => {
          this.list = res.queryResult.list.map(item => {
            item.progress = this.getProgress(item.jsonTextWorkflow, item.nextOperationLabel)
            return item
          })
          this.total = res.queryResult.total
          this.listQuery.current++
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  /*  .card-panel-col {
      height: 500px;
    }*/
  .panel-group .card-panel {
    height: auto !important;
  }
</style>
