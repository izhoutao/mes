<template>
  <div class="qc-defect">
    <div class="filter-container">
      <el-form ref="filterForm" :model="listQuery" :inline="true">
        <el-button class="filter-item" size="medium" style="padding:8px 16px;margin: 0px 0px 8px;" type="success"
                   icon="el-icon-circle-plus-outline" @click="handleAdd">
          添加
        </el-button>
      </el-form>
    </div>

    <el-table :key="tableKey" :data="list" border fit highlight-current-row>
      <el-table-column label="序号" min-width="40px" type="index" align="center" fixed>
      </el-table-column>
      <el-table-column label="缺陷名称" min-width="80px" align="center" fixed>
        <template slot-scope="scope">
          <span>{{ defectMap[scope.row.defectId].name }}</span>
        </template>
      </el-table-column>
      <!--      <el-table-column label="缺陷组名称" min-width="100px" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.defectGroupName }}</span>
              </template>
            </el-table-column>-->
      <el-table-column label="上面" min-width="80px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.up }}</span>
        </template>
      </el-table-column>
      <el-table-column label="下面" min-width="80px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.down }}</span>
        </template>
      </el-table-column>
      <el-table-column label="宽度|位置" min-width="80px" align="center" :render-header="renderHeader">
        <template slot-scope="scope">
          <span>{{ scope.row.widthPosition }}</span>
        </template>
      </el-table-column>
      <el-table-column label="起始位置|(m)" min-width="80px" align="center" :render-header="renderHeader">
        <template slot-scope="scope">
          <span>{{ scope.row.startPosition }}</span>
        </template>
      </el-table-column>
      <el-table-column label="结束位置|(m)" min-width="80px" align="center" :render-header="renderHeader">
        <template slot-scope="scope">
          <span>{{ scope.row.endPosition }}</span>
        </template>
      </el-table-column>
      <el-table-column label="缺陷长度|(m)" min-width="80px" align="center" :render-header="renderHeader">
        <template slot-scope="scope">
          <span>{{ scope.row.defectLength }}</span>
        </template>
      </el-table-column>
      <el-table-column label="程度" min-width="80px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.degree }}</span>
        </template>
      </el-table-column>
      <el-table-column label="类别|波高" min-width="80px" align="center" :render-header="renderHeader">
        <template slot-scope="scope">
          <span>{{ scope.row.waveHeightCategory }}</span>
        </template>
      </el-table-column>
      <el-table-column label="周期|mm" min-width="80px" align="center" :render-header="renderHeader">
        <template slot-scope="scope">
          <span>{{ scope.row.period }}</span>
        </template>
      </el-table-column>
      <el-table-column label="频率" min-width="80px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.frequency }}</span>
        </template>
      </el-table-column>
      <el-table-column label="直径|(mm)" min-width="80px" align="center" :render-header="renderHeader">
        <template slot-scope="scope">
          <span>{{ scope.row.diameter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="距边|(mm)" min-width="80px" align="center" :render-header="renderHeader">
        <template slot-scope="scope">
          <span>{{ scope.row.margin }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="80" fixed="right">
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
      width="1000px"
    >
      <el-form
        ref="qcDefectForm"
        :rules="rules"
        :model="temp"
        label-position="right"
        label-width="100px"
      >
        <el-row>
          <el-col :span="8">
            <el-form-item label="缺陷：" prop="defectId">
              <el-cascader
                v-model="defectActive"
                :options="defects"
                :props="{ expandTrigger: 'hover',value:'id',label:'name' }">
              </el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="上面：" prop="up">
              <el-input v-model="temp.up"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="下面：" prop="down">
              <el-input v-model="temp.down"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="宽度位置：" prop="widthPosition">
              <el-input v-model="temp.widthPosition"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="起始位置：" prop="startPosition">
              <el-input v-model="temp.startPosition"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="结束位置：" prop="endPosition">
              <el-input v-model="temp.endPosition"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="缺陷长度：" prop="defectLength">
              <el-input v-model="temp.defectLength"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="程度：" prop="degree">
              <el-input v-model="temp.degree"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="类别|波高：" prop="waveHeightCategory">
              <el-input v-model="temp.waveHeightCategory"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="周期|mm：" prop="period">
              <el-input v-model="temp.period"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="频率：" prop="frequency">
              <el-input v-model="temp.frequency"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="直径|mm：" prop="diameter">
              <el-input v-model="temp.diameter"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="距边|mm：" prop="margin">
              <el-input v-model="temp.margin"/>
            </el-form-item>
          </el-col>
        </el-row>

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
  import Pagination from '@/components/Pagination/index.vue'
  import { getDefectGroups, getDefects } from '@/api/defect'
  import { addQcDefect, deleteQcDefect, getQcDefects, updateQcDefect } from '@/api/qcdefect' // Secondary package based on el-pagination

  export default {
    name: 'QcDefect',
    components: { Pagination },
    directives: { waves },
    props: ['ipqcId'],
    data() {
      return {
        tableKey: 0,
        list: [],
        total: 0,
        listQuery: {
          ipqcId: ''
        },
        temp: {
          id: '',
          ipqcId: '',
          defectId: '',
          defectGroupId: '',
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
        defects: [],
        defectActive: [],
        defectGroupMap: null,
        defectMap: null,
        tempCopy: null,
        dialogFormVisible: false,
        dialogStatus: '',
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
      if(this.ipqcId){
        this.listQuery.ipqcId = this.ipqcId
        this.temp.ipqcId = this.ipqcId
        this.tempCopy = deepClone(this.temp)
        this.listLoading = true
        this.$nextTick(async() => {
          await this.getDefects({})
          this.getList()
        })
      }
    },
    watch: {
      defectActive: function(val) {
        if (val && val[0] && val[1]) {
          this.temp.defectGroupId = val[0]
          this.temp.defectGroupName = this.defectGroupMap[val[0]].name
          this.temp.defectId = val[1]
          this.temp.defectName = this.defectMap[val[1]].name
        }
      }
    },
    methods: {
      renderHeader(h, { column, $index }) {
        return h('span', {}, [
          h('span', {}, column.label.split('|')[0]),
          h('br'),
          h('span', {}, column.label.split('|')[1])
        ])
      },
      async getDefects() {
        let res = await getDefectGroups({})
        let defectGroups = res.queryResult.list
        this.defectGroupMap = _.fromPairs(defectGroups.map(defectGroup => {
          return [defectGroup.id, defectGroup]
        }))
        res = await getDefects({})
        let defects = res.queryResult.list
        this.defectMap = _.fromPairs(defects.map(defect => {
          return [defect.id, defect]
        }))

        const defectMap = {}
        defects.forEach(defect => {
          if (defectMap[defect.groupId]) {
            defectMap[defect.groupId] = [...defectMap[defect.groupId], defect]
          } else {
            defectMap[defect.groupId] = [defect]
          }
        })
        this.defects = defectGroups.map(item => {
          if (defectMap[item.id]) {
            item.children = defectMap[item.id]
          }
          return item
        })
      },

      getList() {
        this.listLoading = true
        getQcDefects(this.listQuery).then(res => {
          this.list = res.queryResult.list
          this.total = res.queryResult.total
          this.listLoading = false
        })
      },
      resetForm(formName) {
        if (this.$refs[formName] === undefined) {
          return false
        }
        this.$refs[formName].resetFields()

        this.temp = deepClone(this.tempCopy)
      },
      handleAdd() {
        if (!this.ipqcId) {
          this.$message({
            message: '请先保存检验单',
            type: 'warning'
          })
          return
        }
        this.resetForm('qcDefectForm')
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        // this.rules.password[0].required = true
        this.defectActive = [this.temp.defectGroupId, this.temp.defectId]
        this.$nextTick(() => {
          this.$refs['qcDefectForm'].clearValidate()
        })
      },
      submit() {
        this.$refs['qcDefectForm'].validate((valid) => {
          if (valid) {
            // const tempData = deepClone(this.temp)
            let qcDefect = deepClone(this.temp)
            addQcDefect(qcDefect).then((res) => {
              this.list.unshift(res.model)
              this.total++
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '添加成功',
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
        this.defectActive = [this.temp.defectGroupId, this.temp.defectId]
        // this.temp.password = ''
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['qcDefectForm'].clearValidate()
        })
      },
      updateData() {
        this.$refs['qcDefectForm'].validate((valid) => {
          if (valid) {
            let qcDefect = deepClone(this.temp)
            updateQcDefect(qcDefect).then(() => {
              for (const v of this.list) {
                if (v.id === qcDefect.id) {
                  const index = this.list.indexOf(v)
                  this.list.splice(index, 1, qcDefect)
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
        deleteQcDefect(row.id).then(() => {
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
      }

    }
  }
</script>
<style lang="scss">
  .qc-defect {

  .el-icon-circle-plus-outline {
    /*margin: 3px;*/
    font-size: 16px !important;
  }

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

