<template>
  <div class="qc-defect">
<!--    <div class="filter-container">
      <el-form ref="filterForm" :inline="true">
        <el-button class="filter-item" size="medium" style="padding:8px 16px;margin: 0px 0px 8px;" type="success"
                   icon="el-icon-circle-plus-outline" @click="handleAdd">
          添加
        </el-button>
        <el-button class="filter-item" size="medium" style="padding:8px 16px;margin: 0px 0px 8px;" type="success"
                   icon="el-icon-circle-plus-outline" @click="handleCopy">
          复制缺陷
        </el-button>
        <el-button class="filter-item" size="medium" style="padding:8px 16px;margin: 0px 0px 8px;" type="success"
                   icon="el-icon-circle-plus-outline" @click="handlePaste">
          粘贴缺陷
        </el-button>

      </el-form>
    </div>-->
    <el-table :data="list" border fit highlight-current-row height="330">
      <el-table-column label="序" min-width="40px" type="index" align="center" fixed>
      </el-table-column>
      <el-table-column label="缺陷码" min-width="80px" align="center">
        <template slot-scope="scope">
          <el-input v-model="scope.row.defectCode"/>
        </template>
      </el-table-column>
      <el-table-column label="上面" min-width="80px" align="center">
        <template slot-scope="scope">
          <el-input v-model="scope.row.up"/>
        </template>
      </el-table-column>
      <el-table-column label="下面" min-width="80px" align="center">
        <template slot-scope="scope">
          <el-input v-model="scope.row.down"/>
        </template>
      </el-table-column>
      <el-table-column label="宽度|位置" min-width="80px" align="center" :render-header="renderHeader">
        <template slot-scope="scope">
          <el-input v-model="scope.row.widthPosition"/>
        </template>
      </el-table-column>
      <el-table-column label="起始位置|(m)" min-width="80px" align="center" :render-header="renderHeader">
        <template slot-scope="scope">
          <el-input v-model="scope.row.startPosition"/>
        </template>
      </el-table-column>
      <el-table-column label="结束位置|(m)" min-width="80px" align="center" :render-header="renderHeader">
        <template slot-scope="scope">
          <el-input v-model="scope.row.endPosition"/>
        </template>
      </el-table-column>
      <el-table-column label="缺陷长度|(m)" min-width="80px" align="center" :render-header="renderHeader">
        <template slot-scope="scope">
          <el-input v-model="scope.row.defectLength"/>
        </template>
      </el-table-column>
      <el-table-column label="程度" min-width="80px" align="center">
        <template slot-scope="scope">
          <el-input v-model="scope.row.degree"/>
        </template>
      </el-table-column>
      <el-table-column label="类别|波高" min-width="80px" align="center" :render-header="renderHeader">
        <template slot-scope="scope">
          <el-input v-model="scope.row.waveHeightCategory"/>
        </template>
      </el-table-column>
      <el-table-column label="周期|mm" min-width="80px" align="center" :render-header="renderHeader">
        <template slot-scope="scope">
          <el-input v-model="scope.row.period"/>
        </template>
      </el-table-column>
      <el-table-column label="频率" min-width="80px" align="center">
        <template slot-scope="scope">
          <el-input v-model="scope.row.frequency"/>
        </template>
      </el-table-column>
      <el-table-column label="直径|(mm)" min-width="80px" align="center" :render-header="renderHeader">
        <template slot-scope="scope">
          <el-input v-model="scope.row.diameter"/>
        </template>
      </el-table-column>
      <el-table-column label="距边|(mm)" min-width="80px" align="center" :render-header="renderHeader">
        <template slot-scope="scope">
          <el-input v-model="scope.row.margin"/>
        </template>
      </el-table-column>
      <!--      <el-table-column label="操作" align="center" min-width="80" fixed="right">
              <template slot-scope="scope">
                <i class="el-icon-edit update" @click="handleUpdate(scope.row)"/>
                <i class="el-icon-delete delete" @click="handleDelete(scope.row,'true')"/>
              </template>
            </el-table-column>-->
    </el-table>

  </div>
</template>

<script>
  import { deepClone } from '@/utils'

  import waves from '@/directive/waves' // Waves directive
  import Pagination from '@/components/Pagination/index.vue'

  export default {
    name: 'QcDefect',
    components: { Pagination },
    directives: { waves },
    props: ['defectList'],
    watch: {
      'list': {
        handler: function(val) {
          this.$emit('update:defectList', val)
        },
        deep: true
      }
    },
    data() {
      return {
        tableKey: 0,
        list: [],
        temp: {
          id: '',
          ipqcId: '',
          defectCode: '',
          up: '',
          down: '',
          widthPosition: '',
          startPosition: '',
          endPosition: '',
          defectLength: '',
          degree: '',
          waveHeightCategory: '',
          period: '',
          frequency: '',
          diameter: '',
          margin: ''
        },
        tempCopy: null,

      }
    },
    created() {
      this.tempCopy = deepClone(this.temp)
      this.list = this.defectList
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
  .qc-defect {

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

