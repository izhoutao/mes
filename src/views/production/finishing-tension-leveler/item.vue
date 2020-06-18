<template>
  <div class="app-container journaling-finishing-tension-leveler-item">
    <div v-if="!splitVisible">
      <div>
        <!--      <div style="font-size: 20px;">{{textMap[dialogStatus]}}报工</div>-->

        <el-form
          ref="journalingFinishingTensionLevelerItemForm"
          :rules="rules"
          :model="temp"
          label-position="right"
          label-width="150px"
        >
          <el-row>
            <el-col :span="6">
              <el-form-item label="日期：" prop="date">
                <el-date-picker v-model="temp.date" type="date" placeholder="请选择日期" style="width: 100%;"
                                format="yyyy-MM-dd"
                                value-format="yyyy-MM-dd"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="班别：" prop="shiftId">
                <el-select v-model="temp.shiftId" filterable placeholder="请选择" style="width:100%">
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
              <el-form-item label="钢卷编号：" prop="productNumber">
                <el-autocomplete
                  v-model="temp.productNumber"
                  :fetch-suggestions="getPendingItemsByNumberType('productNumber')"
                  placeholder="请输入钢卷号"
                  @select="item => handleNumberChange(item,'materialNumber')"
                ></el-autocomplete>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="原料编号：" prop="materialNumber">
                <el-autocomplete
                  v-model="temp.materialNumber"
                  :fetch-suggestions="getPendingItemsByNumberType('materialNumber')"
                  placeholder="请输入原料编号"
                  @select="item => handleNumberChange(item,'productNumber')"
                ></el-autocomplete>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="进料宽度(mm)：" prop="inputWidth">
                <el-input v-model="temp.inputWidth"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="进料厚度(mm)：" prop="inputThickness">
                <el-input v-model="temp.inputThickness"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="进料重量(kg)：" prop="inputWeight">
                <el-input v-model="temp.inputWeight"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="生产方式：" prop="paramProductionMode">
                <el-radio-group v-model="temp.paramProductionMode">
                  <el-radio :label="0">精整</el-radio>
                  <el-radio :label="1">拉矫</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>

            <el-col :span="6">
              <el-form-item label="入口张力(KN)：" prop="paramInletTesion">
                <el-input v-model="temp.paramInletTesion"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="总轧制力(T)：" prop="paramTotalRollingForce">
                <el-input v-model="temp.paramTotalRollingForce"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="出口张力(KN)：" prop="paramOutletTesion">
                <el-input v-model="temp.paramOutletTesion"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="延伸率(%)：" prop="paramPercentageElongation">
                <el-input v-model="temp.paramPercentageElongation"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="出料厚度(mm)：" prop="outputThickness">
                <el-input v-model="temp.outputThickness"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="出料长度(mm)：" prop="outputLength">
                <el-input v-model="temp.outputLength"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="出料重量(kg)：" prop="outputWeight">
                <el-input v-model="temp.outputWeight"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="套筒重量(kg)：" prop="outputSleeveWeight">
                <el-input v-model="temp.outputSleeveWeight"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>

            <el-col :span="6">
              <el-form-item label="出料速度(m/min)：" prop="outputSpeed">
                <el-input v-model="temp.outputSpeed"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="上机时间：" prop="beginTime">
                <el-date-picker
                  v-model="temp.beginTime"
                  type="datetime"
                  placeholder="选择日期时间"
                  default-time="12:00:00"
                  format="yyyy-MM-dd HH:mm:ss"
                  value-format="yyyy-MM-ddTHH:mm:ss"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="下机时间：" prop="endTime">
                <el-date-picker
                  v-model="temp.endTime"
                  type="datetime"
                  placeholder="选择日期时间"
                  default-time="12:00:00"
                  format="yyyy-MM-dd HH:mm:ss"
                  value-format="yyyy-MM-ddTHH:mm:ss"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div style="margin: 10px 0px 20px;display: flex;flex-direction: row;justify-content: center;align-items: center;">
          <el-button type="danger" style="width: 30%;" @click="dialogStatus==='create'?submit():updateData()">提交
          </el-button>
        </div>
      </div>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span style="font-size: 20px;">报工记录</span>
          <el-button style="float: right;"
                     v-waves class="filter-item" type="warning"
                     @click="splitVisible = true">分卷操作台
          </el-button>
        </div>
        <div>
          <div class="filter-container">
            <el-form ref="filterForm" :model="listQuery" :inline="true">
              <el-form-item label="" prop="journalingBeginTime">
                <el-date-picker
                  v-model="listQuery.journalingBeginTime"
                  type="datetime"
                  placeholder="选择起始日期时间"
                  format="yyyy-MM-dd HH:mm:ss"
                  value-format="yyyy-MM-ddTHH:mm:ss"
                >
                </el-date-picker>
              </el-form-item>

              <el-form-item label="" prop="journalingEndTime">
                <el-date-picker
                  v-model="listQuery.journalingEndTime"
                  type="datetime"
                  placeholder="选择结束日期时间"
                  format="yyyy-MM-dd HH:mm:ss"
                  value-format="yyyy-MM-ddTHH:mm:ss"
                >
                </el-date-picker>
              </el-form-item>
              <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索
              </el-button>
              <el-button v-waves class="filter-item" @click="resetForm('filterForm');handleFilter()">重置</el-button>
              <!--            <el-button class="filter-item" style="margin-left: 10px;" type="success"
                                     icon="el-icon-edit" @click="handleAdd">
                            添加
                          </el-button>-->
            </el-form>
            <pagination
              v-show="total>0"
              :total="total"
              :page.sync="listQuery.current"
              :limit.sync="listQuery.size"
              @pagination="getList"
            />
          </div>
          <el-table :key="tableKey" v-loading="listLoading" :data="list" border fit highlight-current-row>
            <el-table-column label="序" min-width="40px" type="index" align="center">
            </el-table-column>
            <el-table-column label="钢卷编号" min-width="80px" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.productNumber }}</span>
              </template>
            </el-table-column>
            <el-table-column label="钢种" min-width="80px" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.steelGrade }}</span>
              </template>
            </el-table-column>
            <el-table-column label="表面" min-width="80px" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.surfaceFinish }}</span>
              </template>
            </el-table-column>

            <el-table-column label="进料" align="center">
              <el-table-column label="厚度|(mm)" min-width="50px" align="center" :render-header="renderHeader">
                <template slot-scope="scope">
                  <span>{{ scope.row.inputThickness }}</span>
                </template>
              </el-table-column>
              <el-table-column label="宽度|(mm)" min-width="50px" align="center" :render-header="renderHeader">
                <template slot-scope="scope">
                  <span>{{ scope.row.inputWidth }}</span>
                </template>
              </el-table-column>
              <el-table-column label="重量|(kg)" min-width="50px" align="center" :render-header="renderHeader">
                <template slot-scope="scope">
                  <span>{{ scope.row.inputWeight }}</span>
                </template>
              </el-table-column>
            </el-table-column>

            <el-table-column label="精整拉矫参数" align="center">
              <el-table-column label="生产方式" min-width="50px" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.paramProductionMode }}</span>
                </template>
              </el-table-column>
              <el-table-column label="入口张力|(KN)" min-width="50px" align="center" :render-header="renderHeader">
                <template slot-scope="scope">
                  <span>{{ scope.row.paramInletTesion }}</span>
                </template>
              </el-table-column>
              <el-table-column label="总轧制力|(T)" min-width="50px" align="center" :render-header="renderHeader">
                <template slot-scope="scope">
                  <span>{{ scope.row.paramTotalRollingForce }}</span>
                </template>
              </el-table-column>
              <el-table-column label="出口张力|(KN)" min-width="50px" align="center" :render-header="renderHeader">
                <template slot-scope="scope">
                  <span>{{ scope.row.paramOutletTesion }}</span>
                </template>
              </el-table-column>
              <el-table-column label="延伸率|(%)" min-width="50px" align="center" :render-header="renderHeader">
                <template slot-scope="scope">
                  <span>{{ scope.row.paramPercentageElongation }}</span>
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column label="出料" align="center">
              <el-table-column label="厚度|(mm)" min-width="50px" align="center" :render-header="renderHeader">
                <template slot-scope="scope">
                  <span>{{ scope.row.outputThickness }}</span>
                </template>
              </el-table-column>
              <el-table-column label="长度(mm)" min-width="50px" align="center" :render-header="renderHeader">
                <template slot-scope="scope">
                  <span>{{ scope.row.outputLength }}</span>
                </template>
              </el-table-column>
              <el-table-column label="重量|(kg)" min-width="50px" align="center" :render-header="renderHeader">
                <template slot-scope="scope">
                  <span>{{ scope.row.outputWeight }}</span>
                </template>
              </el-table-column>
              <el-table-column label="套筒重量|(kg)" min-width="50px" align="center" :render-header="renderHeader">
                <template slot-scope="scope">
                  <span>{{ scope.row.outputWeight }}</span>
                </template>
              </el-table-column>
              <el-table-column label="损耗|(kg)" min-width="50px" align="center" :render-header="renderHeader">
                <template slot-scope="scope">
                  <span>{{ scope.row.outputWeightLoss }}</span>
                </template>
              </el-table-column>
              <el-table-column label="出料速度|(m/min)" min-width="50px" align="center" :render-header="renderHeader">
                <template slot-scope="scope">
                  <span>{{ scope.row.outputSpeed }}</span>
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column label="时间统计" align="center">
              <el-table-column label="上机时间" min-width="65px" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.beginTime  | parseTime('{h}:{i}') }}</span>
                </template>
              </el-table-column>
              <el-table-column label="下机时间" min-width="65px" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.endTime | parseTime('{h}:{i}') }}</span>
                </template>
              </el-table-column>

              <el-table-column label="用时|（min）" min-width="50px" align="center" :render-header="renderHeader">
                <template slot-scope="scope">
                  <span>{{ scope.row.costTime }}</span>
                </template>
              </el-table-column>
            </el-table-column>

            <el-table-column label="操作" align="center" min-width="60">
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
        </div>
      </el-card>
    </div>
    <split operation="精整拉矫" v-if="splitVisible" :splitVisible.sync="splitVisible"></split>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { deepClone, parseTime } from '@/utils'

  import {
    getJournalingFinishingTensionLevelerItems,
    addJournalingFinishingTensionLevelerItem,
    updateJournalingFinishingTensionLevelerItem,
    deleteJournalingFinishingTensionLevelerItem
  } from '@/api/journalingfinishingtensionleveleritem'

  import waves from '@/directive/waves' // Waves directive
  import Pagination from '@/components/Pagination/index.vue' // Secondary package based on el-pagination
  import Split from '../components/split' // Secondary package based on el-pagination
  import { getShifts } from '@/api/shift'
  import { getOutboundOrderRawItems } from '@/api/outboundorderrawitem'

  export default {
    name: 'finishingTensionLevelerItem',
    components: { Pagination, Split },
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
          //journalingBeginTime: parseTime(new Date(new Date(new Date().toLocaleDateString()).getTime()), '{y}-{m}-{d}T{h}:{i}:{s}'),
          //journalingEndTime: parseTime(new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1), '{y}-{m}-{d}T{h}:{i}:{s}')
          journalingBeginTime: undefined,
          journalingEndTime: undefined,
          createPerson: '',
          orders: ['date desc', 'update_time desc']
          // shiftId: '',
          // date: parseTime(new Date(),'{y}-{m}-{d} {h}:{i}:{s}')
        },
        temp: {
          id: undefined,
          productNumber: '',
          materialNumber: '',
          /*          steelGrade: '',
                    hotRollOrigin: '',*/
          inputThickness: '',
          inputWeight: '',
          inputWidth: '',
          paramProductionMode: '',
          paramInletTesion: '',
          paramTotalRollingForce: '',
          paramOutletTesion: '',
          paramPercentageElongation: '',
          beginTime: '',
          endTime: '',
          outputThickness: '',
          outputLength: '',
          outputWeight: '',
          outputSleeveWeight: '',
          outputSpeed: '',
          shiftId: '',
          date: parseTime(new Date(), '{y}-{m}-{d}T{h}:{i}:{s}')
        },
        tempCopy: null,

        shifts: [],
        shiftMap: null,
        splitVisible: false,
        dialogStatus: 'create',

        /*        textMap: {
                  update: '编辑',
                  create: '添加'
                },*/
        rules: {
          date: [
            { required: true, trigger: 'blur', message: '请选择日期' }
          ],
          shiftId: [
            { required: true, trigger: 'blur', message: '请选择班别' }
          ],
          productNumber: [
            { required: true, message: '钢卷编号不能为空' }
          ],
          materialNumber: [
            { required: true, message: '原料编号不能为空' }
          ],
          inputWidth: [
            { required: true, message: '进料宽度不能为空' }
          ],
          inputThickness: [
            { required: true, message: '进料厚度不能为空' }
          ],
          inputWeight: [
            { required: true, message: '进料重量不能为空' }
          ],
          paramProductionMode: [
            { required: true, message: '请选择生产方式' }
          ],
          paramInletTesion: [
            { required: true, message: '入口张力不能为空' }
          ],
          paramTotalRollingForce: [
            { required: true, message: '总轧制力不能为空' }
          ],
          paramOutletTesion: [
            { required: true, message: '出口张力不能为空' }
          ],
          paramPercentageElongation: [
            { required: true, message: '延伸率不能为空' }
          ],
          outputThickness: [
            { required: true, message: '出料厚度不能为空' }
          ],
          outputLength: [
            { required: true, message: '出料长度不能为空' }
          ],
          outputWeight: [
            { required: true, message: '出料重量不能为空' }
          ],
          outputSleeveWeight: [
            { required: true, message: '套筒重量不能为空' }
          ],
          outputSpeed: [
            { required: true, message: '出料速度不能为空' }
          ],
          beginTime: [
            { required: true, message: '上机时间不能为空' }
          ],
          endTime: [
            { required: true, message: '下机时间不能为空' }
          ]
        }
      }
    },
    computed: {
      ...mapGetters([
        'id'
      ])
    },
    created() {
      this.tempCopy = deepClone(this.temp)
      this.listLoading = true
      this.$nextTick(async() => {
        await this.getShifts({})
        this.listQuery.createPerson = this.id
        const timeStr = parseTime(new Date(), '{h}:{i}:{s}')
        this.listQuery.shiftId = this.shifts.filter(shift => {
          if (shift.beginTime <= shift.endTime) {
            return timeStr >= shift.beginTime && timeStr <= shift.endTime
          } else {
            return (timeStr >= shift.beginTime
              && timeStr <= '24:00:00')
              || (timeStr >= '00:00:00'
                && timeStr <= shift.endTime)
          }
        })[0].shiftId
        this.getList()
      })
    },
    methods: {
      renderHeader(h, { column, $index }) {
        return h('span', {}, [
          h('span', {}, column.label.split('|')[0]),
          h('br'),
          h('span', {}, column.label.split('|')[1])
        ])
      },

      async getShifts(query) {
        const res = await getShifts(query)
        this.shifts = res.queryResult.list
        this.shiftMap = _.fromPairs(this.shifts.map(shift => {
          return [shift.id, shift]
        }))
      },

      getPendingItemsByNumberType(type) {
        return (queryString, cb) => {
          getOutboundOrderRawItems({ next_operation_label: '精整拉矫', status: 0 }).then(res => {
            let pendingItems = res.queryResult.list.map(item => {
              return { ...item, value: item[type] }
            }).filter(this.createStateFilter(queryString))
            cb(pendingItems)
          })
        }
      },
      createStateFilter(queryString) {
        return (state) => {
          return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) > -1)
        }
      },
      handleNumberChange(item, type) {
        if (item) {
          this.temp[type] = item[type]
        } else {
          this.temp[type] = ''
        }
      },

      getList() {
        this.listLoading = true
        getJournalingFinishingTensionLevelerItems(this.listQuery).then(res => {
          this.list = res.queryResult.list.map(item => {
            let shift = this.shiftMap[item.shiftId]
            item.shiftName = shift.name
            return item
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
        this.resetForm('journalingFinishingTensionLevelerItemForm')
        this.dialogStatus = 'create'
        // this.dialogFormVisible = true
        // this.rules.password[0].required = true
        this.$nextTick(() => {
          this.$refs['journalingFinishingTensionLevelerItemForm'].clearValidate()
        })
      },
      submit() {
        this.$refs['journalingFinishingTensionLevelerItemForm'].validate((valid) => {
          if (valid) {
            // const tempData = deepClone(this.temp)
            let journalingFinishingTensionLevelerItem = deepClone(this.temp)
            delete journalingFinishingTensionLevelerItem.shiftName
            addJournalingFinishingTensionLevelerItem(journalingFinishingTensionLevelerItem).then((res) => {
              let shift = this.shiftMap[journalingFinishingTensionLevelerItem.shiftId]
              res.model.shiftName = shift.name
              this.list.unshift(res.model)
              this.total++
              // this.dialogFormVisible = false
              this.handleAdd()
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
        // this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['journalingFinishingTensionLevelerItemForm'].clearValidate()
        })
      },
      updateData() {
        this.$refs['journalingFinishingTensionLevelerItemForm'].validate((valid) => {
          if (valid) {
            let journalingFinishingTensionLevelerItem = deepClone(this.temp)
            delete journalingFinishingTensionLevelerItem.shiftName
            updateJournalingFinishingTensionLevelerItem(journalingFinishingTensionLevelerItem).then(() => {
              let shift = this.shiftMap[journalingFinishingTensionLevelerItem.shiftId]
              journalingFinishingTensionLevelerItem.shiftName = shift.name
              for (const v of this.list) {
                if (v.id === journalingFinishingTensionLevelerItem.id) {
                  const index = this.list.indexOf(v)
                  this.list.splice(index, 1, journalingFinishingTensionLevelerItem)
                  break
                }
              }
              this.handleAdd()
              // this.dialogFormVisible = false
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
        this.$confirm('此操作将永久删除该精整拉矫条目, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteJournalingFinishingTensionLevelerItem(row.id).then(() => {
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
  .journaling-finishing-tension-leveler-item {

  .el-table td, .el-table th {
    padding: 5px 0;
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

