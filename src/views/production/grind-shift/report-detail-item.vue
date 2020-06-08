<template>
  <div class="journaling-rewind-list">
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
    <el-table v-if="detail.type==0" :key="tableKey" v-loading="listLoading" :data="list" border fit
              highlight-current-row>
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
    </el-table>
    <el-table v-if="detail.type==1" :key="tableKey" v-loading="listLoading" :data="list" border fit
              highlight-current-row>
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
      <el-table-column label="轧延参数" align="center">
        <el-table-column label="总道次数" min-width="50px" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.paramTotalRollingPass }}</span>
          </template>
        </el-table-column>
        <el-table-column label="总轧下率|(%)" min-width="50px" align="center" :render-header="renderHeader">
          <template slot-scope="scope">
            <span>{{ scope.row.paramTotalReductionRate }}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="出料" align="center">
        <el-table-column label="厚度|(mm)" min-width="50px" align="center" :render-header="renderHeader">
          <template slot-scope="scope">
            <span>{{ scope.row.outputThickness }}</span>
          </template>
        </el-table-column>
        <el-table-column label="重量|(kg)" min-width="50px" align="center" :render-header="renderHeader">
          <template slot-scope="scope">
            <span>{{ scope.row.outputWeight }}</span>
          </template>
        </el-table-column>
        <el-table-column label="长度|(mm)" min-width="50px" align="center" :render-header="renderHeader">
          <template slot-scope="scope">
            <span>{{ scope.row.outputLength }}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="轧辊使用信息" align="center">
        <el-table-column label="辊号" min-width="50px" align="center" :render-header="renderHeader">
          <template slot-scope="scope">
            <span>{{ scope.row.rollerNumber }}</span>
          </template>
        </el-table-column>
        <el-table-column label="辊类别" min-width="50px" align="center" :render-header="renderHeader">
          <template slot-scope="scope">
            <span>{{ scope.row.rollerType }}</span>
          </template>
        </el-table-column>
        <el-table-column label="辊更换原因" min-width="50px" align="center" :render-header="renderHeader">
          <template slot-scope="scope">
            <span>{{ scope.row.rollerReplaceReason }}</span>
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>
    <el-table v-if="detail.type==2" :key="tableKey" v-loading="listLoading" :data="list" border fit
              highlight-current-row>
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
    </el-table>
    <el-table v-if="detail.type==3" :key="tableKey" v-loading="listLoading" :data="list" border fit
              highlight-current-row>
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
    </el-table>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { deepClone, parseTime } from '@/utils'

  import { getJournalingRewindItems } from '@/api/journalingrewinditem'
  import { getJournalingRollingMillItems } from '@/api/journalingrollingmillitem'
  import { getJournalingAnnealItems } from '@/api/journalingannealitem'
  import { getJournalingFinishingTensionLevelerItems } from '@/api/journalingfinishingtensionleveleritem'

  import waves from '@/directive/waves' // Waves directive
  import Pagination from '@/components/Pagination/index.vue' // Secondary package based on el-pagination

  export default {
    name: 'reportDetailItem',
    components: { Pagination },
    directives: { waves },
    props: ['detail'],
    data() {
      return {
        tableKey: 0,
        list: [],
        total: 0,
        listLoading: true,
        listQuery: {
          current: 1,
          size: 10,
          journalingBeginTime: undefined,
          journalingEndTime: undefined,
          createPerson: '',
          shiftId: '',
          date: undefined
        }
      }
    },
    created() {
      this.listQuery.date = this.detail.date
      this.listQuery.shiftId = this.detail.shiftId
      this.$nextTick(async() => {
        this.getList()
      })
    },
    methods: {
      resetForm(formName) {
        if (this.$refs[formName] === undefined) {
          return false
        }
        this.$refs[formName].resetFields()
      },
      renderHeader(h, { column, $index }) {
        return h('span', {}, [
          h('span', {}, column.label.split('|')[0]),
          h('br'),
          h('span', {}, column.label.split('|')[1])
        ])
      },
      getList() {
        this.listLoading = true
        const getJournalingItems = [getJournalingRewindItems, getJournalingRollingMillItems,
          getJournalingAnnealItems, getJournalingFinishingTensionLevelerItems][this.detail.type]
        getJournalingItems(this.listQuery).then(res => {
          this.list = res.queryResult.list
          this.total = res.queryResult.total
          this.listLoading = false
        })
      },
      handleFilter() {
        this.listQuery.current = 1
        this.getList()
      }
    }
  }
</script>
<style lang="scss">
  .journaling-rewind-list {

  .el-table td, .el-table th {
    padding: 5px 0;
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

