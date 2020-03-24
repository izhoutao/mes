<template>
  <div class="outbound-order-detail">
    <div class="filter-container">
      <el-form ref="filterForm" :model="listQuery" :inline="true" @submit.native.prevent>
        <el-button class="filter-item" style="margin: 16px 0px;" type="success"
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
      <el-table-column label="已出库数量" min-width="40px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.outQuantity}}</span>
        </template>
      </el-table-column>
      <el-table-column label="检验结果" min-width="80px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.checkResult }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="80">
        <template slot-scope="scope">
          <i class="el-icon-edit update" @click="handleUpdate(scope.row)"/>
          <i class="el-icon-delete delete" @click="handleDelete(scope.row,'true')"/>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      :close-on-click-modal="false"
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
      width="600px"
    >
      <el-form
        ref="outboundOrderDetailForm"
        :rules="rules"
        :model="temp"
        label-position="right"
        label-width="150px"
      >
        <el-form-item label="料号：" prop="materialCode">
          <el-input v-model="temp.materialCode" @click.native="handleSelectMaterial"/>
        </el-form-item>
        <el-form-item label="出库数量：" prop="quantity">
          <el-input v-model.number="temp.quantity"/>
        </el-form-item>
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

  import {
    getOutboundOrders,
    addOutboundOrder,
    updateOutboundOrder,
    deleteOutboundOrder
  } from '@/api/outboundorder.js'
  import {
    getOutboundOrderDetails,
    addOutboundOrderDetail,
    updateOutboundOrderDetail,
    deleteOutboundOrderDetail
  } from '@/api/outboundorderdetail.js'
  import { getMaterials } from '@/api/material'

  import waves from '@/directive/waves' // Waves directive
  import Pagination from '@/components/Pagination/index.vue' // Secondary package based on el-pagination
  import Material from './material.vue'

  export default {
    name: 'OutboundOrderDetail',
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
          outboundOrderId: this.orderId
        },
        selectedMaterial: undefined,
        // materials:[],
        // materialMap:null,
        temp: {
          id: undefined,
          materialId: '',
          materialCode:'',
          outboundOrderId: '',
          checkResult: '',
          quantity: '',
          outQuantity: ''
        },
        tempCopy: null,
        dialogFormVisible: false,
        dialogStatus: '',
        materialDialogFormVisible: false,
        textMap: {
          update: '编辑',
          create: '添加'
        },
        rules: {
          materialCode: [
            { required: true, message: '请选择料号' }
          ],
          quantity: [
            { required: true, message: '出库数量不能为空'},
            { type: 'number', message: '出库数量必须为数字值'}
          ],
        }
      }
    },
    created() {
      this.tempCopy = deepClone(this.temp)
      // this.getMaterials()
      this.getList()

    },
    // watch: {
    //   orderId: function(val) {
    //     // this.resetForm('filterForm')
    //     this.listQuery.outboundOrderId = val
    //     this.temp.outboundOrderId = val
    //     this.handleFilter()
    //   }
    // },
    methods: {
      getList() {
        this.listLoading = true
        getOutboundOrderDetails(this.listQuery).then(res => {
          this.list = res.queryResult.list
          this.total = res.queryResult.total
          this.listLoading = false
        })
      },
      // getMaterials() {
      //   getMaterials({}).then(res => {
      //     this.materials = res.queryResult.list
      //     this.materialMap = _.fromPairs(this.materials.map(material => {
      //       return [material.id, material]
      //     }))
      //   })
      // },

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
      handleSelectMaterial() {
        this.materialDialogFormVisible = true
      },
      confirmMaterial() {
        this.materialDialogFormVisible = false
        this.temp.materialId = this.selectedMaterial && this.selectedMaterial.id
        this.temp.materialCode = this.selectedMaterial && this.selectedMaterial.code
        this.temp.materialName = this.selectedMaterial && this.selectedMaterial.name
      },
      handleAdd() {
        this.resetForm('outboundOrderDetailForm')
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        // this.rules.password[0].required = true
        this.$nextTick(() => {
          this.$refs['outboundOrderDetailForm'].clearValidate()
        })
      },
      submit() {
        this.$refs['outboundOrderDetailForm'].validate((valid) => {
          if (valid) {
            // const tempData = deepClone(this.temp)
            let outboundOrderDetail = deepClone(this.temp)
            delete outboundOrderDetail.materialCode
            delete outboundOrderDetail.materialName
            addOutboundOrderDetail(outboundOrderDetail).then((res) => {
              res.model.materialCode=this.temp.materialCode
              res.model.materialName=this.temp.materialName
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
          this.$refs['outboundOrderDetailForm'].clearValidate()
        })
      },
      updateData() {
        this.$refs['outboundOrderDetailForm'].validate((valid) => {
          if (valid) {
            let outboundOrderDetail = deepClone(this.temp)
            outboundOrderDetail.outboundOrderId = this.orderId
            delete outboundOrderDetail.materialCode
            delete outboundOrderDetail.materialName
            updateOutboundOrderDetail(outboundOrderDetail).then(() => {
              for (const v of this.list) {
                if (v.id === outboundOrderDetail.id) {
                  const index = this.list.indexOf(v)
                  outboundOrderDetail.materialCode=this.temp.materialCode
                  outboundOrderDetail.materialName=this.temp.materialName
                  this.list.splice(index, 1, outboundOrderDetail)
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
          deleteOutboundOrderDetail(row.id).then(() => {
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
  .outbound-order-detail {

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

