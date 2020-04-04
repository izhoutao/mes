<template>
  <div class="outbound-order">
    <el-form ref="filterForm" :model="listQuery" :inline="true">
      <el-form-item label="" prop="number">
        <el-input
          v-model="listQuery.number"
          placeholder="请输入出库单号"
          style="width: 200px;"
          class="filter-item"
          clearable=""
          @keyup.enter.native="handleFilter"
        />
      </el-form-item>
      <el-form-item label="" prop="contractNumber">
        <el-input
          v-model="listQuery.workOrderNumber"
          placeholder="请输入工单号"
          style="width: 200px;"
          class="filter-item"
          clearable=""
          @keyup.enter.native="handleFilter"
        />
      </el-form-item>
      <el-form-item label="" prop="statusId">
        <el-select v-model="listQuery.statusId" filterable placeholder="单据状态" @change="handleStatusChange">
          <el-option
            v-for="item in statuses"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="" prop="dateRange">
        <el-date-picker
          v-model="listQuery.dateRange"
          type="daterange"
          align="right"
          unlink-panels
          value-format="yyyy-MM-dd"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions">
        </el-date-picker>
      </el-form-item>
    </el-form>
    <div class="filter-container">
      <div class="filter-btn-group">
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索
        </el-button>
        <el-button v-waves class="filter-item" @click="resetForm('filterForm');handleFilter()">重置</el-button>
        <el-button class="filter-item" style="margin-left: 10px;" type="success"
                   icon="el-icon-edit" @click="handleAdd">
          添加
        </el-button>
      </div>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="listQuery.current"
        :limit.sync="listQuery.size"
        @pagination="getList"
      />
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      @current-change="handleCurrentChange"
    >
      <el-table-column label="序号" min-width="40px" type="index" align="center">
      </el-table-column>
      <el-table-column label="出库库房" min-width="80px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.warehouseId | showName(warehouses) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="出库单号" min-width="80px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.number }}</span>
        </template>
      </el-table-column>
      <!--      <el-table-column label="出库类型" min-width="80px" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.typeId | showName(types) }}</span>
              </template>
            </el-table-column>-->
      <el-table-column label="工单号" min-width="80px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.workOrderNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column label="出库时间" min-width="80px" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.outboundTime | parseTime('{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>

      <el-table-column label="单据状态" min-width="40px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.statusId | showName(statuses) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" min-width="80px" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="80">
        <template slot-scope="scope">
          <!--          <el-button type="primary" icon="el-icon-edit" size="mini"
                               @click="handleUpdate(scope.row)">编辑
                    </el-button>
                    <el-button
                      icon="el-icon-delete"
                      size="mini"
                      type="danger"
                      @click="handleDelete(scope.row,'true')"
                    >删除
                    </el-button>-->
          <i class="el-icon-edit update" @click="handleUpdate(scope.row)"/>
          <i class="el-icon-delete delete" @click="handleDelete(scope.row,'true')"/>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :close-on-click-modal="false" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible"
               width="600px">
      <el-form
        ref="outboundOrderRawForm"
        :rules="rules"
        :model="temp"
        label-position="right"
        label-width="150px"
      >


        <el-form-item label="出库库房：" prop="warehouseId">
          <el-select v-model="temp.warehouseId" filterable placeholder="请选择" style="width:100%">
            <el-option
              v-for="item in warehouses"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <!--        <el-form-item label="出库类型：" prop="typeId">
                  <el-select v-model="temp.typeId" filterable placeholder="请选择" style="width:100%">
                    <el-option
                      v-for="item in types"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>-->
        <el-form-item label="工单号：" prop="workOrderNumber">
          <!--          <el-select v-model="temp.workOrderNumber" filterable placeholder="请选择" style="width:100%">
                      <el-option
                        v-for="item in workOrders"
                        :key="item.id"
                        :label="item.workOrderNumber"
                        :value="item.workOrderNumber">
                      </el-option>
                    </el-select>-->
          <el-select
            v-model="temp.workOrderNumber"
            filterable
            remote
            reserve-keyword
            placeholder="请输入工单号"
            :remote-method="getWorkOrders"
            :loading="loading">
            <el-option
              v-for="item in workOrders"
              :key="item.id"
              :label="item.workOrderNumber"
              :value="item.workOrderNumber">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="出库时间：" prop="outboundTime">
          <el-date-picker
            v-model="temp.outboundTime"
            type="datetime"
            placeholder="选择日期时间"
            default-time="00:00:00"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-ddTHH:mm:ss"
          />
        </el-form-item>

        <el-form-item label="单据状态：" prop="statusId">
          <el-select v-model="temp.statusId" filterable placeholder="请选择" style="width:100%">
            <el-option
              v-for="item in statuses"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" size="small" @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" size="small" @click="dialogStatus==='create'?submit():updateData()">确认</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import { deepClone } from '@/utils'

  import {
    getOutboundOrderRaws,
    addOutboundOrderRaw,
    updateOutboundOrderRaw,
    deleteOutboundOrderRaw
  } from '@/api/outboundorderraw.js'
  import {
    getWorkOrders,
    addWorkOrder,
    updateWorkOrder,
    deleteWorkOrder,
    getProductSerialNumbers
  } from '@/api/workorder.js'
  import { getDictInfos } from '@/api/dictionary.js'
  import { getWarehouses } from '@/api/warehouse.js'

  import waves from '@/directive/waves' // Waves directive
  import Pagination from '@/components/Pagination/index.vue' // Secondary package based on el-pagination

  export default {
    name: 'OutboundOrderRaw',
    components: { Pagination },
    directives: { waves },
    props: ['orderId'],
    data() {
      return {
        tableKey: 0,
        list: [],
        total: 0,
        listLoading: true,
        listQuery: {
          current: 1,
          size: 10,
          number: undefined,
          status: undefined,
          workOrderNumber: undefined,
          statusId: undefined,
          dateRange: undefined
        },
        // types: [],
        warehouses: [],
        statuses: [],
        workOrders: [],
        temp: {
          id: undefined,
          number: '',
          warehouseId: '',
          typeId: '',
          workOrderNumber: '',
          outboundTime: '',
          hotRollOrigin: '',
          steelmakingOrigin: ''
        },
        tempCopy: null,
        loading: false,

        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: '编辑',
          create: '添加'
        },
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }]
        },
        rules: {
          name: [
            { required: true, trigger: 'blur', message: '请填写不良代码名称' }
          ],
          code: [
            { required: true, trigger: 'blur', message: '请填写不良代码编码' }
          ]
        }
      }
    },
    filters: {
      showName: function(id, list) {
        var item = list.find(item => item.id === id)
        if (!item) return ''
        return item.name
      }
    },
    created() {
      this.tempCopy = deepClone(this.temp)
      this.listLoading = true
      this.$nextTick(async() => {
        await Promise.all([
          // this.getTypes(),
          this.getWarehouses(),
          this.getStatuses()
        ])
        this.getList()
      })
    },
    methods: {
      handleStatusChange() {
        this.getList()
      },
      getList() {
        this.listLoading = true
        getOutboundOrderRaws(this.listQuery).then(res => {
          this.$emit('update:orderId', '')
          this.list = res.queryResult.list
          this.total = res.queryResult.total
          this.listLoading = false
        })
      },
      /*      getTypes() {
              getDictInfos({ type_id: '1196628479966187521' }).then(res => {
                this.types = res.queryResult.list
              })
            },*/
      getWarehouses() {
        getWarehouses({ type: '原料仓' }).then(res => {
          this.warehouses = res.queryResult.list
        })
      },
      getStatuses() {
        getDictInfos({ type_id: '1197052960941649922' }).then(res => {
          this.statuses = res.queryResult.list
        })
      },
      /*      getWorkOrders() {
              getWorkOrders({status:1}).then(res => {
                this.workOrders = res.queryResult.list
              })
            },*/
      getWorkOrders(query) {
        if (query !== '') {
          this.loading = true
          getWorkOrders({ status: 1 }).then(res => {
            this.loading = false
            this.workOrders = res.queryResult.list.filter(item => {
              return item.workOrderNumber.toLowerCase()
                .indexOf(query.toLowerCase()) > -1
            })
          })
        } else {
          this.workOrders = []
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
        this.resetForm('outboundOrderRawForm')
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        // this.rules.password[0].required = true
        this.$nextTick(() => {
          this.$refs['outboundOrderRawForm'].clearValidate()
        })
      },
      submit() {
        this.$refs['outboundOrderRawForm'].validate((valid) => {
          if (valid) {
            // const tempData = deepClone(this.temp)
            let outboundOrderRaw = deepClone(this.temp)
            addOutboundOrderRaw(outboundOrderRaw).then((res) => {
              this.list.unshift(res.model)
              this.total++
              this.dialogFormVisible = false
              this.$emit('update:orderId', '')
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
          this.$refs['outboundOrderRawForm'].clearValidate()
        })
      },
      updateData() {
        this.$refs['outboundOrderRawForm'].validate((valid) => {
          if (valid) {
            let outboundOrderRaw = deepClone(this.temp)
            updateOutboundOrderRaw(outboundOrderRaw).then(() => {
              for (const v of this.list) {
                if (v.id === outboundOrderRaw.id) {
                  const index = this.list.indexOf(v)
                  this.list.splice(index, 1, outboundOrderRaw)
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
        this.$confirm('此操作将永久删除该不良代码, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteOutboundOrderRaw(row.id).then(() => {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
            const index = this.list.indexOf(row)
            this.list.splice(index, 1)
            this.total--
            this.$emit('update:orderId', '')
          })
        })
      },
      handleCurrentChange(val) {
        val && this.$emit('update:orderId', val.id)
      }

    }
  }
</script>
<style lang="scss">
  .outbound-order {

  .el-icon-edit.update, .el-icon-delete.delete {
    margin: 3px;
    font-size: 18px !important;
  }

  .filter-container {
    display: flex;
    align-items: center;
    justify-content: space-between;

  /*.filter-btn-group {*/
  /*  padding: 16px 0px;*/
  /*}*/

  .el-form-item {
    margin-bottom: 16px;
  }

  }

  }

</style>

