<template>
  <div class="journaling-rewind-list">
    <div class="filter-container">
<!--      <el-form ref="filterForm" :model="listQuery" :inline="true">
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
        &lt;!&ndash;            <el-button class="filter-item" style="margin-left: 10px;" type="success"
                               icon="el-icon-edit" @click="handleAdd">
                      添加
                    </el-button>&ndash;&gt;
      </el-form>-->
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
</template>

<script>
  import { mapGetters } from 'vuex'
  import { deepClone, parseTime } from '@/utils'

  import { getJournalingRewindItems } from '@/api/journalingrewinditem'
  import { getJournalingRollingMillItems } from '@/api/journalingrollingmillitem'
  import { getJournalingAnnealItems } from '@/api/journalingannealitem'
  import { getJournalingFinishingTensionLevelerItems } from '@/api/journalingfinishingtensionleveleritem'

  import waves from '@/directive/waves' // Waves directive
  import Pagination from '@/components/Pagination/index.vue'
  import { getJournalingGrindItems } from '@/api/journalinggrinditem' // Secondary package based on el-pagination

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
/*          journalingBeginTime: undefined,
          journalingEndTime: undefined,*/
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
        getJournalingGrindItems(this.listQuery).then(res => {
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

