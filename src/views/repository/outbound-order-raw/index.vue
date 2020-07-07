<template>
  <div class="outbound-order-raw-item app-container">
    <div class="filter-container">
      <el-form ref="filterForm" :model="listQuery" :inline="true">
        <el-form-item label="" prop="materialNumber">
          <el-input
            v-model="listQuery.workOrderNumber"
            placeholder="请输入工单号"
            style="width: 200px;"
            class="filter-item"
            clearable=""
            @keyup.enter.native="handleFilter"
          />
        </el-form-item>
        <el-form-item label="" prop="materialNumber">
          <el-input
            v-model="listQuery.materialNumber"
            placeholder="请输入原料编号"
            style="width: 200px;"
            class="filter-item"
            clearable=""
            @keyup.enter.native="handleFilter"
          />
        </el-form-item>
        <el-form-item label="" prop="productNumber">
          <el-input
            v-model="listQuery.productNumber"
            placeholder="请输入钢卷编号"
            style="width: 200px;"
            class="filter-item"
            clearable=""
            @keyup.enter.native="handleFilter"
          />
        </el-form-item>
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
        <el-button v-waves class="filter-item" @click="resetForm('filterForm');handleFilter()">重置</el-button>
        <el-button class="filter-item" style="margin-left: 10px;" type="success"
                   icon="el-icon-edit" @click="handleAdd">
          添加
        </el-button>
      </el-form>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="listQuery.current"
        :limit.sync="listQuery.size"
        @pagination="getList"
      />
    </div>

    <el-table :key="tableKey"
              v-loading="listLoading"
              :data="list"
              border fit highlight-current-row
              style="width: 100%">
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

      <el-table-column label="操作" align="center" width="200" fixed="right">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini"
                     @click="handleUpdate(scope.row)">编辑
          </el-button>
          <el-button
            icon="el-icon-delete"
            size="mini"
            type="danger"
            @click="handleDelete(scope.row,'true')"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :close-on-click-modal="false" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible"
               width="800px">
      <el-form
        ref="outboundOrderRawItemForm"
        :rules="rules"
        :model="temp"
        :inline="true"
        label-position="right"
        label-width="150px"
      >
        <el-form-item label="工单号：" prop="workOrderNumber">
          <el-autocomplete
            v-model="temp.workOrderNumber"
            :fetch-suggestions="getWorkOrderNumbers"
            placeholder="请输入工单号"
            @select="handleSelectWorkOrder"
          />
        </el-form-item>
        <el-form-item label="钢种：" prop="steelGrade">
          <el-input :value="temp.steelGrade" :disabled="true"/>
        </el-form-item>
        <!--        <el-form-item label="钢卷编号：" prop="productNumber">
                  <el-select
                    v-model="temp.productNumber"
                    filterable
                    remote
                    reserve-keyword
                    placeholder="请输入钢卷号"
                    :remote-method="getStoredRawItems"
                    :loading="loading">
                    <el-option
                      v-for="item in storedRawItems"
                      :key="item"
                      :label="item"
                      :value="item">
                    </el-option>
                  </el-select>

                </el-form-item>-->

        <el-form-item label="钢卷编号：" prop="productNumber">
          <el-autocomplete
            v-model="temp.productNumber"
            :fetch-suggestions="getStoredRawItems"
            placeholder="请输入钢卷号"
            @select="handleSelectProductNumber"
          ></el-autocomplete>
        </el-form-item>
        <el-form-item label="原料编号：" prop="materialNumber">
          <el-input :value="temp.materialNumber" :disabled="true"/>
        </el-form-item>

        <el-form-item label="出库时间：" prop="time">
          <el-date-picker v-model="temp.time" type="datetime" placeholder="请选择发料出库时间" style="width: 100%;"
                          format="yyyy-MM-dd HH:mm:ss"
                          value-format="yyyy-MM-ddTHH:mm:ss"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" size="small" @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" size="small" @click="dialogStatus==='create'?submit():updateData()">确认</el-button>
      </div>
    </el-dialog>

<!--    <el-dialog
      :close-on-click-modal="false"
      title="请选择"
      :visible.sync="materialDialogFormVisible"
      width="800px"
    >
      <material ref="material" :steelGrade="temp.steelGrade"/>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" size="small" @click="materialDialogFormVisible = false">取消</el-button>
        <el-button type="primary" size="small" @click="confirmMaterial()">确认</el-button>
      </div>
    </el-dialog>-->

  </div>
</template>

<script>
  import { deepClone } from '@/utils'

  import {
    getOutboundOrderRawItems,
    addOutboundOrderRawItem,
    updateOutboundOrderRawItem,
    deleteOutboundOrderRawItem,
    getStoredRawItems
  } from '@/api/outboundorderrawitem.js'
  import waves from '@/directive/waves' // Waves directive
  import Pagination from '@/components/Pagination/index.vue' // Secondary package based on el-pagination
  import Material from '@/components/Material'
  import { getWorkOrders } from '@/api/workorder'
  import { login } from '@/api/user'

  export default {
    name: 'outboundRaw',
    components: { Pagination, Material },
    directives: { waves },
    data() {
      return {
        tableKey: 0,
        list: [],
        total: 0,
        listLoading: true,
        listQuery: {
          current: 1,
          size: 10,
          workOrderNumber: undefined,
          materialNumber: undefined,
          productNumber: undefined
        },
        temp: {
          id: undefined,
          workOrderNumber: '',
          materialNumber: undefined,
          productNumber: '',
          steelGrade: undefined,
          vendorId: undefined,
          vendorName: undefined,
          thickness: undefined,
          width: undefined,
          grossWeight: undefined,
          netWeight: undefined,
          grossWeight2: undefined,
          packageWeight: undefined,
          contractNumber: undefined,
          customerId: undefined,
          customerName: undefined,
          orderTime: undefined,
          orderThickness: undefined,
          rollingThickness: undefined,
          time: undefined,
          description: undefined,
          createTime: undefined,
          updateTime: undefined
          /*          workOrderId: undefined,
                    workOrderNumber: undefined*/
        },
        tempCopy: null,
        // storedRawItems: [],
        // loading: false,
        statuses: ['未完成', '已完成'],
        tagTypes: ['success', 'info', 'warning', 'danger'],
        selectedMaterial: undefined,

        dialogFormVisible: false,
        dialogStatus: '',

        // materialDialogFormVisible: false,
        textMap: {
          update: '编辑',
          create: '添加'
        },
        rules: {
          workOrderNumber: [
            { required: true, trigger: 'blur', message: '请填写工单号' }
          ],
          productNumber: [
            { required: true, trigger: 'blur', message: '请填写钢卷编号' }
          ],
          time: [
            { required: true, trigger: 'blur', message: '请填写日期' },
            { required: true, message: '请选择时间', trigger: 'change' }
          ]
        }
      }
    },
    created() {
      this.tempCopy = deepClone(this.temp)
      this.getList()
    },
    methods: {
      renderHeader(h, { column, $index }) {
        return h('span', {}, [
          h('span', {}, column.label.split('|')[0]),
          h('br'),
          h('span', {}, column.label.split('|')[1])
        ])
      },
      translateStatus(status) {
        return {
          tagType: this.tagTypes[status],
          text: this.statuses[status]
        }
      },
/*      handleSelectMaterial() {
        this.materialDialogFormVisible = true
      },
      confirmMaterial() {
        this.materialDialogFormVisible = false
        this.temp.materialId = this.$refs['material'].selectedMaterial && this.$refs['material'].selectedMaterial.id
        this.temp.steelGrade = this.$refs['material'].selectedMaterial && this.$refs['material'].selectedMaterial.steelGrade
        this.temp.density = this.$refs['material'].selectedMaterial && this.$refs['material'].selectedMaterial.density
      },*/
      getList() {
        this.listLoading = true
        getOutboundOrderRawItems(this.listQuery).then(res => {
          this.list = res.queryResult.list
          this.total = res.queryResult.total
          this.listLoading = false
        })
      },
      getWorkOrderNumbers(queryString, cb) {
        getWorkOrders({ status: 1 }).then(res => {
          let workOrders = res.queryResult.list.map(item => {
            return { ...item, value: item.workOrderNumber }
          }).filter(this.createStateFilter(queryString))
          cb(workOrders)
        })
      },
      handleSelectWorkOrder(item) {
        if (!item) {
          this.temp = deepClone(this.tempCopy)
        } else {
          this.temp = deepClone(this.tempCopy)
          this.temp.workOrderNumber = item.workOrderNumber
          this.temp.steelGrade = item.steelGrade
          this.temp.density = item.density
        }
      },
      /*      getStoredRawItems(query) {
              if (query !== '') {
                this.loading = true
                getStoredRawItems().then(res => {
                  this.loading = false
                  this.storedRawItems = res.queryResult.list.filter(item => {
                    return item.toLowerCase()
                      .indexOf(query.toLowerCase()) > -1
                  })
                })
              } else {
                this.storedRawItems = []
              }
            },*/
      getStoredRawItems(queryString, cb) {
        getStoredRawItems({ steelGrade: this.temp.steelGrade }).then(res => {
          let storedRawItems = res.queryResult.list.map(item => {
            return { ...item, value: item.productNumber }
          }).filter(this.createStateFilter(queryString))
          cb(storedRawItems)
        })
      },
      handleSelectProductNumber(item) {
        if (!item) {
          this.temp.productNumber = ''
          this.temp.materialNumber = undefined
        } else {
          this.temp.productNumber = item.productNumber
          this.temp.materialNumber = item.materialNumber
        }
      },
      createStateFilter(queryString) {
        return (state) => {
          return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) > -1)
        }
      },
      handleFilter() {
        this.listQuery.current = 1
        this.getList()
      },

      resetForm(formName) {
        if (this.$refs[formName] === undefined) {
          return false
        }
        this.$refs[formName].resetFields()

        this.temp = deepClone(this.tempCopy)
      },
      handleAdd() {
        this.resetForm('outboundOrderRawItemForm')
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        // this.rules.password[0].required = true
        this.$nextTick(() => {
          this.$refs['outboundOrderRawItemForm'].clearValidate()
        })
      },
      submit() {
        this.$refs['outboundOrderRawItemForm'].validate((valid) => {
          if (valid) {
            // const tempData = deepClone(this.temp)
            let outboundOrderRawItem = deepClone(this.temp)
            addOutboundOrderRawItem(outboundOrderRawItem).then((res) => {
              this.list.unshift(res.model)
              this.dialogFormVisible = false
              // this.storedRawItems = []
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              })
            })
          }
        })
      },
      handleUpdate(row) {

        this.dialogStatus = 'update'
        // this.rules.password[0].required = false
        this.temp = deepClone(row) // copy obj
        // this.temp.password = ''
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['outboundOrderRawItemForm'].clearValidate()
        })
      },
      updateData() {
        this.$refs['outboundOrderRawItemForm'].validate((valid) => {
          if (valid) {
            let outboundOrderRawItem = deepClone(this.temp)
            updateOutboundOrderRawItem(outboundOrderRawItem).then(() => {
              for (const v of this.list) {
                if (v.id === outboundOrderRawItem.id) {
                  const index = this.list.indexOf(v)
                  this.list.splice(index, 1, outboundOrderRawItem)
                  break
                }
              }
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '更新成功',
                type: 'success',
                duration: 2000
              })
            })
          }
        })
      },
      handleDelete(row) {
        this.$confirm('此操作将永久删除该工单发料钢卷项, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteOutboundOrderRawItem(row.id).then(() => {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
            const index = this.list.indexOf(row)
            this.list.splice(index, 1)
          })
        })
      }

    }
  }
</script>
<style lang="scss">
  .outbound-order-raw-item {

  .el-icon-edit.update, .el-icon-delete.delete {
    margin: 3px;
    font-size: 18px !important;
  }

  .filter-container {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;

  .el-form-item {
    margin-bottom: 16px;
  }

  }

  .product-number {
    /*width: 100%;*/
    display: flex;
  }

  }

</style>

