<template>
  <div class="app-container production-defect">
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

          <el-input
            v-model="listQuery.operation"
            placeholder="请输入制程"
            style="width: 200px;"
            class="filter-item"
            clearable=""
            @keyup.enter.native="handleFilter"
          />
        </el-form-item>
        <el-form-item label="" prop="defectCode">
          <el-input
            v-model="listQuery.defectCode"
            placeholder="请输入缺陷码"
            style="width: 200px;"
            class="filter-item"
            clearable=""
            @keyup.enter.native="handleFilter"
          />
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
        <el-form-item label="" prop="degree">
          <el-input
            v-model="listQuery.degree"
            placeholder="请输入程度"
            style="width: 200px;"
            class="filter-item"
            clearable=""
            @keyup.enter.native="handleFilter"
          />
        </el-form-item>
        <el-form-item label="" prop="grade">
          <el-input
            v-model="listQuery.grade"
            placeholder="请输入等级"
            style="width: 200px;"
            class="filter-item"
            clearable=""
            @keyup.enter.native="handleFilter"
          />
        </el-form-item>

        <!--        <el-form-item label="" prop="hotRollOrigin">
                  <el-select v-model="listQuery.hotRollOrigin" filterable placeholder="请选择产地" @change="handleFilter">
                    <el-option
                      v-for="item in hotRollOrigins"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>-->

        <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" size="mini" @click="handleFilter">
          搜索
        </el-button>
        <el-button v-waves class="filter-item" size="mini" @click="resetForm('filterForm');handleFilter()">重置
        </el-button>
      </el-form>
    </div>

    <el-table :key="tableKey" v-loading="listLoading" :data="list" border fit highlight-current-row
              class="zoom-production-defect">

      <el-table-column label="日期" min-width="100px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.date }}</span>
        </template>
      </el-table-column>
      <el-table-column label="钢卷编号" min-width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.productNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column label="原料编号" min-width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.materialNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column label="钢种" min-width="100px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.steelGrade }}</span>
        </template>
      </el-table-column>
      <el-table-column label="产地" min-width="60px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.hotRollOrigin }}</span>
        </template>
      </el-table-column>

      <el-table-column label="订单厚度" min-width="70px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.targetThickness }}</span>
        </template>
      </el-table-column>
      <el-table-column label="厚度" min-width="80px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.thickness }}</span>
        </template>
      </el-table-column>
      <el-table-column label="宽度" min-width="80px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.width }}</span>
        </template>
      </el-table-column>


      <el-table-column label="表面品级" min-width="60px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.surfaceFinish }}</span>
        </template>
      </el-table-column>
      <el-table-column label="等级" min-width="60px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.grade }}</span>
        </template>
      </el-table-column>
      <el-table-column label="等级评分" min-width="60px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.gradeScore }}</span>
        </template>
      </el-table-column>
      <el-table-column label="上面" min-width="60px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.up }}</span>
        </template>
      </el-table-column>
      <el-table-column label="下面" min-width="60px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.down }}</span>
        </template>
      </el-table-column>
      <el-table-column label="产线" min-width="60px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.operation }}</span>
        </template>
      </el-table-column>
      <el-table-column label="缺陷码" min-width="60px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.defectCode }}</span>
        </template>
      </el-table-column>

      <el-table-column label="宽度位置" min-width="60px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.widthPosition }}</span>
        </template>
      </el-table-column>

      <el-table-column label="起始位置" min-width="60px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.startPosition }}</span>
        </template>
      </el-table-column>
      <el-table-column label="结束位置" min-width="60px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.endPosition }}</span>
        </template>
      </el-table-column>
      <el-table-column label="缺陷长度" min-width="60px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.defectLength }}</span>
        </template>
      </el-table-column>
      <el-table-column label="程度" min-width="60px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.degree }}</span>
        </template>
      </el-table-column>
      <el-table-column label="有害缺陷率" min-width="70px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.harmfulDefectPercent }}</span>
        </template>
      </el-table-column>
      <el-table-column label="退火TV" min-width="60px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.annealTv }}</span>
        </template>
      </el-table-column>
      <el-table-column label="退火硬度" min-width="60px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.annealHardness }}</span>
        </template>
      </el-table-column>
      <el-table-column label="轧/平道次" min-width="60px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.rollingPass }}</span>
        </template>
      </el-table-column>
      <el-table-column label="建议使用表面" min-width="80px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.recommendedSurface }}</span>
        </template>
      </el-table-column>
      <el-table-column label="开卷方式" min-width="60px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.unwindMethod }}</span>
        </template>
      </el-table-column>
      <el-table-column label="类别波高" min-width="60px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.waveHeightCategory }}</span>
        </template>
      </el-table-column>
      <el-table-column label="周期" min-width="60px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.period }}</span>
        </template>
      </el-table-column>
      <el-table-column label="频率" min-width="60px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.frequency }}</span>
        </template>
      </el-table-column>
      <el-table-column label="直径" min-width="60px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.diameter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="距边" min-width="60px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.margin }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" min-width="200px" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.note }}</span>
        </template>
      </el-table-column>

      <!--      <el-table-column label="下制程" min-width="80px" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.nextOperation }}</span>
              </template>
            </el-table-column>
            <el-table-column label="班别" min-width="80px" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.shiftId }}</span>
              </template>
            </el-table-column>
           <el-table-column label="用途" min-width="80px" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.uses }}</span>
              </template>
            </el-table-column>
            <el-table-column label="客户" min-width="80px" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.customerId }}</span>
              </template>
            </el-table-column>-->


    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.current"
      :limit.sync="listQuery.size"
      @pagination="getList"
    />


  </div>
</template>

<script>
  import { deepClone } from '@/utils'

  import { getProductionDefects } from '@/api/productiondefect.js'

  import waves from '@/directive/waves' // Waves directive
  import Pagination from '@/components/Pagination/index.vue' // Secondary package based on el-pagination

  export default {
    name: 'productionDefect',
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
          productNumber: undefined,
          operation: undefined,
          defectCode: undefined,
          dateRange: undefined,
          degree: undefined,
          grade: undefined
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
        }
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        this.listLoading = true
        getProductionDefects(this.listQuery).then(res => {
          this.list = res.queryResult.list.map(item => {
            const statistics = JSON.parse(item.statistics)
            if (statistics) {
              item.width = statistics.mean.width
              item.thickness = statistics.mean.thickness
            }
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
      }
    }
  }
</script>
<style lang="scss">
  .production-defect {

  .el-input.filter-item {
    width: 150px!important;
  }

  .zoom-production-defect {
    zoom: 0.8;

  }

  }

</style>

