<template>
  <el-tabs :value="activeName" @tab-click="handleClick">
    <el-tab-pane label="生产班详情" name="first">
      <el-form label-width="150px">
        <el-row>
          <el-col :span="6">
            <el-form-item label="日期：" prop="date">
              <el-date-picker
                :value="detail.date"
                type="datetime"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                :disabled="true"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="班别：" prop="shiftName">
              <el-input :value="detail.shiftName" :disabled="true"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="生产钢卷数：" prop="producedCoilNumber">
              <el-input :value="detail.producedCoilNumber" :disabled="true"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="进料总重量(kg)：" prop="totalInputWeight">
              <el-input :value="detail.totalInputWeight" :disabled="true"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="损耗总重量(kg)：" prop="totalLossWeight">
              <el-input :value="detail.totalLossWeight" :disabled="true"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="出料总重量(kg)：" prop="totalOutputWeight">
              <el-input :value="detail.totalOutputWeight" :disabled="true"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="产出率(kg)：" prop="outputRate">
              <el-input :value="detail.outputRate" :disabled="true"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="设备使用率(kg)：" prop="capacityUtilization">
              <el-input :value="detail.capacityUtilization" :disabled="true"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="应到人数：" prop="expectedAttendanceNum">
              <el-input :value="detail.expectedAttendanceNum" :disabled="true"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="实到人数：" prop="actualAttendanceNum">
              <el-input :value="detail.actualAttendanceNum" :disabled="true"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="出勤姓名：" prop="actualAttendanceName">
              <el-input :value="detail.actualAttendanceName" :disabled="true"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="问题记录：" prop="mattersRecord">
              <el-input  type="textarea" :rows="2" :value="detail.mattersRecord" :disabled="true"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="交接班事宜：" prop="shiftHandover">
              <el-input  type="textarea" :rows="2" :value="detail.shiftHandover" :disabled="true"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="班长：" prop="shiftLeaderName">
              <el-input :value="detail.shiftLeaderName" :disabled="true"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="主管：" prop="supervisorName">
              <el-input :value="detail.supervisorName" :disabled="true"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="呈阅：" prop="inspectorName">
              <el-input :value="detail.inspectorName" :disabled="true"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="报表状态：" prop="shiftHandover">
              <el-input :value="statuses[detail.status]" :disabled="true"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="创建时间：" prop="updateTime">
              <el-input
                :value="detail.updateTime"
                :disabled="true">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="最后更新时间：" prop="updateTime">
              <el-input
                :value="detail.updateTime"
                :disabled="true">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="创建人：" prop="createPerson">
              <el-input
                :value="detail.createPerson"
                :disabled="true">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="最后更新人：" prop="updatePerson">
              <el-input
                :value="detail.updatePerson"
                :disabled="true">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-tab-pane>
  </el-tabs>
</template>
<script>

  export default {
    name: 'ReportDetail',
    components: {},
    props: ['detail'],
    data() {
      return {
        activeName: 'first',
        statuses: ['新建', '班长已审核', '主管已审核', '已呈阅审核'],
      }
    },
    methods: {
      handleClick(tab, event) {
        // console.log(tab, event)
      }
    }
  }
</script>
