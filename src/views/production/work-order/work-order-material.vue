<template>
  <div class="order-item">
    <div class="filter-container">
      <el-form ref="filterForm" :model="listQuery" :inline="true">
        <el-form-item label="" prop="WorkOrderMaterialNumber">
          <el-input
            v-model="listQuery.workOrderMaterialNumber"
            placeholder="请输入子订单号"
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

      <el-table-column label="需求数量" min-width="50px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.requestNum }}</span>
        </template>
      </el-table-column>
      <el-table-column label="已使用数量" min-width="50px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.usedNum }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用量单位" min-width="50px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.unit}}</span>
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
        ref="workOrderMaterialForm"
        :rules="rules"
        :model="temp"
        label-position="right"
        label-width="150px"
      >
        <el-form-item label="料号：" prop="materialName">
          <el-input v-model="temp.materialName" @click.native="handleSelectMaterial"/>
        </el-form-item>
        <el-form-item label="需求数量：" prop="requestNum">
          <el-input v-model.number="temp.requestNum"/>
        </el-form-item>
<!--        <el-form-item label="已使用数量：" prop="usedNum">-->
<!--          <el-input v-model.number="temp.usedNum"/>-->
<!--        </el-form-item>-->
        <el-form-item label="用量单位：" prop="typeId">
          <el-select v-model="temp.unit" filterable placeholder="请选择" style="width:100%">
            <el-option
              v-for="item in units"
              :key="item.id"
              :label="item.name"
              :value="item.name">
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
  import { getDictMaps } from '@/api/dictionary'
  import {
    getWorkOrderMaterials,
    addWorkOrderMaterial,
    updateWorkOrderMaterial,
    deleteWorkOrderMaterial
  } from '@/api/workordermaterial.js'

  import waves from '@/directive/waves' // Waves directive
  import Pagination from '@/components/Pagination/index.vue' // Secondary package based on el-pagination
  import Material from './material.vue'

  export default {
    name: 'WorkOrderMaterial',
    components: { Pagination, Material },
    directives: { waves },
    props: ['workOrderId'],
    data() {
      return {
        tableKey: 0,
        list: [],
        total: 0,
        listLoading: true,
        listQuery: {
          current: 1,
          size: 10,
          workOrderId: this.workOrderId,
          status: undefined
        },
        temp: {
          id: undefined,
          workOrderId: this.workOrderId,
          materialId: undefined,
          materialCode: undefined,
          materialName: '',
          requestNum: undefined,
          // usedNum: undefined,
          unit: ''
        },
        tempCopy: null,
        statuses: ['待领料', '已领料'],
        tagTypes: ['success', 'danger'],
        units: [],
        unitMap: null,
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
      this.listLoading = true
      this.$nextTick(async() => {
        await this.getDicts()
        this.getList()
      })
    },
    methods: {

      handleSelectMaterial() {
        this.materialDialogFormVisible = true
      },
      confirmMaterial() {
        this.materialDialogFormVisible = false
        this.temp.materialId = this.selectedMaterial && this.selectedMaterial.id
        this.temp.materialCode = this.selectedMaterial && this.selectedMaterial.code
        this.temp.materialName = this.selectedMaterial && this.selectedMaterial.name
      },
      getList() {
        this.listLoading = true
        getWorkOrderMaterials(this.listQuery).then(res => {
          this.list = res.queryResult.list
          this.total = res.queryResult.total
          this.listLoading = false
        })
      },

      async getDicts() {
        const dictTypeIds = ['1233012081154904066']
        let res = await getDictMaps(dictTypeIds)
        this.units = res.model[dictTypeIds[0]]
        this.unitMap = _.fromPairs(this.units.map(unit => {
          return [unit.id, unit]
        }))
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
        this.resetForm('workOrderMaterialForm')
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        // this.rules.password[0].required = true
        this.$nextTick(() => {
          this.$refs['workOrderMaterialForm'].clearValidate()
        })
      },
      submit() {
        this.$refs['workOrderMaterialForm'].validate((valid) => {
          if (valid) {
            // const tempData = deepClone(this.temp)
            let workOrderMaterial = deepClone(this.temp)
            addWorkOrderMaterial(workOrderMaterial).then((res) => {
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
          this.$refs['workOrderMaterialForm'].clearValidate()
        })
      },
      updateData() {
        this.$refs['workOrderMaterialForm'].validate((valid) => {
          if (valid) {
            let workOrderMaterial = deepClone(this.temp)
            updateWorkOrderMaterial(workOrderMaterial).then(() => {
              for (const v of this.list) {
                if (v.id === workOrderMaterial.id) {
                  const index = this.list.indexOf(v)
                  this.list.splice(index, 1, workOrderMaterial)
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
          deleteWorkOrderMaterial(row.id).then(() => {
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

