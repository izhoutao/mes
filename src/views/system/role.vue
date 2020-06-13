<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form ref="filterForm" :model="listQuery" :inline="true">
        <el-form-item label="" prop="name">
          <el-input
            v-model="listQuery.name"
            placeholder="角色名"
            style="width: 200px;"
            class="filter-item"
            clearable=""
            @keyup.enter.native="handleFilter"
          />
        </el-form-item>
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索
        </el-button>
        <el-button v-waves class="filter-item" @click="resetForm('filterForm');handleFilter()">重置</el-button>
        <el-button class="filter-item" type="success"
                   icon="el-icon-edit" @click="handleAdd">
          添加
        </el-button>
      </el-form>
    </div>

    <el-table :key="tableKey" v-loading="listLoading" :data="list" border fit highlight-current-row>
      <el-table-column label="序" min-width="20px" type="index" align="center">
      </el-table-column>
      <el-table-column label="角色编码" min-width="100px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.code }}</span>
        </template>
      </el-table-column>
      <el-table-column label="角色名" min-width="100px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="描述" min-width="200px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.description }}</span>
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
        ref="roleForm"
        :rules="rules"
        :model="temp"
        label-position="right"
        label-width="150px"
      >
        <el-form-item label="角色编码：" prop="code">
          <el-input v-model="temp.code" placeholder="角色编码"/>
        </el-form-item>
        <el-form-item label="角色名称：" prop="name">
          <el-input v-model="temp.name" placeholder="角色名"/>
        </el-form-item>
        <el-form-item label="描述：" prop="description">
          <el-input
            v-model="temp.description"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            placeholder="描述"
          />
        </el-form-item>
        <el-form-item label="菜单">
          <el-tree
            ref="tree"
            :check-strictly="checkStrictly"
            :data="treeData"
            :props="defaultProps"
            show-checkbox
            node-key="name"
            class="permission-tree"
            @check-change="handleCheckChange"
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
  import path from 'path'
  import { deepClone } from '@/utils/index'

  import { getRoutes, getRoles, addRole, updateRole, deleteRole } from '@/api/role'
  import { asyncRoutes, constantRoutes } from '@/router'

  import waves from '@/directive/waves' // Waves directive
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

  export default {
    name: 'role',
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
        routes: [],
        temp: {
          id: undefined,
          name: '',
          code: '',
          description: ''
        },
        tempCopy: null,
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: '编辑',
          create: '添加'
        },
        checkStrictly: false,
        defaultProps: {
          children: 'children',
          label: 'title'
        },
        rules: {
          name: [
            { required: true, trigger: 'blur', message: '请填写角色名称' }
          ],
          code: [
            { required: true, trigger: 'blur', message: '请填写角色编码' }
          ]
        }
      }
    },
    computed: {
      treeData() {
        this.serviceRoutes = deepClone(this.generateTreeFromList(this.routes))
        return this.generateRoutes(this.serviceRoutes)
      }
    },
    created() {
      this.tempCopy = deepClone(this.temp)
      this.listLoading = true
      this.getRoutes()
      this.getList()
    },
    methods: {
      getList() {
        this.listLoading = true
        getRoles(this.listQuery).then(res => {
          this.list = res.queryResult.list
          this.total = res.queryResult.total
          this.listLoading = false
        })
      },
      handleFilter() {
        this.listQuery.current = 1
        this.getList()
      },
      generateTreeFromList(list) {
        let temp = JSON.parse(JSON.stringify(list))
        // 以id为键，当前对象为值，存入一个新的对象中
        let tempObj = {}
        for (let i in temp) {
          tempObj[temp[i].id] = temp[i]
        }
        /*        let tempMap = Object.fromEntries(temp.map(item => {
                  return { [item.id]: item }
                }))*/
        return temp.filter(father => {
          // 把当前节点的所有子节点找到
          let childArr = temp.filter(child => father.id === child.pid)
          childArr.length > 0 ? father.children = childArr : ''
          // 只返回第一级数据；如果当前节点的pid不为空，但是在父节点不存在，也为一级数据
          return !tempObj[father.pid]
        })
      },
      // Reshape the routes structure so that it looks the same as the sidebar
      generateRoutes(routes) {
        const res = []

        for (let route of routes) {
          // skip some route
          if (route.hidden) {
            continue
          }

          const onlyOneShowingChild = this.onlyOneShowingChild(route.children, route)

          if (route.children && onlyOneShowingChild && !route.alwaysShow) {
            route = onlyOneShowingChild
          }

          const data = {
            name: route.code,
            title: (route.name)
          }
          // recursive child routes
          if (route.children) {
            data.children = this.generateRoutes(route.children)
          }
          res.push(data)
        }
        return res
      },
      onlyOneShowingChild(children = [], parent) {
        let onlyOneChild = null
        const showingChildren = children.filter(item => !item.hidden)

        // When there is only one child route, the child route is displayed by default
        if (showingChildren.length === 1) {
          onlyOneChild = showingChildren[0]
          // onlyOneChild.path = path.resolve(parent.path, onlyOneChild.path)
          return onlyOneChild
        }

        // Show parent if there are no child route to display
        if (showingChildren.length === 0) {
          // onlyOneChild = { ...parent, path: '', noShowingChildren: true }
          onlyOneChild = parent
          return onlyOneChild
        }

        return false
      },
      getRoutes() {
        getRoutes({}).then(res => {
          this.routes = res.queryResult.list
        })
      },
      resetForm(formName) {
        if (this.$refs[formName] === undefined) {
          return false
        }
        this.$refs[formName].resetFields()

        this.temp = deepClone(this.tempCopy)
      },
      handleCheckChange(data, checked, indeterminate) {
        this.checkStrictly = true
        this.$nextTick(() => {
          this.$refs.tree.setCheckedKeys([...this.$refs.tree.getCheckedKeys(), ...this.$refs.tree.getHalfCheckedKeys()])
          // set checked state of a node not affects its father and child nodes
          this.checkStrictly = false
        })
      },
      handleAdd() {
        this.resetForm('roleForm')
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        if (this.$refs.tree) {
          this.$refs.tree.setCheckedKeys([])
        }
        // this.rules.password[0].required = true
        this.$nextTick(() => {
          this.$refs['roleForm'].clearValidate()
        })
      },
      submit() {
        this.$refs['roleForm'].validate((valid) => {
          if (valid) {
            // const tempData = deepClone(this.temp)
            let role = deepClone(this.temp)
            const checkedKeys = this.$refs.tree.getCheckedKeys()
            const checkedRoutes = this.routes.filter(route => checkedKeys.includes(route.code))
            role.menuList = checkedRoutes
            addRole(role).then((res) => {
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
        this.checkStrictly = true
        this.$nextTick(() => {
          // const routes = this.generateRoutes(this.role.routes)
          // alert(JSON.stringify(this.generateArr(routes)) )
          // this.$refs.tree.setCheckedNodes(this.generateArr(routes))
          // alert(JSON.stringify(this.role.routes))
          this.$refs.tree.setCheckedKeys(this.temp.menuList.map(menu => menu.code))
          // set checked state of a node not affects its father and child nodes
          this.checkStrictly = false
          this.$refs['roleForm'].clearValidate()
        })
      },
      updateData() {
        this.$refs['roleForm'].validate((valid) => {
          if (valid) {
            let role = deepClone(this.temp)
            const checkedKeys = this.$refs.tree.getCheckedKeys()
            const checkedRoutes = this.routes.filter(route => checkedKeys.includes(route.code))
            role.menuList = checkedRoutes
            updateRole(role).then(() => {
              for (const v of this.list) {
                if (v.id === role.id) {
                  const index = this.list.indexOf(v)
                  this.list.splice(index, 1, role)
                  break
                }
              }
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                dangerouslyUseHTMLString: true,
                message: '更新成功',
                type: 'success',
                duration: 2000
              })
            })
          }
        })
      },
      handleDelete(row) {
        this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteRole(row.id).then(() => {
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


