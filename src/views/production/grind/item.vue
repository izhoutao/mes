<template>
  <div class="app-container journaling-rewind-item">
    <div>
      <el-form
        ref="journalingGrindItemForm"
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
            <el-form-item label="辊号：" prop="rollerNumber">
              <el-input v-model="temp.rollerNumber"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="种类：" prop="type">
              <el-input v-model="temp.type"/>
            </el-form-item>
          </el-col>

        </el-row>


        <el-row>
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
            <el-form-item label="磨前外径：" prop="outerDiameterBeforeGrinding">
              <el-input v-model="temp.outerDiameterBeforeGrinding"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="磨前情况说明：" prop="descriptionBeforeGrinding">
              <el-input v-model="temp.descriptionBeforeGrinding"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
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
          <el-col :span="6">
            <el-form-item label="磨后外径：" prop="outerDiameterAfterGrinding">
              <el-input v-model="temp.outerDiameterAfterGrinding"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="磨工：" prop="grinder">
              <el-input v-model="temp.grinder"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div
        style="margin: 10px 0px 20px;display: flex;flex-direction: row;justify-content: center;align-items: center;">
        <el-button type="danger" style="width: 30%;" @click="dialogStatus==='create'?submit():updateData()">提交
        </el-button>
      </div>
    </div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span style="font-size: 20px;">报工记录</span>
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
          <el-table-column label="辊号" min-width="80px" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.rollerNumber }}</span>
            </template>
          </el-table-column>
          <el-table-column label="种类" min-width="80px" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.type }}</span>
            </template>
          </el-table-column>

          <el-table-column label="磨前状况" align="center">
            <el-table-column label="上机时间" min-width="65px" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.beginTime  | parseTime('{h}:{i}') }}</span>
              </template>
            </el-table-column>

            <el-table-column label="磨前外径" min-width="50px" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.outerDiameterBeforeGrinding }}</span>
              </template>
            </el-table-column>
            <el-table-column label="磨前情况说明" min-width="50px" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.descriptionBeforeGrinding }}</span>
              </template>
            </el-table-column>
          </el-table-column>

          <el-table-column label="磨后状况" align="center">
            <el-table-column label="下机时间" min-width="65px" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.endTime  | parseTime('{h}:{i}') }}</span>
              </template>
            </el-table-column>
            <el-table-column label="磨后外径" min-width="50px" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.outerDiameterAfterGrinding }}</span>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="磨工" min-width="50px" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.grinder }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" min-width="60">
            <template slot-scope="scope">
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
    getJournalingGrindItems,
    addJournalingGrindItem,
    updateJournalingGrindItem,
    deleteJournalingGrindItem
  } from '@/api/journalinggrinditem'

  import waves from '@/directive/waves' // Waves directive
  import Pagination from '@/components/Pagination/index.vue' // Secondary package based on el-pagination
  import Split from '../components/split' // Secondary package based on el-pagination
  import { getShifts } from '@/api/shift'
  import { getOutboundOrderRawItems } from '@/api/outboundorderrawitem'

  export default {
    name: 'grindItem',
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
          rollerNumber: '',
          type: '',
          beginTime: '',
          outerDiameterBeforeGrinding: '',
          descriptionBeforeGrinding: '',
          endTime: '',
          outerDiameterAfterGrinding: '',
          grinder: '',
          shiftId: '',
          date: parseTime(new Date(), '{y}-{m}-{d}T{h}:{i}:{s}'),
          status: ''
        },
        tempCopy: null,
        shifts: [],
        shiftMap: null,
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
          rollerNumber: [
            { required: true, message: '辊号不能为空' }
          ],
          type: [
            { required: true, message: '种类不能为空' }
          ],
          beginTime: [
            { required: true, message: '上机时间不能为空' }
          ],
          outerDiameterBeforeGrinding: [
            { required: true, message: '磨前外径不能为空' }
          ],
          descriptionBeforeGrinding: [
            { required: true, message: '磨前情况说明不能为空' }
          ],
          endTime: [
            { required: true, message: '下机时间不能为空' }
          ],
          outerDiameterAfterGrinding: [
            { required: true, message: '磨后外径不能为空' }
          ],
          grinder: [
            { required: true, message: '磨工不能为空' }
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
      getList() {
        this.listLoading = true
        getJournalingGrindItems(this.listQuery).then(res => {
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
        this.resetForm('journalingGrindItemForm')
        this.dialogStatus = 'create'
        // this.dialogFormVisible = true
        // this.rules.password[0].required = true
        this.$nextTick(() => {
          this.$refs['journalingGrindItemForm'].clearValidate()
        })
      },
      submit() {
        this.$refs['journalingGrindItemForm'].validate((valid) => {
          if (valid) {
            // const tempData = deepClone(this.temp)
            let journalingGrindItem = deepClone(this.temp)
            delete journalingGrindItem.shiftName
            addJournalingGrindItem(journalingGrindItem).then((res) => {
              let shift = this.shiftMap[journalingGrindItem.shiftId]
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
          this.$refs['journalingGrindItemForm'].clearValidate()
        })
      },
      updateData() {
        this.$refs['journalingGrindItemForm'].validate((valid) => {
          if (valid) {
            let journalingGrindItem = deepClone(this.temp)
            delete journalingGrindItem.shiftName
            updateJournalingGrindItem(journalingGrindItem).then(() => {
              let shift = this.shiftMap[journalingGrindItem.shiftId]
              journalingGrindItem.shiftName = shift.name
              for (const v of this.list) {
                if (v.id === journalingGrindItem.id) {
                  const index = this.list.indexOf(v)
                  this.list.splice(index, 1, journalingGrindItem)
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
        this.$confirm('此操作将永久删除该报工项, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteJournalingGrindItem(row.id).then(() => {
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

