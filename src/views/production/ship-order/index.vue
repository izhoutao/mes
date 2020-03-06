<template>
  <div class="app-container">
    <div v-show="!dialogFormVisible">

      <div class="filter-container">
        <el-form ref="filterForm" :model="listQuery" :inline="true">
          <el-form-item label="" prop="shipOrderNumber">
            <el-input
              v-model="listQuery.shipOrderNumber"
              placeholder="请输入出货单编号"
              style="width: 200px;"
              class="filter-item"
              clearable=""
              @keyup.enter.native="handleFilter"
            />
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
        <el-table-column label="出货单号" min-width="80px" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.shipOrderNumber }}</span>
          </template>
        </el-table-column>
        <el-table-column label="订单编号" min-width="80px" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.orderNumber }}</span>
          </template>
        </el-table-column>

        <el-table-column label="地址" min-width="90px" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.address }}</span>
          </template>
        </el-table-column>
        <el-table-column label="城市" min-width="90px" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.city }}</span>
          </template>
        </el-table-column>
        <el-table-column label="省州" min-width="90px" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.province }}</span>
          </template>
        </el-table-column>
        <el-table-column label="国家" min-width="90px" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.country }}</span>
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
      <div style="font-size: 20px;">{{textMap[dialogStatus]}}出货单</div>
      <div style="margin: 10px 0px 20px;">
        <el-button type="primary" size="small" @click="dialogStatus==='create'?submit():updateData()">{{dialogStatus==='create'?'创建':'确认'}}</el-button>
        <el-button type="danger" size="small" @click="dialogFormVisible = false">取消</el-button>
      </div>
      <el-form
        ref="shipOrderForm"
        :rules="rules"
        :model="temp"
        label-position="right"
        label-width="100px"
      >
        <el-form-item label="订单编号：" prop="address">
          <el-input v-model="temp.orderNumber"/>
        </el-form-item>
        <el-form-item label="出货地址：" prop="address">
          <el-input v-model="temp.address"/>
        </el-form-item>
        <el-form-item label="城市：" prop="city">
          <el-input v-model="temp.city"/>
        </el-form-item>
        <el-form-item label="省州：" prop="province">
          <el-input v-model="temp.province"/>
        </el-form-item>
        <el-form-item label="国家：" prop="country">
          <el-input v-model="temp.country"/>
        </el-form-item>
      </el-form>
      </el-form>


      <el-card class="box-card" v-if="temp.id">
        <div slot="header" class="clearfix">
          <div style="font-size: 20px;">出货单详情</div>
        </div>
        <ship-order-item :shipOrderId="temp.id" :key="temp.id"/>
      </el-card>

    </div>

  </div>
</template>

<script>
  import { deepClone } from '@/utils'

  import { getShipOrders, addShipOrder, updateShipOrder, deleteShipOrder } from '@/api/shiporder.js'
  import { getCustomers } from '@/api/customer' // Secondary package based on el-pagination

  import waves from '@/directive/waves' // Waves directive
  import Pagination from '@/components/Pagination/index.vue'
  import ShipOrderItem from './ship-order-item'

  export default {
    name: 'shiporder',
    components: { Pagination, ShipOrderItem },
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
          shipOrderNumber:undefined,
          status:undefined
          /*orders: ['code desc']*/
        },
        temp: {
          id: undefined,
          orderNumber:undefined,
          address:undefined,
          city:undefined,
          province:undefined,
          country:undefined,
          // status: undefined,
        },
        tempCopy: null,
        statuses: ['新建', '已完成'],
        tagTypes: ['success', 'info', 'warning', 'danger'],
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
      this.$nextTick(() => {
        this.getList()
      })

    },
    methods: {
      getList() {
        this.listLoading = true
        getShipOrders(this.listQuery).then(res => {
          this.list = res.queryResult.list
          this.total = res.queryResult.total
          this.listLoading = false
        })
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
        this.resetForm('shipOrderForm')
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        // this.rules.password[0].required = true
        this.$nextTick(() => {
          this.$refs['shipOrderForm'].clearValidate()
        })
      },
      submit() {
        this.$refs['shipOrderForm'].validate((valid) => {
          if (valid) {
            // const tempData = deepClone(this.temp)
            let shipOrder = deepClone(this.temp)
            addShipOrder(shipOrder).then((res) => {
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
          this.$refs['shipOrderForm'].clearValidate()
        })
      },
      updateData() {
        this.$refs['shipOrderForm'].validate((valid) => {
          if (valid) {
            let shipOrder = deepClone(this.temp)
            updateShipOrder(shipOrder).then(() => {
              for (const v of this.list) {
                if (v.id === shipOrder.id) {
                  const index = this.list.indexOf(v)
                  this.list.splice(index, 1, shipOrder)
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
        this.$confirm('此操作将永久删除该出货单, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteShipOrder(row.id).then(() => {
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


