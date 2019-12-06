<template>
  <div class="inspection-rule-item">
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
      <el-table-column label="检验项目" min-width="80px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="检验内容" min-width="80px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column label="规格" min-width="80px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.specification}}</span>
        </template>
      </el-table-column>
      <el-table-column label="检测方法" min-width="40px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.method}}</span>
        </template>
      </el-table-column>
      <el-table-column label="检测工具" min-width="80px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.tool }}</span>
        </template>
      </el-table-column>
      <el-table-column label="检测频率" min-width="80px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.frequency }}</span>
        </template>
      </el-table-column>
      <el-table-column label="检测类型" min-width="80px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.checkType }}</span>
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
      width="800px"
    >
      <el-form
        ref="inspectionRuleItemForm"
        :rules="rules"
        :model="temp"
        label-position="right"
        label-width="100px"
      >

        <el-row>
          <el-col :span="12">
            <el-form-item label="检验项目：" prop="name">
              <el-input v-model="temp.name"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="项次：" prop="sequenceNumber">
              <el-input v-model.number="temp.sequenceNumber"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="检验内容：" prop="description" style="width: 100%">
              <el-input v-model="temp.description" type="textarea"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="检验工具：" prop="tool">
              <el-input v-model="temp.tool"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="检验频率：" prop="frequency">
              <el-input v-model.number="temp.frequency"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="检验规格：" prop="showSpecification">
              <el-checkbox v-model="showSpecification"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="检验方法：" prop="method">
              <el-input v-model="temp.method"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="检验规格：" prop="specification" v-show="showSpecification">
              <el-input v-model.number="temp.specification"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="规格单位：" prop="unit" v-show="showSpecification">
              <el-input v-model="temp.specificationUnit"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="规格下限：" prop="minValue" v-show="showSpecification">
              <el-input v-model.number="temp.minValue"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="规格上限：" prop="maxValue" v-show="showSpecification">
              <el-input v-model.number="temp.maxValue"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="检验类别：" prop="checkType">
              <el-input v-model="temp.checkType"/>
            </el-form-item>
          </el-col>
        </el-row>
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
    getInspectionRuleItems,
    addInspectionRuleItem,
    updateInspectionRuleItem,
    deleteInspectionRuleItem
  } from '@/api/inspectionruleitem.js'

  import waves from '@/directive/waves' // Waves directive
  import Pagination from '@/components/Pagination/index.vue' // Secondary package based on el-pagination
  import Material from './material.vue'

  export default {
    name: 'InspectionRuleItem',
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
        temp: {
          id: undefined,
          inspectionRuleId: this.ruleId,
          name: '',
          sequenceNumber: '',
          description: '',
          tool: '',
          frequency: '',
          method: '',
          specification: '',
          specificationUnit: '',
          minValue: '',
          maxValue: '',
          checkType: ''
        },
        tempCopy: null,
        dialogFormVisible: false,
        dialogStatus: '',
        showSpecification: true,
        textMap: {
          update: '编辑',
          create: '添加'
        },
        rules: {
          name: [
            { required: true, message: '请填写检验项目' }
          ],
          description: [
            { required: true, message: '请填写检验内容' }
          ]
        }
      }
    },
    created() {
      this.tempCopy = deepClone(this.temp)
      this.getList()

    },
    watch: {
      ruleId: function(val) {
        // this.resetForm('filterForm')
        this.listQuery.inspectionRuleId = val
        this.temp.inspectionRuleId = val
        this.handleFilter()
      }
    },
    methods: {
      getList() {
        this.listLoading = true
        getInspectionRuleItems(this.listQuery).then(res => {
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
        this.resetForm('inspectionRuleItemForm')
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        // this.rules.password[0].required = true
        this.$nextTick(() => {
          this.$refs['inspectionRuleItemForm'].clearValidate()
        })
      },
      submit() {
        this.$refs['inspectionRuleItemForm'].validate((valid) => {
          if (valid) {
            // const tempData = deepClone(this.temp)
            let inspectionRuleItem = deepClone(this.temp)
            addInspectionRuleItem(inspectionRuleItem).then((res) => {
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
          this.$refs['inspectionRuleItemForm'].clearValidate()
        })
      },
      updateData() {
        this.$refs['inspectionRuleItemForm'].validate((valid) => {
          if (valid) {
            let inspectionRuleItem = deepClone(this.temp)
            updateInspectionRuleItem(inspectionRuleItem).then(() => {
              for (const v of this.list) {
                if (v.id === inspectionRuleItem.id) {
                  const index = this.list.indexOf(v)
                  this.list.splice(index, 1, inspectionRuleItem)
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
        this.$confirm('此操作将永久删除该检规项目, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteInspectionRuleItem(row.id).then(() => {
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
  .inspection-rule-item {

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

