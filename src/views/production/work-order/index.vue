<template>
  <div class="app-container">
    <div v-show="!dialogFormVisible">
      <div class="filter-container">
        <el-form ref="filterForm" :model="listQuery" :inline="true">
          <el-form-item label="" prop="workOrderNumber">
            <el-input
              v-model="listQuery.workOrderNumber"
              placeholder="请输入工单号"
              style="width: 200px;"
              class="filter-item"
              clearable=""
              @keyup.enter.native="handleFilter"
            />
          </el-form-item>
          <el-form-item label="" prop="status">
            <el-select v-model="listQuery.status" filterable placeholder="工单状态" @change="handleFilter">
              <el-option
                v-for="(item,index) in statuses"
                :key="index"
                :label="item"
                :value="index">
              </el-option>
            </el-select>
          </el-form-item>
          <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索
          </el-button>
          <el-button v-waves class="filter-item" @click="resetForm('filterForm');handleFilter()">重置</el-button>
          <el-button class="filter-item" style="margin-left: 10px;" type="success"
                     icon="el-icon-edit" @click="handleAdd">
            添加
          </el-button>
          <el-button class="filter-item" style="margin-left: 10px;" type="warning"
                     icon="el-icon-data-line" @click="handleOnline">
            上线
          </el-button>
        </el-form>
      </div>

      <el-table
        :key="tableKey"
        v-loading="listLoading"
        :data="list"
        border fit highlight-current-row
        ref="selectWorkOrder"
        @select="handleSelect"
        @select-all="handleSelectAll"
        @current-change="handleCurrentChange"
      >
        <!--        <el-table-column label="序" min-width="40px" type="index" align="center">
                </el-table-column>-->
        <el-table-column
          type="selection"
          width="55px">
        </el-table-column>
        <el-table-column label="工单号" min-width="80px" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.workOrderNumber }}</span>
          </template>
        </el-table-column>
        <el-table-column label="钢种" min-width="80px" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.steelGrade }}</span>
          </template>
        </el-table-column>
        <el-table-column label="需求重量(kg)" min-width="80px" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.num }}</span>
          </template>
        </el-table-column>

        <el-table-column label="计划开始日期" min-width="80px" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.schStartTime | parseTime('{y}-{m}-{d}')}}</span>
          </template>
        </el-table-column>
        <el-table-column label="计划结束日期" min-width="80px" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.schCloseTime  | parseTime('{y}-{m}-{d}')}}</span>
          </template>
        </el-table-column>
        <el-table-column label="工单状态" min-width="80px" align="center">
          <template slot-scope="scope">
            <el-tag :type="translateStatus(scope.row.status).tagType" style="margin:0 5px;">
              {{ translateStatus(scope.row.status).text}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" min-width="80">
          <template slot-scope="scope">
            <i class="el-icon-edit" @click="handleUpdate(scope.row)"/>
            <i class="el-icon-delete" @click="handleDelete(scope.row,'true')"/>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="listQuery.current"
        :limit.sync="listQuery.size"
        @pagination="getList"
      />
    </div>
    <div v-show="dialogFormVisible">
      <div style="font-size: 20px;">{{textMap[dialogStatus]}}工单</div>
      <div style="margin: 10px 0px 20px;">
        <el-button type="primary" size="small" @click="dialogStatus==='create'?submit():updateData()">
          <!--{{dialogStatus==='create'?'创建':'确认'}}-->确认
        </el-button>
        <el-button type="danger" size="small" @click="dialogFormVisible = false">取消</el-button>
      </div>
      <el-form
        ref="workOrderForm"
        :rules="rules"
        :model="temp"
        label-position="right"
        label-width="110px"
        size="mini"
      >
        <el-row>
          <el-col :span="6">
            <el-form-item label="钢种：" prop="steelGrade">
              <el-input v-model="temp.steelGrade" @click.native="handleSelectMaterial"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="需求重量(kg)：" prop="num">
              <el-input v-model="temp.num"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="完成重量(kg)：" prop="num">
              <el-input :value="temp.outputNum" :disabled="true"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="上线重量(kg)：" prop="num">
              <el-input :value="temp.onLineNum" :disabled="true"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="7">
            <el-form-item label="预计开始日期：" prop="schStartTime">
              <el-date-picker
                v-model="temp.schStartTime"
                type="datetime"
                placeholder="选择日期时间"
                default-time="00:00:00"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-ddTHH:mm:ss"
              />
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="预计结束日期：" prop="schCloseTime">
              <el-date-picker
                v-model="temp.schCloseTime"
                type="datetime"
                placeholder="选择日期时间"
                default-time="00:00:00"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-ddTHH:mm:ss"
              />
            </el-form-item>
          </el-col>

          <el-col :span="5">
            <el-form-item label="工艺流程：" prop="workflowId">
              <el-select v-model="temp.workflowId" filterable placeholder="请选择" style="width:100%">
                <el-option
                  v-for="item in workflows"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="5">
            <el-form-item label="产线：" prop="lineId">
              <el-select v-model="temp.lineId" filterable placeholder="请选择" style="width:100%">
                <el-option
                  v-for="item in lines"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="客户：" prop="customerId">
              <el-select
                v-model="temp.customerId"
                style="width:100%"
              >
                <el-option
                  v-for="item in customers"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="用途：" prop="uses">
              <el-input v-model="temp.uses"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="目标宽度：" prop="targetWidth">
              <el-input v-model="temp.targetWidth"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="宽度容差：" prop="toleranceWidth">
              <el-input v-model="temp.toleranceWidth"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="目标厚度：" prop="targetThickness">
              <el-input v-model="temp.targetThickness"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="厚度容差：" prop="toleranceThickness">
              <el-input v-model="temp.toleranceThickness"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="生产要求：" prop="requirements">
              <el-input type="textarea" :rows="6" v-model="temp.requirements"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="创建时间：" prop="updateTime">
              <el-input
                :value="temp.createTime"
                :disabled="true">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="最后更新时间：" prop="updateTime">
              <el-input
                :value="temp.updateTime"
                :disabled="true">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="创建人：" prop="createPerson">
              <el-input
                :value="temp.createPerson"
                :disabled="true">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="最后更新人：" prop="updatePerson">
              <el-input
                :value="temp.updatePerson"
                :disabled="true">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <el-dialog
      :close-on-click-modal="false"
      title="请选择"
      :visible.sync="materialDialogFormVisible"
      width="800px"
    >
<!--      <material :selectedMaterial.sync="selectedMaterial"/>-->
      <material ref="material"/>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" size="small" @click="materialDialogFormVisible = false">取消</el-button>
        <el-button type="primary" size="small" @click="confirmMaterial()">确认</el-button>
      </div>
    </el-dialog>
    <work-order-detail v-if="currentWorkOrder&&!dialogFormVisible"
                       :detail="currentWorkOrder"
                       :workflows="workflows"
                       :lines="lines"
                       :users="users"
                       :key="currentWorkOrder.id"/>
  </div>
</template>

<script>
  import { deepClone } from '@/utils'

  import {
    getWorkOrders,
    addWorkOrder,
    updateWorkOrder,
    deleteWorkOrder,
    getProductSerialNumbers
  } from '@/api/workorder.js'
  import { getCustomers } from '@/api/customer' // Secondary package based on el-pagination

  import waves from '@/directive/waves' // Waves directive
  import Pagination from '@/components/Pagination/index.vue'
  import WorkOrderDetail from './work-order-detail.vue'
  import Material from '@/components/Material'
  import { getWorkflows } from '@/api/workflow'
  import { getLines } from '@/api/line'
  import { getUsers } from '@/api/system'

  export default {
    name: 'workorder',
    // components: { Pagination, WorkOrderMaterial, Material },
    components: { Pagination, Material, WorkOrderDetail },
    directives: { waves },
    watch: {
      'temp.customerId': {
        handler: function(val) {
          if (val) {
            this.temp.customerName = this.customerMap[val].name
          } else {
            this.temp.customerName = ''
          }
        }
        // deep: true
      }
    },
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
          status: undefined
          /*orders: ['code desc']*/
        },
        temp: {
          id: undefined,
          workOrderNumber: undefined,
          steelGrade: '',
          density: undefined,
          num: undefined,
          outputNum: undefined,
          onLineNum: undefined,
          schStartTime: undefined,
          schCloseTime: undefined,

          workflowId: undefined,
          lineId: undefined,
          customerId: undefined,
          customerName: undefined,
          targetWidth: undefined,
          toleranceWidth: undefined,
          targetThickness: undefined,
          toleranceThickness: undefined,
          uses: undefined,
          requirements: '',
          createPerson: undefined,
          createTime: undefined,
          updatePerson: undefined,
          updateTime: undefined
        },
        tempCopy: null,
        statuses: ['新建', '已上线', '已完成', '已关闭'],
        tagTypes: ['success', 'info', 'warning', 'danger'],
        currentWorkOrder: undefined,
        selectedMaterial: undefined,
        selectedWorkOrder: {
          id: undefined,
          workOrderNumber: undefined,
          materialId: undefined,
          steelGrade: undefined,
          density: undefined,
          num: undefined,
          expandedNum: undefined,
          schStartTime: undefined,
          schCloseTime: undefined,
          status: undefined
        },
        selectedWorkOrderCopy: null,
        // expandingNum: undefined,
        productSerialNumbers: [],
        psnlist: [],
        workflows: [],
        lines: [],
        customers: [],
        customerMap: undefined,
        users:[],
        product: {
          id: undefined,
          productNumber: undefined,
          steelGrade: undefined,
          surfaceFinish: undefined,
          specification: undefined,
          netWeight: undefined,
          grossWeight: undefined,
          referenceThickness: undefined,
          referenceWidth: undefined,
          referenceLength: undefined,
          edge: undefined,
          grade: undefined,
          inspector: undefined,
          // barcode: undefined,
          date: undefined,
          createTime: undefined,
          updateTime: undefined,
          workOrderId: undefined,
          workOrderNumber: undefined
        },

        dialogFormVisible: false,
        dialogStatus: '',
        materialDialogFormVisible: false,
        workOrderSNdialogFormVisible: false,
        textMap: {
          update: '编辑',
          create: '创建'
        },
        rules: {
          name: [
            { required: true, trigger: 'blur', message: '请填写工艺名称' }
          ],
          code: [
            { required: true, trigger: 'blur', message: '请填写工艺编码' }
          ]
        }
      }
    },
    created() {
      this.tempCopy = deepClone(this.temp)
      this.selectedWorkOrderCopy = deepClone(this.selectedWorkOrder)
      this.listLoading = true
      this.$nextTick(async() => {
        await Promise.all([
          this.getLines({}),
          this.getUsers({}),
          this.getWorkflows({}),
          this.getCustomers({})
        ])
        this.getList()
      })
    },
    methods: {
      handleSelect(selection, row) {
        //clearSelection：用于多选表格，清空用户的选择
        //此时所有的checkbox处于未勾选，当用户第一次点击的时候，selection为一个数组，里面存放的为当前这一行的数据
        this.$refs.selectWorkOrder.clearSelection()
        //此时selection仍然有值 ，只是勾选状态不显示了。
        if (selection.length === 0) {
          this.selectedWorkOrder = this.selectedWorkOrderCopy
          return
        }
        //这这里将这行的状态又变为了勾选
        this.$refs.selectWorkOrder.toggleRowSelection(row, true)
        //用于多选表格，切换某一行的选中状态，如果使用了第二个参数，则是设置这一行选中与否（selected 为 true 则选中）
        this.selectedWorkOrder = row
      },
      handleSelectAll(selection) {
        this.$refs.selectWorkOrder.clearSelection()
        this.selectedWorkOrder = this.selectedWorkOrderCopy
      },
      handleSelectMaterial() {
        this.materialDialogFormVisible = true
      },
      confirmMaterial() {
        this.materialDialogFormVisible = false
        this.temp.materialId = this.$refs['material'].selectedMaterial && this.$refs['material'].selectedMaterial.id
        this.temp.steelGrade = this.$refs['material'].selectedMaterial && this.$refs['material'].selectedMaterial.steelGrade
        this.temp.density = this.$refs['material'].selectedMaterial && this.$refs['material'].selectedMaterial.density
      },
      async getLines(query) {
        const res = await getLines(query)
        this.lines = res.queryResult.list
      },
      async getUsers(query) {
        const res = await getUsers(query)
        this.users = res.queryResult.list
      },
      async getWorkflows(query) {
        const res = await getWorkflows(query)
        this.workflows = res.queryResult.list
      },
      async getCustomers() {
        const res = await getCustomers({})
        this.customers = res.queryResult.list
        this.customerMap = _.fromPairs(this.customers.map(customer => {
          return [customer.id, customer]
      }))
      },
      getList() {
        this.listLoading = true
        getWorkOrders(this.listQuery).then(res => {
          this.list = res.queryResult.list
          this.total = res.queryResult.total
          this.listLoading = false
        })
      },
      handleCurrentChange(val) {
        this.currentWorkOrder = val
      },
      handleFilter() {
        this.listQuery.current = 1
        this.getList()
      },
      translateStatus(status) {
        return {
          tagType: this.tagTypes[status],
          text: this.statuses[status]
        }
      },
      resetForm(formName) {
        if (this.$refs[formName] === undefined) {
          return false
        }
        this.$refs[formName].resetFields()

        this.temp = deepClone(this.tempCopy)
      },
      handleAdd() {
        this.resetForm('workOrderForm')
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        // this.rules.password[0].required = true
        this.$nextTick(() => {
          this.$refs['workOrderForm'].clearValidate()
        })
      },
      submit() {
        this.$refs['workOrderForm'].validate((valid) => {
          if (valid) {
            // const tempData = deepClone(this.temp)
            let workOrder = deepClone(this.temp)
            addWorkOrder(workOrder).then((res) => {
              this.list.unshift(res.model)
              this.total++
              // this.handleUpdate(res.model)
              this.dialogFormVisible = false
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
      handleOnline() {
        if (!this.selectedWorkOrder.id) {
          this.$message({
            message: '请选择一条工单',
            type: 'warning'
          })
          return
        }
        /*        // this.resetForm('workOrderSNForm')
                // this.expandingNum = undefined
                this.productSerialNumbers = []
                this.psnlist = []
                // this.dialogStatus = 'create'
                this.workOrderSNdialogFormVisible = true
                // this.rules.password[0].required = true
                this.$nextTick(() => {
                  this.$refs['workOrderSNForm'].clearValidate()
                })*/
        const wo = {
          id: this.selectedWorkOrder.id,
          status: 1
        }
        updateWorkOrder(wo).then((res) => {
          for (const v of this.list) {
            if (v.id === wo.id) {
              const index = this.list.indexOf(v)
              console.log(this.selectedWorkOrder)
              this.selectedWorkOrder.status = 1
              this.list.splice(index, 1, this.selectedWorkOrder)
              break
            }
          }
          this.$notify({
            title: '成功',
            message: '工单上线成功',
            type: 'success',
            duration: 2000
          })
        })
      },
      handleUpdate(row) {
        if (row.status != 0) {
          this.$message({
            message: this.translateStatus(row.status).text + '工单不能编辑',
            type: 'warning'
          })
          return
        }
        this.dialogStatus = 'update'
        // this.rules.password[0].required = false
        this.temp = deepClone(row) // copy obj
        // this.temp.password = ''
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['workOrderForm'].clearValidate()
        })
      },
      updateData() {
        this.$refs['workOrderForm'].validate((valid) => {
          if (valid) {
            let workOrder = deepClone(this.temp)
            updateWorkOrder(workOrder).then(() => {
              for (const v of this.list) {
                if (v.id === workOrder.id) {
                  const index = this.list.indexOf(v)
                  this.list.splice(index, 1, workOrder)
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
        this.$confirm('此操作将永久删除该工单, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteWorkOrder(row.id).then(() => {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
            const index = this.list.indexOf(row)
            this.list.splice(index, 1)
            this.total--
          })
        })
      }

    }
  }
</script>
<style scoped lang="scss">
  .el-icon-edit {
    margin-right: 5px;
    font-size: 18px;
  }

  .el-icon-delete {
    margin-left: 5px;
    font-size: 18px;
  }
</style>


