<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form ref="filterFrom" :model="listQuery" :inline="true">
        <el-form-item label="" prop="phone">
          <el-input
            v-model="listQuery.phone"
            placeholder="手机号"
            style="width: 200px;"
            class="filter-item"
            clearable=""
            @keyup.enter.native="handleFilter"
          />
        </el-form-item>
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
        <el-button v-waves class="filter-item" @click="resetForm('filterFrom');handleFilter()">重置</el-button>
        <el-button class="filter-item" style="margin-left: 10px;" type="success"
                   icon="el-icon-edit" @click="handleAdd">
          添加
        </el-button>
      </el-form>
    </div>

    <el-table :key="tableKey" v-loading="listLoading" :data="list" border fit highlight-current-row>
      <el-table-column label="序号" min-width="50px" align="center">
        <template slot-scope="scope">
          {{ scope.$index }}
        </template>
      </el-table-column>
      <el-table-column label="部门" min-width="80px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.department }}</span>
        </template>
      </el-table-column>
      <el-table-column label="员工工号" min-width="100px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.staffId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="姓名" min-width="80px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="性别" min-width="70px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.sex }}</span>
        </template>
      </el-table-column>
      <el-table-column label="岗位" min-width="100px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.position }}</span>
        </template>
      </el-table-column>
      <el-table-column label="邮箱" min-width="200px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.email }}</span>
        </template>
      </el-table-column>
      <el-table-column label="入职日期" min-width="160px" align="center">
        <template slot-scope="scope">
          <i class="el-icon-time"/>
          <span>{{ scope.row.hiredate | parseTime('{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="在职状态" min-width="100px" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.state?'': 'info'" style="margin:0 5px;"> {{ scope.row.state | stateFilter}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="线别" min-width="100px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.line }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="200">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini"
                     @click="handleUpdate(scope.row)">编辑
          </el-button>
          <el-button
            v-if="scope.row.state"
            icon="el-icon-delete"
            size="mini"
            type="danger"
            :disabled="scope.row.username === 'admin'"
            @click="handleDelete(scope.row,'true')"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page_no"
      :limit.sync="listQuery.page_size"
      @pagination="getList"
    />

    <el-dialog :close-on-click-modal="false" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible"
               width="550px">
      <el-form
        ref="userForm"
        :rules="rules"
        :model="temp"
        label-position="right"
        label-width="90px"
      >
        <el-form-item label="用户名：" prop="username">
          <el-input v-model="temp.username"/>
        </el-form-item>
        <el-form-item label="密码：" prop="password">
          <el-input v-model="temp.password"/>
        </el-form-item>
        <el-form-item label="角色：" prop="roleList">
          <el-select v-model="temp.roleList" multiple placeholder="请选择" style="width:100%">
            <el-option
              v-for="item in rolesList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="状态：" prop="state">
          <el-switch v-model="temp.state" active-color="#13ce66"/>
        </el-form-item>
        <hr class="el-divider">
        <el-form-item label="姓名：" prop="name">
          <el-input v-model="temp.name"/>
        </el-form-item>
        <el-form-item label="工号：" prop="staffId">
          <el-input v-model="temp.staffId"/>
        </el-form-item>
        <el-form-item label="性别：" prop="sex">
          <el-radio v-model="temp.sex" label="男">男</el-radio>
          <el-radio v-model="temp.sex" label="女">女</el-radio>
        </el-form-item>
        <el-form-item label="手机号：" prop="phone">
          <el-input v-model="temp.phone"/>
        </el-form-item>
        <el-form-item label="邮箱：" prop="email">
          <el-input v-model="temp.email"/>
        </el-form-item>
        <el-form-item label="出生日期：" prop="birthday">
          <el-col :span="11">
            <el-date-picker v-model="temp.birthday" type="date" placeholder="请选择日期" style="width: 100%;"
                            format="yyyy 年 MM 月 dd 日"
                            value-format="yyyy-MM-dd"/>
          </el-col>
        </el-form-item>
        <el-form-item label="入职日期：" prop="hiredate">
          <el-col :span="11">
            <el-date-picker v-model="temp.hiredate" type="date" placeholder="请选择日期" style="width: 100%;"
                            format="yyyy 年 MM 月 dd 日"
                            value-format="yyyy-MM-dd"/>
          </el-col>
        </el-form-item>
        <el-form-item label="备注：" prop="description">
          <el-input v-model="temp.description"/>
        </el-form-item>
        <el-form-item label="部门：" prop="department">
          <el-input v-model="temp.department"/>
        </el-form-item>
        <el-form-item label="岗位：" prop="pisition">
          <el-input v-model="temp.position"/>
        </el-form-item>
        <el-form-item label="产线：" prop="line">
          <el-input v-model="temp.line"/>
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

  import { getUsers, addUser, updateUser, deleteUser } from '@/api/system'
  import { getRoutes, getRoles, addRole, deleteRole, updateRole } from '@/api/role'

  import waves from '@/directive/waves' // Waves directive
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

  export default {
    name: 'User',
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
        return state ? '在职' : '离职'
      }
    },
    data() {
      var validTelephone = (rule, value, callback) => {
        if (!value || value === '') {
          callback()
        }
        const reg = /^1[3|4|5|7|8][0-9]{9}$/
        if (!reg.test(value)) {
          callback(new Error('请输入正确的手机号'))
        } else {
          callback()
        }
      }

      return {
        tableKey: 0,
        list: [],
        rolesList: [],
        // rolesMap: {},
        total: 0,
        listLoading: true,
        listQuery: {
          page_no: 1,
          page_size: 10,
          phone: undefined
        },
        temp: {
          id: undefined,
          username: '',
          roleList: [],
          name: '',
          password: '111111',
          phone: '',
          email: '',
          state: true
        },
        tempCopy: null,
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: '编辑用户',
          create: '添加用户'
        },
        rules: {
          username: [
            { required: true, trigger: 'blur', message: '请填写用户名' },
            { min: 3, max: 20, message: '长度在 3 到 20个字符', trigger: 'blur' }
          ],
          password: [
            { required: true, trigger: 'blur', message: '请设置密码' }],
          roleList: [
            { required: true, trigger: 'blur', message: '请设置角色' }
          ],
          name: [
            { min: 2, max: 20, message: '长度在 2 到 8个字符', trigger: 'blur' }
          ],
          staffId: [
            { required: true, trigger: 'blur', message: '请设置员工ID' }
          ],
          phone: [
            { required: false, trigger: 'blur', validator: validTelephone }
          ],
          email: [
            { required: false, message: '请输入邮箱地址', trigger: 'blur' },
            { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
          ]
        }
      }
    },
    created() {
      this.tempCopy = deepClone(this.temp)
      this.getList()
      this.getRole()
    },
    methods: {
      handleModifyState(index, row) {
        updateUser(row.id, {
          'id': row.id,
          'state': row.state ? '1' : '0',
          'roleList': row.roleList
        }).then((res) => {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
        })
      },
      async getRole() {
        const res = await getRoles(1, 100)
        this.rolesList = res.queryResult.list
/*        this.rolesList.forEach(item => {
          this.$set(this.rolesMap, item.id, item.roleName)
        })*/
      },
      getList() {
        this.listLoading = true
        const { page_no, page_size, ...listQuery } = this.listQuery
        getUsers(page_no, page_size, listQuery).then(res => {
          this.list = res.queryResult.list.map(item => {
            item.state = (item.state === '1')
            return item
          })
          this.total = res.queryResult.total
          this.listLoading = false
        })
      },
      handleFilter() {
        this.listQuery.page_no = 1
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
        this.resetForm('userForm')
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        // this.rules.password[0].required = true
        this.$nextTick(() => {
          this.$refs['userForm'].clearValidate()
        })
      },
      submit() {
        this.$refs['userForm'].validate((valid) => {
          if (valid) {
            // const tempData = deepClone(this.temp)
            let roleList = this.temp.roleList.map(item => {
              return {
                id: item
              }
            })
            let user = deepClone(this.temp)
            user.roleList = roleList
            user.state = user.state ? '1' : '0'
            addUser(user).then((res) => {
              this.list.unshift(res.userExt)
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
        this.temp.roleList = this.temp.roleList.map(item => item.id)
        // this.temp.password = ''
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['userForm'].clearValidate()
        })
      },
      updateData() {
        this.$refs['userForm'].validate((valid) => {
          if (valid) {

            let roleList = this.temp.roleList.map(item => {
              return {
                id: item
              }
            })
            let user = deepClone(this.temp)
            user.roleList = roleList
            user.state = user.state ? '1' : '0'
            updateUser(user.id, user).then(() => {
              for (const v of this.list) {
                if (v.id === user.id) {
                  const index = this.list.indexOf(v)
                  user.state = (user.state === '1')
                  this.list.splice(index, 1, user)
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
        this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteUser(row.id).then(() => {
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


