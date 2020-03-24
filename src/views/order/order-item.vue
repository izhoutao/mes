<template>
  <div class="order-item">
    <div class="filter-container">
      <el-form ref="filterForm" :model="listQuery" :inline="true">
        <el-form-item label="" prop="orderItemNumber">
          <el-input
            v-model="listQuery.orderItemNumber"
            placeholder="请输入子订单号"
            style="width: 200px;"
            class="filter-item"
            clearable=""
            @keyup.enter.native="handleFilter"
          />
        </el-form-item>
<!--        <el-form-item label="" prop="status">
          <el-select v-model="listQuery.status" filterable placeholder="状态" @change="handleFilter">
            <el-option
              v-for="(item,index) in statuses"
              :key="index"
              :label="item"
              :value="index">
            </el-option>
          </el-select>
        </el-form-item>-->
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

    <el-table :key="tableKey" v-loading="listLoading" :data="list" border fit highlight-current-row>
      <el-table-column label="序号" min-width="40px" align="center">
        <template slot-scope="scope">
          {{ scope.$index }}
        </template>
      </el-table-column>
      <el-table-column label="子订单号" min-width="80px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.orderItemNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column label="产品" min-width="80px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.productName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="规格" min-width="80px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.productSpecification }}</span>
        </template>
      </el-table-column>
      <el-table-column label="数量" min-width="50px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.num }}</span>
        </template>
      </el-table-column>
<!--      <el-table-column label="状态" min-width="50px" align="center">
        <template slot-scope="scope">
          <el-tag :type="translateStatus(scope.row.status).tagType" style="margin:0 5px;">
            {{ translateStatus(scope.row.status).text}}
          </el-tag>
        </template>
      </el-table-column>-->

      <el-table-column label="操作" align="center" min-width="80">
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
               width="600px">
      <el-form
        ref="orderItemForm"
        :rules="rules"
        :model="temp"
        label-position="right"
        label-width="150px"
      >
        <el-form-item label="产品：" prop="productName">
          <el-input v-model="temp.productName" @click.native="handleSelectMaterial"/>
        </el-form-item>
        <el-form-item label="规格：" prop="productSpecification">
          <el-input v-model="temp.productSpecification"/>
        </el-form-item>
        <el-form-item label="数量：" prop="num">
          <el-input v-model="temp.num"/>
        </el-form-item>
<!--        <el-form-item label="状态：" prop="status">
          <el-select v-model="temp.status" filterable placeholder="请选择" style="width:100%">
            <el-option
              v-for="(item,index) in statuses"
              :key="index"
              :label="item"
              :value="index">
            </el-option>
          </el-select>
        </el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" size="small" @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" size="small" @click="dialogStatus==='create'?submit():updateData()">确认</el-button>
      </div>
    </el-dialog>


    <el-dialog
      :close-on-click-modal="false"
      title="请选择"
      :visible.sync="materialDialogFormVisible"
      width="800px"
    >
      <material :selectedMaterial.sync="selectedMaterial"/>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" size="small" @click="materialDialogFormVisible = false">取消</el-button>
        <el-button type="primary" size="small" @click="confirmMaterial()">确认</el-button>
      </div>
    </el-dialog>


  </div>
</template>

<script>
  import { deepClone } from '@/utils'

  import { getOrderItems, addOrderItem, updateOrderItem, deleteOrderItem } from '@/api/orderitem.js'

  import waves from '@/directive/waves' // Waves directive
  import Pagination from '@/components/Pagination/index.vue' // Secondary package based on el-pagination
  import Material from './material.vue'

  export default {
    name: 'OrderItem',
    components: { Pagination, Material },
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
          orderId: this.orderId,
          orderItemNumber: '',
          // status:undefined
        },
        temp: {
          id: undefined,
          orderItemNumber: '',
          orderId: this.orderId,
          productId: undefined,
          productName: '',
          productSpecification: '',
          num: undefined,
          // status: undefined
        },
        tempCopy: null,
        // statuses: ['待排产', '已排产', '生产中', '已完成'],
        tagTypes: ['success', 'info', 'warning', 'danger'],
        selectedMaterial: undefined,

        dialogFormVisible: false,
        dialogStatus: '',

        materialDialogFormVisible: false,
        textMap: {
          update: '编辑',
          create: '添加'
        },
        rules: {
          name: [
            { required: true, trigger: 'blur', message: '请填写子订单名称' }
          ],
          code: [
            { required: true, trigger: 'blur', message: '请填写子订单编码' }
          ]
        }
      }
    },
    created() {
      this.tempCopy = deepClone(this.temp)
      this.getList()
    },
    methods: {
      // translateStatus(status) {
      //   return {
      //     tagType: this.tagTypes[status],
      //     text: this.statuses[status]
      //   }
      // },
      handleSelectMaterial() {
        this.materialDialogFormVisible = true
      },
      confirmMaterial() {
        this.materialDialogFormVisible = false
        this.temp.productId = this.selectedMaterial && this.selectedMaterial.id
        this.temp.productName = this.selectedMaterial && this.selectedMaterial.name
      },
      getList() {
        this.listLoading = true
        getOrderItems(this.listQuery).then(res => {
          this.list = res.queryResult.list
          this.total = res.queryResult.total
          this.listLoading = false
        })
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
        this.resetForm('orderItemForm')
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        // this.rules.password[0].required = true
        this.$nextTick(() => {
          this.$refs['orderItemForm'].clearValidate()
        })
      },
      submit() {
        this.$refs['orderItemForm'].validate((valid) => {
          if (valid) {
            // const tempData = deepClone(this.temp)
            let orderItem = deepClone(this.temp)
            addOrderItem(orderItem).then((res) => {
              this.list.unshift(res.model)
              this.total++
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
      handleUpdate(row) {

        this.dialogStatus = 'update'
        // this.rules.password[0].required = false
        this.temp = deepClone(row) // copy obj
        // this.temp.password = ''
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['orderItemForm'].clearValidate()
        })
      },
      updateData() {
        this.$refs['orderItemForm'].validate((valid) => {
          if (valid) {
            let orderItem = deepClone(this.temp)
            updateOrderItem(orderItem).then(() => {
              for (const v of this.list) {
                if (v.id === orderItem.id) {
                  const index = this.list.indexOf(v)
                  this.list.splice(index, 1, orderItem)
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
        this.$confirm('此操作将永久删除该子订单, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteOrderItem(row.id).then(() => {
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
<style lang="scss">
  .order-item {

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

  }

</style>

