<template>
  <el-table v-loading="listLoading" :data="list" border fit highlight-current-row
            style="width: 100%;margin-top: 10px">
    <el-table-column label="序" width="60px" type="index" align="center" fixed>
    </el-table-column>
    <el-table-column label="原料编号" width="160px" align="center">
      <template slot-scope="scope">
        <span>{{ scope.row.materialNumber }}</span>
      </template>
    </el-table-column>
    <el-table-column label="钢卷编号" width="160px" align="center">
      <template slot-scope="scope">
        <span>{{ scope.row.productNumber }}</span>
      </template>
    </el-table-column>
    <el-table-column label="当前制程" width="160px" align="center">
      <template slot-scope="scope">
        <span>{{ scope.row.nextOperationLabel }}</span>
      </template>
    </el-table-column>

    <el-table-column label="钢种" width="100px" align="center">
      <template slot-scope="scope">
        <span>{{ scope.row.steelGrade }}</span>
      </template>
    </el-table-column>
    <el-table-column label="产地" min-width="80px" align="center">
      <template slot-scope="scope">
        <span>{{ scope.row.vendorName}}</span>
      </template>
    </el-table-column>
    <el-table-column label="厚度|(mm)" width="100px" align="center" :render-header="renderHeader">
      <template slot-scope="scope">
        <span>{{ scope.row.thickness }}</span>
      </template>
    </el-table-column>
    <el-table-column label="宽度|(mm)" width="100px" align="center" :render-header="renderHeader">
      <template slot-scope="scope">
        <span>{{ scope.row.width }}</span>
      </template>
    </el-table-column>
    <el-table-column label="毛重|(kg)" width="100px" align="center" :render-header="renderHeader">
      <template slot-scope="scope">
        <span>{{ scope.row.grossWeight }}</span>
      </template>
    </el-table-column>
    <el-table-column label="净重|(kg)" width="100px" align="center" :render-header="renderHeader">
      <template slot-scope="scope">
        <span>{{ scope.row.netWeight }}</span>
      </template>
    </el-table-column>
    <el-table-column label="复磅毛重|(kg)" width="100px" align="center" :render-header="renderHeader">
      <template slot-scope="scope">
        <span>{{ scope.row.grossWeight2 }}</span>
      </template>
    </el-table-column>
    <el-table-column label="包装重量|(kg)" width="100px" align="center" :render-header="renderHeader">
      <template slot-scope="scope">
        <span>{{ scope.row.packageWeight }}</span>
      </template>
    </el-table-column>
    <el-table-column label="合同号" width="100px" align="center">
      <template slot-scope="scope">
        <span>{{ scope.row.contractNumber }}</span>
      </template>
    </el-table-column>
    <el-table-column label="客户" width="100px" align="center">
      <template slot-scope="scope">
        <span>{{ scope.row.customerName }}</span>
      </template>
    </el-table-column>
    <el-table-column label="下单日期" width="100px" align="center">
      <template slot-scope="scope">
        <span>{{ scope.row.orderTime | parseTime('{y}-{m}-{d}') }}</span>
      </template>
    </el-table-column>
    <el-table-column label="订单厚度" width="100px" align="center">
      <template slot-scope="scope">
        <span>{{ scope.row.orderThickness }}</span>
      </template>
    </el-table-column>
    <el-table-column label="轧延厚度" width="100px" align="center">
      <template slot-scope="scope">
        <span>{{ scope.row.rollingThickness }}</span>
      </template>
    </el-table-column>

    <el-table-column label="时间" width="100px" align="center">
      <template slot-scope="scope">
        <span>{{ scope.row.time | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}</span>
      </template>
    </el-table-column>

  </el-table>
</template>

<script>
  import { getOutboundOrderRawItems } from '@/api/outboundorderrawitem'

  export default {
    name: 'workOrderRawMaterial',
    props: ['workOrderNumber'],
    data() {
      return {
        list: [],
        total: 0,
        listLoading: true,
        listQuery: {
          current: 1,
          size: 10,
          workOrderNumber: this.workOrderNumber,
          status: 0
        }
      }
    },
    created() {
      this.listLoading = true
      this.$nextTick(() => {
        this.getList()
      })
    },

    methods: {
      getList() {
        getOutboundOrderRawItems(this.listQuery).then(res => {
          this.list = res.queryResult.list
          this.total = res.queryResult.total
          this.listLoading = false
        })
      },
      renderHeader(h, { column, $index }) {
        return h('span', {}, [
          h('span', {}, column.label.split('|')[0]),
          h('br'),
          h('span', {}, column.label.split('|')[1])
        ])
      }
    }
  }
</script>

<style scoped>

</style>
