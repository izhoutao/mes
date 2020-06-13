<template>
  <div class="app-container vendor">
    <div class="filter-container">
      <el-form ref="filterForm" :model="listQuery" :inline="true">
        <el-form-item label="" prop="name">
          <el-input
            v-model="listQuery.name"
            placeholder="请输入供应商名称"
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
      <el-table-column label="序" min-width="40px" type="index" align="center">
      </el-table-column>
      <el-table-column label="供应商代码" min-width="90px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.code }}</span>
        </template>
      </el-table-column>
      <el-table-column label="供应商名称" min-width="90px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="供应商联系人" min-width="90px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.linkMan }}</span>
        </template>
      </el-table-column>
      <el-table-column label="联系电话" min-width="90px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.phoneNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column label="供应商地址" min-width="90px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.address }}</span>
        </template>
      </el-table-column>
      <el-table-column label="邮箱" min-width="90px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.email }}</span>
        </template>
      </el-table-column>
      <el-table-column label="传真" min-width="90px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.fax }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" min-width="90px" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.state===1?'': 'info'" style="margin:0 5px;"> {{ scope.row.state | stateFilter}}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="城市" min-width="90px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.city }}</span>
        </template>
      </el-table-column>
      <el-table-column label="省州" min-width="90px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.province }}</span>
        </template>
      </el-table-column>
      <el-table-column label="国家" min-width="90px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.country }}</span>
        </template>
      </el-table-column>
      <!--      <el-table-column label="最后编辑时间" min-width="200px" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.updateTime }}</span>
              </template>
            </el-table-column>-->
      <el-table-column label="操作" align="center" min-width="80">
        <template slot-scope="scope">
          <!--          <el-button type="primary" icon="el-icon-edit" size="mini"
                               @click="handleUpdate(scope.row)">编辑
                    </el-button>
                    <el-button
                      icon="el-icon-delete"
                      size="mini"
                      type="danger"
                      @click="handleDelete(scope.row,'true')"
                    >删除
                    </el-button>-->
          <i class="el-icon-edit update" @click="handleUpdate(scope.row)"/>
          <i class="el-icon-delete delete" @click="handleDelete(scope.row,'true')"/>
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
        ref="vendorForm"
        :rules="rules"
        :model="temp"
        label-position="right"
        label-width="150px"
      >
        <el-form-item label="供应商代码：" prop="code">
          <el-input v-model="temp.code"/>
        </el-form-item>
        <el-form-item label="供应商名称：" prop="name">
          <el-input v-model="temp.name"/>
        </el-form-item>
        <el-form-item label="供应商联系人：" prop="linkMan">
          <el-input v-model="temp.linkMan"/>
        </el-form-item>
        <el-form-item label="联系电话：" prop="phoneNumber">
          <el-input v-model="temp.phoneNumber"/>
        </el-form-item>
        <el-form-item label="供应商地址：" prop="address">
          <el-input v-model="temp.address"/>
        </el-form-item>
        <el-form-item label="邮箱：" prop="email">
          <el-input v-model="temp.email"/>
        </el-form-item>
        <el-form-item label="传真：" prop="fax">
          <el-input v-model="temp.fax"/>
        </el-form-item>
        <el-form-item label="状态：" prop="status">
          <el-switch v-model="temp.state"
                     active-color="#13ce66"
                     :active-value="1"
                     :inactive-value="0"/>
        </el-form-item>
        </el-form-item>
        <el-form-item label="城市：" prop="city">
          <el-input v-model="temp.city"/>
        </el-form-item>
        <el-form-item label="省州：" prop="province">
          <el-input v-model="temp.province"/>
        </el-form-item>
        <el-form-item label="国家：" prop="country">
          <el-input v-model="temp.country"/>
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

  import { getVendors, addVendor, updateVendor, deleteVendor } from '@/api/vendor.js'

  import waves from '@/directive/waves' // Waves directive
  import Pagination from '@/components/Pagination/index.vue' // Secondary package based on el-pagination

  export default {
    name: 'vendor',
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
        return state === 1 ? '启用' : '未启用'
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
          linkMan: '',
          phoneNumber: '',
          address: '',
          email: '',
          fax: '',
          state: 1,
          city: '',
          province: '',
          country: '',
          updateTime: ''
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
            { required: true, trigger: 'blur', message: '请填写供应商名称' }
          ],
          code: [
            { required: true, trigger: 'blur', message: '请填写供应商代码' }
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
        updateVendor(row).then((res) => {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
        })
      },
      getList() {
        this.listLoading = true
        getVendors(this.listQuery).then(res => {
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
        this.resetForm('vendorForm')
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        // this.rules.password[0].required = true
        this.$nextTick(() => {
          this.$refs['vendorForm'].clearValidate()
        })
      },
      submit() {
        this.$refs['vendorForm'].validate((valid) => {
          if (valid) {
            // const tempData = deepClone(this.temp)
            let vendor = deepClone(this.temp)
            addVendor(vendor).then((res) => {
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
          this.$refs['vendorForm'].clearValidate()
        })
      },
      updateData() {
        this.$refs['vendorForm'].validate((valid) => {
          if (valid) {
            let vendor = deepClone(this.temp)
            updateVendor(vendor).then(() => {
              for (const v of this.list) {
                if (v.id === vendor.id) {
                  const index = this.list.indexOf(v)
                  this.list.splice(index, 1, vendor)
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
        this.$confirm('此操作将永久删除该供应商, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteVendor(row.id).then(() => {
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


<style lang="scss">
  .vendor {
    .el-icon-edit.update, .el-icon-delete.delete {
      margin: 3px;
      font-size: 18px !important;
    }
  }

</style>
