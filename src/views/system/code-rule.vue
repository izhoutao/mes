<template>
  <div class="app-container">
    <div v-show="!dialogFormVisible">

      <div class="filter-container">
        <el-form ref="filterForm" :model="listQuery" :inline="true">
          <el-form-item label="" prop="name">
            <el-input
              v-model="listQuery.name"
              placeholder="请输入编码名称"
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
        <el-table-column label="序号" min-width="40px" align="center">
          <template slot-scope="scope">
            {{ scope.$index }}
          </template>
        </el-table-column>
        <el-table-column label="编码名称" min-width="80px" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="编码规则" min-width="80px" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.rule }}</span>
          </template>
        </el-table-column>
        <el-table-column label="描述" min-width="100px" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.description }}</span>
          </template>
        </el-table-column>
        <el-table-column label="重置类型" min-width="100px" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.resetTypeName }}</span>
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
      <div style="font-size: 20px;">编辑编码规则</div>
      <div style="margin: 10px 0px 20px;">
        <el-button type="primary" size="small" @click="dialogStatus==='create'?submit():updateData()">确认</el-button>
        <el-button type="danger" size="small" @click="dialogFormVisible = false">关闭</el-button>
      </div>
      <el-form
        ref="codeRuleForm"
        :rules="rules"
        :model="temp"
        label-position="right"
        label-width="100px"
      >

        <el-row>
          <el-col :span="12">
            <el-form-item label="编码名称：" prop="name">
              <el-input v-model="temp.name"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="进制编码：" prop="name">
              <el-input v-model="temp.name"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="星期首日：" prop="weekId">
              <el-select v-model="temp.firstDayOfWeek" filterable placeholder="请选择" style="width:100%">
                <el-option
                  v-for="item in weeks"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="重置类型：" prop="resetType">
              <el-select v-model="temp.resetType" filterable placeholder="请选择" style="width:100%">
                <el-option
                  v-for="item in resetTypes"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="起始码：" prop="minNumber">
              <el-input v-model="temp.minNumber"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="截止码：" prop="maxNumber">
              <el-input v-model="temp.maxNumber"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="编码规则：" prop="name">
              <el-input v-model="temp.rule" :disabled="true"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="描述：" prop="description">
              <el-input type="textarea" :rows="2" v-model="temp.description"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <el-card class="box-card" style="margin: 20px;">
        <div slot="header" class="clearfix">
          <div style="font-size: 20px;">编码规则明细</div>
          <el-button class="filter-item" style="margin-top: 10px;" type="success"
                     icon="el-icon-edit" @click="handleAddCodeRule">
            添加
          </el-button>
        </div>
        <el-table :key="temp.id" :data="codeRuleList" border fit highlight-current-row>
          <el-table-column label="参数序号" min-width="40px" align="center">
            <template slot-scope="scope">
              {{ scope.$index }}
            </template>
          </el-table-column>
          <el-table-column label="参数类型" min-width="80px" align="center">
            <template slot-scope="scope">
              <el-select v-model="codeRuleList[scope.$index].paramType" filterable placeholder="请选择" style="width:100%">
                <el-option
                  v-for="item in paramTypes"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="参数值" min-width="80px" align="center">
            <template slot-scope="scope">
              <el-select v-if="codeRuleList[scope.$index].paramType=='1203207494105686017'" v-model="codeRuleList[scope.$index].paramValue"
                         filterable
                         placeholder="请选择"
                         style="width:100%">
                <el-option
                  v-for="item in systemParams"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code">
                  <span style="float: left">{{ item.code }}</span>
                  <span style="float: right; color: #8492a6; ">{{ item.name }}</span>
                </el-option>
              </el-select>
              <el-input v-else v-model="codeRuleList[scope.$index].paramValue"/>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" min-width="80">
            <template slot-scope="scope">
              <el-button
                icon="el-icon-delete"
                size="mini"
                type="danger"
                @click="handleDeleteCodeRule(scope.row.$index)"
              >删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>

  </div>
</template>

<script>
  import { deepClone } from '@/utils'

  import { getCodeRules, addCodeRule, updateCodeRule, deleteCodeRule } from '@/api/coderule.js'
  import { getDictMaps } from '@/api/dictionary'

  import waves from '@/directive/waves' // Waves directive
  import Pagination from '@/components/Pagination/index.vue' // Secondary package based on el-pagination

  export default {
    name: 'CodeRule',
    components: { Pagination },
    directives: { waves },
    watch: {
      codeRuleList: {
        handler:function(val) {
          let rule = ''
          val.forEach(item => {
            let paramType, paramValue
            if (item.paramType == '1203207494105686017') {
              rule += `[${item.paramValue}]|`
            } else if (item.paramType == '1203207541392269313') {
              rule += `{${item.paramValue}}|`
            } else {
              rule += `${item.paramValue}|`
            }
          })
          this.temp.rule = rule.slice(0, rule.length - 1)
        },
        deep: true
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
          name: undefined,
          typeId: undefined
          /*orders: ['code desc']*/
        },
        temp: {
          id: undefined,
          name: '',
          rule: '',
          description: '',
          minNumber: undefined,
          maxNumber: undefined,
          resetType: ''
        },
        tempCopy: null,
        weeks: [],
        weekMap: null,
        resetTypes: [],
        resetTypeMap: null,
        paramTypes: [],
        paramTypeMap: null,
        systemParams: [],
        systemParamMap: null,
        codeRuleList: [],
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
      this.$nextTick(async() => {
        await this.getCodeRuleDicts()
        this.getList()
      })
    },
    methods: {
      handleModifyState(index, row) {
        updateCodeRule(row).then((res) => {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
        })
      },
      getList() {
        this.listLoading = true
        getCodeRules(this.listQuery).then(res => {
          this.list = res.queryResult.list.map(item => {
            let resetType = this.resetTypeMap[item.resetType]
            item.resetTypeName = resetType.name
            return item
          })
          this.total = res.queryResult.total
        })
        this.listLoading = false
      },
      async getCodeRuleDicts() {
        const dictTypeIds = ['1203211153396850690', '1203210692275068930', '1203207242149650433', '1203207870116651010']
        let res = await getDictMaps(dictTypeIds)
        this.weeks = res.model[dictTypeIds[0]]
        this.weekMap = _.fromPairs(this.weeks.map(week => {
          return [week.id, week]
        }))
        this.resetTypes = res.model[dictTypeIds[1]]
        this.resetTypeMap = _.fromPairs(this.resetTypes.map(resetType => {
          return [resetType.id, resetType]
        }))
        console.log(this.resetTypeMap)
        this.paramTypes = res.model[dictTypeIds[2]]
        this.paramTypeMap = _.fromPairs(this.paramTypes.map(paramType => {
          return [paramType.id, paramType]
        }))
        this.systemParams = res.model[dictTypeIds[3]]
        this.systemParamMap = _.fromPairs(this.systemParams.map(systemParam => {
          return [systemParam.id, systemParam]
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
        this.resetForm('codeRuleForm')
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        // this.rules.password[0].required = true
        this.$nextTick(() => {
          this.$refs['codeRuleForm'].clearValidate()
        })
      },
      submit() {
        this.$refs['codeRuleForm'].validate((valid) => {
          if (valid) {
            // const tempData = deepClone(this.temp)
            let codeRule = deepClone(this.temp)
            addCodeRule(codeRule).then((res) => {
              let resetType = this.resetTypeMap[codeRule.resetType]
              res.model.resetTypeName = resetType.name
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
        //IQC|[YYYY]|[MM]|[DD]|[SEQ]|{param}
        const ruleList = this.temp.rule.split('|')
        this.codeRuleList = []
        ruleList.forEach(item => {
          let paramType, paramValue
          if (item.startsWith('[') && item.endsWith(']')) {
            paramType = '1203207494105686017'
            paramValue = item.slice(1, item.length - 1)
          } else if (item.startsWith('{') && item.endsWith('}')) {
            paramType = '1203207541392269313'
            paramValue = item.slice(1, item.length - 1)
          } else {
            paramType = '1203207412526473218'
            paramValue = item
          }
          this.codeRuleList.push({ paramType, paramValue })
        })
        console.log(this.codeRuleList)
        this.$nextTick(() => {
          this.$refs['codeRuleForm'].clearValidate()
        })
      },
      updateData() {
        this.$refs['codeRuleForm'].validate((valid) => {
          if (valid) {
            let codeRule = deepClone(this.temp)
            updateCodeRule(codeRule).then(() => {
              let resetType = this.resetTypeMap[codeRule.resetType]
              codeRule.resetTypeName = resetType.name
              for (const v of this.list) {
                if (v.id === codeRule.id) {
                  const index = this.list.indexOf(v)
                  this.list.splice(index, 1, codeRule)
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
      handleAddCodeRule() {
        let paramType, paramValue
        paramType = '1203207494105686017'
        paramValue = ''
        this.codeRuleList.push({ paramType, paramValue })
      },
      handleDeleteCodeRule(index) {
        this.codeRuleList.splice(index, 1)
      },
      handleDelete(row) {
        this.$confirm('此操作将永久删除该工艺, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteCodeRule(row.id).then(() => {
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
    float: right;
  }
</style>


