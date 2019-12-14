<template>
  <div class="iqc-defect">
    <div class="filter-container">
      <el-form ref="filterForm" :model="listQuery" :inline="true">
        <el-button class="filter-item" style="margin: 16px 0px;" type="success"
                   icon="el-icon-edit" @click="handleAdd">
          添加
        </el-button>
      </el-form>
    </div>

    <el-table :key="tableKey" :data="list" border fit highlight-current-row>
      <el-table-column label="序号" min-width="40px" align="center">
        <template slot-scope="scope">
          {{ scope.$index }}
        </template>
      </el-table-column>
      <el-table-column label="缺陷代号" min-width="80px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="80">
        <template slot-scope="scope">
          <i class="el-icon-edit update" @click="handleUpdate(scope.row)"/>
          <i class="el-icon-delete delete" @click="handleDelete(scope.row,'true')"/>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      :close-on-click-modal="false"
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
      width="800px"
    >
      <el-form
        ref="iqcDefectForm"
        :rules="rules"
        :model="temp"
        label-position="right"
        label-width="100px"
      >
        <el-form-item label="缺陷代号：" prop="id">
          <el-input v-model="temp.id"/>
        </el-form-item>
        <el-form-item label="上面：" prop="up">
          <el-input v-model="temp.up"/>
        </el-form-item>
        <el-form-item label="下面：" prop="down">
          <el-input v-model="temp.down"/>
        </el-form-item>
        <el-form-item label="宽度位置：" prop="widthPosition">
          <el-input v-model="temp.widthPosition"/>
        </el-form-item>
        <el-form-item label="起始位置：" prop="startPosition">
          <el-input v-model="temp.startPosition"/>
        </el-form-item>
        <el-form-item label="结束位置：" prop="endPosition">
          <el-input v-model="temp.endPosition"/>
        </el-form-item>
        <el-form-item label="缺陷长度：" prop="defectLength">
          <el-input v-model="temp.defectLength"/>
        </el-form-item>
        <el-form-item label="程度：" prop="degree">
          <el-input v-model="temp.degree"/>
        </el-form-item>
        <el-form-item label="类别|波高：" prop="waveHeightCategory">
          <el-input v-model="temp.waveHeightCategory"/>
        </el-form-item>
        <el-form-item label="周期|mm：" prop="period">
          <el-input v-model="temp.period"/>
        </el-form-item>
        <el-form-item label="频率：" prop="frequency">
          <el-input v-model="temp.frequency"/>
        </el-form-item>
        <el-form-item label="直径|mm：" prop="diameter">
          <el-input v-model="temp.diameter"/>
        </el-form-item>
        <el-form-item label="距边|mm：" prop="margin">
          <el-input v-model="temp.margin"/>
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

  import waves from '@/directive/waves' // Waves directive
  import Pagination from '@/components/Pagination/index.vue' // Secondary package based on el-pagination

  export default {
    name: 'IqcDefect',
    components: { Pagination },
    directives: { waves },
    props: ['defectList'],
    data() {
      return {
        tableKey: 0,
        list: this.defectList,
        listQuery: {
          current: 1,
          size: 10,
        },
        temp: {
          id: '',
          up: '',
          down: '',
          widthPosition: '',
          startPosition: '',
          endPosition: '',
          defectLength: '',
          degree: '',
          waveHeightCategory: '',
          period: '',
          frequency: '',
          diameter: '',
          margin: ''
        },
        tempCopy: null,
        dialogFormVisible: false,
        dialogStatus: '',
        showSpecification: true,
        textMap: {
          update: '编辑',
          create: '添加'
        },
        rules: {
          name: [
            { required: true, message: '请填写检验项目' }
          ],
          description: [
            { required: true, message: '请填写检验内容' }
          ]
        }
      }
    },
    created() {
      this.tempCopy = deepClone(this.temp)
    },
    // watch: {
    //   ruleId: function(val) {
    //     // this.resetForm('filterForm')
    //     this.listQuery.inspectionRuleId = val
    //     this.temp.inspectionRuleId = val
    //     this.handleFilter()
    //   }
    // },
    methods: {
      resetForm(formName) {
        if (this.$refs[formName] === undefined) {
          return false
        }
        this.$refs[formName].resetFields()

        this.temp = deepClone(this.tempCopy)
      },
      handleAdd() {
        this.resetForm('iqcDefectForm')
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        // this.rules.password[0].required = true
        this.$nextTick(() => {
          this.$refs['iqcDefectForm'].clearValidate()
        })
      },
      submit() {
        this.$refs['iqcDefectForm'].validate((valid) => {
          if (valid) {
            // const tempData = deepClone(this.temp)
            let iqcDefect = deepClone(this.temp)
            this.list.unshift(iqcDefect)
            this.$emit('update:defectList', this.list)
            this.dialogFormVisible = false
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
          this.$refs['iqcDefectForm'].clearValidate()
        })
      },
      updateData() {
        this.$refs['iqcDefectForm'].validate((valid) => {
          if (valid) {
            let iqcDefect = deepClone(this.temp)
            for (const v of this.list) {
              if (v.id === iqcDefect.id) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, iqcDefect)
                console.log(index)
                break
              }
            }
            this.$emit('update:defectList', this.list)
            this.dialogFormVisible = false
          }
        })
      },
      handleDelete(row) {
        const index = this.list.indexOf(row)
        this.list.splice(index, 1)
        this.$emit('update:defectList', this.list)
      }

    }
  }
</script>
<style lang="scss">
  .iqc-defect {

  .el-icon-edit.update, .el-icon-delete.delete {
    margin: 3px;
    font-size: 18px !important;
  }

  .filter-container {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;

  .el-form-item {
    margin-bottom: 16px;
  }

  }
  }
</style>

