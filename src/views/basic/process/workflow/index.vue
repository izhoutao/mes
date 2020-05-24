<template>
  <div class="app-container workflow">
    <el-row :gutter="5">
      <el-col :span="6" :xs="24">
        <el-card style="padding:0px;">
          <div slot="header" class="clearfix">
            <span>生产路线列表</span>
          </div>
          <workflow-list v-bind:currentWorkflow.sync="currentWorkflow"/>
        </el-card>
      </el-col>
      <el-col :span="18" :xs="24">
        <el-card style="padding:0px;">
          <div slot="header" class="clearfix">
            <span>生产路线详情</span>
          </div>
          <base-flow-editor :labels="labels" :currentWorkflow="currentWorkflow"
                            :key="JSON.stringify(currentWorkflow)"/>
        </el-card>
      </el-col>

    </el-row>
  </div>
</template>

<script>
  import WorkflowList from './components/workflow-list.vue'
  import BaseFlowEditor from './components/base-flow-editor.vue'
  import { getOperations } from '@/api/workflow.js'

  export default {
    name: 'workflow',
    data() {
      return {
        labels: [],
        currentWorkflow: {}
      }
    },
    components: { WorkflowList, BaseFlowEditor },
    created() {
      getOperations({orders: ['sequence_number asc']}).then(res => {
        this.labels = res.queryResult.list.map(item => item.name)
      })
    }
  }
</script>
<style lang="scss">
  .app-container.workflow {

  .el-card__body {
    padding: 0px
  }

  .el-row {
    height: 100%;
  }

  }
</style>
