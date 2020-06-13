<template>
  <div class="inbound-order">
    <div class="filter-container">
      <el-form ref="filterForm" :model="listQuery" :inline="true">
        <el-form-item label="" prop="number">
          <el-input
            v-model="listQuery.number"
            placeholder="请输入入库单号"
            style="width: 200px;"
            class="filter-item"
            clearable=""
            @keyup.enter.native="handleFilter"
          />
        </el-form-item>
        <el-form-item label="" prop="statusId">
          <el-select v-model="listQuery.statusId" filterable placeholder="单据状态" @change="handleStatusChange">
            <el-option
              v-for="item in statuses"
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
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="listQuery.current"
        :limit.sync="listQuery.size"
        @pagination="getList"
      />
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      @current-change="handleCurrentChange"
    >
      <el-table-column label="序" min-width="40px" type="index" align="center">
      </el-table-column>
      <el-table-column label="入库单号" min-width="80px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.number }}</span>
        </template>
      </el-table-column>
      <el-table-column label="入库库房" min-width="80px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.warehouseId | showName(warehouses) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="入库方式" min-width="80px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.typeId | showName(types) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="单据状态" min-width="40px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.statusId | showName(statuses) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="紧急程度" min-width="80px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.levelId | showName(levels) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="供应商" min-width="80px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.vendorId | showName(vendors) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" min-width="80px" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="80">
        <template slot-scope="scope">
          <!--          <el-button type="primary" icon="el-icon-edit" size="mini"
                               @click="handleUpdate(scope.row)">编辑
                    </el-button>
                    <el-button
                      icon="el-icon-delete"
                      size="mini"
                      type="danger"
                      @click="handleDelete(scope.row,'true')"
                    >删除
                    </el-button>-->
          <i class="el-icon-edit update" @click="handleUpdate(scope.row)"/>
          <i class="el-icon-delete delete" @click="handleDelete(scope.row,'true')"/>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :close-on-click-modal="false" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible"
               width="600px">
      <el-form
        ref="inboundOrderForm"
        :rules="rules"
        :model="temp"
        label-position="right"
        label-width="150px"
      >
        <el-form-item label="入库单号：" prop="number">
          <el-input v-model="temp.number"/>
        </el-form-item>
        <el-form-item label="入库方式：" prop="typeId">
          <el-select v-model="temp.typeId" filterable placeholder="请选择" style="width:100%">
            <el-option
              v-for="item in types"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="入库库房：" prop="warehouseId">
          <el-select v-model="temp.warehouseId" filterable placeholder="请选择" style="width:100%">
            <el-option
              v-for="item in warehouses"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="紧急程度：" prop="levelId">
          <el-select v-model="temp.levelId" filterable placeholder="请选择" style="width:100%">
            <el-option
              v-for="item in levels"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="单据状态：" prop="statusId">
          <el-select v-model="temp.statusId" filterable placeholder="请选择" style="width:100%">
            <el-option
              v-for="item in statuses"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="供应商：" prop="vendorId">
          <el-select v-model="temp.vendorId" filterable placeholder="请选择" style="width:100%">
            <el-option
              v-for="item in vendors"
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
    getInboundOrders,
    addInboundOrder,
    updateInboundOrder,
    deleteInboundOrder
  } from '@/api/inboundorder.js'
  import { getDictInfos } from '@/api/dictionary.js'
  import { getWarehouses } from '@/api/warehouse.js'
  import { getVendors } from '@/api/vendor.js'

  import waves from '@/directive/waves' // Waves directive
  import Pagination from '@/components/Pagination/index.vue' // Secondary package based on el-pagination

  export default {
    name: 'InboundOrder',
    components: { Pagination },
    directives: { waves },
    props: ['orderId'],
    data() {
      return {
        tableKey: 0,
        list: [],
        total: 0,
        listLoading: true,
        listQuery: {
          current: 1,
          size: 10,
          number: undefined,
          status: undefined
        },
        types: [],
        warehouses: [],
        levels: [],
        statuses: [],
        vendors: [],
        temp: {
          id: undefined,
          number: ''
        },
        tempCopy: null,
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: '编辑',
          create: '添加'
        },
        rules: {
          name: [
            { required: true, trigger: 'blur', message: '请填写不良代码名称' }
          ],
          code: [
            { required: true, trigger: 'blur', message: '请填写不良代码编码' }
          ]
        }
      }
    },
    filters: {
      showName: function(id, list) {
        var item = list.find(item => item.id === id)
        if (!item) return ''
        return item.name
      }
    },
    created() {
      this.tempCopy = deepClone(this.temp)
      this.listLoading = true
      this.$nextTick(async() => {
        await Promise.all([
          this.getTypes(),
          this.getWarehouses(),
          this.getStatuses(),
          this.getLevels(),
          this.getVendors()
        ])
        this.getList()
      })
    },
    methods: {
      handleStatusChange() {
        this.getList()
      },
      getList() {
        this.listLoading = true
        getInboundOrders(this.listQuery).then(res => {
          this.$emit('update:orderId', '')
          this.list = res.queryResult.list
          this.total = res.queryResult.total
          this.listLoading = false
        })
      },
      getTypes() {
        getDictInfos({ type_id: '1196628479966187521' }).then(res => {
          this.types = res.queryResult.list
        })
      },
      getWarehouses() {
        getWarehouses({}).then(res => {
          this.warehouses = res.queryResult.list
        })
      },
      getStatuses() {
        getDictInfos({ type_id: '1197052960941649922' }).then(res => {
          this.statuses = res.queryResult.list
        })
      },
      getLevels() {
        getDictInfos({ type_id: 'b5a7df5d0f5c4ec7853036a480b4de3f' }).then(res => {
          this.levels = res.queryResult.list
        })
      },
      getVendors() {
        getVendors({ }).then(res => {
          this.vendors = res.queryResult.list
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

        this.temp = deepClone(this.tempCopy)
      },
      handleAdd() {
        this.resetForm('inboundOrderForm')
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        // this.rules.password[0].required = true
        this.$nextTick(() => {
          this.$refs['inboundOrderForm'].clearValidate()
        })
      },
      submit() {
        this.$refs['inboundOrderForm'].validate((valid) => {
          if (valid) {
            // const tempData = deepClone(this.temp)
            let inboundOrder = deepClone(this.temp)
            addInboundOrder(inboundOrder).then((res) => {
              this.list.unshift(res.model)
              this.total++
              this.dialogFormVisible = false
              this.$emit('update:orderId', '')
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
          this.$refs['inboundOrderForm'].clearValidate()
        })
      },
      updateData() {
        this.$refs['inboundOrderForm'].validate((valid) => {
          if (valid) {
            let inboundOrder = deepClone(this.temp)
            updateInboundOrder(inboundOrder).then(() => {
              for (const v of this.list) {
                if (v.id === inboundOrder.id) {
                  const index = this.list.indexOf(v)
                  this.list.splice(index, 1, inboundOrder)
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
        this.$confirm('此操作将永久删除该不良代码, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteInboundOrder(row.id).then(() => {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
            const index = this.list.indexOf(row)
            this.list.splice(index, 1)
            this.total--
            this.$emit('update:orderId', '')
          })
        })
      },
      handleCurrentChange(val) {
        val && this.$emit('update:orderId', val.id)
      }

    }
  }
</script>
<style lang="scss">
  .inbound-order {

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

  }

</style>

