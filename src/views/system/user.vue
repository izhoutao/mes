<template>
  <div class="app-container">


    <el-row :gutter="20">
      <!--部门数据-->
      <el-col :xs="9" :sm="6" :md="4" :lg="4" :xl="4">
        <div class="head-container">
          <el-input v-model="deptName" clearable placeholder="输入部门名称搜索" prefix-icon="el-icon-search"
                    style="width: 100%;" class="filter-item" @input="getDepartments"/>
        </div>
        <el-tree :data="treeData" :props="defaultProps" :expand-on-click-node="false" default-expand-all
                 highlight-current
                 @node-click="handleNodeClick"/>
      </el-col>
      <!--用户数据-->
      <el-col :xs="15" :sm="18" :md="20" :lg="20" :xl="20">
        <!--工具栏-->
        <div class="filter-container">
          <el-form ref="filterForm" :model="listQuery" :inline="true">
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
            <el-form-item label="" prop="depts">
              <el-select v-model="listQuery.depts" multiple v-show="false">
                <el-option
                  v-for="item in depts"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索
            </el-button>
            <el-button v-waves class="filter-item" @click="resetForm('filterForm');handleFilter()">重置</el-button>
            <el-button class="filter-item" style="margin-left: 10px;" type="success"
                       icon="el-icon-edit" @click="handleAdd">
              添加
            </el-button>
          </el-form>
        </div>
        <!--表格渲染-->
        <el-table :key="tableKey" v-loading="listLoading" :data="list" border fit highlight-current-row>
          <el-table-column label="序号" min-width="50px" type="index" align="center">
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
          <el-table-column label="部门/岗位" min-width="80px" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.department }}/{{ scope.row.position }}</span>
            </template>
          </el-table-column>
          <el-table-column label="入职日期" min-width="100px" align="center">
            <template slot-scope="scope">
              <i class="el-icon-time"/>
              <span>{{ scope.row.hiredate | parseTime('{y}-{m}-{d}') }}</span>
            </template>
          </el-table-column>
          <el-table-column label="在职状态" min-width="80px" align="center">
            <template slot-scope="scope">
              <el-tag :type="scope.row.state==='1'?'': 'info'" style="margin:0 5px;"> {{ scope.row.state | stateFilter}}
              </el-tag>
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
        <!--分页组件-->
        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="listQuery.current"
          :limit.sync="listQuery.size"
          @pagination="getList"
        />
      </el-col>
    </el-row>

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
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="状态：" prop="state">
          <el-switch v-model="temp.state"
                     active-color="#13ce66"
                     active-value="1"
                     inactive-value="0"/>
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
          <el-date-picker v-model="temp.birthday" type="date" placeholder="请选择日期" style="width: 100%;"
                          format="yyyy 年 MM 月 dd 日"
                          value-format="yyyy-MM-dd"/>
        </el-form-item>
        <el-form-item label="入职日期：" prop="hiredate">
          <el-date-picker v-model="temp.hiredate" type="date" placeholder="请选择日期" style="width: 100%;"
                          format="yyyy 年 MM 月 dd 日"
                          value-format="yyyy-MM-dd"/>
        </el-form-item>
        <el-form-item label="备注：" prop="description">
          <el-input v-model="temp.description"/>
        </el-form-item>
        <el-form-item label="部门：" prop="deptId">
          <treeselect
            v-model="temp.deptId"
            :options="treeData"
            :normalizer="normalizer"
            :defaultExpandLevel=Infinity
            style="width: 370px;"
            placeholder="选择所属部门"
          />
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
  import { getDepartments, addDepartment, updateDepartment, deleteDepartment } from '@/api/department.js'

  import waves from '@/directive/waves' // Waves directive
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
  import Treeselect from '@riophae/vue-treeselect'
  import '@riophae/vue-treeselect/dist/vue-treeselect.css'

  export default {
    name: 'user',
    components: { Pagination, Treeselect },
    directives: { waves },
    watch: {
      depts: {
        handler: function(val) {
          // this.tableData = this.toTree(deepClone(val), this.rootId)
          this.treeData = this.buildTree(val)
        }
        // deep: true
      }
    },
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
        return state === '1' ? '在职' : '离职'
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
          current: 1,
          size: 10,
          phone: undefined,
          depts: undefined
        },
        deptName: undefined,
        depts: [],
        deptMap: {},
        treeData: [],
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        temp: {
          id: undefined,
          username: '',
          roleList: [],
          name: '',
          password: '111111',
          phone: '',
          email: '',
          state: '1',
          staffId: '',
          deptId: undefined
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
      this.listLoading = true
      this.$nextTick(async() => {
        await Promise.all([
          this.getDepartments(),
          this.getRoles()
        ])
        this.getList()
      })
    },
    methods: {
      async getRoles() {
        const res = await getRoles({})
        this.rolesList = res.queryResult.list
      },
      async getDepartments() {
        const res = await getDepartments({ name: this.deptName })
        this.depts = res.queryResult.list
        this.deptMap = _.fromPairs(this.depts.map(dept => {
          return [dept.id, dept]
        }))
      },
      getList() {
        this.listLoading = true
        getUsers(this.listQuery).then(res => {
          this.list = res.queryResult.list.map(user =>
            Object.assign(user, { department: this.deptMap[user.deptId].name })
          )
          this.total = res.queryResult.total
          this.listLoading = false
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
      getDeptIdList(data) {
        let deptIdList = [data.id]
        if (data.children) {
          data.children.forEach(item => {
            deptIdList = deptIdList.concat(this.getDeptIdList(item))
          })
        }
        return deptIdList
      },
      handleNodeClick(data) {
        this.listQuery.depts = this.getDeptIdList(data)
        this.listQuery.current = 1
        this.getList()
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
            addUser(user).then((res) => {
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
            updateUser(user).then(() => {
              for (const v of this.list) {
                if (v.id === user.id) {
                  const index = this.list.indexOf(v)
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
            this.total--
          })
        })
      }

    }
  }
</script>


