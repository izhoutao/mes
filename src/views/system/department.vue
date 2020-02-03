<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form ref="filterForm" :model="listQuery" :inline="true">
        <el-form-item label="" prop="name">
          <el-input
            v-model="listQuery.name"
            placeholder="请输入部门名称"
            style="width: 200px;"
            class="filter-item"
            clearable=""
            @keyup.enter.native="handleFilter"
          />
        </el-form-item>
        <el-form-item label="" prop="enabled">
          <el-select v-model="listQuery.enabled" clearable placeholder="状态" class="filter-item" style="width: 90px"
                     @change="handleFilter">
            <el-option :key="'正常'" :label="'正常'" :value="1"/>
            <el-option :key="'禁用'" :label="'禁用'" :value="0"/>
          </el-select>
        </el-form-item>
<!--        <el-form-item>
          <el-date-picker
            v-model="listQuery.createTime"
            type="daterange"
            range-separator=":"
            class="el-range-editor&#45;&#45;small filter-item"
            style="height: 30.5px;width: 220px"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"/>
        </el-form-item>-->
        </el-form-item>
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
        <el-button v-waves class="filter-item" @click="resetForm('filterForm');handleFilter()">重置</el-button>
        <el-button class="filter-item" style="margin-left: 10px;" type="success"
                   icon="el-icon-edit" @click="handleAdd">
          添加
        </el-button>
      </el-form>
    </div>
    <el-table
      :key="tableKey"
      default-expand-all
      row-key="id"
      v-loading="listLoading"
      :data="tableData"
      border
      fit
      highlight-current-row
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column label="名称" min-width="100px" align="left">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column label="状态" width="200px" align="center">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.enabled"
            active-color="#13ce66"
            @change="handleModifyState(scope.row)"
          />

        </template>
      </el-table-column>

      <el-table-column label="创建日期" min-width="160px" align="center">
        <template slot-scope="scope">
          <i class="el-icon-time"/>
          <span>{{ scope.row.createTime | parseTime('{y}-{m}-{d}') }}</span>
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
    <!--
        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="listQuery.current"
          :limit.sync="listQuery.size"
          @pagination="getList"
        />-->

    <el-dialog :close-on-click-modal="false" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible"
               width="600px">
      <el-form
        ref="departmentForm"
        :rules="rules"
        :model="temp"
        label-position="right"
        label-width="150px"
      >
        <el-form-item label="部门名称：" prop="name">
          <el-input v-model="temp.name"/>
        </el-form-item>
        <el-form-item label="状态：" prop="enabled">
          <el-switch
            v-model="temp.enabled"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </el-form-item>
        <el-form-item label="上级部门：" prop="pid">
          <treeselect
            v-model="temp.pid"
            :options="treeData"
            :normalizer="normalizer"
            :defaultExpandLevel=Infinity
            style="width: 370px;"
            placeholder="选择上级类目"
          />
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
  import { deepClone } from '@/utils/index'

  import { getDepartments, addDepartment, updateDepartment, deleteDepartment } from '@/api/department.js'

  import waves from '@/directive/waves' // Waves directive
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
  import Treeselect from '@riophae/vue-treeselect'
  import '@riophae/vue-treeselect/dist/vue-treeselect.css'

  export default {
    name: 'department',
    components: { Pagination, Treeselect },
    directives: { waves },
    watch: {
      list: {
        handler: function(val) {
          // this.tableData = this.toTree(deepClone(val), this.rootId)
          this.tableData = this.buildTree(val)
          this.treeData = [{
            id: '0',
            name: '顶级类目',
            children: this.tableData
          }]
        },
        // deep: true
      }
    },
    data() {
      return {
        tableKey: 0,
        list: [],
        tableData: [],
        treeData: [],
        total: 0,
        listLoading: true,
        listQuery: {
          name: undefined,
          enabled: undefined,
        },
        temp: {
          id: undefined,
          name: '',
          pid: '0',
          enabled: true,
          description: ''
        },
        tempCopy: null,
        expand: true,
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: '编辑',
          create: '添加'
        },
        rules: {
          name: [
            { required: true, trigger: 'blur', message: '请填写部门名称' }
          ]
        }
      }
    },
    created() {
      this.tempCopy = deepClone(this.temp)
      this.getList()
    },
    methods: {
      handleModifyState(row) {
        updateDepartment({
          'id': row.id,
          'enabled': row.enabled
        }).then((res) => {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
        })
      },
      //后台返回的数据如果和VueTreeselect要求的数据结构不同，需要进行转换
      normalizer(node) {
        //去掉children=[]的children属性
        if (node.children && !node.children.length) {
          delete node.children
        }
        return {
          id: node.id,
          label: node.name,
          children: node.children
        }
      },
      buildTree(list) {
        let temp = JSON.parse(JSON.stringify(list))
        // 以id为键，当前对象为值，存入一个新的对象中
        let tempObj = {}
        for (let i in temp) {
          tempObj[temp[i].id] = temp[i]
        }
        return temp.filter(father => {
          // 把当前节点的所有子节点找到
          let childArr = temp.filter(child => father.id === child.pid)
          childArr.length > 0 ? father.children = childArr : ''
          // 只返回第一级数据；如果当前节点的pid不为空，但是在父节点不存在，也为一级数据
          return !tempObj[father.pid]
        })
      },
      getList() {
        this.listLoading = true
        getDepartments(this.listQuery).then(res => {
          this.list = res.queryResult.list
          this.total = res.queryResult.total
          this.listLoading = false
        })
      },
      handleFilter() {
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
        this.resetForm('departmentForm')
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        // this.rules.password[0].required = true
        this.$nextTick(() => {
          this.$refs['departmentForm'].clearValidate()
        })
      },
      submit() {
        this.$refs['departmentForm'].validate((valid) => {
          if (valid) {
            // const tempData = deepClone(this.temp)
            let department = deepClone(this.temp)
            addDepartment(department).then((res) => {
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
          this.$refs['departmentForm'].clearValidate()
        })
      },
      updateData() {
        this.$refs['departmentForm'].validate((valid) => {
          if (valid) {
            let department = deepClone(this.temp)
            delete department.children
            updateDepartment(department).then(() => {
              for (const v of this.list) {
                if (v.id === department.id) {
                  const index = this.list.indexOf(v)
                  this.list.splice(index, 1, department)
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
          deleteDepartment(row.id).then(() => {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
            this.getList()
          })
        })
      }

    }
  }
</script>


