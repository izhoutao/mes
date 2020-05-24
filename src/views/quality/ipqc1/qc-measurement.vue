<template>
  <div class="qc-measurement">
    <el-table :data="list" border fit highlight-current-row height="330">
      <el-table-column label="序" min-width="40px" type="index" align="center">
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
        tempCopy: null,

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


  .el-table__row {

  td {
    padding: 0px;

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

