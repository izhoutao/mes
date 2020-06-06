<template>
  <div class="app-container ipqc-container">
    <!--工具栏-->
    <div class="filter-container">
      <el-form ref="filterForm" :model="listQuery" :inline="true" size="mini">
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
            <el-option :key="0" label="未确认" :value="0"></el-option>
            <el-option :key="1" label="已确认" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="" prop="inspectorResult">
          <el-select v-model="listQuery.inspectorResult" clearable filterable placeholder="请选择状态"
                     @change="handleFilter">
            <el-option key="OK" label="合格" value="OK"></el-option>
            <el-option key="NG" label="暂留" value="NG"></el-option>
          </el-select>
        </el-form-item>
        <el-button v-waves class="filter-item" size="mini" type="primary" icon="el-icon-search" @click="handleFilter">
          搜索
        </el-button>
        <el-button v-waves class="filter-item" size="mini" @click="resetForm('filterForm');handleFilter()">重置
        </el-button>
      </el-form>
    </div>
    <el-row :gutter="10">
      <!--状态数据-->
      <el-col :span="4">
        <el-table
          ref="ipqcTable"
          :key="tableKey"
          v-loading="listLoading"
          :data="list"
          @current-change="handleCurrentChange"
          border fit highlight-current-row
          class="ipqc-table"
          style="zoom:0.9;"
        >
          <el-table-column label="工序" min-width="30px" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.operation }}</span>
            </template>
          </el-table-column>
          <el-table-column label="钢卷编号" min-width="85px" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.productNumber }}</span>
            </template>
          </el-table-column>
          <el-table-column label="状态" min-width="25px" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.inspectorResult }}</span>
            </template>
          </el-table-column>
          <el-table-column label="确认" min-width="25px" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.status?'Y':'N' }}</span>
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
      <el-col :span="20">
        <!--表单-->
        <el-form
          ref="ipqcForm"
          :rules="rules"
          :model="temp"
          size="mini"
          label-position="right"
          label-width="120px"
        >
          <div v-if="temp.productNumber">
            <el-button type="primary" size="small" @click="handleSave">保存</el-button>
            <el-button type="primary" size="small" @click="handleApprove">提交</el-button>
          </div>
          <el-row :gutter="5">
            <el-col :span="21">
              <el-tabs value="basic">
                <el-tab-pane label="基本信息" name="basic" size="mini">
                  <el-row>
                    <el-col :span="6">
                      <el-form-item label="日期：" prop="date">
                        <el-date-picker :value="temp.date" type="date" placeholder="请选择日期" style="width: 100%;"
                                        format="yyyy-MM-dd"
                                        value-format="yyyy-MM-dd"/>
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item label="产地：" prop="hotRollOrigin">
                        <el-input :value="temp.hotRollOrigin"/>
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item label="产线：" prop="operation">
                        <el-input :value="temp.operation"/>
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item label="下制程：" prop="nextOperation">
                        <el-input :value="temp.nextOperation"/>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="6">
                      <el-form-item label="班别：" prop="shiftId">
                        <el-select :value="temp.shiftId" style="width:100%">
                          <el-option
                            v-for="item in shifts"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                          </el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item label="钢种：" prop="steelGrade">
                        <el-input :value="temp.steelGrade"/>
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item label="表面品级：" prop="surfaceFinish">
                        <el-select :value="temp.surfaceFinish">
                          <el-option
                            v-for="item in surfaceFinishes.list"
                            :key="item"
                            :label="item"
                            :value="item"
                          >
                          </el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item label="用途：" prop="uses">
                        <el-input :value="temp.uses"/>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="6">
                      <el-form-item label="客户：" prop="customerId">
                        <el-select :value="temp.customerId" style="width:100%">
                          <el-option
                            v-for="item in customers"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                          </el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item label="钢卷编号：" prop="productNumber">
                        <el-input :value="temp.productNumber"/>
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item label="原料编号：" prop="materialNumber">
                        <el-input :value="temp.materialNumber"/>
                      </el-form-item>
                    </el-col>
                  </el-row>

                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="宽度管制范围：" class="range-container">
                        <el-input :value="minWidth"/>
                        <div class="splitter">-</div>
                        <el-input :value="maxWidth"/>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="厚度管制范围：" class="range-container">
                        <el-input :value="minThickness"/>
                        <div class="splitter">-</div>
                        <el-input :value="maxThickness"/>
                      </el-form-item>
                    </el-col>
                  </el-row>

                </el-tab-pane>
              </el-tabs>
              <el-tabs value="record">
                <el-tab-pane label="检验记录" name="record">
                  <el-row>
                    <el-col :span="6">
                      <el-form-item label="等级：" prop="grade">
                        <el-select v-model="temp.grade">
                          <el-option label="1" value="1"/>
                          <el-option label="A" value="A"/>
                          <el-option label="2" value="2"/>
                          <el-option label="3" value="3"/>
                          <el-option label="C" value="C"/>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item label="有害缺陷率(%)：" prop="harmfulDefectPercent">
                        <el-input v-model="temp.harmfulDefectPercent"/>
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item label="等级评分：" prop="gradeScore">
                        <el-input v-model="temp.gradeScore"/>
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item label="退火TV：" prop="annealTv">
                        <el-input v-model="temp.annealTv"/>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="6">
                      <el-form-item label="退火硬度：" prop="annealHardness">
                        <el-input v-model="temp.annealHardness"/>
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item label="轧/平道次：" prop="rollingPass">
                        <el-input v-model="temp.rollingPass"/>
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item label="建议使用表面：" prop="recommendedSurface">
                        <!--                        <el-select v-model="temp.recommendedSurface">
                                                  <el-option label="上面" value="上面"/>
                                                  <el-option label="下面" value="下面"/>
                                                </el-select>-->
                        <!--                        <el-input v-model="temp.recommendedSurface" @dblclick.native="handleDbclickRecommendedSurface"/>-->
                        <el-radio-group v-model="temp.recommendedSurface">
                          <el-radio label="上面">上面</el-radio>
                          <el-radio label="下面">下面</el-radio>
                        </el-radio-group>
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item label="开卷方式：" prop="unwindMethod">
                        <!--                        <el-input v-model="temp.unwindMethod" @dblclick.native="handleDbclickUnwindMethod"/>-->
                        <el-radio-group v-model="temp.unwindMethod">
                          <el-radio label="上翻">上翻</el-radio>
                          <el-radio label="下翻">下翻</el-radio>
                        </el-radio-group>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-button plain size="mini" @click="handleAddBlanMeasurementkRow">添加空行</el-button>

                    <div style="float: right">
                      <el-button plain size="mini" @click="handleCopyDefect">复制缺陷</el-button>
                      <el-button plain size="mini" @click="handleCutDefect">剪切缺陷</el-button>
                      <el-button plain size="mini" @click="handlePasteDefect">粘贴缺陷</el-button>
                      <el-button plain size="mini" @click="handleDeleteDefect">删除缺陷</el-button>
                      <el-button plain size="mini" @click="handleSetTopDefect">置顶缺陷</el-button>
                      <el-button plain size="mini" @click="handleAddBlankDefectRow">添加空行</el-button>
                    </div>
                  </el-row>
                  <el-row :gutter="3" class="measurement-defectList-container">
                    <el-col :span="7">
                      <qc-measurement ref="measurement" v-bind:measurement.sync="temp.measurement" :key="temp.id"/>
                    </el-col>
                    <el-col :span="17">
                      <qc-defect ref="defect" v-bind:defectList.sync="temp.defectList" :key="temp.id"/>
                    </el-col>
                  </el-row>

                  <el-row>
                    <el-col :span="24">
                      <el-form-item label="备注：" prop="note" class="note">
                        <el-input type="textarea" :rows="3" v-model="temp.note"/>
                      </el-form-item>
                    </el-col>
                  </el-row>
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
            </el-col>

            <el-col :span="3">
              <el-form-item label="生产要求：" prop="requirements" class="side-form-item">
                <el-input type="textarea" :rows="17" v-model="temp.requirements"/>
              </el-form-item>
            </el-col>

            <el-col :span="3">
              <el-form-item label="交接事项：" prop="handoverMatters" class="side-form-item">
                <el-input type="textarea" :rows="17" v-model="temp.handoverMatters"/>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { deepClone } from '@/utils'

  import { addIpqc, getIpqcs, updateIpqc } from '@/api/ipqc.js'
  import waves from '@/directive/waves' // Waves directive
  import Pagination from '@/components/Pagination/index.vue'
  import QcDefect from '../components/qc-defect'
  import QcMeasurement from '../components/qc-measurement'

  import { getCustomers } from '@/api/customer'
  import { getOperations } from '@/api/operation'
  import { getShifts } from '@/api/shift'
  import {
    getInboundOrderRawItemByOutboundRawItemProductNumber,
  } from '@/api/inboundorderrawitem'
  import { getOutboundOrderRawItems } from '@/api/outboundorderrawitem'
  import { getInboundOrderRaws } from '@/api/inboundorderraw'
  import { login } from '@/api/user'
  import { getWorkOrders } from '@/api/workorder' // Secondary package based on el-pagination

  export default {
    name: 'ipqc_check',
    components: { Pagination, QcDefect, QcMeasurement },
    directives: { waves },
    watch: {
      'temp': {
        handler: async function(val) {
          switch (val.operation) {
            case '重卷':
              this.surfaceFinishes = { default: '', list: ['2BA', 'BA', 'NO.1', '硬板G'] }
              break
            case '轧机':
              this.surfaceFinishes = { default: '硬板G', list: ['2BA', 'BA', 'NO.1', '硬板G'] }
              break
            case '退火炉':
              this.surfaceFinishes = { default: '2BA', list: ['2BA', 'BA', 'NO.1', '硬板G'] }
              break
            case '精整拉矫':
              this.surfaceFinishes = { default: '2BA', list: ['2BA', 'BA', 'NO.1', '硬板G'] }
              break
            default:
          }
          if (!val.surfaceFinish) {
            val.surfaceFinish = this.surfaceFinishes.default
          }
          if (!this.temp.measurement) {
            this.temp.measurement = []
          }
          this.measurementTableRowLength = 5
          for (let i = this.temp.measurement.length; i < this.measurementTableRowLength; i++) {
            this.temp.measurement.push(deepClone(this.measurementItem))
          }
          this.$nextTick(() => {
            this.temp.statistics = JSON.stringify({
                mean: this.$refs.measurement.statisticsList[0],
                min: this.$refs.measurement.statisticsList[1],
                max: this.$refs.measurement.statisticsList[2]
              }
            )
          })
          if (!this.temp.defectList) {
            this.temp.defectList = []
          }
          /*          //console.log(val.id)
                    if (val.id) {
                      let res = await getQcDefects({ ipqcId: val.id })
                      this.temp.defectList = res.queryResult.list
                    }*/
          this.defectTableRowLength = 20
          for (let i = this.temp.defectList.length; i < this.defectTableRowLength; i++) {
            this.temp.defectList.push(deepClone(this.defectItem))
          }
          //console.log(this.temp.defectList)
        },
        immediate: true
        // deep: true
      }
    },
    computed: {
      minWidth() {
        let minWidth = this.temp.targetWidth - this.temp.toleranceWidth
        return minWidth.toString() == 'NaN' ? '' : minWidth
      },
      maxWidth() {
        let maxWidth = this.temp.targetWidth + this.temp.toleranceWidth
        return maxWidth.toString() == 'NaN' ? '' : maxWidth
      },
      minThickness() {
        let minThickness = this.temp.targetThickness - this.temp.toleranceThickness
        return minThickness.toString() == 'NaN' ? '' : minThickness
      },
      maxThickness() {
        let maxThickness = this.temp.targetThickness + this.temp.toleranceThickness
        return maxThickness.toString() == 'NaN' ? '' : maxThickness
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
          size: 20,
          productNumber: undefined,
          operation: undefined,
          dateRange: undefined,
          inspectorResult: 'NG',
          inspectorConfirm: 1
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
          recommendedSurface: '下面',
          unwindMethod: '上翻',
          requirements: '',
          handoverMatters: '',
          note: '',
          inspectorName: '',
          inspectorResult: '',
          checkerName: '',
          checkerResult: '',
          measurement: [],
          defectList: [],
          status: null
        },
        tempCopy: null,
        clipboardDefects: [],
        defectTableRowLength: 20,
        measurementTableRowLength: 5,

        shifts: [],
        customers: [],
        operations: [],
        surfaceFinishes: [],
        measurementItem: {
          thickness: null,
          width: null,
          length: null,
          ts48: null,
          bs48: null
        },
        defectItem: {
          id: '',
          ipqcId: '',
          defectCode: '',
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
        recommendedSurfaceIndex: 1,
        recommendedSurfaces: ['上面', '下面'],
        unwindMethodIndex: 0,
        unwindMethods: ['上翻', '下翻'],

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
      this.listQuery.dateRange = [new Date(date.getTime() - 3600 * 1000 * 24 * 30 * 3), date]
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
          // if (!this.temp.id) {
          getInboundOrderRawItemByOutboundRawItemProductNumber(this.temp.productNumber).then(res => {
            const inboundOrderRawItem = res.model
            this.temp.steelGrade = inboundOrderRawItem.steelGrade
            this.temp.surfaceFinish = inboundOrderRawItem.surfaceFinish
            getInboundOrderRaws({
              inboundOrderRawId: inboundOrderRawItem.inboundOrderRawId
            }).then(res => {
              if (res.queryResult.total) {
                const inboundOrderRaw = res.queryResult.list[0]
                this.temp.hotRollOrigin = inboundOrderRaw.hotRollOrigin
              }
            })
          }).catch(error => {
            console.log(error)
            this.$message.error('获取信息失败1')
          })
          getOutboundOrderRawItems({
            materialNumber: this.temp.materialNumber,
            productNumber: this.temp.productNumber,
            status: 0
          }).then(res => {
            if (res.queryResult.total) {
              const outboundOrderRawItem = res.queryResult.list[0]
              getWorkOrders({
                workOrderNumber: outboundOrderRawItem.workOrderNumber
              }).then(res => {
                if (res.queryResult.total) {
                  const workOrder = res.queryResult.list[0]
                  const targetWidth = parseFloat(workOrder.targetWidth)
                  const toleranceWidth = parseFloat(workOrder.toleranceWidth)
                  const targetThickness = parseFloat(workOrder.targetWidth)
                  const toleranceThickness = parseFloat(workOrder.toleranceWidth)
                  this.temp.targetWidth = targetWidth
                  this.temp.toleranceWidth = toleranceWidth
                  this.temp.targetThickness = targetThickness
                  this.temp.toleranceThickness = toleranceThickness

                  this.temp.requirements = workOrder.requirements
                }
              }).catch(error => {
                console.log(error)
                this.$message.error('获取信息失败2')
              })
              const operationHistory = JSON.parse(outboundOrderRawItem.operationHistory)
              const index = operationHistory.findIndex(item => item.itemId == this.temp.itemId)
              if (index != -1) {
                if (index != (operationHistory.length - 1)) {
                  this.temp.nextOperation = operationHistory[index + 1].operationName
                } else if (index == (operationHistory.length - 1)) {
                  if (outboundOrderRawItem.nextOperationLabel) {
                    this.temp.nextOperation = outboundOrderRawItem.nextOperationLabel
                  } else {
                    this.temp.nextOperation = '成品入库'
                  }
                }
              }
            }
          }).catch(error => {
            console.log(error)
            this.$message.error('获取信息失败3')
          })
          // }
        } else {
          this.temp = deepClone(this.tempCopy)
        }
      },
      /*      handleDbclickRecommendedSurface() {
              this.recommendedSurfaceIndex = (++this.recommendedSurfaceIndex) % 2
              this.temp.recommendedSurface = this.recommendedSurfaces[this.recommendedSurfaceIndex]
            },
            handleDbclickUnwindMethod() {
              this.unwindMethodIndex = (++this.unwindMethodIndex) % 2
              this.temp.unwindMethod = this.unwindMethods[this.unwindMethodIndex]
            },*/
      handleAddMeasurementItem(index) {
        this.temp.measurement.splice(index + 1, 0, deepClone(this.measurementItem))
      },
      handleDeleteMeasurementItem(index) {
        this.temp.measurement.splice(index, 1)
      },

      handleCopyDefect() {
        this.clipboardDefects = deepClone(this.$refs.defect.selectedDefects.filter(
          item => Object.values(item).join('') != '')
        )
      },
      handleCutDefect() {
        this.handleCopyDefect()
        this.handleDeleteDefect()
      },
      handlePasteDefect() {
        const defectList = this.$refs.defect.list.filter(item => Object.values(item).join('') != '')
        this.$refs.defect.list = [...defectList, ...deepClone(this.clipboardDefects)]

        for (let i = this.$refs.defect.list.length; i < this.defectTableRowLength; i++) {
          this.$refs.defect.list.push(deepClone(this.defectItem))
        }
        let selectedDefects = this.$refs.defect.selectedDefects
        this.$nextTick(() => {
          this.$refs.defect.toggleSelection(selectedDefects)
        })
      },
      handleDeleteDefect() {
        let defectList = this.$refs.defect.list
        let selectedDefects = this.$refs.defect.selectedDefects
        this.$refs.defect.list = defectList.filter(v => !selectedDefects.includes(v))

        for (let i = this.$refs.defect.list.length; i < this.defectTableRowLength; i++) {
          this.$refs.defect.list.push(deepClone(this.defectItem))
        }
      },
      handleSetTopDefect() {
        let defectList = this.$refs.defect.list
        let selectedDefects = this.$refs.defect.selectedDefects
        this.$refs.defect.list = [...selectedDefects,
          ...defectList.filter(v => !selectedDefects.includes(v))]
        this.$nextTick(() => {
          this.$refs.defect.toggleSelection(selectedDefects)
        })
      },
      handleAddBlankDefectRow() {
        this.$refs.defect.list.push(deepClone(this.defectItem))
        this.defectTableRowLength++
      },
      handleAddBlanMeasurementkRow() {
        this.$refs.measurement.list.push(deepClone(this.measurementItem))
        this.measurementTableRowLength++
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
        let res = await getOperations({ orders: ['sequence_number asc'] })
        this.operations = res.queryResult.list
      },
      getList() {
        this.listLoading = true
        getIpqcs(this.listQuery).then(res => {
          this.list = res.queryResult.list.map(item => {
            if (!item.id) {
              item.recommendedSurface = this.recommendedSurfaces[this.recommendedSurfaceIndex]
              item.unwindMethod = this.unwindMethods[this.unwindMethodIndex]
            }
            item.measurement = JSON.parse(item.measurement)
            item.defectList = JSON.parse(item.defectList)
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
      handleSave() {
        const status = this.temp.status
        this.temp.status = 0
        this.temp.id ? this.updateData() : this.submit()
        this.temp.status = status
      },
      handleApprove() {
        this.temp.status = 1
        this.temp.id ? this.updateData() : this.submit()
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
            ipqc.defectList = JSON.stringify(ipqc.defectList.filter(
              item => item.defectCode
            ))
            addIpqc(ipqc).then((res) => {
              for (const v of this.list) {
                if (
                  v.operation === res.model.operation &&
                  v.productNumber === res.model.productNumber &&
                  v.date === res.model.date &&
                  v.shiftId === res.model.shiftId
                ) {
                  const index = this.list.indexOf(v)
                  res.model.measurement = JSON.parse(res.model.measurement)
                  res.model.defectList = JSON.parse(res.model.defectList)
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
            ipqc.defectList = JSON.stringify(ipqc.defectList.filter(
              item => item.defectCode
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

  .range-container {

  .el-form-item__content {
    display: flex;
    /*默认的主轴是row,这里需要以列的方式进行排列*/
    flex-direction: row;
    /*设置子元素的主轴方向上的排列方式*/
    justify-content: space-around;
    align-items: center;

  .splitter {
    margin: 0 10px;
  }

  }

  }


  .el-tabs__item {
    height: 35px;
  }

  .ipqc-table {

  .cell {
    padding: 0px !important;
  }

  td, th {
    padding: 5px 2px;
  }

  }


  .el-form-item--mini.el-form-item, .el-form-item--small.el-form-item {
    margin-bottom: 2px;
  }

  .el-icon-circle-plus, .el-icon-delete {
    margin: 5px;
    font-size: 22px !important;
  }

  .el-tabs__header {
    margin: 0 0 5px;
  }

  .measurement-defectList-container {
    margin-top: 5px;
  }


  .side-form-item {
    display: flex;
    /*默认的主轴是row,这里需要以列的方式进行排列*/
    flex-direction: column;
    /*设置子元素的主轴方向上的排列方式*/
    justify-content: left;

  /*align-items: center;*/

  .el-form-item__label {
    text-align: left;
  }

  .el-form-item__content {
    /*display: block !important;*/
    margin: 0px !important;
  }

  }

  .note {
    margin-top: 15px;
  }

  }

</style>


