<template>
  <div class="app-container journaling-anneal-item">
    <div v-if="!splitVisible">
      <div>
        <el-form
          ref="journalingAnnealItemForm"
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
              <el-form-item label="操作各区温度：" prop="operationTemperatures">
                <el-input v-model="temp.operationTemperatures"/>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="6">
              <el-form-item label="操作TV：" prop="operationTv">
                <el-input v-model="temp.operationTv"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="操作速度：" prop="operationSpeed">
                <el-input v-model="temp.operationSpeed"/>
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
          <el-row>
            <el-col :span="6">
              <el-form-item label="出料重量(kg)：" prop="outputWeight">
                <el-input v-model="temp.outputWeight"/>
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
            <el-table-column label="进料" align="center">
              <el-table-column label="宽度|(mm)" min-width="50px" align="center" :render-header="renderHeader">
                <template slot-scope="scope">
                  <span>{{ scope.row.inputWidth }}</span>
                </template>
              </el-table-column>
              <el-table-column label="厚度|(mm)" min-width="50px" align="center" :render-header="renderHeader">
                <template slot-scope="scope">
                  <span>{{ scope.row.inputThickness }}</span>
                </template>
              </el-table-column>
              <el-table-column label="重量|(kg)" min-width="50px" align="center" :render-header="renderHeader">
                <template slot-scope="scope">
                  <span>{{ scope.row.inputWeight }}</span>
                </template>
              </el-table-column>
            </el-table-column>

            <el-table-column label="操作条件" align="center">
              <el-table-column label="各区温度" min-width="50px" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.operationTemperatures }}</span>
                </template>
              </el-table-column>
              <el-table-column label="操作TV" min-width="50px" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.operationTv }}</span>
                </template>
              </el-table-column>
              <el-table-column label="操作速度" min-width="50px" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.operationSpeed }}</span>
                </template>
              </el-table-column>
            </el-table-column>

            <el-table-column label="时间统计" align="center">
              <el-table-column label="操作时间段" min-width="65px" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.beginTime  | parseTime('{h}:{i}') }}-{{ scope.row.endTime | parseTime('{h}:{i}') }}</span>
                </template>
              </el-table-column>
              <el-table-column label="用时|（min）" min-width="50px" align="center" :render-header="renderHeader">
                <template slot-scope="scope">
                  <span>{{ scope.row.operationSpeed }}</span>
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column label="出料" align="center">
              <el-table-column label="重量|(kg)" min-width="50px" align="center" :render-header="renderHeader">
                <template slot-scope="scope">
                  <span>{{ scope.row.outputWeight }}</span>
                </template>
              </el-table-column>
              <el-table-column label="损耗|(kg)" min-width="50px" align="center" :render-header="renderHeader">
                <template slot-scope="scope">
                  <span>{{ scope.row.outputWeightLoss }}</span>
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
    <split operation="退火炉" v-if="splitVisible" :splitVisible.sync="splitVisible"></split>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { deepClone, parseTime } from '@/utils'

  import {
    getJournalingAnnealItems,
    addJournalingAnnealItem,
    updateJournalingAnnealItem,
    deleteJournalingAnnealItem
  } from '@/api/journalingannealitem'

  import waves from '@/directive/waves' // Waves directive
  import Pagination from '@/components/Pagination/index.vue' // Secondary package based on el-pagination
  import Split from '../components/split' // Secondary package based on el-pagination
  import { getShifts } from '@/api/shift'
  import { getOutboundOrderRawItems } from '@/api/outboundorderrawitem'

  export default {
    name: 'annealItem',
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
          operationTemperatures: '',
          operationTv: '',
          operationSpeed: '',
          beginTime: '',
          endTime: '',
          outputWeight: '',
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
          operationTemperatures: [
            { required: true, message: '操作各区温度不能为空' }
          ],
          operationTv: [
            { required: true, message: '操作TV不能为空' }
          ],
          operationSpeed: [
            { required: true, message: '操作速度不能为空' }
          ],

          beginTime: [
            { required: true, message: '上机时间不能为空' }
          ],
          endTime: [
            { required: true, message: '下机时间不能为空' }
          ],
          outputWeight: [
            { required: true, message: '出料重量不能为空' }
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
          getOutboundOrderRawItems({ next_operation_label: '退火炉', status: 0 }).then(res => {
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
        getJournalingAnnealItems(this.listQuery).then(res => {
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
        this.resetForm('journalingAnnealItemForm')
        this.dialogStatus = 'create'
        // this.dialogFormVisible = true
        // this.rules.password[0].required = true
        this.$nextTick(() => {
          this.$refs['journalingAnnealItemForm'].clearValidate()
        })
      },
      submit() {
        this.$refs['journalingAnnealItemForm'].validate((valid) => {
          if (valid) {
            // const tempData = deepClone(this.temp)
            let journalingAnnealItem = deepClone(this.temp)
            delete journalingAnnealItem.shiftName
            addJournalingAnnealItem(journalingAnnealItem).then((res) => {
              let shift = this.shiftMap[journalingAnnealItem.shiftId]
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
          this.$refs['journalingAnnealItemForm'].clearValidate()
        })
      },
      updateData() {
        this.$refs['journalingAnnealItemForm'].validate((valid) => {
          if (valid) {
            let journalingAnnealItem = deepClone(this.temp)
            delete journalingAnnealItem.shiftName
            updateJournalingAnnealItem(journalingAnnealItem).then(() => {
              let shift = this.shiftMap[journalingAnnealItem.shiftId]
              journalingAnnealItem.shiftName = shift.name
              for (const v of this.list) {
                if (v.id === journalingAnnealItem.id) {
                  const index = this.list.indexOf(v)
                  this.list.splice(index, 1, journalingAnnealItem)
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
        this.$confirm('此操作将永久删除该轧机条目, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteJournalingAnnealItem(row.id).then(() => {
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
  .journaling-anneal-item {

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

