<template>
  <div class="app-container ipqc-container">
    <!--工具栏-->
    <div class="filter-container">
      <el-form ref="filterForm" :model="listQuery" :inline="true" size="small">
        <el-form-item label="" prop="productNumber">
          <el-input
            v-model="listQuery.productNumber"
            placeholder="请输入钢卷编号"
            style="width: 200px;"
            class="filter-item"
            clearable=""
            @keyup.enter.native="handleFilter"
          />
        </el-form-item>
        <el-form-item label="" prop="operation">
          <el-select v-model="listQuery.operation" filterable placeholder="请选择制程" @change="handleFilter">
            <el-option
              v-for="item in operations"
              :key="item.id"
              :label="item.name"
              :value="item.name">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="" prop="dateRange">
          <el-date-picker
            v-model="listQuery.dateRange"
            type="daterange"
            align="right"
            unlink-panels
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="" prop="inspectorConfirm">
          <el-select v-model="listQuery.inspectorConfirm" clearable filterable placeholder="请选择确认情况"
                     @change="handleFilter">
            <el-option :key="0" label="已确认" :value="0"></el-option>
            <el-option :key="1" label="未确认" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="" prop="inspectorResult">
          <el-select v-model="listQuery.inspectorResult" clearable filterable placeholder="请选择状态"
                     @change="handleFilter">
            <el-option key="OK" label="合格" value="OK"></el-option>
            <el-option key="NG" label="暂留" value="NG"></el-option>
          </el-select>
        </el-form-item>
        <el-button v-waves class="filter-item" size="small" type="primary" icon="el-icon-search" @click="handleFilter">
          搜索
        </el-button>
        <el-button v-waves class="filter-item" size="small" @click="resetForm('filterForm');handleFilter()">重置
        </el-button>
      </el-form>
    </div>
    <el-row :gutter="20">
      <!--状态数据-->
      <el-col :span="7">
        <el-table
          ref="ipqcTable"
          :key="tableKey"
          v-loading="listLoading"
          :data="list"
          @current-change="handleCurrentChange"
          border fit highlight-current-row>
          <el-table-column label="工序" min-width="30px" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.operation }}</span>
            </template>
          </el-table-column>
          <el-table-column label="钢卷编号" min-width="80px" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.productNumber }}</span>
            </template>
          </el-table-column>
          <el-table-column label="状态" min-width="30px" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.inspectorResult }}</span>
            </template>
          </el-table-column>
          <el-table-column label="确认" min-width="30px" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.inspectorConfirm?'Y':'N' }}</span>
            </template>
          </el-table-column>
        </el-table>
        <!--分页组件-->
        <el-pagination
          v-show="total>0"
          :total="total"
          :page-size="listQuery.size"
          :pager-count="5"
          @current-change="handleCurrentPageChange"
          :hide-on-single-page="true"
          small
          layout="prev, pager, next">
        </el-pagination>
      </el-col>
      <!--检验数据-->
      <el-col :span="17">
        <!--表单-->
        <el-form
          ref="ipqcForm"
          :rules="rules"
          :model="temp"
          size="small"
          label-position="right"
          label-width="150px"
        >
          <div v-if="temp.productNumber">
            <el-button type="primary" size="small" @click="temp.id?updateData():submit()">保存</el-button>
            <el-button type="primary" size="small" @click="temp.id?updateData():submit()">提交</el-button>
          </div>

          <el-tabs value="basic">
            <el-tab-pane label="基本信息" name="basic">
              <el-row>
                <el-col :span="8">
                  <el-form-item label="检验日期：" prop="inspectDate">
                    <el-date-picker v-model="temp.inspectDate" type="date" placeholder="请选择日期" style="width: 100%;"
                                    format="yyyy 年 MM 月 dd 日"
                                    value-format="yyyy-MM-dd"/>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="产地：" prop="hotRollOrigin">
                    <el-input v-model="temp.hotRollOrigin"/>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="产线：" prop="operation">
                    <el-input v-model="temp.operation"/>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="下制程：" prop="nextOperation">
                    <el-input v-model="temp.nextOperation"/>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="班别：" prop="shiftId">
                    <el-select v-model="temp.shiftId" style="width:100%">
                      <el-option
                        v-for="item in shifts"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="钢种：" prop="steelGrade">
                    <el-input v-model="temp.steelGrade"/>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="表面品级：" prop="surfaceFinish">
                    <el-input v-model="temp.surfaceFinish"/>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="用途：" prop="uses">
                    <el-input v-model="temp.uses"/>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="客户：" prop="customerId">
                    <el-select v-model="temp.customerId" style="width:100%">
                      <el-option
                        v-for="item in customers"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="钢卷编号：" prop="productNumber">
                    <el-input v-model="temp.productNumber"/>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="原料编号：" prop="materialNumber">
                    <el-input v-model="temp.materialNumber"/>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-tab-pane>
          </el-tabs>
          <el-tabs value="record">
            <el-tab-pane label="检验记录" name="record">
              <el-row>
                <el-col :span="8">
                  <el-form-item label="等级：" prop="grade">
                    <el-input v-model="temp.grade"/>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="有害缺陷率(%)：" prop="harmfulDefectPercent">
                    <el-input v-model="temp.harmfulDefectPercent"/>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="等级评分：" prop="gradeScore">
                    <el-input v-model="temp.gradeScore"/>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="退火TV：" prop="annealTv">
                    <el-input v-model="temp.annealTv"/>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="退火硬度：" prop="annealHardness">
                    <el-input v-model="temp.annealHardness"/>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="轧/平道次：" prop="rollingPass">
                    <el-input v-model="temp.rollingPass"/>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="建议使用表面：" prop="recommendedSurface">
                    <el-input v-model="temp.recommendedSurface"/>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="开卷方式：" prop="unwindMethod">
                    <el-input v-model="temp.unwindMethod"/>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item label="测量：" prop="recommendedSurface">
                <el-table :key="new Date().toString()" :data="temp.measurement" border fit highlight-current-row>
                  <el-table-column label="序" min-width="40px" type="index" align="center">
                  </el-table-column>
                  <el-table-column label="厚" min-width="40px" align="center">
                    <template slot-scope="scope">
                      <el-input v-model="temp.measurement[scope.$index].thickness"/>
                    </template>
                  </el-table-column>
                  <el-table-column label="宽" min-width="40px" align="center">
                    <template slot-scope="scope">
                      <el-input v-model="temp.measurement[scope.$index].width"/>
                    </template>
                  </el-table-column>
                  <el-table-column label="长" min-width="40px" align="center">
                    <template slot-scope="scope">
                      <el-input v-model="temp.measurement[scope.$index].length"/>
                    </template>
                  </el-table-column>
                  <el-table-column label="T-S48" min-width="40px" align="center">
                    <template slot-scope="scope">
                      <el-input v-model="temp.measurement[scope.$index].ts48"/>
                    </template>
                  </el-table-column>
                  <el-table-column label="B-S48" min-width="40px" align="center">
                    <template slot-scope="scope">
                      <el-input v-model="temp.measurement[scope.$index].bs48"/>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" align="center" min-width="40">
                    <template slot-scope="scope">
                      <i class="el-icon-circle-plus" @click="handleAddMeasurementItem(scope.$index)"/>
                      <i class="el-icon-delete" @click="handleDeleteMeasurementItem(scope.$index)"/>
                    </template>
                  </el-table-column>
                </el-table>
              </el-form-item>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="交接事项：" prop="handoverMatters">
                    <el-input type="textarea" :rows="2" v-model="temp.handoverMatters"/>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="备注：" prop="note">
                    <el-input type="textarea" :rows="2" v-model="temp.note"/>
                  </el-form-item>
                </el-col>
              </el-row>

              <!--              <el-row>
                              <el-col :span="8">
                                <el-form-item label="测量值：" prop="measurement">
                                  <el-input v-model="temp.measurement"/>
                                </el-form-item>
                              </el-col>
                            </el-row>-->

            </el-tab-pane>
          </el-tabs>
          <el-tabs value="defect">
            <el-tab-pane label="缺陷信息" name="defect">
              <qc-defect :key="temp.id" :ipqcId="temp.id"/>
            </el-tab-pane>
          </el-tabs>
          <el-tabs value="determine">
            <el-tab-pane label="判定" name="determine">
              <!--              <el-row>
                              <el-col :span="8">
                                <el-form-item label="品检员姓名：" prop="inspectorName">
                                  <el-input v-model="temp.inspectorName"/>
                                </el-form-item>
                              </el-col>
                              <el-col :span="8">
                                <el-form-item label="品检结论：" prop="inspectorResult">
                                  <el-select v-model="temp.inspectorResult" clearable filterable placeholder="状态">
                                    <el-option key="OK" label="OK" value="OK"></el-option>
                                    <el-option key="NG" label="NG" value="NG"></el-option>
                                  </el-select>
                                </el-form-item>
                              </el-col>
                            </el-row>
                            <el-row>
                              <el-col :span="8">
                                <el-form-item label="复判员姓名：" prop="checkerName">
                                  <el-input v-model="temp.checkerName"/>
                                </el-form-item>
                              </el-col>
                              <el-col :span="8">
                                <el-form-item label="复判结论：" prop="checkerResult">
                                  <el-select v-model="temp.checkerResult" clearable filterable placeholder="状态">
                                    <el-option key="OK" label="OK" value="OK"></el-option>
                                    <el-option key="NG" label="NG" value="NG"></el-option>
                                  </el-select>
                                </el-form-item>
                              </el-col>
                            </el-row>-->

              <el-radio-group v-model="temp.inspectorResult">
                <el-radio label="OK">合格</el-radio>
                <el-radio label="NG">暂留</el-radio>
              </el-radio-group>

            </el-tab-pane>
          </el-tabs>

        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { deepClone } from '@/utils'

  import { getIpqcs, addIpqc, updateIpqc, deleteIpqc } from '@/api/ipqc.js'

  import { MessageBox } from 'element-ui'
  import waves from '@/directive/waves' // Waves directive
  import Pagination from '@/components/Pagination/index.vue'
  import QcDefect from './qc-defect' // Secondary package based on el-pagination

  import { getCustomers } from '@/api/customer'
  import { getOperations } from '@/api/operation'
  import { getShifts } from '@/api/shift' // Secondary package based on el-pagination

  export default {
    name: 'ipqc',
    components: { Pagination, QcDefect },
    directives: { waves },
    watch: {
      'temp.measurement': {
        handler: async function(val) {
          if (!val || val.length == 0) {
            this.temp.measurement = [deepClone(this.measurementItem)]
          }
        }
        // deep: true
      }
      /*      'temp': {
              handler: async function(newVal, oldVal) {
                let s1 = JSON.stringify(oldVal)
                let s2 =  JSON.stringify(newVal)
                console.log(s1)
                console.log(s2)
                if (oldVal && newVal
                  && oldVal.operation == newVal.operation
                  && oldVal.productNumber == newVal.productNumber
                  && oldVal.date == newVal.date
                ) {

                  if (JSON.stringify(oldVal) != JSON.stringify(newVal)) {
                    this.modified = true
                  }
                }
              },
              deep: true
            }*/
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
          productNumber: undefined,
          operation: undefined,
          dateRange: undefined,
          inspectorResult: undefined,
          inspectorConfirm: undefined
          /*orders: ['code desc']*/
        },
        temp: {
          id: null,
          operation: '',
          productNumber: '',
          inspectorResult: '',
          date: '',
          inspectDate: '',
          hotRollOrigin: '',
          nextOperation: '',
          shiftId: '',
          steelGrade: '',
          surfaceFinish: '',
          uses: '',
          customerId: '',
          productNumber: '',
          materialNumber: '',
          grade: '',
          harmfulDefectPercent: '',
          gradeScore: '',
          annealTv: '',
          annealHardness: '',
          rollingPass: '',
          recommendedSurface: '',
          unwindMethod: '',
          handoverMatters: '',
          note: '',
          inspectorName: '',
          inspectorResult: '',
          checkerName: '',
          checkerResult: '',
          measurement: [{
            thickness: null,
            width: null,
            length: null,
            ts48: null,
            bs48: null
          }]
        },
        tempCopy: null,
        shifts: [],
        customers: [],
        operations: [],
        inspectorResults: [],
        measurementItem: {
          thickness: null,
          width: null,
          length: null,
          ts48: null,
          bs48: null
        },
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }]
        },
        modified: false,
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
      const date = new Date()
      this.listQuery.dateRange = [new Date(date.getTime() - 3600 * 1000 * 24 * 30), date]
      this.tempCopy = deepClone(this.temp)
      this.listLoading = true
      this.$nextTick(async() => {
        await Promise.all([
          this.getShifts(),
          this.getCustomers(),
          this.getOperations()
        ])
        this.getList()
      })
    },
    methods: {
      handleModifyState(index, row) {
        updateIpqc(row).then((res) => {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
        })
      },
      handleCurrentChange(currentRow, oldCurrentRow) {
        /*        if (this.modified) {
                  MessageBox.confirm('当前页面信息发生变更, 是否保存?？', '提示', {
                    confirmButtonText: '保存',
                    cancelButtonText: '取消',
                    type: 'warning'
                  }).then(() => {
                    this.temp.id ? submit() : updateData()
                    return
                  })
                }*/
        this.$nextTick(() => {
          this.$refs['ipqcForm'].clearValidate()
        })
        if (currentRow) {
          this.temp = deepClone(currentRow)
        } else {
          this.temp = deepClone(this.tempCopy)
        }
      },
      handleAddMeasurementItem(index) {
        this.temp.measurement.splice(index + 1, 0, deepClone(this.measurementItem))
      },
      handleDeleteMeasurementItem(index) {
        this.temp.measurement.splice(index, 1)
      },
      async getShifts() {
        const res = await getShifts({})
        this.shifts = res.queryResult.list
      },
      async getCustomers() {
        const res = await getCustomers({})
        this.customers = res.queryResult.list
      },
      async getOperations() {
        let res = await getOperations({})
        this.operations = res.queryResult.list
      },
      getList() {
        this.listLoading = true
        getIpqcs(this.listQuery).then(res => {
          this.list = res.queryResult.list.map(item => {
            item.measurement = JSON.parse(item.measurement)
            return item
          })
          this.total = res.queryResult.total
          this.resetForm('ipqcForm')
          this.listLoading = false
        })
      },
      handleCurrentPageChange(val) {
        this.listQuery.current = val
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
      submit() {
        this.$refs['ipqcForm'].validate((valid) => {
          if (valid) {
            // const tempData = deepClone(this.temp)
            let ipqc = deepClone(this.temp)
            ipqc.measurement = JSON.stringify(ipqc.measurement.filter(
              item => item.thickness && item.width &&
                item.length && item.ts48 && item.bs48
            ))
            addIpqc(ipqc).then((res) => {
              for (const v of this.list) {
                if (
                  v.operation === res.model.operation &&
                  v.productNumber === res.model.productNumber &&
                  v.date === res.model.date
                ) {
                  const index = this.list.indexOf(v)
                  res.model.measurement = JSON.parse(res.model.measurement)
                  this.list.splice(index, 1, res.model)
                  this.$refs.ipqcTable.setCurrentRow(res.model)
                  break
                }
              }
              this.modified = false
              this.$notify({
                title: '成功',
                message: '保存成功',
                type: 'success',
                duration: 2000
              })
            })
          }
        })
      },
      updateData() {
        this.$refs['ipqcForm'].validate((valid) => {
          if (valid) {
            let ipqc = deepClone(this.temp)
            ipqc.measurement = JSON.stringify(ipqc.measurement.filter(
              item => item.thickness && item.width &&
                item.length && item.ts48 && item.bs48
            ))
            updateIpqc(ipqc).then(() => {
              for (const v of this.list) {
                if (v.id === ipqc.id) {
                  const index = this.list.indexOf(v)
                  this.list.splice(index, 1, this.temp)
                  this.$refs.ipqcTable.setCurrentRow(this.temp)
                  break
                }
              }
              this.modified = false
              this.$notify({
                title: '成功',
                message: '保存成功',
                type: 'success',
                duration: 2000
              })
            })
          }
        })
      }
      /*      handleDelete(row) {
              this.$confirm('此操作将删除该质检单, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                deleteIpqc(row.id).then(() => {
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
            }*/
    }
  }
</script>
<style lang="scss">
  .ipqc-container {

  .el-icon-circle-plus, .el-icon-delete {
    margin: 5px;
    font-size: 22px !important;
  }

  }

</style>


