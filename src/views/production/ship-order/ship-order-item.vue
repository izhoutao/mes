<template>
  <div class="ship-order-item">
    <div class="filter-container">
      <el-form ref="filterForm" :model="listQuery" :inline="true">
        <el-form-item label="" prop="shipOrderItemNumber">
          <el-input
            v-model="listQuery.shipOrderItemNumber"
            placeholder="请输入出货项号"
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
      <el-table-column label="出货项号" min-width="80px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.shipOrderItemNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column label="物料名称" min-width="80px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.materialName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="规格" min-width="80px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.specification }}</span>
        </template>
      </el-table-column>
      <el-table-column label="目标数量" min-width="50px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.requestNum }}</span>
        </template>
      </el-table-column>
      <el-table-column label="已完成数量" min-width="50px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.shippedNum }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" min-width="50px" align="center">
        <template slot-scope="scope">
          <el-tag :type="translateStatus(scope.row.status).tagType" style="margin:0 5px;">
            {{ translateStatus(scope.row.status).text}}
          </el-tag>
        </template>
      </el-table-column>

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
        ref="shipOrderItemForm"
        :rules="rules"
        :model="temp"
        label-position="right"
        label-width="150px"
      >
        <el-form-item label="产品：" prop="materialName">
          <el-input v-model="temp.materialName" @click.native="handleSelectMaterial"/>
        </el-form-item>
        <el-form-item label="规格：" prop="specification">
          <el-input v-model="temp.specification"/>
        </el-form-item>
        <el-form-item label="目标数量：" prop="num">
          <el-input v-model="temp.requestNum"/>
        </el-form-item>
        <el-form-item label="完成数量：" prop="num" v-if="dialogStatus!=='create'">
          <el-input :value="temp.shippedNum" :disabled="true"/>
        </el-form-item>
        <el-form-item label="状态：" prop="status" v-if="dialogStatus!=='create'">
          <el-select :value="temp.status" :disabled="true" placeholder="" style="width:100%">
            <el-option
              v-for="(item,index) in statuses"
              :key="index"
              :label="item"
              :value="index">
            </el-option>
          </el-select>
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

  import { getShipOrderItems, addShipOrderItem, updateShipOrderItem, deleteShipOrderItem } from '@/api/shiporderitem.js'

  import waves from '@/directive/waves' // Waves directive
  import Pagination from '@/components/Pagination/index.vue' // Secondary package based on el-pagination
  import Material from './material.vue'

  export default {
    name: 'ShipOrderItem',
    components: { Pagination, Material },
    directives: { waves },
    props: ['shipOrderId'],
    data() {
      return {
        tableKey: 0,
        list: [],
        total: 0,
        listLoading: true,
        listQuery: {
          current: 1,
          size: 10,
          shipOrderId: this.shipOrderId,
          shipOrderItemNumber: '',
          status: undefined
        },
        temp: {
          id: undefined,
          shipOrderItemNumber: '',
          shipOrderId: this.shipOrderId,
          materialId: undefined,
          materialName: '',
          specification: '',
          requestNum: undefined,
          shippedNum: undefined,
          status: undefined
        },
        tempCopy: null,
        statuses: ['未完成', '已完成'],
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
      translateStatus(status) {
        return {
          tagType: this.tagTypes[status],
          text: this.statuses[status]
        }
      },
      handleSelectMaterial() {
        this.materialDialogFormVisible = true
      },
      confirmMaterial() {
        this.materialDialogFormVisible = false
        this.temp.materialId = this.selectedMaterial && this.selectedMaterial.id
        this.temp.materialName = this.selectedMaterial && this.selectedMaterial.name
      },
      getList() {
        this.listLoading = true
        getShipOrderItems(this.listQuery).then(res => {
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
        this.resetForm('shipOrderItemForm')
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        // this.rules.password[0].required = true
        this.$nextTick(() => {
          this.$refs['shipOrderItemForm'].clearValidate()
        })
      },
      submit() {
        this.$refs['shipOrderItemForm'].validate((valid) => {
          if (valid) {
            // const tempData = deepClone(this.temp)
            let shipOrderItem = deepClone(this.temp)
            addShipOrderItem(shipOrderItem).then((res) => {
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
          this.$refs['shipOrderItemForm'].clearValidate()
        })
      },
      updateData() {
        this.$refs['shipOrderItemForm'].validate((valid) => {
          if (valid) {
            let shipOrderItem = deepClone(this.temp)
            updateShipOrderItem(shipOrderItem).then(() => {
              for (const v of this.list) {
                if (v.id === shipOrderItem.id) {
                  const index = this.list.indexOf(v)
                  this.list.splice(index, 1, shipOrderItem)
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
        this.$confirm('此操作将永久删除该出货单项, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteShipOrderItem(row.id).then(() => {
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
  .ship-order-item {

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

