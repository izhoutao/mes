<template>
  <el-tabs :value="activeName" @tab-click="handleClick">
    <el-tab-pane label="生产班详情" name="detail">
      <el-form label-width="125px" label-position="right" class="report-detail-container">
        <el-row>
          <el-col :span="4">
            <el-form-item label="日期：" prop="date">
              <span>{{detail.date | parseTime('{y}-{m}-{d}')}} </span>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="班别：" prop="shiftName">
              <span>{{detail.shiftName}} </span>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="研磨轧辊数：" prop="grindRollNumber">
              <span>{{detail.grindRollNumber}} </span>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="总研磨量mm：" prop="totalGrindAmount">
              <span>{{detail.totalGrindAmount}} </span>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="抛光辊数量：" prop="polishedRollerNumber">
              <span>{{detail.polishedRollerNumber}} </span>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="异常辊数量：" prop="abnormalRollerNumber">
              <span>{{detail.abnormalRollerNumber}} </span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>


          <el-col :span="4">
            <el-form-item label="组装轧辊数量：" prop="assembledRollNumber">
              <span>{{detail.assembledRollNumber}} </span>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="应到人数：" prop="expectedAttendanceNum">
              <span>{{detail.expectedAttendanceNum}} </span>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="实到人数：" prop="actualAttendanceNum">
              <span>{{detail.actualAttendanceNum}} </span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="出勤姓名：" prop="actualAttendance">
              <span>{{detail.actualAttendanceLabel}} </span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="问题记录：" prop="mattersRecord">
              <span>{{detail.mattersRecord}} </span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="交接班事宜：" prop="shiftHandover">
              <span>{{detail.shiftHandover}} </span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="班长：" prop="shiftLeaderName">
              <span>{{detail.shiftLeaderName}} </span>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="主管：" prop="supervisorName">
              <span>{{detail.supervisorName}} </span>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="呈阅：" prop="inspectorName">
              <span>{{detail.inspectorName}} </span>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="报表状态：" prop="shiftHandover">
              <span>{{statuses[detail.status]}} </span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="创建时间：" prop="updateTime">
              <span>{{detail.createTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}} </span>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="最后更新时间：" prop="updateTime">
              <span>{{detail.updateTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}} </span>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="创建人：" prop="createPerson">
              <span>{{detail.createPerson }} </span>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="最后更新人：" prop="updatePerson">
              <span>{{detail.updatePerson }} </span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-tab-pane>
    <el-tab-pane label="生产明细" name="items">
      <report-detail-item :key="detail.id" :detail="detail"/>
    </el-tab-pane>
  </el-tabs>
</template>
<script>
  import ReportDetailItem from './report-detail-item' // Secondary package based on el-pagination
  import { parseTime } from '@/utils'

  export default {
    name: 'ReportDetail',
    components: { ReportDetailItem },
    props: ['detail', 'activeName'],
    data() {
      return {
        statuses: ['新建', '班长已审核', '科长已审核', '厂长已审核']
      }
    },
    methods: {
      handleClick(tab, event) {
        // console.log(tab.paneName)
        this.$emit('update:activeName', tab.paneName)
      }
    }
  }
</script>
<style lang="scss">
  .report-detail-container {

  .el-form-item {
    margin: 0px 5px;
  }

  .el-col {
    border: 1px solid #EBEEF5;
    .el-form-item__label{
      border-right: 1px solid #EBEEF5;
    }
    .el-form-item__content{
      text-align: center;
    }
  }

  }
</style>
