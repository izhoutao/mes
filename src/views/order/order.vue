<template>
  <div class="app-container">
    <div v-show="!dialogFormVisible">

      <div class="filter-container">
        <el-form ref="filterForm" :model="listQuery" :inline="true">
          <el-form-item label="" prop="orderNumber">
            <el-input
              v-model="listQuery.orderNumber"
              placeholder="请输入订单编号"
              style="width: 200px;"
              class="filter-item"
              clearable=""
              @keyup.enter.native="handleFilter"
            />
          </el-form-item>
          <el-form-item label="" prop="customerId">
            <el-select v-model="listQuery.customerId" filterable placeholder="客户" @change="handleFilter">
              <el-option
                v-for="item in customers"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="" prop="status">
            <el-select v-model="listQuery.status" filterable placeholder="状态" @change="handleFilter">
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
        </el-form>
      </div>

      <el-table :key="tableKey" v-loading="listLoading" :data="list" border fit highlight-current-row>
        <el-table-column label="序号" min-width="40px" align="center">
          <template slot-scope="scope">
            {{ scope.$index }}
          </template>
        </el-table-column>
        <el-table-column label="订单编号" min-width="80px" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.orderNumber }}</span>
          </template>
        </el-table-column>
        <el-table-column label="客户名称" min-width="80px" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.customerName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="交货日期" min-width="80px" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.deliveryDate | parseTime('{y}-{m}-{d}')}}</span>
          </template>
        </el-table-column>
        <el-table-column label="完成日期" min-width="80px" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.finishDate  | parseTime('{y}-{m}-{d}')}}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" min-width="80px" align="center">
          <template slot-scope="scope">
            <el-tag :type="translateStatus(scope.row.status).tagType" style="margin:0 5px;">
              {{ translateStatus(scope.row.status).text}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="描述" min-width="100px" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.description }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建人" min-width="80px" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.createPerson }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建日期"  min-width="80px" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.createTime  | parseTime('{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" min-width="80">
          <template slot-scope="scope">
<!--
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
-->
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
      <div style="font-size: 20px;">{{textMap[dialogStatus]}}订单</div>
      <div style="margin: 10px 0px 20px;">
        <el-button type="primary" size="small" @click="dialogStatus==='create'?submit():updateData()">{{dialogStatus==='create'?'创建':'确认'}}</el-button>
        <el-button type="danger" size="small" @click="dialogFormVisible = false">取消</el-button>
      </div>
      <el-form
        ref="orderForm"
        :rules="rules"
        :model="temp"
        label-position="right"
        label-width="100px"
      >
        <el-row>
          <el-col :span="6">
            <el-form-item label="客户：" prop="customer">
              <el-select v-model="temp.customerId" filterable placeholder="请选择" style="width:100%">
                <el-option
                  v-for="item in customers"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="状态：" prop="status">
              <el-select v-model="temp.status" filterable placeholder="请选择" style="width:100%">
                <el-option
                  v-for="(item,index) in statuses"
                  :key="index"
                  :label="item"
                  :value="index">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="交货日期：" prop="deliveryDate">
              <el-date-picker v-model="temp.deliveryDate" type="date" placeholder="请选择日期" style="width: 100%;"
                              format="yyyy 年 MM 月 dd 日"
                              value-format="yyyy-MM-dd"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="完成日期：" prop="deliveryDate">
              <el-date-picker v-model="temp.finishDate" type="date" placeholder="请选择日期" style="width: 100%;"
                              format="yyyy 年 MM 月 dd 日"
                              value-format="yyyy-MM-dd"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="描述：" prop="description">
          <el-input type="textarea" :rows="2" v-model="temp.description"/>
        </el-form-item>
      </el-form>


      <el-card class="box-card" v-if="temp.id">
        <div slot="header" class="clearfix">
          <div style="font-size: 20px;">子订单信息</div>
        </div>
        <order-item :orderId="temp.id" :key="temp.id"/>
      </el-card>

    </div>

  </div>
</template>

<script>
  import { deepClone } from '@/utils'

  import { getOrders, addOrder, updateOrder, deleteOrder } from '@/api/order.js'
  import { getCustomers } from '@/api/customer' // Secondary package based on el-pagination

  import waves from '@/directive/waves' // Waves directive
  import Pagination from '@/components/Pagination/index.vue'
  import OrderItem from './order-item'

  export default {
    name: 'Order',
    components: { Pagination, OrderItem },
    directives: { waves },
    watch: {
      'temp.customerId': {
        handler: async function(val) {
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
          orderNumber:undefined,
          customerId: undefined,
          status:undefined
          /*orders: ['code desc']*/
        },
        temp: {
          id: undefined,
          customerId: '',
          customerName: '',
          deliveryDate: '',
          finishDate: '',
          status: undefined,
          description: ''
        },
        tempCopy: null,
        statuses: ['已创建', '生产中', '已完成'],
        tagTypes: ['success', 'info', 'warning', 'danger'],
        customers: [],
        customerMap: null,
        dialogFormVisible: false,
        dialogStatus: '',
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
      this.listLoading = true
      this.$nextTick(async() => {
        await this.getCustomers()
        this.getList()
      })

    },
    methods: {
      getList() {
        this.listLoading = true
        getOrders(this.listQuery).then(res => {
          this.list = res.queryResult.list.map(item => {
            let customer = this.customerMap[item.customerId]
            item.customerName = customer.name
            return item
          })
          this.total = res.queryResult.total
          this.listLoading = false
        })
      },
      async getCustomers() {
        let res = await getCustomers({})
        this.customers = res.queryResult.list
        this.customerMap = _.fromPairs(this.customers.map(customer => {
          return [customer.id, customer]
        }))
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
        this.resetForm('orderForm')
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        // this.rules.password[0].required = true
        this.$nextTick(() => {
          this.$refs['orderForm'].clearValidate()
        })
      },
      submit() {
        this.$refs['orderForm'].validate((valid) => {
          if (valid) {
            // const tempData = deepClone(this.temp)
            let order = deepClone(this.temp)
            addOrder(order).then((res) => {
              let customer = this.customerMap[order.customerId]
              res.model.customerName = customer.name
              this.list.unshift(res.model)
              this.total++
              this.handleUpdate(res.model)
              // this.dialogFormVisible = false
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
          this.$refs['orderForm'].clearValidate()
        })
      },
      updateData() {
        this.$refs['orderForm'].validate((valid) => {
          if (valid) {
            let order = deepClone(this.temp)
            updateOrder(order).then(() => {
              let customer = this.customerMap[order.customerId]
              order.customerName = customer.name
              for (const v of this.list) {
                if (v.id === order.id) {
                  const index = this.list.indexOf(v)
                  this.list.splice(index, 1, order)
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
        this.$confirm('此操作将永久删除该工艺, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteOrder(row.id).then(() => {
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


