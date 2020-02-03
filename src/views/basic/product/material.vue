<template>
  <div class="app-container">
    <div v-show="!dialogFormVisible">

      <div class="filter-container">
        <el-form ref="filterForm" :model="listQuery" :inline="true">
          <el-form-item label="" prop="name">
            <el-input
              v-model="listQuery.name"
              placeholder="请输入物料名称"
              style="width: 200px;"
              class="filter-item"
              clearable=""
              @keyup.enter.native="handleFilter"
            />
          </el-form-item>
          <el-form-item label="" prop="typeId">
            <el-select v-model="listQuery.typeId" filterable placeholder="物料类型" @change="handleFilter">
              <el-option
                v-for="item in materialTypes"
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

      <el-table :key="tableKey" v-loading="listLoading" :data="list" border fit highlight-current-row>
        <el-table-column label="序号" min-width="40px" align="center">
          <template slot-scope="scope">
            {{ scope.$index }}
          </template>
        </el-table-column>
        <el-table-column label="料号" min-width="80px" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.code }}</span>
          </template>
        </el-table-column>
        <el-table-column label="物料名称" min-width="80px" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="物料类型" min-width="80px" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.typeName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="描述" min-width="100px" align="center">
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
    </div>
    <div v-show="dialogFormVisible">
      <el-form
        ref="materialForm"
        :rules="rules"
        :model="temp"
        label-position="right"
        label-width="150px"
      >
        <el-form-item label="料号：" prop="code">
          <el-input v-model="temp.code"/>
        </el-form-item>
        <el-form-item label="物料名称：" prop="name">
          <el-input v-model="temp.name"/>
        </el-form-item>
        <el-form-item label="物料类型：" prop="typeId">
          <el-select v-model="temp.typeId" filterable placeholder="请选择" style="width:100%">
            <el-option
              v-for="item in materialTypes"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述：" prop="description">
          <el-input type="textarea" :rows="2" v-model="temp.description"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="form-footer">
        <el-button type="danger" size="small" @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" size="small" @click="dialogStatus==='create'?submit():updateData()">确认</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  import { deepClone } from '@/utils'

  import { getMaterials, addMaterial, updateMaterial, deleteMaterial, getMaterialTypes } from '@/api/material.js'

  import waves from '@/directive/waves' // Waves directive
  import Pagination from '@/components/Pagination/index.vue' // Secondary package based on el-pagination

  export default {
    name: 'material',
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
          name: undefined,
          typeId:undefined
          /*orders: ['code desc']*/
        },
        temp: {
          id: undefined,
          name: '',
          code: '',
          typeId:'',
          description: ''
        },
        tempCopy: null,
        materialTypes:[],
        materialTypeMap:null,
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: '编辑',
          create: '添加'
        },
        rules: {
          name: [
            { required: true, trigger: 'blur', message: '请填写工艺名称' }
          ],
          code: [
            { required: true, trigger: 'blur', message: '请填写工艺编码' }
          ]
        }
      }
    },
    created() {
      this.tempCopy = deepClone(this.temp)
      this.listLoading = true
      this.$nextTick(async () => {
        await this.getMaterialTypes()
        this.getList()
      })

    },
    methods: {
      handleModifyState(index, row) {
        updateMaterial(row).then((res) => {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
        })
      },
      getList() {
        this.listLoading = true
        getMaterials(this.listQuery).then(res => {
          this.list = res.queryResult.list.map(item => {
            let materialType = this.materialTypeMap[item.typeId]
            item.typeName = materialType.name
            return item
          })
          this.total = res.queryResult.total
          this.listLoading = false
        })
      },
      async getMaterialTypes() {
        let res = await getMaterialTypes({})
        this.materialTypes = res.queryResult.list
        this.materialTypeMap = _.fromPairs(this.materialTypes.map(materialType => {
          return [materialType.id, materialType]
        }))
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
        this.resetForm('materialForm')
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        // this.rules.password[0].required = true
        this.$nextTick(() => {
          this.$refs['materialForm'].clearValidate()
        })
      },
      submit() {
        this.$refs['materialForm'].validate((valid) => {
          if (valid) {
            // const tempData = deepClone(this.temp)
            let material = deepClone(this.temp)
            addMaterial(material).then((res) => {
              let materialType = this.materialTypeMap[material.typeId]
              res.model.typeName=materialType.name
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
          this.$refs['materialForm'].clearValidate()
        })
      },
      updateData() {
        this.$refs['materialForm'].validate((valid) => {
          if (valid) {
            let material = deepClone(this.temp)
            updateMaterial(material).then(() => {
              let materialType = this.materialTypeMap[material.typeId]
              material.typeName=materialType.name
              for (const v of this.list) {
                if (v.id === material.id) {
                  const index = this.list.indexOf(v)
                  this.list.splice(index, 1, material)
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
          deleteMaterial(row.id).then(() => {
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
<style lang="scss" scoped>
  .form-footer {
    float:right;
  }
</style>


