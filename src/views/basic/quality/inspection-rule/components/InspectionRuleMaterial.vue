<template>
  <div class="inspection-rule-material">
    <div class="filter-container">
      <el-form ref="filterForm" :model="listQuery" :inline="true">
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
      <el-table-column label="料号类别" min-width="80px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.materialTypeName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="品名" min-width="80px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.materialName }}</span>
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
        ref="inspectionRuleMaterialForm"
        :rules="rules"
        :model="temp"
        label-position="right"
        label-width="150px"
      >
        <el-form-item label="料号：" prop="materialCode">
          <el-input v-model="temp.materialCode" @click.native="handleSelectMaterial"/>
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
    getInspectionRuleMaterials,
    addInspectionRuleMaterial,
    updateInspectionRuleMaterial,
    deleteInspectionRuleMaterial
  } from '@/api/inspectionrulematerial.js'

  import waves from '@/directive/waves' // Waves directive
  import Pagination from '@/components/Pagination/index.vue' // Secondary package based on el-pagination
  import Material from './material.vue'

  export default {
    name: 'InspectionRuleMaterial',
    components: { Pagination, Material },
    directives: { waves },
    props: ['ruleId'],
    data() {
      return {
        tableKey: 0,
        list: [],
        total: 0,
        listLoading: true,
        listQuery: {
          current: 1,
          size: 10,
          inspectionRuleId: this.ruleId
        },
        selectedMaterial: undefined,
        temp: {
          id: undefined,
          materialId: '',
          materialCode:'',
          inspectionRuleId: this.ruleId,
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
            { required: true, message: '入库数量不能为空'},
            { type: 'number', message: '入库数量必须为数字值'}
          ],
        }
      }
    },
    created() {
      this.tempCopy = deepClone(this.temp)
      this.getList()
    },
    // watch: {
    //   ruleId: function(val) {
    //     // this.resetForm('filterForm')
    //     this.listQuery.inspectionRuleId = val
    //     this.temp.inspectionRuleId = val
    //     this.handleFilter()
    //   }
    // },
    methods: {
      getList() {
        this.listLoading = true
        getInspectionRuleMaterials(this.listQuery).then(res => {
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
      handleSelectMaterial() {
        this.materialDialogFormVisible = true
      },
      confirmMaterial() {
        this.materialDialogFormVisible = false
        this.temp.materialId = this.selectedMaterial && this.selectedMaterial.id
        this.temp.materialCode = this.selectedMaterial && this.selectedMaterial.code
        this.temp.materialName = this.selectedMaterial && this.selectedMaterial.name
        this.temp.materialTypeName = this.selectedMaterial && this.selectedMaterial.typeName
      },
      handleAdd() {
        this.resetForm('inspectionRuleMaterialForm')
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        // this.rules.password[0].required = true
        this.$nextTick(() => {
          this.$refs['inspectionRuleMaterialForm'].clearValidate()
        })
      },
      submit() {
        this.$refs['inspectionRuleMaterialForm'].validate((valid) => {
          if (valid) {
            // const tempData = deepClone(this.temp)
            let inspectionRuleMaterial = deepClone(this.temp)
            delete inspectionRuleMaterial.materialCode
            delete inspectionRuleMaterial.materialName
            delete inspectionRuleMaterial.materialTypeName
            addInspectionRuleMaterial(inspectionRuleMaterial).then((res) => {
              res.model.materialCode=this.temp.materialCode
              res.model.materialName=this.temp.materialName
              res.model.materialTypeName=this.temp.materialTypeName
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
          this.$refs['inspectionRuleMaterialForm'].clearValidate()
        })
      },
      updateData() {
        this.$refs['inspectionRuleMaterialForm'].validate((valid) => {
          if (valid) {
            let inspectionRuleMaterial = deepClone(this.temp)
            delete inspectionRuleMaterial.materialCode
            delete inspectionRuleMaterial.materialName
            delete inspectionRuleMaterial.materialTypeName
            updateInspectionRuleMaterial(inspectionRuleMaterial).then(() => {
              for (const v of this.list) {
                if (v.id === inspectionRuleMaterial.id) {
                  const index = this.list.indexOf(v)
                  inspectionRuleMaterial.materialCode=this.temp.materialCode
                  inspectionRuleMaterial.materialName=this.temp.materialName
                  inspectionRuleMaterial.materialTypeName=this.temp.materialTypeName
                  this.list.splice(index, 1, inspectionRuleMaterial)
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
        this.$confirm('此操作将永久删除该检规对应料号, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteInspectionRuleMaterial(row.id).then(() => {
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
  .inspection-rule-material {

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

