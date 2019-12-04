<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form ref="filterForm" :model="listQuery" :inline="true">
        <el-button class="filter-item" style="margin-left: 10px;" type="success"
                   icon="el-icon-edit" @click="handleAdd">
          添加
        </el-button>
      </el-form>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="listQuery.current"
        :limit.sync="listQuery.size"
        @pagination="getList"
      />
    </div>

    <el-table :key="tableKey" v-loading="listLoading" :data="list" border fit highlight-current-row>
      <el-table-column label="序号" min-width="20px" align="center">
        <template slot-scope="scope">
          {{ scope.$index }}
        </template>
      </el-table-column>
      <el-table-column label="打印机" min-width="70px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="打印机路径" min-width="70px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.path }}</span>
        </template>
      </el-table-column>
      <el-table-column label="默认打印机" min-width="70px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.isDefault }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="80">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini"
                     @click="setDefaultPrinter(scope.row.id)">编辑
          </el-button>
          <el-button
            icon="el-icon-delete"
            size="mini"
            type="danger"
            @click="handleDelete(scope.row,'true')"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>


    <el-dialog :close-on-click-modal="false" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible"
               width="600px">
      <el-form
        ref="lineStationPrinterForm"
        :rules="rules"
        :model="temp"
        label-position="right"
        label-width="150px"
      >
        <el-form-item label="" prop="printerId">
          <el-input v-model="temp.printerId"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" size="small" @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" size="small" @click="dialogStatus==='create'?submit():updateData()">确认</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import { deepClone } from '@/utils'

  import {
    getLineStationPrinters,
    addLineStationPrinter,
    updateLineStationPrinter,
    deleteLineStationPrinter,
    getPrintersByLineStationId,
    setDefaultPrinter
  } from '@/api/linestationprinter.js'
  import { getPrinters, addPrinter, updatePrinter, deletePrinter } from '@/api/printer.js'

  import waves from '@/directive/waves' // Waves directive
  import Pagination from '@/components/Pagination/index.vue' // Secondary package based on el-pagination

  export default {
    name: 'LineStationPrinter',
    components: { Pagination },
    directives: { waves },
    props: ['lineStationId'],
    watch: {
      lineStationId: {
        handler: function(val) {
          this.listQuery.lineStationId = val
        },
        immediate: true
      }
    },
    data() {
      return {
        tableKey: 0,
        list: [],
        total: 0,
        listLoading: true,
        listQuery: {
          current: 1,
          size: 10
        },
        temp: {
          id: undefined,
          lineStationId: this.lineStationId,
          printerId: undefined,
          isDefaut: 0
        },
        tempCopy: null,
        dialogFormVisible: false,
        dialogStatus: '',
        printers: '',
        textMap: {
          update: '编辑',
          create: '添加'
        },
        rules: {
          printerId: [
            { required: true, trigger: 'blur', message: '打印机不能为空' }
          ]
        }
      }
    },
    created() {
      this.tempCopy = deepClone(this.temp)
      this.getList()
      this.getPrinters()
    },
    methods: {
      getList() {
        this.listLoading = true
        getPrintersByLineStationId(this.lineStationId).then(res => {
          this.list = res.queryResult.list
          this.total = res.queryResult.total
          this.listLoading = false
        })
      },
      getPrinters() {
        getPrinters(this.lineStationId).then(res => {
          this.printers = res.queryResult.list
        })
      },
      resetForm(formName) {
        if (this.$refs[formName] === undefined) {
          return false
        }
        this.$refs[formName].resetFields()

        this.temp = deepClone(this.tempCopy)
      },
      handleAdd() {
        this.resetForm('lineStationPrinterForm')
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        // this.rules.password[0].required = true
        this.$nextTick(() => {
          this.$refs['lineStationPrinterForm'].clearValidate()
        })
      },
      submit() {
        this.$refs['lineStationPrinterForm'].validate((valid) => {
          if (valid) {
            // const tempData = deepClone(this.temp)
            let lineStationPrinter = deepClone(this.temp)
            addLineStationPrinter(lineStationPrinter).then((res) => {
              let printer = this.printers.find(item => item.id === res.model.printerId)
              if (printer) {
                res.model.name = printer.name
                res.model.path = printer.path
              }
              this.list.unshift(res.model)
              this.total++
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '添加成功',
                type: 'success',
                duration: 2000
              })
            })
          }
        })
      },
      handleDelete(row) {
        this.$confirm('此操作将永久删除该打印机, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteLineStationPrinter(row.id).then(() => {
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
      setDefaultPrinter(printerId) {
        setDefaultPrinter(this.setDefaultPrinterId, printerId).then(() => {
          this.list.forEach(lineStationPrinter => {
            if (lineStationPrinter.printerId != printerId) {
              lineStationPrinter.isDefalut = 0
            } else {
              lineStationPrinter.isDefalut = 1
            }
          })
        })
      }
    }
  }
</script>


