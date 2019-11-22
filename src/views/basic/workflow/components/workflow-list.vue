<template>
  <div class="workflow-container">
    <div class="filter-container">
      <el-form ref="filterForm" :model="listQuery" :inline="true">
        <el-form-item label="" prop="name">
          <el-input
            v-model="listQuery.name"
            placeholder="请输入路线名称"
            prefix-icon="el-icon-search"
            style="padding:0px 8px;"
            class="filter-item"
            clearable=""
            @keyup.enter.native="handleFilter"
            size="mini"
          />
        </el-form-item>
        <!--        <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
                <el-button v-waves class="filter-item" @click="resetForm('filterForm');handleFilter()">重置</el-button>
                <el-button class="filter-item" style="margin-left: 10px;" type="success"
                           icon="el-icon-edit" @click="handleAdd">
                  添加
                </el-button>-->
      </el-form>
      <i class="el-icon-circle-plus" @click="handleAdd"/>
      <i class="el-icon-edit" @click="handleUpdate(currentWorkflow)"/>
      <i class="el-icon-delete" @click="handleDelete(currentWorkflow,'true')"/>
    </div>

    <el-table :key="tableKey" v-loading="listLoading" :data="list" border fit highlight-current-row
              @current-change="handleCurrentChange">
      <!--      <el-table-column label="序号" min-width="50px" align="center">
              <template slot-scope="scope">
                {{ scope.$index }}
              </template>
            </el-table-column>-->
      <el-table-column label="路线名称" min-width="80px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>

    </el-table>

    <el-pagination
      v-show="total>0"
      :total="total"
      :page-size="listQuery.size"
      :pager-count="5"
      @current-change="handleCurrentPageChange"
      :hide-on-single-page="true"
      small
      layout="prev, pager, next">
    </el-pagination>

    <el-dialog :close-on-click-modal="false" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible"
               width="550px">
      <el-form
        ref="dictForm"
        :rules="rules"
        :model="temp"
        label-position="right"
        label-width="100px"
      >
        <el-form-item label="路线名称：" prop="name">
          <el-input v-model="temp.name"/>
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

  import { getWorkflows, addWorkflow, updateWorkflow, deleteWorkflow } from '@/api/workflow'

  import waves from '@/directive/waves' // Waves directive
  import Pagination from '@/components/Pagination/index' // Secondary package based on el-pagination

  export default {
    name: 'WorkflowList',
    components: { Pagination },
    directives: { waves },
    props: ['currentWorkflow'],
    data() {
      return {
        tableKey: 0,
        list: [],
        total: 0,
        listLoading: true,
        listQuery: {
          current: 1,
          size: 10,
          name: undefined
        },
        temp: {
          id: undefined,
          name: ''
          // code: ''
        },
        tempCopy: null,
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: '编辑',
          create: '添加'
        },
        rules: {
          name: [
            { required: true, trigger: 'blur', message: '请填写路线名称' }
          ]
          // code: [
          //   { required: true, trigger: 'blur', message: '请填写路线编码' }]
        }
      }
    },
    created() {
      this.tempCopy = deepClone(this.temp)
      this.getList()
    },
    methods: {
      getList() {
        this.listLoading = true
        getWorkflows(this.listQuery).then(res => {
          this.$emit('update:currentWorkflow', {})
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
        this.resetForm('dictForm')
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dictForm'].clearValidate()
        })
      },
      submit() {
        this.$refs['dictForm'].validate((valid) => {
          if (valid) {
            let workflow = deepClone(this.temp)
            addWorkflow(workflow).then((res) => {
              this.list.unshift(res.model)
              this.total++
              this.dialogFormVisible = false
              this.$emit('update:currentWorkflow', {})
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
        if (!row.id) {
          this.$message({
            message: '请选择一条生产路线',
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
          this.$refs['dictForm'].clearValidate()
        })
      },
      updateData() {
        this.$refs['dictForm'].validate((valid) => {
          if (valid) {
            let workflow = deepClone(this.temp)
            updateWorkflow(workflow).then(() => {
              for (const v of this.list) {
                if (v.id === workflow.id) {
                  const index = this.list.indexOf(v)
                  this.list.splice(index, 1, workflow)
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
        if (!row.id) {
          this.$message({
            message: '请选择一条生产路线',
            type: 'warning'
          })
          return
        }
        this.$confirm('此操作将永久删除该生产路线, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteWorkflow(row.id).then(() => {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
            const index = this.list.indexOf(row)
            this.list.splice(index, 1)
            this.$emit('update:currentWorkflow', {})
          })
        })
      },
      handleCurrentChange(val) {
        // alert(JSON.stringify(val))
        // this.currentWorkflow = val
        this.$emit('update:currentWorkflow', val)
      },
      handleCurrentPageChange(val) {
        this.listQuery.current = val
        this.getList()
      }
    }
  }
</script>

<style lang="scss">
  .workflow-container {

  .el-icon-circle-plus, .el-icon-edit, .el-icon-delete {
    margin: 3px;
    font-size: 18px !important;
  }

  .filter-container {
    display: flex;
    /*默认的主轴是row,这里需要以列的方式进行排列*/
    flex-direction: row;
    /*设置子元素的主轴方向上的排列方式*/
    justify-content: space-around;
    align-items: center;

  .el-form {
    flex: 1;
  }

  .el-form-item {
    margin: 0px;
    width: 100% !important;
  }

  .el-form-item__content {
    width: 100%;
  }

  }


  .el-table--border, .el-table--group {
    border: none;
  }

  .el-table__header-wrapper th:nth-last-of-type(2) {
    border-right: none;
  }

  .el-table--border td:nth-last-of-type(1) {
    border-right: none;
  }

  .el-table--border::after, .el-table--group::after {
    width: 0;
  }

  }


</style>
