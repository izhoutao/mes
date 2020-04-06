<template>
  <div class="app-container journaling-rewind-item">
    <div>
      <!--      <div style="font-size: 20px;">{{textMap[dialogStatus]}}报工</div>-->

      <el-form
        ref="journalingRewindItemForm"
        :rules="rules"
        :model="temp"
        label-position="right"
        label-width="150px"
      >

        <el-row :gutter="40">
          <el-col :span="8">
            <el-form-item label="日期：" prop="date">
              <el-date-picker v-model="temp.date" type="date" placeholder="请选择日期" style="width: 100%;"
                              format="yyyy 年 MM 月 dd 日"
                              value-format="yyyy-MM-dd"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
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
          <el-col :span="8">
            <el-form-item label="钢卷编号：" prop="productNumber">
              <el-select
                v-model="temp.productNumber"
                filterable
                remote
                reserve-keyword
                placeholder="请输入钢卷号"
                :remote-method="getPendingRawItems"
                :loading="loading">
                <el-option
                  v-for="item in pendingRawItems"
                  :key="item"
                  :label="item"
                  :value="item">
                </el-option>
              </el-select>

            </el-form-item>

          </el-col>

        </el-row>
        <el-row :gutter="40">
          <el-col :span="8">
            <el-form-item label="进料厚度(mm)：" prop="inputThickness">
              <el-input v-model.number="temp.inputThickness"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="进料重量(kg)：" prop="inputWeight">
              <el-input v-model.number="temp.inputWeight"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="生产速度(m/min)：" prop="processVelocity">
              <el-input v-model.number="temp.processVelocity"/>
            </el-form-item>
          </el-col>

        </el-row>

        <el-row :gutter="40">
          <el-col :span="8">
            <el-form-item label="焊机电流：" prop="welderCurrent">
              <el-input v-model.number="temp.welderCurrent"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="焊机速度：" prop="welderVelocity">
              <el-input v-model.number="temp.welderVelocity"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
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
        </el-row>
        <el-row :gutter="40">
          <el-col :span="8">
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
          <el-col :span="8">
            <el-form-item label="出料重量(kg)：" prop="outputWeight">
              <el-input v-model.number="temp.outputWeight"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="出料长度(m)：" prop="outputLength">
              <el-input v-model.number="temp.outputLength"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="损耗原因：" prop="lossReason">
              <el-input v-model="temp.lossReason"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div style="margin: 10px 0px 20px;display: flex;flex-direction: row;justify-content: center;align-items: center;">
        <el-button type="danger" style="width: 30%;" @click="dialogStatus==='create'?submit():updateData()">提交
        </el-button>
        <!--        <el-button type="danger" size="small" @click="dialogFormVisible = false">取消</el-button>-->
      </div>
    </div>

    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <div style="font-size: 20px;">报工记录</div>
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
          <el-table-column label="序号" min-width="40px" type="index" align="center">
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
          <el-table-column label="产地" min-width="80px" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.hotRollOrigin }}</span>
            </template>
          </el-table-column>

          <el-table-column label="进料" align="center">
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

          <el-table-column label="生产参数" align="center">
            <el-table-column label="速度|(m/min)" min-width="50px" align="center" :render-header="renderHeader">
              <template slot-scope="scope">
                <span>{{ scope.row.processVelocity }}</span>
              </template>
            </el-table-column>
            <el-table-column label="焊机参数" align="center">
              <el-table-column label="电流" min-width="50px" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.welderCurrent }}</span>
                </template>
              </el-table-column>
              <el-table-column label="速度" min-width="50px" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.welderVelocity }}</span>
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column label="上下机时间" min-width="65px" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.beginTime  | parseTime('{h}:{i}') }}-{{ scope.row.endTime | parseTime('{h}:{i}') }}</span>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="出料" align="center">
            <el-table-column label="重量|(kg)" min-width="50px" align="center" :render-header="renderHeader">
              <template slot-scope="scope">
                <span>{{ scope.row.outputWeight }}</span>
              </template>
            </el-table-column>
            <el-table-column label="长度|(m)" min-width="50px" align="center" :render-header="renderHeader">
              <template slot-scope="scope">
                <span>{{ scope.row.outputLength }}</span>
              </template>
            </el-table-column>
            <el-table-column label="损耗原因" min-width="50px" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.lossReason }}</span>
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
</template>

<script>
  import { mapGetters } from 'vuex'
  import { deepClone, parseTime } from '@/utils'

  import {
    getJournalingRewindItems,
    addJournalingRewindItem,
    updateJournalingRewindItem,
    deleteJournalingRewindItem
  } from '@/api/journalingrewinditem'

  import waves from '@/directive/waves' // Waves directive
  import Pagination from '@/components/Pagination/index.vue' // Secondary package based on el-pagination
  import { getShifts } from '@/api/shift'
  import { getOutboundOrderRawItems } from '@/api/outboundorderrawitem'

  export default {
    name: 'rewindItem',
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
          //journalingBeginTime: parseTime(new Date(new Date(new Date().toLocaleDateString()).getTime()), '{y}-{m}-{d}T{h}:{i}:{s}'),
          //journalingEndTime: parseTime(new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1), '{y}-{m}-{d}T{h}:{i}:{s}')
          journalingBeginTime: undefined,
          journalingEndTime: undefined,
          createPerson: '',
          // shiftId: '',
          // date: parseTime(new Date(),'{y}-{m}-{d} {h}:{i}:{s}')
        },
        temp: {
          id: undefined,
          productNumber: '',
/*          steelGrade: '',
          hotRollOrigin: '',*/
          inputThickness: '',
          inputWeight: '',
          processVelocity: '',
          welderCurrent: '',
          welderVelocity: '',
          beginTime: undefined,
          endTime: undefined,
          outputWeight: '',
          outputLength: '',
          lossReason: '',
          shiftId: '',
          date: parseTime(new Date(),'{y}-{m}-{d}T{h}:{i}:{s}')
        },
        tempCopy: null,
        pendingRawItems: [],
        loading: false,
        shifts: [],
        shiftMap: null,

        // dialogFormVisible: false,
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
          inputThickness: [
            { required: true, message: '进料厚度不能为空' },
            { type: 'number', message: '进料厚度必须为数字值' }
          ],
          inputWeight: [
            { required: true, message: '进料重量不能为空' },
            { type: 'number', message: '进料重量必须为数字值' }
          ],
          processVelocity: [
            { required: true, message: '生产速度不能为空' },
            { type: 'number', message: '生产速度必须为数字值' }
          ],
          welderCurrent: [
            { required: true, message: '焊机电流不能为空' },
            { type: 'number', message: '焊机电流必须为数字值' }
          ],
          welderVelocity: [
            { required: true, message: '焊机速度不能为空' },
            { type: 'number', message: '焊机速度必须为数字值' }
          ],
          beginTime: [
            { required: true, message: '上机时间不能为空' }
          ],
          endTime: [
            { required: true, message: '下机时间不能为空' }
          ],
          outputWeight: [
            { required: true, message: '出料重量不能为空' },
            { type: 'number', message: '出料重量必须为数字值' }
          ],
          outputLength: [
            { required: true, message: '出料长度不能为空' },
            { type: 'number', message: '出料长度必须为数字值' }
          ],
          lossReason: [
            { required: true, message: '损耗原因不能为空' }
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
            return timeStr >= shift.beginTime && timeStr <= Number(shift.endTime.slice(0, 2)) + 24 + shift.endTime.slice(2)
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
      getPendingRawItems(query) {
        if (query !== '') {
          this.loading = true
          getOutboundOrderRawItems({ next_operation_label: '重卷', next_operation_status: 0  }).then(res => {
            this.loading = false
            this.pendingRawItems = res.queryResult.list.map(item => item.productNumber).filter(item => {
              return item.toLowerCase()
                .indexOf(query.toLowerCase()) > -1
            })
          })
        } else {
          this.pendingRawItems = []
        }
      },
      getList() {
        this.listLoading = true
        getJournalingRewindItems(this.listQuery).then(res => {
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
        this.resetForm('journalingRewindItemForm')
        this.dialogStatus = 'create'
        // this.dialogFormVisible = true
        // this.rules.password[0].required = true
        this.$nextTick(() => {
          this.$refs['journalingRewindItemForm'].clearValidate()
        })
      },
      submit() {
        this.$refs['journalingRewindItemForm'].validate((valid) => {
          if (valid) {
            // const tempData = deepClone(this.temp)
            let journalingRewindItem = deepClone(this.temp)
            delete journalingRewindItem.shiftName
            addJournalingRewindItem(journalingRewindItem).then((res) => {
              let shift = this.shiftMap[journalingRewindItem.shiftId]
              res.model.shiftName = shift.name
              this.list.unshift(res.model)
              this.total++
              this.pendingRawItems = []
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
          this.$refs['journalingRewindItemForm'].clearValidate()
        })
      },
      updateData() {
        this.$refs['journalingRewindItemForm'].validate((valid) => {
          if (valid) {
            let journalingRewindItem = deepClone(this.temp)
            delete journalingRewindItem.shiftName
            updateJournalingRewindItem(journalingRewindItem).then(() => {
              let shift = this.shiftMap[journalingRewindItem.shiftId]
              journalingRewindItem.shiftName = shift.name
              for (const v of this.list) {
                if (v.id === journalingRewindItem.id) {
                  const index = this.list.indexOf(v)
                  this.list.splice(index, 1, journalingRewindItem)
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
        this.$confirm('此操作将永久删除该子订单, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteJournalingRewindItem(row.id).then(() => {
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
  .journaling-rewind-item {

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

