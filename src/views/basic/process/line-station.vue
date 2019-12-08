<template>
  <div class="app-container line-station">
    <div class="filter-container">
      <el-form ref="filterForm" :model="listQuery" :inline="true">
        <el-form-item label="" prop="name">
          <el-input
            v-model="listQuery.name"
            placeholder="请输入线别工站名称"
            style="width: 200px;"
            class="filter-item"
            clearable=""
            @keyup.enter.native="handleFilter"
          />
        </el-form-item>
        <el-form-item label="" prop="groupId">
          <el-select v-model="listQuery.lineId" filterable placeholder="线别工站组" @change="handleGroupChange">
            <el-option
              v-for="item in lines"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
        <el-button v-waves class="filter-item" @click="resetForm('filterForm');handleFilter()">重置</el-button>
        <el-button class="filter-item" style="margin-left: 10px;" type="success"
                   icon="el-icon-edit" @click="handleAdd">
          添加
        </el-button>
      </el-form>
    </div>

    <el-table :key="tableKey" v-loading="listLoading" :data="list" border fit highlight-current-row>
      <el-table-column label="序号" min-width="40px" align="center">
        <template slot-scope="scope">
          {{ scope.$index }}
        </template>
      </el-table-column>
      <el-table-column label="工站编码" min-width="100px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.code }}</span>
        </template>
      </el-table-column>
      <el-table-column label="工站名称" min-width="100px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="线别" min-width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.lineName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="制程" min-width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.operationName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="100">
        <template slot-scope="scope">
          <i class="el-icon-printer printer" @click="handlePrinters(scope.row)"/>
          <i class="el-icon-edit edit" @click="handleUpdate(scope.row)"/>
          <i class="el-icon-delete delete" @click="handleDelete(scope.row,'true')"/>
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

    <el-dialog
      :close-on-click-modal="false"
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
      width="600px">
      <el-form
        ref="lineStationForm"
        :rules="rules"
        :model="temp"
        label-position="right"
        label-width="150px"
      >
        <el-form-item label="工站编码：" prop="code">
          <el-input v-model="temp.code"/>
        </el-form-item>
        <el-form-item label="工站名称：" prop="name">
          <el-input v-model="temp.name"/>
        </el-form-item>
        <el-form-item label="线别：" prop="groupId">
          <el-select v-model="temp.lineId" filterable placeholder="请选择" style="width:100%">
            <el-option
              v-for="item in lines"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="工艺：" prop="groupId">
          <el-select v-model="temp.operationId" filterable placeholder="请选择" style="width:100%">
            <el-option
              v-for="item in operations"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" size="small" @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" size="small" @click="dialogStatus==='create'?submit():updateData()">确认</el-button>
      </div>
    </el-dialog>

    <el-dialog
      :close-on-click-modal="false"
      title="关联打印机"
      :visible.sync="printerDialogFormVisible"
      width="800px"
    >
      <line-station-printer :lineStationId="temp.id" :key="temp.id+new Date()"/>
    </el-dialog>


  </div>
</template>

<script>
  import { deepClone } from '@/utils'

  import {
    getLineStations,
    addLineStation,
    updateLineStation,
    deleteLineStation,
  } from '@/api/linestation.js'
  import { getLines } from '@/api/line.js'
  import { getOperations } from '@/api/operation.js'

  import waves from '@/directive/waves' // Waves directive
  import Pagination from '@/components/Pagination/index.vue' // Secondary package based on el-pagination
  import LineStationPrinter from './LineStationPrinter' // Secondary package based on el-pagination

  export default {
    name: 'LineStation',
    components: { Pagination, LineStationPrinter },
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
          name: undefined
        },
        lines: [],
        lineMap:null,
        operations: [],
        operationMap:null,
        temp: {
          id: undefined,
          name: '',
          code: '',
          lineId: undefined,
          operationId: undefined
        },
        tempCopy: null,
        dialogFormVisible: false,
        dialogStatus: '',
        printerDialogFormVisible: false,
        textMap: {
          update: '编辑',
          create: '添加'
        },
        rules: {
          name: [
            { required: true, trigger: 'blur', message: '请填写线别工站名称' }
          ],
          code: [
            { required: true, trigger: 'blur', message: '请填写线别工站编码' }
          ]
        }
      }
    },
    created() {
      this.tempCopy = deepClone(this.temp)
      this.listLoading = true
      this.$nextTick(async () => {
        await Promise.all([
          this.getLines(),
          this.getOperations()
        ])
        this.getList()
      })
    },
    methods: {
      handleGroupChange() {
        this.getList()
      },
      getList() {
        this.listLoading = true
        getLineStations(this.listQuery).then(res => {
          this.list = res.queryResult.list.map(item => {
            let line = this.lineMap[item.lineId]
            item.lineName = line.name
            let operation = this.operationMap[item.operationId]
            item.operationName = operation.name
            return item
          })
          this.total = res.queryResult.total
          this.listLoading = false
        })
      },
      async getLines() {
        let res = await getLines({})
        this.lines = res.queryResult.list
        this.lineMap = _.fromPairs(this.lines.map(line => {
          return [line.id, line]
        }))
      },
      async getOperations() {
        let res = await getOperations({})
        this.operations = res.queryResult.list
        this.operationMap = _.fromPairs(this.operations.map(operation => {
          return [operation.id, operation]
        }))
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

        this.temp = deepClone(this.tempCopy)
      },
      handleAdd() {
        this.resetForm('lineStationForm')
        this.temp.lineId = this.listQuery.lineId
        this.temp.operationId = this.listQuery.operationId
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        // this.rules.password[0].required = true
        this.$nextTick(() => {
          this.$refs['lineStationForm'].clearValidate()
        })
      },
      submit() {
        this.$refs['lineStationForm'].validate((valid) => {
          if (valid) {
            // const tempData = deepClone(this.temp)
            let lineStation = deepClone(this.temp)
            addLineStation(lineStation).then((res) => {
              let line = this.lineMap[lineStation.lineId]
              res.model.lineName = line.name
              let operation = this.operationMap[lineStation.operationId]
              res.model.operationName = operation.name
              this.list.unshift(res.model)
              this.total++
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
      },
      handleUpdate(row) {
        this.dialogStatus = 'update'
        // this.rules.password[0].required = false
        this.temp = deepClone(row) // copy obj
        // this.temp.password = ''
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['lineStationForm'].clearValidate()
        })
      },
      updateData() {
        this.$refs['lineStationForm'].validate((valid) => {
          if (valid) {
            let lineStation = deepClone(this.temp)
            updateLineStation(lineStation).then(() => {
              let line = this.lineMap[lineStation.lineId]
              lineStation.lineName = line.name
              let operation = this.operationMap[lineStation.operationId]
              lineStation.operationName = operation.name
              for (const v of this.list) {
                if (v.id === lineStation.id) {
                  const index = this.list.indexOf(v)
                  this.list.splice(index, 1, lineStation)
                  break
                }
              }
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
      },
      handleDelete(row) {
        this.$confirm('此操作将永久删除该线别工站, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteLineStation(row.id).then(() => {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
            const index = this.list.indexOf(row)
            this.list.splice(index, 1)
          })
        })
      },
      handlePrinters(row) {
        this.temp = deepClone(row) // copy obj
        this.printerDialogFormVisible = true
      }
    }
  }
</script>

<style lang="scss">

  .line-station {

  .el-icon-printer.printer, .el-icon-edit.edit, .el-icon-delete.delete {
    margin: 3px;
    font-size: 18px !important;
  }

  }

</style>

