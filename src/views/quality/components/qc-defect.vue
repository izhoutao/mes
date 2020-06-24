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
    <el-table :data="list" border fit highlight-current-row height="250"
              @selection-change="handleSelectionChange"
              ref="multipleTable"
    >
      <el-table-column
        type="selection"
        width="30">
      </el-table-column>
      <el-table-column label="缺陷码" min-width="35px" align="center">
        <template slot-scope="scope">
          <el-input v-model="scope.row.defectCode"
                    v-on:keydown.native="e => handleSwitchFocus(e, scope.$index, 0)"
                    :ref="'defect-'+scope.$index+'-0'"
          />
        </template>
      </el-table-column>
      <el-table-column label="上面" min-width="35px" align="center">
        <template slot-scope="scope">
          <el-input v-model="scope.row.up"
                    v-on:keydown.native="e => handleSwitchFocus(e, scope.$index, 1)"
                    :ref="'defect-'+scope.$index+'-1'"
          />
        </template>
      </el-table-column>
      <el-table-column label="下面" min-width="35px" align="center">
        <template slot-scope="scope">
          <el-input v-model="scope.row.down"
                    v-on:keydown.native="e => handleSwitchFocus(e, scope.$index, 2)"
                    :ref="'defect-'+scope.$index+'-2'"
          />
        </template>
      </el-table-column>
      <el-table-column label="宽度位置" min-width="40px" align="center">
        <template slot-scope="scope">
          <el-input v-model="scope.row.widthPosition"
                    v-on:keydown.native="e => handleSwitchFocus(e, scope.$index, 3)"
                    :ref="'defect-'+scope.$index+'-3'"
          />
        </template>
      </el-table-column>
      <el-table-column label="起始位置(m)" min-width="50px" align="center">
        <template slot-scope="scope">
          <el-input v-model="scope.row.startPosition"
                    v-on:keydown.native="e => handleSwitchFocus(e, scope.$index, 4)"
                    :ref="'defect-'+scope.$index+'-4'"
          />
        </template>
      </el-table-column>
      <el-table-column label="结束位置(m)" min-width="50px" align="center">
        <template slot-scope="scope">
          <el-input v-model="scope.row.endPosition"
                    v-on:keydown.native="e => handleSwitchFocus(e, scope.$index, 5)"
                    :ref="'defect-'+scope.$index+'-5'"
          />
        </template>
      </el-table-column>
      <el-table-column label="缺陷长度(m)" min-width="50px" align="center">
        <template slot-scope="scope">
          <el-input v-model="scope.row.defectLength"
                    v-on:keydown.native="e => handleSwitchFocus(e, scope.$index, 6)"
                    :ref="'defect-'+scope.$index+'-6'"
          />
        </template>
      </el-table-column>
      <el-table-column label="程度" min-width="35px" align="center">
        <template slot-scope="scope">
          <el-input v-model="scope.row.degree"
                    v-on:keydown.native="e => handleSwitchFocus(e, scope.$index, 7)"
                    :ref="'defect-'+scope.$index+'-7'"
          />
        </template>
      </el-table-column>
      <el-table-column label="类别波高" min-width="40px" align="center">
        <template slot-scope="scope">
          <el-input v-model="scope.row.waveHeightCategory"
                    v-on:keydown.native="e => handleSwitchFocus(e, scope.$index, 8)"
                    :ref="'defect-'+scope.$index+'-8'"
          />
        </template>
      </el-table-column>
      <el-table-column label="周期(mm)" min-width="50px" align="center">
        <template slot-scope="scope">
          <el-input v-model="scope.row.period"
                    v-on:keydown.native="e => handleSwitchFocus(e, scope.$index, 9)"
                    :ref="'defect-'+scope.$index+'-9'"
          />
        </template>
      </el-table-column>
      <el-table-column label="频率" min-width="35px" align="center">
        <template slot-scope="scope">
          <el-input v-model="scope.row.frequency"
                    v-on:keydown.native="e => handleSwitchFocus(e, scope.$index, 10)"
                    :ref="'defect-'+scope.$index+'-10'"
          />
        </template>
      </el-table-column>
      <el-table-column label="直径(mm)" min-width="50px" align="center">
        <template slot-scope="scope">
          <el-input v-model="scope.row.diameter"
                    v-on:keydown.native="e => handleSwitchFocus(e, scope.$index, 11)"
                    :ref="'defect-'+scope.$index+'-11'"
          />
        </template>
      </el-table-column>
      <el-table-column label="距边(mm)" min-width="50px" align="center">
        <template slot-scope="scope">
          <el-input v-model="scope.row.margin"
                    v-on:keydown.native="e => handleSwitchFocus(e, scope.$index, 12)"
                    :ref="'defect-'+scope.$index+'-12'"
          />
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
        selectedDefects: [],
        temp: {
          /*          id: '',
                    ipqcId: '',*/
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
        tempCopy: null

      }
    },
    created() {
      this.tempCopy = deepClone(this.temp)
      this.list = this.defectList
    },
    methods: {
      /*      renderHeader(h, { column, $index }) {
              return h('span', {}, [
                h('span', {}, column.label.split('|')[0]),
                h('br'),
                h('span', {}, column.label.split('|')[1])
              ])
            },*/
      toggleSelection(rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row)
          })
        }
      },
      handleSelectionChange(val) {
        this.selectedDefects = val
      },
      handleSwitchFocus(event, row, column) {
        let direction
        switch (event.key) {
          case 'ArrowUp':
            direction = 1
            break
          case 'ArrowRight':
          case 'Enter':
            direction = 2
            break
          case 'ArrowDown':
            direction = 3
            break
          case 'ArrowLeft':
            direction = 4
            break
        }
        const inputRef = this.getNeighbour(row, column, direction)
        this.$refs[inputRef].focus()
      },
      getNeighbour(row, column, direction) {
        switch (direction) {
          case 1:
            row = row == 0 ? row : row - 1
            break
          case 2:
            if (column == 12 && row != this.list.length - 1) {
              row++
              column = 0
            } else {
              column = column == 12 ? column : column + 1
            }
            break
          case 3:
            row = row == this.list.length - 1 ? row : row + 1
            break
          case 4:
            if (column == 0 && row > 0) {
              row--
              column = 12
            } else {
              column = column == 0 ? column : column - 1
            }
            break

        }
        return 'defect-' + row + '-' + column
      }
    }
  }
</script>
<style lang="scss">
  .qc-defect {

  /*zoom: 0.9;*/

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
  .current-row .el-input__inner {
    background: #E0EEEE;
    /*border-radius: 0px;*/
  }

  input {
    border: none;
    padding: 0px;
    text-align: center;
  }

  }
  }
</style>

