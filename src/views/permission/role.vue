<template>
  <div class="app-container">
    <el-button type="primary" @click="handleAddRole">添加角色</el-button>

    <el-table :data="rolesList" style="width: 100%;margin-top:30px;" border>
      <el-table-column align="center" label="角色编码" width="220">
        <template slot-scope="scope">
          {{ scope.row.code }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="角色名" width="220">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="描述">
        <template slot-scope="scope">
          {{ scope.row.description }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="200">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit"  size="mini" @click="handleEdit(scope)">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="handleDelete(scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'Edit Role':'New Role'">
      <el-form :model="role" label-width="80px" label-position="left">
        <el-form-item label="Code">
          <el-input v-model="role.code" placeholder="角色编码"/>
        </el-form-item>
        <el-form-item label="Name">
          <el-input v-model="role.name" placeholder="角色名"/>
        </el-form-item>
        <el-form-item label="Desc">
          <el-input
            v-model="role.description"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            placeholder="描述"
          />
        </el-form-item>
        <el-form-item label="Menus">
          <el-tree
            ref="tree"
            :check-strictly="checkStrictly"
            :data="routesData"
            :props="defaultProps"
            show-checkbox
            node-key="name"
            class="permission-tree"
            @check-change="handleCheckChange"
          />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmRole">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import path from 'path'
  import { deepClone } from '@/utils'
  import { getRoutes, getRoles, addRole, deleteRole, updateRole } from '@/api/role'
  import { asyncRoutes, constantRoutes } from '@/router'

  const defaultRole = {
    key: '',
    code: '',
    name: '',
    description: '',
    routes: []
  }

  export default {
    data() {
      return {
        role: Object.assign({}, defaultRole),
        routes: [],
        rolesList: [],
        dialogVisible: false,
        dialogType: 'new',
        checkStrictly: false,
        defaultProps: {
          children: 'children',
          label: 'title'
        },
        flag: true
      }
    },
    computed: {
      routesData() {
        return this.routes
      }
    },
    created() {
      // Mock: get all routes and roles list from server
      this.getRoutes()
      this.getRoles()
    },
    methods: {
      async getRoutes() {
        // const res = await getRoutes()
        // this.serviceRoutes = res.data
        // console.log(JSON.stringify(res.data))
        //this.routes = this.generateRoutes(res.data)
        // console.log(JSON.stringify(this.routes))
        this.serviceRoutes = deepClone([...constantRoutes, ...asyncRoutes])
        this.routes = this.generateRoutes(this.serviceRoutes)
      },
      async getRoles() {
        const res = await getRoles()
        this.rolesList = res.queryResult.list.map((item) => {
          return {
            key: item.id,
            code: item.roleCode,
            name: item.roleName,
            description: item.description,
            status: item.status,
            routes: item.menuList.map((item) => {
                item.name = item.menuCode
                item.title = item.menuName
                return item
              }
            )
          }
        })
      },

      // Reshape the routes structure so that it looks the same as the sidebar
      generateRoutes(routes, basePath = '/') {
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
            // path: path.resolve(basePath, route.path),
            name: route.name,
            title: route.meta && route.meta.title

          }

          // recursive child routes
          if (route.children) {
            data.children = this.generateRoutes(route.children, data.path)
          }
          res.push(data)
        }
        return res
      },
      generateArr(routes) {
        let data = []
        routes.forEach(route => {
          data.push({
            name: route.name,
            title: route.meta && route.meta.title
          })
          if (route.children) {
            const temp = this.generateArr(route.children)
            if (temp.length > 0) {
              data = [...data, ...temp]
            }
          }
        })
        return data
      },
      handleAddRole() {
        this.role = Object.assign({}, defaultRole)
        if (this.$refs.tree) {
          this.$refs.tree.setCheckedNodes([])
        }
        this.dialogType = 'new'
        this.dialogVisible = true
      },
      handleEdit(scope) {
        this.dialogType = 'edit'
        this.dialogVisible = true
        this.checkStrictly = true
        this.role = deepClone(scope.row)
        this.$nextTick(() => {
          // const routes = this.generateRoutes(this.role.routes)
          // alert(JSON.stringify(this.generateArr(routes)) )
          // this.$refs.tree.setCheckedNodes(this.generateArr(routes))
          // alert(JSON.stringify(this.role.routes))
          this.$refs.tree.setCheckedNodes(this.role.routes)
          // set checked state of a node not affects its father and child nodes
          this.checkStrictly = false
        })
      },
      handleDelete({ $index, row }) {
        this.$confirm('Confirm to remove the role?', 'Warning', {
          confirmButtonText: 'Confirm',
          cancelButtonText: 'Cancel',
          type: 'warning'
        })
          .then(async() => {
            await deleteRole(row.key)
            this.rolesList.splice($index, 1)
            this.$message({
              type: 'success',
              message: 'Delete succed!'
            })
          })
          .catch(err => {
            console.error(err)
          })
      },

      handleCheckChange(data, checked, indeterminate) {
        this.checkStrictly = true
        this.$nextTick(() => {
          this.$refs.tree.setCheckedKeys([...this.$refs.tree.getCheckedKeys(), ...this.$refs.tree.getHalfCheckedKeys()])
          // set checked state of a node not affects its father and child nodes
          this.checkStrictly = false
        })
      },

      // handleCheckChange(data, checked, indeterminate) {
      //   // let childrenKeys = []
      //   // childrenKeys = this.getChildrenKeys(data)
      //   // childrenKeys.forEach(key => {
      //   //     this.$refs.tree.setChecked(key, checked)
      //   //   }
      //   // )
      //   // if (checked) {
      //   //   let ancestorKeys = []
      //   //   this.getAncestorKeys(data, this.routesData, ancestorKeys)
      //   //   ancestorKeys.forEach(key => {
      //   //       this.$refs.tree.setChecked(key, checked)
      //   //     }
      //   //   )
      //   // }
      //
      //   if (checked && this.flag) {
      //     let ancestorKeys = []
      //     this.getAncestorKeys(data, this.routesData, ancestorKeys)
      //
      //     this.checkStrictly = true
      //     this.flag = false
      //     this.$nextTick(() => {
      //       this.$refs.tree.setCheckedKeys([...this.$refs.tree.getCheckedKeys(), ...ancestorKeys])
      //       // ancestorKeys.forEach(key => {
      //       //     this.$refs.tree.setChecked(key, checked)
      //       //   }
      //       // )
      //       // set checked state of a node not affects its father and child nodes
      //       this.checkStrictly = false
      //       this.flag = true
      //     })
      //
      //   }else if(!checked && this.flag && !data.children){
      //     this.checkStrictly = true
      //     // this.flag = false
      //     this.$nextTick(() => {
      //       this.checkStrictly = false
      //       // this.flag = true
      //     })
      //   }
      //
      // },
      // getAncestorKeys(data, routesData, ancestorKeys) {
      //   for (let i = 0; i < routesData.length; i++) {
      //     if (routesData[i].name === data.name) {
      //       return true
      //     } else if (routesData[i].children) {
      //       ancestorKeys.push(routesData[i].name)
      //       if (!this.getAncestorKeys(data, routesData[i].children, ancestorKeys)) {
      //         ancestorKeys.pop()
      //       } else {
      //         return true
      //       }
      //     }
      //   }
      //   return false
      // },
      // getChildrenKeys(data) {
      //   if (data.children) {
      //     return data.children.map(item => item.name)
      //   } else {
      //     return []
      //   }
      // },
      generateTree(routes, basePath = '/', checkedKeys) {
        const res = []

        for (const route of routes) {
          // const routePath = path.resolve(basePath, route.path)

          // recursive child routes
          if (route.children) {
            route.children = this.generateTree(route.children, 'routePath', checkedKeys)
          }

          if (checkedKeys.includes(route.name) || (route.children && route.children.length >= 1)) {
            res.push(route)
          }
        }
        return res
      },
      async confirmRole() {
        const isEdit = this.dialogType === 'edit'

        const checkedKeys = this.$refs.tree.getCheckedKeys()
        // console.log(JSON.stringify(this.serviceRoutes) )
        // this.role.routes =  this.role.routes.filter((route,index,arr)=>checkedKeys.includes(route.name))
        let role = {
          id: this.role.key,
          roleCode: this.role.code,
          roleName: this.role.name,
          description: this.role.description,
          status: 1
        }
        role.menuList = checkedKeys.map((checkedKey) => {
          return {
            menuCode: checkedKey
          }
        })
        if (isEdit) {
          await updateRole(role.id, role)
          for (let index = 0; index < this.rolesList.length; index++) {
            if (this.rolesList[index].key === this.role.key) {
              this.rolesList.splice(index, 1, Object.assign({}, this.role))
              break
            }
          }
        } else {
          const { roleExt: data } = await addRole(role)
          this.role.key = data.id
          let checkedRoutes = this.generateTree(deepClone(this.serviceRoutes), '/', checkedKeys)
          this.role.routes = this.generateArr(checkedRoutes)

          // this.role.routes=role.menuList.map((item) => {
          //     item.name = item.menuCode
          //     item.title = item.menuName
          //     return item
          //   }
          // )
          this.rolesList.push(this.role)
        }

        const { description, code, name } = this.role
        this.dialogVisible = false
        this.$notify({
          title: 'Success',
          dangerouslyUseHTMLString: true,
          message: `
            <div>Role Code: ${code}</div>
            <div>Role Name: ${name}</div>
            <div>Description: ${description}</div>
          `,
          type: 'success'
        })
      },
      // reference: src/view/layout/components/Sidebar/SidebarItem.vue
      onlyOneShowingChild(children = [], parent) {
        let onlyOneChild = null
        const showingChildren = children.filter(item => !item.hidden)

        // When there is only one child route, the child route is displayed by default
        if (showingChildren.length === 1) {
          onlyOneChild = showingChildren[0]
          onlyOneChild.path = path.resolve(parent.path, onlyOneChild.path)
          return onlyOneChild
        }

        // Show parent if there are no child route to display
        if (showingChildren.length === 0) {
          onlyOneChild = { ...parent, path: '', noShowingChildren: true }
          return onlyOneChild
        }

        return false
      }
    }
  }
</script>

<style lang="scss" scoped>
  .app-container {

  .roles-table {
    margin-top: 30px;
  }

  .permission-tree {
    margin-bottom: 30px;
  }

  }
</style>
