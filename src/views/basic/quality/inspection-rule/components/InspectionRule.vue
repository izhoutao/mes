<template>
  <div class="inspection-rule">
    <div class="filter-container">
      <el-form ref="filterForm" :model="listQuery" :inline="true">

        <el-form-item label="" prop="code">
          <el-input
            v-model="listQuery.code"
            placeholder="请输入检规编号"
            prefix-icon="el-icon-search"
            class="filter-item"
            clearable=""
            @keyup.enter.native="handleFilter"
          />
        </el-form-item>

        <el-form-item label="" prop="statusId">
          <el-select v-model="listQuery.materialId" filterable placeholder="请选择维护的物料" @change="handleMaterialIdChange">
            <el-option
              v-for="item in materials"
              :key="item.id"
              :label="item.name"
              :value="item.id">
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

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      @current-change="handleCurrentChange"
    >
      <el-table-column label="序号" min-width="40px" align="center">
        <template slot-scope="scope">
          {{ scope.$index }}
        </template>
      </el-table-column>
      <el-table-column label="检规编号" min-width="80px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.code }}</span>
        </template>
      </el-table-column>
      <el-table-column label="检规版次" min-width="80px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.version }}</span>
        </template>
      </el-table-column>
      <el-table-column label="最后维护人" min-width="80px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.updatePerson}}</span>
        </template>
      </el-table-column>
      <el-table-column label="最后维护时间" min-width="80px" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.updateTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="80">
        <template slot-scope="scope">
          <i class="el-icon-edit update" @click="handleUpdate(scope.row)"/>
          <i class="el-icon-delete delete" @click="handleDelete(scope.row,'true')"/>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :close-on-click-modal="false" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible"
               width="600px">
      <el-form
        ref="inspectionRuleForm"
        :rules="rules"
        :model="temp"
        label-position="right"
        label-width="150px"
      >
        <el-form-item label="检规编号：" prop="number">
          <el-input v-model="temp.code"/>
        </el-form-item>
        <el-form-item label="检规版次：" prop="typeId">
          <el-input v-model="temp.version"/>
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
    getInspectionRules,
    addInspectionRule,
    updateInspectionRule,
    deleteInspectionRule
  } from '@/api/inspectionrule'
  import { getMaterials } from '@/api/material.js'

  import waves from '@/directive/waves' // Waves directive
  import Pagination from '@/components/Pagination/index.vue' // Secondary package based on el-pagination

  export default {
    name: 'InspectionRule',
    components: { Pagination },
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
          code: undefined,
          materialId: undefined
        },
        materials: [],
        temp: {
          id: undefined,
          code: '',
          version: ''
        },
        tempCopy: null,
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: '编辑',
          create: '添加'
        },
        rules: {
          code: [
            { required: true, trigger: 'blur', message: '请填写检规编码' }
          ],
          version: [
            { required: true, trigger: 'blur', message: '请填写检规版次' }
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
        await this.getMaterials()
        this.getList()
      })
    },
    methods: {
      handleMaterialIdChange() {
        this.getList()
      },
      getList() {
        this.listLoading = true
        getInspectionRules(this.listQuery).then(res => {
          this.$emit('update:ruleId', '')
          this.list = res.queryResult.list
          this.total = res.queryResult.total
          this.listLoading = false
        })
      },
      async getMaterials() {
        let res = await getMaterials({})
        this.materials = res.queryResult.list
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
        this.resetForm('inspectionRuleForm')
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        // this.rules.password[0].required = true
        this.$nextTick(() => {
          this.$refs['inspectionRuleForm'].clearValidate()
        })
      },
      submit() {
        this.$refs['inspectionRuleForm'].validate((valid) => {
          if (valid) {
            // const tempData = deepClone(this.temp)
            let inspectionRule = deepClone(this.temp)
            addInspectionRule(inspectionRule).then((res) => {
              this.list.unshift(res.model)
              this.total++
              this.dialogFormVisible = false
              this.$emit('update:ruleId', '')
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
          this.$refs['inspectionRuleForm'].clearValidate()
        })
      },
      updateData() {
        this.$refs['inspectionRuleForm'].validate((valid) => {
          if (valid) {
            let inspectionRule = deepClone(this.temp)
            updateInspectionRule(inspectionRule).then(() => {
              for (const v of this.list) {
                if (v.id === inspectionRule.id) {
                  const index = this.list.indexOf(v)
                  this.list.splice(index, 1, inspectionRule)
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
        this.$confirm('此操作将永久删除该检验规则, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteInspectionRule(row.id).then(() => {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
            const index = this.list.indexOf(row)
            this.list.splice(index, 1)
            this.total--
            this.$emit('update:ruleId', '')
          })
        })
      },
      handleCurrentChange(val) {
        val && this.$emit('update:ruleId', val.id)
      }

    }
  }
</script>
<style lang="scss">
  .inspection-rule {

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

