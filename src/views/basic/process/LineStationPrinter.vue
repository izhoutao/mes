<template>
  <div class="line-station-printer-container">
    <div class="filter-container">
      <el-form ref="filterForm" :model="listQuery" :inline="true">
        <el-button class="filter-item" style="margin: 16px 0px;" type="success"
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
      <el-table-column label="序" min-width="20px" type="index" align="center">
      </el-table-column>
      <el-table-column label="打印机" min-width="70px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.printerName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="打印机路径" min-width="70px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.printerPath }}</span>
        </template>
      </el-table-column>
      <el-table-column label="默认打印机" min-width="70px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.isDefault?'是':'否' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="80">
        <template slot-scope="scope">
          <i :class="scope.row.isDefault?'el-icon-star-on':'el-icon-star-off'"
             @click="handleDefaultPrinter(scope.row)"/>
          <i class="el-icon-delete" @click="handleDelete(scope.row,'true')"/>
        </template>
      </el-table-column>
    </el-table>


    <el-dialog
      :close-on-click-modal="false"
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
      width="600px"
      append-to-body
    >
      <el-form
        ref="lineStationPrinterForm"
        :rules="rules"
        :model="temp"
        label-position="right"
        label-width="100px"
      >
        <el-form-item label="打印机：" prop="printerId">
          <el-select v-model="temp.printerId" filterable placeholder="请选择" style="width:100%">
            <el-option
              v-for="item in printers"
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

  </div>
</template>

<script>
  import { deepClone } from '@/utils'

  import {
    getLineStationPrinters,
    addLineStationPrinter,
    updateLineStationPrinter,
    deleteLineStationPrinter
  } from '@/api/linestationprinter.js'
  import { getPrinters, addPrinter, updatePrinter, deletePrinter } from '@/api/printer.js'

  import waves from '@/directive/waves' // Waves directive
  import Pagination from '@/components/Pagination/index.vue' // Secondary package based on el-pagination

  export default {
    name: 'LineStationPrinter',
    components: { Pagination },
    directives: { waves },
    props: ['lineStationId'],
    // watch: {
    //   lineStationId: {
    //     handler: function(val) {
    //       this.listQuery.lineStationId = val
    //     },
    //     immediate: true
    //   }
    // },
    data() {
      return {
        tableKey: 0,
        list: [],
        total: 0,
        listLoading: true,
        listQuery: {
          current: 1,
          size: 10,
          lineStationId: this.lineStationId
        },
        temp: {
          id: undefined,
          lineStationId: this.lineStationId,
          printerId: undefined,
          isDefault: 0
        },
        tempCopy: null,
        dialogFormVisible: false,
        dialogStatus: '',
        printers: '',
        printerMap: null,
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
      this.listLoading = true
      this.$nextTick(async () => {
        await this.getPrinters()
        this.getList()
      })

    },
    methods: {
      getList() {
        this.listLoading = true
        getLineStationPrinters(this.listQuery).then(res => {
          this.list = res.queryResult.list.map(item => {
            let printer = this.printerMap[item.printerId]
            item.printerName = printer.name
            item.printerPath = printer.path
            return item
          })
          this.total = res.queryResult.total
          this.listLoading = false
        })
      },
      async getPrinters() {
        let res = await getPrinters({})
        this.printers = res.queryResult.list
        this.printerMap = _.fromPairs(this.printers.map(printer => {
          return [printer.id, printer]
        }))
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
              let printer = this.printerMap[lineStationPrinter.printerId]
              res.model.printerName = printer.name
              res.model.printerPath = printer.path
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
      handleDelete(row) {
        this.$confirm('此操作将删除该关联打印机, 是否继续?', '提示', {
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
            this.total--
          })
        })
      },
      handleDefaultPrinter(row) {
        let lineStationPrinter = deepClone(row) // copy obj
        lineStationPrinter.isDefault = 1
        updateLineStationPrinter(lineStationPrinter).then(() => {
          this.list.forEach(item => {
            if (item.printerId != lineStationPrinter.printerId) {
              item.isDefault = 0
            } else {
              item.isDefault = 1
            }
          })
        })
      }
    }
  }
</script>


<style lang="scss">
  .line-station-printer-container {


  .el-icon-star-on, .el-icon-star-off, .el-icon-delete {
    margin: 3px;
    font-size: 22px !important;
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
