<template>

  <div>
    <el-radio v-model="radio" label="1">详情列表</el-radio>
    <el-radio v-model="radio" label="2">钢卷列表</el-radio>
    <el-table v-show="radio=='1'" :key="0" v-loading="listLoading" :data="detailList" border fit highlight-current-row
              style="width: 100%;margin-top: 10px">
      <el-table-column label="序号" min-width="40px" type="index" align="center">
      </el-table-column>
      <el-table-column label="料号" min-width="80px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.materialCode }}</span>
        </template>
      </el-table-column>
      <el-table-column label="物料名称" min-width="80px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.materialName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="出库数量" min-width="80px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.quantity}}</span>
        </template>
      </el-table-column>
      <el-table-column label="已出数量" min-width="80px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.outQuantity}}</span>
        </template>
      </el-table-column>
    </el-table>
    <el-table v-show="radio=='2'" :key="1" v-loading="listLoading" :data="itemList" border fit highlight-current-row
              style="width: 100%;margin-top: 10px">
      <el-table-column label="序号" width="60px" type="index" align="center" fixed>
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
      <el-table-column label="钢种" width="100px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.steelGrade }}</span>
        </template>
      </el-table-column>
      <el-table-column label="表面品级" width="100px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.surfaceFinish }}</span>
        </template>
      </el-table-column>
      <el-table-column label="宽度|(mm)" width="100px" align="center" :render-header="renderHeader">
        <template slot-scope="scope">
          <span>{{ scope.row.width }}</span>
        </template>
      </el-table-column>
      <el-table-column label="厚度|(mm)" width="100px" align="center" :render-header="renderHeader">
        <template slot-scope="scope">
          <span>{{ scope.row.thickness }}</span>
        </template>
      </el-table-column>
      <el-table-column label="长度|(mm)" width="100px" align="center" :render-header="renderHeader">
        <template slot-scope="scope">
          <span>{{ scope.row.length }}</span>
        </template>
      </el-table-column>
      <el-table-column label="标签规格|mm*mm" width="100px" align="center" :render-header="renderHeader">
        <template slot-scope="scope">
          <span>{{ scope.row.labelSpecification }}</span>
        </template>
      </el-table-column>
      <el-table-column label="实际规格|mm*mm" width="100px" align="center" :render-header="renderHeader">
        <template slot-scope="scope">
          <span>{{ scope.row.specification }}</span>
        </template>
      </el-table-column>
      <el-table-column label="标签净重|(kg)" width="100px" align="center" :render-header="renderHeader">
        <template slot-scope="scope">
          <span>{{ scope.row.labelNetWeight }}</span>
        </template>
      </el-table-column>
      <el-table-column label="标签毛重|(kg)" width="100px" align="center" :render-header="renderHeader">
        <template slot-scope="scope">
          <span>{{ scope.row.labelGrossWeight }}</span>
        </template>
      </el-table-column>
      <el-table-column label="实磅净重|(kg)" width="100px" align="center" :render-header="renderHeader">
        <template slot-scope="scope">
          <span>{{ scope.row.netWeight }}</span>
        </template>
      </el-table-column>
      <el-table-column label="实磅毛重|(kg)" width="100px" align="center" :render-header="renderHeader">
        <template slot-scope="scope">
          <span>{{ scope.row.grossWeight }}</span>
        </template>
      </el-table-column>
      <el-table-column label="边部" width="100px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.edge }}</span>
        </template>
      </el-table-column>
      <el-table-column label="等级" width="100px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.grade }}</span>
        </template>
      </el-table-column>
      <el-table-column label="检验员" width="100px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.inspector }}</span>
        </template>
      </el-table-column>
      <el-table-column label="条码" width="120px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.barcode }}</span>
        </template>
      </el-table-column>
      <el-table-column label="日期" width="100px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.date }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.description }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>

</template>

<script>
  import { getOutboundOrderRawDetails } from '@/api/outboundorderrawdetail'
  import { getOutboundOrderRawItems } from '@/api/outboundorderrawitem'

  export default {
    name: 'workOrderRawMaterial',
    props: ['workOrderNumber'],
    data() {
      return {
        radio: '1',
        detailList: [],
        detailTotal: 0,
        itemList: [],
        itemTotal: 0,
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
      this.$nextTick(async() => {
        await this.getDetailList()
        this.getItemList()
      })
    },

    methods: {
      getDetailList() {
        getOutboundOrderRawDetails(this.listQuery).then(res => {
          this.detailList = res.queryResult.list
          this.detailTotal = res.queryResult.total
          this.listLoading = false
        })
      },
      getItemList() {
        getOutboundOrderRawItems(this.listQuery).then(res => {
          this.itemList = res.queryResult.list
          this.itemTotal = res.queryResult.total
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
