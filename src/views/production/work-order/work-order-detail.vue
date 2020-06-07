<template>
  <el-tabs :value="activeName" @tab-click="handleClick">
    <el-tab-pane label="工单详情" name="first" class="work-order-detail-tab-container">
      <el-form label-width="125px">
        <el-row>
          <el-col :span="7">
            <el-form-item label="产品名称：" prop="materialName">
              <span>{{detail.materialName}} </span>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="需求重量(kg)：" prop="num">
              <span>{{detail.num}} </span>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="完成重量(kg)：" prop="num">
              <span>{{detail.outputNum}} </span>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="上线重量(kg)：" prop="num">
              <span>{{detail.onLineNum}} </span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="7">
            <el-form-item label="预计开始日期：" prop="schStartTime">
              <span>{{detail.schStartTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}} </span>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="预计结束日期：" prop="schCloseTime">
              <span>{{detail.schCloseTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}} </span>
            </el-form-item>
          </el-col>

          <el-col :span="5">
            <el-form-item label="工艺流程：" prop="workflowId">
              <span>{{detail.workflowId | showName(workflows)}} </span>
            </el-form-item>
          </el-col>

          <el-col :span="5">
            <el-form-item label="产线：" prop="lineId">
              <span>{{detail.lineId | showName(lines)}} </span>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="7">
            <el-form-item label="目标宽度：" prop="targetWidth">
              <span>{{detail.targetWidth}} </span>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="宽度容差：" prop="toleranceWidth">
              <span>{{detail.toleranceWidth}} </span>
            </el-form-item>
          </el-col>

          <el-col :span="5">
            <el-form-item label="目标厚度：" prop="targetThickness">
              <span>{{detail.targetThickness}} </span>
            </el-form-item>
          </el-col>

          <el-col :span="5">
            <el-form-item label="厚度容差：" prop="toleranceThickness">
              <span>{{detail.toleranceThickness}} </span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="生产要求：" prop="schStartTime">
              <span>{{detail.requirements}} </span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="7">
            <el-form-item label="创建时间：" prop="updateTime">
              <span>{{detail.createTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}} </span>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="最后更新时间：" prop="updateTime">
              <span>{{detail.updateTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}} </span>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="创建人：" prop="createPerson">
              <span>{{detail.createPerson}} </span>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="最后更新人：" prop="updatePerson">
              <span>{{detail.updatePerson}} </span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-tab-pane>

    <el-tab-pane label="工单物料" name="second">
      <work-order-raw-material :workOrderNumber="detail.workOrderNumber"/>
    </el-tab-pane>
  </el-tabs>
</template>
<script>
  import workOrderRawMaterial from './work-order-raw-material'

  export default {
    components: { workOrderRawMaterial },
    props: ['detail', 'workflows', 'lines'],
    data() {
      return {
        name: 'WorkOrderDetail',
        activeName: 'first',
        detailInfo: this.detail
      }
    },
    filters: {
      showName: function(id, list) {
        var item = list.find(item => item.id === id)
        if (!item) return ''
        return item.name
      }
    },
    methods: {
      handleClick(tab, event) {
        // console.log(tab, event)
      }
    }
  }
</script>

<style lang="scss">
  .work-order-detail-tab-container {

  .el-form-item {
    margin: 0px;
  }

  .el-col {
    border: 1px solid #EBEEF5;
  .el-form-item__label{
    padding: 0px;
    border-right: 1px solid #EBEEF5;
  }
  .el-form-item__content{
    text-align: center;
  }
  }

  }
</style>
