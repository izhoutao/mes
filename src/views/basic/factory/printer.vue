<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form ref="filterForm" :model="listQuery" :inline="true">
        <el-form-item label="" prop="name">
          <el-input
            v-model="listQuery.name"
            placeholder="请输入打印机名称"
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
      <el-table-column label="序" min-width="20px" type="index" align="center">
      </el-table-column>
      <el-table-column label="打印机名称" min-width="70px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="打印机路径" min-width="70px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.path }}</span>
        </template>
      </el-table-column>
      <el-table-column label="字符编码" min-width="80px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.characterCode }}</span>
        </template>
      </el-table-column>
      <el-table-column label="访问用户名" min-width="70px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="访问密码" min-width="70px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.password }}</span>
        </template>
      </el-table-column>
      <el-table-column label="打印文件路径" min-width="70px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.filePath }}</span>
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
        ref="printerForm"
        :rules="rules"
        :model="temp"
        label-position="right"
        label-width="150px"
      >
        <el-form-item label="打印机名称：" prop="name">
          <el-input v-model="temp.name"/>
        </el-form-item>
        <el-form-item label="打印机路径：" prop="path">
          <el-input v-model="temp.path"/>
        </el-form-item>
        <el-form-item label="字符编码：" prop="characterCode">
          <el-input v-model="temp.characterCode"/>
        </el-form-item>
        <el-form-item label="访问用户名：" prop="username">
          <el-input v-model="temp.username"/>
        </el-form-item>
        <el-form-item label="访问密码：" prop="password">
          <el-input v-model="temp.password"/>
        </el-form-item>
        <el-form-item label="打印文件路径：" prop="filePath">
          <el-input v-model="temp.filePath"/>
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

  import { getPrinters, addPrinter, updatePrinter, deletePrinter } from '@/api/printer.js'

  import waves from '@/directive/waves' // Waves directive
  import Pagination from '@/components/Pagination/index.vue' // Secondary package based on el-pagination

  export default {
    name: 'printer',
    components: { Pagination },
    directives: { waves },
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
          path: '',
          characterCode: '',
          username: '',
          password: '',
          filePath: ''
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
            { required: true, trigger: 'blur', message: '打印机名称不能为空' }
          ],
          path: [
            { required: true, trigger: 'blur', message: '打印机路径不能为空' }
          ],
          characterCode: [
            { required: true, trigger: 'blur', message: '字符编码不能为空' }
          ],
          username: [
            { required: true, trigger: 'blur', message: '访问用户名不能为空' }
          ],
          password: [
            { required: true, trigger: 'blur', message: '访问密码不能为空' }
          ],
          filePath: [
            { required: true, trigger: 'blur', message: '打印文件路径不能为空' }
          ],
        }
      }
    },
    created() {
      this.tempCopy = deepClone(this.temp)
      this.getList()
    },
    methods: {
      handleModifyState(index, row) {
        updatePrinter(row).then((res) => {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
        })
      },
      getList() {
        this.listLoading = true
        getPrinters(this.listQuery).then(res => {
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
        this.resetForm('printerForm')
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        // this.rules.password[0].required = true
        this.$nextTick(() => {
          this.$refs['printerForm'].clearValidate()
        })
      },
      submit() {
        this.$refs['printerForm'].validate((valid) => {
          if (valid) {
            // const tempData = deepClone(this.temp)
            let printer = deepClone(this.temp)
            addPrinter(printer).then((res) => {
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
          this.$refs['printerForm'].clearValidate()
        })
      },
      updateData() {
        this.$refs['printerForm'].validate((valid) => {
          if (valid) {
            let printer = deepClone(this.temp)
            updatePrinter(printer).then(() => {
              for (const v of this.list) {
                if (v.id === printer.id) {
                  const index = this.list.indexOf(v)
                  this.list.splice(index, 1, printer)
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
          deletePrinter(row.id).then(() => {
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


