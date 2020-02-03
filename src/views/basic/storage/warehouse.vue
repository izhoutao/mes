<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form ref="filterForm" :model="listQuery" :inline="true">
        <el-form-item label="" prop="name">
          <el-input
            v-model="listQuery.name"
            placeholder="请输入仓库名称"
            style="width: 200px;"
            class="filter-item"
            clearable=""
            @keyup.enter.native="handleFilter"
          />
        </el-form-item>
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
        <el-button v-waves class="filter-item" @click="resetForm('filterForm');handleFilter()">重置</el-button>
        <el-button class="filter-item" style="margin-left: 10px;" type="success"
                   icon="el-icon-edit" @click="handleAdd">
          添加
        </el-button>
      </el-form>
    </div>

    <el-table :key="tableKey" v-loading="listLoading" :data="list" border fit highlight-current-row>
      <el-table-column label="序号" min-width="30px" align="center">
        <template slot-scope="scope">
          {{ scope.$index }}
        </template>
      </el-table-column>
      <el-table-column label="仓库代码" min-width="80px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.code }}</span>
        </template>
      </el-table-column>
      <el-table-column label="仓库名称" min-width="80px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="仓库类型" min-width="80px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.type }}</span>
        </template>
      </el-table-column>
      <el-table-column label="管理员" min-width="50px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.admin }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否启用" min-width="30px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.state | stateFilter}}</span>
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

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.current"
      :limit.sync="listQuery.size"
      @pagination="getList"
    />

    <el-dialog :close-on-click-modal="false" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible"
               width="600px">
      <el-form
        ref="warehouseForm"
        :rules="rules"
        :model="temp"
        label-position="right"
        label-width="150px"
      >
        <el-form-item label="仓库代码：" prop="code">
          <el-input v-model="temp.code"/>
        </el-form-item>
        <el-form-item label="仓库名称：" prop="name">
          <el-input v-model="temp.name"/>
        </el-form-item>
        <el-form-item label="仓库类型：" prop="type">
          <el-input v-model="temp.type"/>
        </el-form-item>
        <el-form-item label="管理员：" prop="description">
          <el-input v-model="temp.admin"/>
        </el-form-item>
        <el-form-item label="是否启用：" prop="description">
          <el-switch v-model="temp.state"
                     active-color="#13ce66"
                     active-value="1"
                     inactive-value="0"/>
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

  import { getWarehouses, addWarehouse, updateWarehouse, deleteWarehouse } from '@/api/warehouse.js'

  import waves from '@/directive/waves' // Waves directive
  import Pagination from '@/components/Pagination/index.vue' // Secondary package based on el-pagination

  export default {
    name: 'warehouse',
    components: { Pagination },
    directives: { waves },
    filters: {
      statusFilter(state) {
        const statusMap = {
          published: 'success',
          draft: 'info',
          deleted: 'danger'
        }
        return statusMap[state]
      },
      stateFilter(state) {
        return state === '1' ? '启用' : '未启用'
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
          name: undefined
        },
        temp: {
          id: undefined,
          name: '',
          code: '',
          type: '',
          admin: '',
          state: '1'
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
            { required: true, trigger: 'blur', message: '请填写仓库名称' }
          ],
          code: [
            { required: true, trigger: 'blur', message: '请填写仓库代码' }
          ]
        }
      }
    },
    created() {
      this.tempCopy = deepClone(this.temp)
      this.getList()
    },
    methods: {
      handleModifyState(index, row) {
        updateWarehouse(row).then((res) => {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
        })
      },
      getList() {
        this.listLoading = true
        getWarehouses(this.listQuery).then(res => {
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
        this.resetForm('warehouseForm')
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        // this.rules.password[0].required = true
        this.$nextTick(() => {
          this.$refs['warehouseForm'].clearValidate()
        })
      },
      submit() {
        this.$refs['warehouseForm'].validate((valid) => {
          if (valid) {
            // const tempData = deepClone(this.temp)
            let warehouse = deepClone(this.temp)
            addWarehouse(warehouse).then((res) => {
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
          this.$refs['warehouseForm'].clearValidate()
        })
      },
      updateData() {
        this.$refs['warehouseForm'].validate((valid) => {
          if (valid) {
            let warehouse = deepClone(this.temp)
            updateWarehouse(warehouse).then(() => {
              for (const v of this.list) {
                if (v.id === warehouse.id) {
                  const index = this.list.indexOf(v)
                  this.list.splice(index, 1, warehouse)
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
          deleteWarehouse(row.id).then(() => {
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


