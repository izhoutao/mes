<template>
  <div class="qc-measurement">
    <el-table :data="tableData" border fit highlight-current-row height="250">
      <el-table-column label="" width="35px" align="center">
        <template slot-scope="scope">
          {{ renderfirstLine(scope.$index) }}
        </template>
      </el-table-column>
      <el-table-column label="厚" min-width="40px" align="center">
        <template slot-scope="scope">
          <el-input v-model="scope.row.thickness"/>
        </template>
      </el-table-column>
      <el-table-column label="宽" min-width="40px" align="center">
        <template slot-scope="scope">
          <el-input v-model="scope.row.width"/>
        </template>
      </el-table-column>
      <el-table-column label="长" min-width="40px" align="center">
        <template slot-scope="scope">
          <el-input v-model="scope.row.length"/>
        </template>
      </el-table-column>
      <el-table-column label="T-S48" min-width="40px" align="center">
        <template slot-scope="scope">
          <el-input v-model="scope.row.ts48"/>
        </template>
      </el-table-column>
      <el-table-column label="B-S48" min-width="40px" align="center">
        <template slot-scope="scope">
          <el-input v-model="scope.row.bs48"/>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import { deepClone } from '@/utils'

  import waves from '@/directive/waves' // Waves directive
  import Pagination from '@/components/Pagination/index.vue'

  export default {
    name: 'QcMeasurement',
    components: { Pagination },
    directives: { waves },
    // props: ['ipqcId'],
    props: ['measurement'],
    watch: {
      'list': {
        handler: async function(val) {
          this.$emit('update:measurement', val)
        },
        deep: true
      }
    },
    computed: {
      statisticsData() {
        let initData = new Array(5)
        for (let i = 0; i < 5; i++) {
          initData[i] = deepClone({
            sum: 0,
            count: 0,
            max: -Number.MAX_VALUE,
            min: Number.MAX_VALUE
          })
        }
        const attrs = ['thickness', 'width', 'length', 'ts48', 'bs48']
        let statisticsData = this.measurement.reduce((prev, cur) => {
          for (let i = 0; i < attrs.length; i++) {
            let val = parseFloat(cur[attrs[i]])
            if (val.toString() != 'NaN') {
              prev[i].valid = true
              prev[i].attribute = attrs[i]
              prev[i].sum += val
              prev[i].max = Math.max(prev[i].max, val)
              prev[i].min = Math.min(prev[i].min, val)
              prev[i].count++
            }
          }
          /*          let thickness = parseFloat(cur.thickness)
          if (thickness.toString() != 'NaN') {
            prev[0].valid = true
            prev[0].attribute = 'thickness'

            prev[0].sum += thickness
            prev[0].max = Math.max(prev[0].max, thickness)
            prev[0].min = Math.min(prev[0].min, thickness)

            prev[0].count++
          }
          let width = parseFloat(cur.width)
          if (width.toString() != 'NaN') {
            prev[1].valid = true
            prev[1].attribute = 'width'

            prev[1].sum += width
            prev[1].max = Math.max(prev[1].max, width)
            prev[1].min = Math.min(prev[1].min, width)

            prev[1].count++
          }
          let length = parseFloat(cur.length)
          if (length.toString() != 'NaN') {
            prev[2].valid = true
            prev[2].attribute = 'length'

            prev[2].sum += length
            prev[2].max = Math.max(prev[2].max, length)
            prev[2].min = Math.min(prev[2].min, length)

            prev[2].count++
          }
          let ts48 = parseFloat(cur.ts48)
          if (ts48.toString() != 'NaN') {
            prev[3].valid = true
            prev[3].attribute = 'ts48'

            prev[3].sum += ts48
            prev[3].max = Math.max(prev[3].max, ts48)
            prev[3].min = Math.min(prev[3].min, ts48)

            prev[3].count++
          }
          let bs48 = parseFloat(cur.bs48)
          if (bs48.toString() != 'NaN') {
            prev[4].valid = true
            prev[4].attribute = 'bs48'

            prev[4].sum += bs48
            prev[4].max = Math.max(prev[4].max, bs48)
            prev[4].min = Math.min(prev[4].min, bs48)

            prev[4].count++
          }*/
          return prev
        }, initData)
        return statisticsData.map(item => {
          if (item.valid) {
            item.mean = item.count ? item.sum / item.count : null
            return item
          } else {
            return deepClone({ sum: null, count: null, max: null, min: null })
          }
        })
      },
      tableData() {
        let statisticsList = new Array(2)
        for (let i = 0; i < 3; i++) {
          statisticsList[i] = deepClone(this.temp)
        }
        this.statisticsData.forEach(item => {
          if (item.valid) {
            statisticsList[0][item.attribute] = item.mean
            statisticsList[1][item.attribute] = item.min
            statisticsList[2][item.attribute] = item.max
          }
        })
        return [...this.list, ...statisticsList]
      }
    },
    data() {
      return {
        tableKey: 0,
        list: [],
        temp: {
          thickness: null,
          width: null,
          length: null,
          ts48: null,
          bs48: null
        },
        tempCopy: null

      }
    },
    created() {
      this.tempCopy = deepClone(this.temp)
      this.list = this.measurement
    },
    methods: {
      renderHeader(h, { column, $index }) {
        return h('span', {}, [
          h('span', {}, column.label.split('|')[0]),
          h('br'),
          h('span', {}, column.label.split('|')[1])
        ])
      },
      renderfirstLine(index) {
        let length = this.tableData.length
        if (index == length - 3) {
          return '均值'
        } else if (index == length - 2) {
          return 'Min'
        } else if (index == length - 1) {
          return 'Max'
        } else {
          return index + 1
        }
      },
      handleAdd() {

      },
      handleCopy() {

      },
      handlePaste() {

      }

    }
  }
</script>
<style lang="scss">
  .qc-measurement {

  tbody tr:nth-last-of-type(1), tr:nth-last-of-type(2), tr:nth-last-of-type(3) {
    color: red;
  }

  /*zoom:0.9;*/
  .el-icon-circle-plus-outline {
    /*margin: 3px;*/
    font-size: 16px !important;
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
  .el-input__inner {
    height: 26px;
    border-radius: 0px;
  }

  .el-table {
    font-size: 12px;
  }

  th {
    padding: 0px;
    text-align: center;
  }

  .el-table__row {

  td {
    padding: 0px;
    text-align: center;

  .cell {
    padding: 0px;
  }

  }
  &
  .current-row input {
    background: #E0EEEE;
    border-radius: 0px;
  }

  input {
    border: none;
    padding: 0px;
    text-align: center;
  }

  }
  }
</style>

