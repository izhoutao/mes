<template>
  <el-card style="margin-bottom:20px;">
    <div slot="header" class="clearfix">
      <span>字典详情</span>
    </div>
    <div v-if="typeId">
      <div class="filter-container">
        <el-form ref="filterForm" :model="listQuery" :inline="true">
          <el-form-item label="" prop="name">
            <el-input
              v-model="listQuery.name"
              placeholder="请输入字典详情名字"
              prefix-icon="el-icon-search"
              style="width: 200px;"
              class="filter-item"
              clearable=""
              @keyup.enter.native="handleFilter"
            />
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
        <el-table-column label="字典标签" min-width="80px" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="字典值" min-width="100px" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.code }}</span>
          </template>
        </el-table-column>
        <el-table-column label="排序" min-width="50px" align="center">
          <template slot-scope="scope">
            {{ scope.row.sequenceNumber }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" min-width="60">
          <template slot-scope="scope">
            <!--            <el-button type="primary" icon="el-icon-edit" size="mini"
                                   @click="handleUpdate(scope.row)">编辑
                        </el-button>
                        <el-button
                          icon="el-icon-delete"
                          size="mini"
                          type="danger"
                          @click="handleDelete(scope.row,'true')"
                        >删除
                        </el-button>-->
            <i class="el-icon-edit" @click="handleUpdate(scope.row)"/>

            <i class="el-icon-delete" @click="handleDelete(scope.row,'true')"/>
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
                 width="550px">
        <el-form
          ref="dictForm"
          :rules="rules"
          :model="temp"
          label-position="right"
          label-width="100px"
        >
          <el-form-item label="字典标签：" prop="name">
            <el-input v-model="temp.name"/>
          </el-form-item>
          <el-form-item label="字典值：" prop="code">
            <el-input v-model="temp.code"/>
          </el-form-item>
          <el-form-item label="排序：" prop="sequenceNumber">
            <el-input v-model.number="temp.sequenceNumber"/>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="danger" size="small" @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" size="small" @click="dialogStatus==='create'?submit():updateData()">确认</el-button>
        </div>
      </el-dialog>
    </div>
    <div v-else>
      <span>点击字典列表查看详情</span>
    </div>
  </el-card>
</template>

<script>
import { deepClone } from '@/utils/index'

import { getDictInfos, addDictInfo, updateDictInfo, deleteDictInfo } from '@/api/dictionary'

import waves from '@/directive/waves' // Waves directive
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'DictInfo',
  components: { Pagination },
  directives: { waves },
  props: ['typeId'],
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
        code: undefined,
        typeId: this.typeId
      },
      temp: {
        id: undefined,
        name: '',
        code: '',
        sequenceNumber: 0
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
          { required: true, trigger: 'blur', message: '请填写字典标签' }
        ],
        code: [
          { required: true, trigger: 'blur', message: '请填写字典值' }],
        sequenceNumber: [
          { required: true, trigger: 'blur', message: '排序不能为空' },
          { type: 'integer', message: '排序必须为整数值' }
        ]

      }
    }
  },
  created() {
    this.tempCopy = deepClone(this.temp)
    this.getList()
  },
  watch: {
    typeId: function(val) {
      this.resetForm('filterForm')
      this.listQuery.typeId = val
      this.handleFilter()
    }
  },
  methods: {
    getList() {
      this.listLoading = true
      getDictInfos(this.listQuery).then(res => {
        this.list = res.queryResult.list.sort((info1, info2) => {
          return info1.sequenceNumber < info2.sequenceNumber ? -1 : 1
        })
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
          let dictInfo = deepClone(this.temp)
          dictInfo.typeId = this.typeId
          addDictInfo(dictInfo).then((res) => {
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
        this.$refs['dictForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dictForm'].validate((valid) => {
        if (valid) {
          let dictInfo = deepClone(this.temp)
          dictInfo.typeId = this.typeId
          updateDictInfo(dictInfo).then(() => {
            for (const v of this.list) {
              if (v.id === dictInfo.id) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, dictInfo)
                this.list = this.list.sort((info1, info2) => {
                  return info1.sequenceNumber < info2.sequenceNumber ? -1 : 1
                })
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
      this.$confirm('此操作将永久删除该字典信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteDictInfo(row.id).then(() => {
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

<style scoped lang="scss">
  .el-icon-edit {
    margin-right: 5px;
    font-size: 18px;
  }

  .el-icon-delete {
    margin-left: 5px;
    font-size: 18px;
  }
</style>
