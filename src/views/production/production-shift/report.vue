<template>
  <div class="app-container journaling-report">
    <div class="filter-container">
      <el-form ref="filterForm" :model="listQuery" :inline="true">
        <el-form-item label="" prop="date">
          <el-date-picker
            v-model="listQuery.date"
            type="date"
            placeholder="请选择日期"
            style="width: 100%;"
            class="filter-item"
            clearable=""
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            @change="handleFilter"
          />
        </el-form-item>
        <el-form-item label="" prop="status">
          <el-select v-model="listQuery.status" filterable placeholder="状态" @change="handleFilter">
            <el-option
              v-for="(item,index) in statuses"
              :key="index"
              :label="item"
              :value="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="" prop="type" v-if="shiftTypes.length">
          <el-select v-model="listQuery.type" filterable placeholder="请选择生产班类型" @change="handleFilter">
            <el-option
              v-for="(item,index) in shiftTypes"
              :key="index"
              :label="item"
              :value="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
        <el-button v-waves class="filter-item" @click="resetForm('filterForm');handleFilter()">重置</el-button>
        <el-button v-if="shiftLeaders.includes(listQuery.role)" class="filter-item" style="margin-left: 10px;"
                   type="success"
                   icon="el-icon-edit" @click="handleAdd">
          添加
        </el-button>
        <el-form-item label="" prop="role" v-if="shiftRoles.length">
          <!--          <el-radio-group v-model="listQuery.role">
                      <el-radio v-for="(item,index) in shiftRoles"
                                :key="index"
                                :label="item.code"
                      >{{item.name}}</el-radio>
                    </el-radio-group>-->
          <el-select v-model="listQuery.role" filterable placeholder="请选择自身角色" @change="handleFilter">
            <el-option
              v-for="(item,index) in shiftRoles"
              :key="index"
              :label="item.name"
              :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>

        <el-button class="filter-item" style="margin-left: 10px;" type="warning"
                   icon="el-icon-data-line" @click="handleApprove">
          审核通过
        </el-button>
      </el-form>
    </div>
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border fit highlight-current-row
      ref="selectWorkOrder"
      @select="handleSelect"
      @select-all="handleSelectAll"
      @current-change="handleCurrentChange"
    >
      <!--        <el-table-column label="序" min-width="40px" type="index" align="center">
              </el-table-column>-->
      <el-table-column
        type="selection"
        width="55px">
      </el-table-column>

      <el-table-column label="日期" min-width="80px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.date | parseTime('{y}-{m}-{d}')}}</span>
        </template>
      </el-table-column>
      <el-table-column label="班别" min-width="80px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.shiftName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="类型" min-width="80px" align="center">
        <template slot-scope="scope">
          <span>{{ ['重卷', '轧机', '退火炉', '精整拉矫'][scope.row.type] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="生产钢卷数" min-width="80px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.producedCoilNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column label="进料总重量(kg)" min-width="80px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.totalInputWeight }}</span>
        </template>
      </el-table-column>
      <el-table-column label="损耗总重量(kg)" min-width="80px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.totalLossWeight }}</span>
        </template>
      </el-table-column>
      <el-table-column label="出料总重量(kg)" min-width="80px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.totalOutputWeight }}</span>
        </template>
      </el-table-column>

      <el-table-column label="产出率" min-width="80px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.outputRate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="设备使用率(%)" min-width="80px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.capacityUtilization }}</span>
        </template>
      </el-table-column>
      <el-table-column label="应到人数" min-width="80px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.expectedAttendanceNum }}</span>
        </template>
      </el-table-column>
      <el-table-column label="实到人数" min-width="80px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.actualAttendanceNum }}</span>
        </template>
      </el-table-column>
      <!--
            <el-table-column label="问题记录" min-width="80px" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.mattersRecord }}</span>
              </template>
            </el-table-column>
            <el-table-column label="交接班事宜" min-width="80px" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.shiftHandover }}</span>
              </template>
            </el-table-column>
      -->

      <el-table-column label="报表状态" min-width="80px" align="center">
        <template slot-scope="scope">
          <el-tag :type="translateStatus(scope.row.status).tagType" style="margin:0 5px;">
            {{ translateStatus(scope.row.status).text}}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column v-if="shiftLeaders.includes(listQuery.role)" label="操作" align="center" min-width="80">
        <template slot-scope="scope">
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
               width="600px">
      <el-form
        ref="reportForm"
        :rules="rules"
        :model="temp"
        label-position="right"
        label-width="150px"
      >
        <el-form-item label="日期：" prop="date">
          <el-date-picker v-model="temp.date" type="date" placeholder="请选择日期" style="width: 100%;"
                          format="yyyy-MM-dd"
                          value-format="yyyy-MM-dd"/>
        </el-form-item>
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

        <el-form-item label="设备使用率(%)：" prop="capacityUtilization">
          <el-input v-model="temp.capacityUtilization"/>
        </el-form-item>
        <el-form-item label="应到人数：" prop="expectedAttendanceNum">
          <el-input v-model.number="temp.expectedAttendanceNum"/>
        </el-form-item>
        <el-form-item label="实际出勤人员：" prop="actualAttendanceVal">
          <el-select
            v-model="temp.actualAttendanceVal"
            multiple
            filterable
            remote
            placeholder="请输入姓名或工号"
            :remote-method="getStaff"
            :loading="loading"
            @change="handleAttendanceChange"
          >
            <el-option
              v-for="item in staff"
              :key="item.id"
              :label="item.label"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="问题记录：" prop="mattersRecord">
          <el-input type="textarea" v-model="temp.mattersRecord"/>
        </el-form-item>
        <el-form-item label="交接班事宜：" prop="shiftHandover">
          <el-input type="textarea" v-model="temp.shiftHandover"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" size="small" @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" size="small" @click="dialogStatus==='create'?submit():updateData()">确认</el-button>
      </div>
    </el-dialog>
    <report-detail v-if="currentReport" :detail="currentReport" :activeName.sync="currentActiveTabName"
                   :key="JSON.stringify(currentReport)"/>

  </div>
</template>

<script>
  import permission from '@/directive/permission/index.js' // 权限判断指令
  import { mapGetters } from 'vuex'
  import { deepClone, parseTime } from '@/utils'

  import waves from '@/directive/waves' // Waves directive
  import Pagination from '@/components/Pagination/index.vue'
  import ReportDetail from './report-detail.vue'
  import {
    addJournalingProductionShiftReport,
    getJournalingProductionShiftReports,
    updateJournalingProductionShiftReport,
    deleteJournalingProductionShiftReport
  } from '@/api/journalingproductionshiftreport'
  import { getShifts } from '@/api/shift'
  import { getUsers } from '@/api/system'

  export default {
    name: 'productionShiftReport',
    components: { Pagination, ReportDetail },
    directives: { waves, permission },

    data() {
      return {
        tableKey: 0,
        list: [],
        total: 0,
        listLoading: true,
        listQuery: {
          current: 1,
          size: 10,
          date: '',
          shiftId: '',
          createPerson: undefined,
          status: undefined,
          type: undefined,
          role: undefined
          /*orders: ['code desc']*/
        },
        temp: {
          id: null,
          date: null,
          shiftId: null,
          producedCoilNumber: null,
          totalInputWeight: null,
          totalLossWeight: null,
          totalOutputWeight: null,
          outputRate: null,
          capacityUtilization: null,
          expectedAttendanceNum: null,
          // status: undefined,
          actualAttendanceNum: null,
          actualAttendance: null,
          actualAttendanceVal: [],
          shiftLeader: null,
          shiftLeaderName: null,
          supervisor: null,
          supervisorName: null,
          inspector: null,
          inspectorName: null,
          mattersRecord: null,
          shiftHandover: null
        },
        tempCopy: null,
        statuses: ['新建', '班长已审核', '科长已审核', '厂长已审核'],
        tagTypes: ['success', 'info', 'warning', 'danger'],
        loading: false,
        staff: [],
        users: [],
        userMap: null,
        shifts: [],
        shiftMap: null,
        shiftRoles: [],
        shiftTypes: [],
        shiftLeaders: ['CJBZ', 'ZJBZ', 'THBZ', 'JZBZ'],
        sectionChiefs: ['CJKZ', 'ZJKZ', 'THKZ', 'JZKZ'],
        currentReport: undefined,
        selectedReport: {
          id: null,
          date: null,
          shiftId: null,
          producedCoilNumber: null,
          totalInputWeight: null,
          totalLossWeight: null,
          totalOutputWeight: null,
          outputRate: null,
          capacityUtilization: null,
          expectedAttendanceNum: null,
          // status: undefined,
          actualAttendanceNum: null,
          actualAttendance: null,
          actualAttendanceVal: [],
          shiftLeader: null,
          shiftLeaderName: null,
          supervisor: null,
          supervisorName: null,
          inspector: null,
          inspectorName: null,
          mattersRecord: null,
          shiftHandover: null
        },
        selectedReportCopy: null,
        currentActiveTabName: 'detail',
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: '编辑',
          create: '创建'
        },
        rules: {
          date: [
            { required: true, trigger: 'blur', message: '请选择日期' }
          ],
          shiftId: [
            { required: true, trigger: 'blur', message: '请选择班别' }
          ],

          capacityUtilization: [
            { required: true, message: '设备使用率不能为空' }
          ],
          expectedAttendanceNum: [
            { required: true, message: '应到人数不能为空' },
            { type: 'number', message: '应到人数必须为数字值' }
          ],
          actualAttendanceNum: [
            { required: true, message: '实到人数不能为空' },
            { type: 'number', message: '实到人数必须为数字值' }
          ],
          actualAttendanceVal: [
            { required: true, trigger: 'blur', message: '出勤人员不能为空' }
          ]
        }
      }
    },
    computed: {
      ...mapGetters([
        'id',
        'name',
        'roles'
      ])
    },
    watch: {
      'listQuery.role': {
        handler: async function(val) {
          const index1 = this.shiftLeaders.indexOf(val)
          const index2 = this.sectionChiefs.indexOf(val)
          if (index1 != -1 || index2 != -1) {
            this.shiftTypes = []
            this.listQuery.type = index1 + index2 + 1
            this.listQuery.createPerson = this.id
          } else {
            this.shiftTypes = ['重卷生产班', '轧机生产班', '退火炉生产班', '精整拉矫生产班']
            this.listQuery.type = 0
            this.listQuery.createPerson = ''
          }
        },
        immediate: true
      }
    },
    created() {
      this.tempCopy = deepClone(this.temp)
      this.selectedReportCopy = deepClone(this.selectedReport)
      const isShiftLeaderArr = [
        this.roles.includes('CJBZ'),
        this.roles.includes('ZJBZ'),
        this.roles.includes('THBZ'),
        this.roles.includes('JZBZ'),
        this.roles.includes('CJKZ'),
        this.roles.includes('ZJKZ'),
        this.roles.includes('THKZ'),
        this.roles.includes('JZKZ')
      ]
      const isInspector = this.roles.includes('CZ')
      let shiftRoles = [
        { code: 'CJBZ', name: '重卷班长', type: 0 },
        { code: 'ZJBZ', name: '轧机班长', type: 1 },
        { code: 'THBZ', name: '退火班长', type: 2 },
        { code: 'JZBZ', name: '精整班长', type: 3 },
        { code: 'CJKZ', name: '重卷科长', type: 0 },
        { code: 'ZJKZ', name: '轧机科长', type: 1 },
        { code: 'THKZ', name: '退火科长', type: 2 },
        { code: 'JZKZ', name: '精整科长', type: 3 },
        { code: 'CZ', name: '呈阅' }]
      const shiftRoleBoolArr = [...isShiftLeaderArr, isInspector]
      shiftRoles = shiftRoles.filter((item, index) => shiftRoleBoolArr[index])
      if (shiftRoles.length > 1) {
        this.shiftRoles = shiftRoles
      }
      this.listQuery.role = shiftRoles[0].code
      this.listQuery.type = shiftRoles[0].type
      this.listLoading = true
      this.$nextTick(async() => {
        await this.getShifts({})
        await this.getUsers({})
        this.getList()
      })
    },
    methods: {
      handleSelect(selection, row) {
        //clearSelection：用于多选表格，清空用户的选择
        //此时所有的checkbox处于未勾选，当用户第一次点击的时候，selection为一个数组，里面存放的为当前这一行的数据
        this.$refs.selectWorkOrder.clearSelection()
        //此时selection仍然有值 ，只是勾选状态不显示了。
        if (selection.length === 0) {
          this.selectedReport = this.selectedReportCopy
          return
        }
        //这这里将这行的状态又变为了勾选
        this.$refs.selectWorkOrder.toggleRowSelection(row, true)
        //用于多选表格，切换某一行的选中状态，如果使用了第二个参数，则是设置这一行选中与否（selected 为 true 则选中）
        this.selectedReport = row
      },
      handleSelectAll(selection) {
        this.$refs.selectWorkOrder.clearSelection()
        this.selectedReport = this.selectedReportCopy
      },

      async getShifts(query) {
        const res = await getShifts(query)
        this.shifts = res.queryResult.list
        this.shiftMap = _.fromPairs(this.shifts.map(shift => {
          return [shift.id, shift]
        }))
      },
      async getUsers(query) {
        const res = await getUsers(query)
        this.users = res.queryResult.list.map(item => {
          item.label = item.staffId + '/' + item.name
          return item
        })
        this.userMap = _.fromPairs(this.users.map(user => {
          return [user.id, user]
        }))
      },
      getStaff(query) {
        if (query !== '') {
          this.loading = true
          setTimeout(() => {
            this.loading = false
            this.staff = this.users.filter(item => {
              return (item.name.toLowerCase()
                .indexOf(query.toLowerCase()) > -1) || (item.staffId.toLowerCase()
                .indexOf(query.toLowerCase()) > -1)
            })
          }, 100)
        } else {
          this.staff = []
        }
      },
      getList() {
        this.listLoading = true
        getJournalingProductionShiftReports(this.listQuery).then(res => {
          this.list = res.queryResult.list.map(item => {
            let shift = this.shiftMap[item.shiftId]
            item.shiftName = shift.name
            try {
              item.actualAttendanceVal = JSON.parse(item.actualAttendance).map(
                item => item.staffId + '/' + item.name
              )
            } catch (e) {
              item.actualAttendanceVal = []
            }
            return item
          })
          this.total = res.queryResult.total
          this.listLoading = false
        })
      },
      handleAttendanceChange(val) {
        if (val) {
          this.temp.actualAttendanceNum = val.length
          let attendance = val.map((item, index) => {
            if (!item.includes('/')) {
              return {
                id: item,
                staffId: this.userMap[item].staffId,
                name: this.userMap[item].name
              }
            }
            let actualAttendance = JSON.parse(this.temp.actualAttendance)
            const arr = item.split('/')
            for (let i = 0; i < actualAttendance.length; i++) {
              if (actualAttendance[i].staffId == arr[0]) {
                return actualAttendance[i]
              }
            }
          })
          attendance = _.uniqWith(attendance, _.isEqual)
          this.temp.actualAttendance = JSON.stringify(attendance)
          this.temp.actualAttendanceVal = attendance.map(item => item.staffId + '/' + item.name)
          if (this.currentReport) {
            this.currentReport.actualAttendanceLabel = this.temp.actualAttendanceVal
          }
        }
      },
      handleCurrentChange(val) {
        if (val) {
          this.currentReport = deepClone(val)
          this.currentReport.actualAttendanceLabel = JSON.parse(val.actualAttendance).map(
            item => item.staffId + '/' + item.name
          )
        }
      },
      handleFilter() {
        this.listQuery.current = 1
        this.getList()
      }
      ,
      translateStatus(status) {
        return {
          tagType: this.tagTypes[status],
          text: this.statuses[status]
        }
      }
      ,
      resetForm(formName) {
        if (this.$refs[formName] === undefined) {
          return false
        }
        this.$refs[formName].resetFields()

        this.temp = deepClone(this.tempCopy)
      }
      ,
      handleAdd() {
        this.resetForm('reportForm')
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        // this.rules.password[0].required = true
        this.$nextTick(() => {
          this.$refs['reportForm'].clearValidate()
        })
      },
      submit() {
        this.$refs['reportForm'].validate((valid) => {
          if (valid) {
            // const tempData = deepClone(this.temp)
            let report = deepClone(this.temp)
            const index = this.shiftLeaders.indexOf(this.listQuery.role)
            if (index != -1) {
              report.type = index
            }
            const actualAttendanceVal = deepClone(report.actualAttendanceVal)
            delete report.actualAttendanceVal
            addJournalingProductionShiftReport(report).then((res) => {
              let shift = this.shiftMap[res.model.shiftId]
              res.model.shiftName = shift.name
              res.model.actualAttendanceVal = actualAttendanceVal
              this.list.unshift(res.model)
              this.total++
              // this.handleUpdate(res.model)
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
      }
      ,
      handleApprove() {
        if (!this.selectedReport.id) {
          this.$message({
            message: '请选择一条报告单',
            type: 'warning'
          })
          return
        }
        const r = {
          id: this.selectedReport.id,
          date: this.selectedReport.date,
          shiftId: this.selectedReport.shiftId,
          shiftLeader: this.shiftLeaders.includes(this.listQuery.role) ? this.id : null,
          supervisor: this.sectionChiefs.includes(this.listQuery.role) ? this.id : null,
          inspector: this.listQuery.role == 'CZ' ? this.id : null,
          type: this.listQuery.type
        }
        updateJournalingProductionShiftReport(r).then((res) => {
          for (const v of this.list) {
            if (v.id === r.id) {
              const index = this.list.indexOf(v)
              if (!this.selectedReport.shiftLeader && r.shiftLeader) {
                this.selectedReport.shiftLeader = this.id
                this.selectedReport.shiftLeaderName = this.name
                this.selectedReport.status = 1
              }
              if (!this.selectedReport.supervisor && r.supervisor) {
                this.selectedReport.supervisor = this.id
                this.selectedReport.supervisorName = this.name
                this.selectedReport.status = 2
              }
              if (!this.selectedReport.inspector && r.inspector) {
                this.selectedReport.inspector = this.id
                this.selectedReport.inspectorName = this.name
                this.selectedReport.status = 3
              }
              this.list.splice(index, 1, this.selectedReport)
              break
            }

            /*            if(this.currentReport.id==this.selectedReport.id){
                          this.currentReport = this.selectedReport
                        }*/
          }
          this.$notify({
            title: '成功',
            message: '签审成功',
            type: 'success',
            duration: 2000
          })
        })
      }
      ,
      handleUpdate(row) {
        if (row.status != 0) {
          this.$message({
            message: this.translateStatus(row.status).text + '报表不能编辑',
            type: 'warning'
          })
          return
        }
        this.dialogStatus = 'update'
        // this.rules.password[0].required = false
        this.temp = deepClone(row) // copy obj
        // this.temp.password = ''
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['reportForm'].clearValidate()
        })
      }
      ,
      updateData() {
        this.$refs['reportForm'].validate((valid) => {
          if (valid) {
            let report = deepClone(this.temp)
            const actualAttendanceVal = deepClone(report.actualAttendanceVal)
            delete report.actualAttendanceVal
            updateJournalingProductionShiftReport(report).then(() => {
              for (const v of this.list) {
                if (v.id === report.id) {
                  const index = this.list.indexOf(v)
                  report.actualAttendanceVal = actualAttendanceVal
                  this.list.splice(index, 1, report)
                  break
                }
              }
              /*             if(report.id==this.selectedReport.id){
                             this.currentReport = report
                           }*/
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
      }
      ,
      handleDelete(row) {
        if (row.status > 1) {
          this.$message({
            message: this.translateStatus(row.status).text + '报表不能删除',
            type: 'warning'
          })
          return
        }
        this.$confirm('此操作将永久删除该报表, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteJournalingProductionShiftReport(row.id).then(() => {
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
  .journaling-report {

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


