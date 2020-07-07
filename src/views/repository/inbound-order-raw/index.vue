<template>
  <div class="app-container inbound-order-raw-item">
    <div class="filter-container">
      <el-form ref="filterForm" :model="listQuery" :inline="true">
        <el-form-item label="" prop="materialNumber">
          <el-input
            v-model="listQuery.materialNumber"
            placeholder="请输入原料编号"
            style="width: 200px;"
            class="filter-item"
            clearable=""
            @keyup.enter.native="handleFilter"
          />
        </el-form-item>
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

    <el-table :key="tableKey" v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%"
              height="250">
      <el-table-column label="序" width="60px" type="index" align="center" fixed>
      </el-table-column>
      <el-table-column label="收货日期" width="100px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.receivingTime | parseTime('{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="原料编号" width="160px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.materialNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column label="我司编号" width="160px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.productNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column label="钢种" width="100px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.steelGrade }}</span>
        </template>
      </el-table-column>
      <el-table-column label="产地" min-width="80px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.vendorName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="厚度|(mm)" width="100px" align="center" :render-header="renderHeader">
        <template slot-scope="scope">
          <span>{{ scope.row.thickness }}</span>
        </template>
      </el-table-column>
      <el-table-column label="宽度|(mm)" width="100px" align="center" :render-header="renderHeader">
        <template slot-scope="scope">
          <span>{{ scope.row.width }}</span>
        </template>
      </el-table-column>
      <el-table-column label="毛重|(kg)" width="100px" align="center" :render-header="renderHeader">
        <template slot-scope="scope">
          <span>{{ scope.row.grossWeight }}</span>
        </template>
      </el-table-column>

      <el-table-column label="净重|(kg)" width="100px" align="center" :render-header="renderHeader">
        <template slot-scope="scope">
          <span>{{ scope.row.netWeight }}</span>
        </template>
      </el-table-column>
      <el-table-column label="复磅毛重|(kg)" width="100px" align="center" :render-header="renderHeader">
        <template slot-scope="scope">
          <span>{{ scope.row.grossWeight2 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="包装重量|(kg)" width="100px" align="center" :render-header="renderHeader">
        <template slot-scope="scope">
          <span>{{ scope.row.packageWeight }}</span>
        </template>
      </el-table-column>

      <el-table-column label="合同号" width="100px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.contractNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column label="客户" width="100px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.customerName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="下单日期" width="100px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.orderTime | parseTime('{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>

      <el-table-column label="订单厚度" width="100px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.orderThickness }}</span>
        </template>
      </el-table-column>
      <el-table-column label="轧延厚度" width="100px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.rollingThickness }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="200" fixed="right">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini"
                     @click="handleUpdate(scope.row)">编辑
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
               width="1100px">
      <!--      <el-form
              ref="inboundOrderRawItemForm"
              :rules="rules"
              :model="temp"
              :inline="true"
              label-position="right"
              label-width="120px"
              size="small"
            >
              <el-row>
                <el-col :span="6">
                  <el-form-item label="原料编号：" prop="materialNumber">
                    <el-input v-model="temp.materialNumber"/>
                  </el-form-item>
                </el-col>
                <el-col :span="10">
                  <el-form-item label="我司编号：" prop="productNumber">
                    <el-row>
                      <el-col :span="9">
                        <el-input v-model="temp.productNumber"/>
                      </el-col>
                      <el-col :span="6">
                        <el-button type="success" style="margin: 0 0 0 20px;" size="mini"
                                   @click="handleGetProductSerialNumber()">
                          生成编号
                        </el-button>
                      </el-col>
                      <el-col :span="8">
                        <el-select v-model="codeRule" clearable filterable placeholder="编码规则" size="mini">
                          <el-option
                            v-for="item in codeRules"
                            :key="item.id"
                            :label="item.rule"
                            :value="item.name">
                          </el-option>
                        </el-select>
                      </el-col>
                    </el-row>

                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="钢种：" prop="materialCode">
                    <el-input v-model="temp.steelGrade" @click.native="handleSelectMaterial"/>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="6">
                  <el-form-item label="产地：" prop="vendorId">
                    <el-select v-model="temp.vendorId" filterable placeholder="请选择" style="width:100%">
                      <el-option
                        v-for="item in vendors"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="收货日期：" prop="receivingTime">
                    <el-date-picker v-model="temp.orderTime" type="datetime" placeholder="请选择时间" style="width: 100%;"
                                    format="yyyy-MM-dd HH:mm:ss"
                                    value-format="yyyy-MM-ddTHH:mm:ss"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item label="厚度(mm)：" prop="thickness">
                    <el-input v-model="temp.thickness" @input="temp.thickness=temp.thickness.replace(/[^0-9.]/g,'')"/>
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item label="宽度(mm)：" prop="width">
                    <el-input v-model="temp.width"/>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="5">
                  <el-form-item label="毛重(kg)：" prop="grossWeight">
                    <el-input v-model="temp.grossWeight"/>
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item label="净重(kg)：" prop="netWeight">
                    <el-input v-model="temp.netWeight"/>
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item label="复磅毛重(kg)：" prop="grossWeight2">
                    <el-input v-model="temp.grossWeight2"/>
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item label="包装重量(kg)：" prop="labelNetWeight">
                    <el-input v-model="temp.labelNetWeight"/>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="合同号：" prop="contractNumber">
                    <el-input v-model="temp.contractNumber"/>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="客户：" prop="customerId">
                    <el-select v-model="temp.customerId" style="width:100%">
                      <el-option
                        v-for="item in customers"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="下单时间：" prop="orderTime">
                    <el-date-picker v-model="temp.orderTime" type="datetime" placeholder="请选择时间" style="width: 100%;"
                                    format="yyyy-MM-dd HH:mm:ss"
                                    value-format="yyyy-MM-ddTHH:mm:ss"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="订单厚度：" prop="orderThickness">
                    <el-input v-model="temp.orderThickness"/>
                  </el-form-item>
                </el-col>

                <el-col :span="8">
                  <el-form-item label="轧延厚度：" prop="rollingThickness">
                    <el-input v-model="temp.rollingThickness"/>
                  </el-form-item>
                </el-col>
              </el-row>


            </el-form>-->
      <el-form
        ref="inboundOrderRawItemForm"
        :rules="rules"
        :model="temp"
        :inline="true"
        label-position="right"
        label-width="120px"
      >
        <el-form-item label="原料编号：" prop="materialNumber">
          <el-input v-model="temp.materialNumber"/>
        </el-form-item>
        <el-form-item label="我司编号：" prop="productNumber">
          <el-row>
            <el-col :span="9">
              <el-input v-model="temp.productNumber"/>
            </el-col>
            <el-col :span="6">
              <el-button type="success" style="margin: 0 0 0 20px;" size="mini"
                         @click="handleGetProductSerialNumber()">
                生成编号
              </el-button>
            </el-col>
            <el-col :span="8">
              <el-select v-model="codeRule" clearable filterable placeholder="编码规则" size="mini">
                <el-option
                  v-for="item in codeRules"
                  :key="item.id"
                  :label="item.rule"
                  :value="item.name">
                </el-option>
              </el-select>
            </el-col>
          </el-row>

        </el-form-item>
        <el-form-item label="钢种：" prop="materialCode">
          <el-input v-model="temp.steelGrade" @click.native="handleSelectMaterial"/>
        </el-form-item>
        <el-form-item label="产地：" prop="vendorId">
          <el-select v-model="temp.vendorId" filterable placeholder="请选择" style="width:100%">
            <el-option
              v-for="item in vendors"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="收货日期：" prop="receivingTime">
          <el-date-picker v-model="temp.receivingTime" type="datetime" placeholder="请选择时间" style="width: 100%;"
                          format="yyyy-MM-dd HH:mm:ss"
                          value-format="yyyy-MM-ddTHH:mm:ss"
          />
        </el-form-item>
        <el-form-item label="厚度(mm)：" prop="thickness">
          <el-input v-model="temp.thickness" @input="temp.thickness=temp.thickness.replace(/[^0-9.]/g,'')"/>
        </el-form-item>
        <el-form-item label="宽度(mm)：" prop="width">
          <el-input v-model="temp.width"/>
        </el-form-item>
        <el-form-item label="毛重(kg)：" prop="grossWeight">
          <el-input v-model="temp.grossWeight"/>
        </el-form-item>
        <el-form-item label="净重(kg)：" prop="netWeight">
          <el-input v-model="temp.netWeight"/>
        </el-form-item>
        <el-form-item label="复磅毛重(kg)：" prop="grossWeight2">
          <el-input v-model="temp.grossWeight2"/>
        </el-form-item>
        <el-form-item label="包装重量(kg)：" prop="packageWeight">
          <el-input v-model="temp.packageWeight"/>
        </el-form-item>
        <el-form-item label="合同号：" prop="contractNumber">
          <el-input v-model="temp.contractNumber"/>
        </el-form-item>
        <el-form-item label="客户：" prop="customerId">
          <el-select v-model="temp.customerId" style="width:100%">
            <el-option
              v-for="item in customers"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="下单时间：" prop="orderTime">
          <el-date-picker v-model="temp.orderTime" type="datetime" placeholder="请选择时间" style="width: 100%;"
                          format="yyyy-MM-dd HH:mm:ss"
                          value-format="yyyy-MM-ddTHH:mm:ss"
          />
        </el-form-item>
        <el-form-item label="订单厚度：" prop="orderThickness">
          <el-input v-model="temp.orderThickness"/>
        </el-form-item>
        <el-form-item label="轧延厚度：" prop="rollingThickness">
          <el-input v-model="temp.rollingThickness"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" size="small" @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" size="small" @click="dialogStatus==='create'?submit():updateData()">确认</el-button>
      </div>
    </el-dialog>

    <el-dialog
      :close-on-click-modal="false"
      title="请选择"
      :visible.sync="materialDialogFormVisible"
      width="800px"
    >
      <material  ref="material"/>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" size="small" @click="materialDialogFormVisible = false">取消</el-button>
        <el-button type="primary" size="small" @click="confirmMaterial()">确认</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import { deepClone } from '@/utils'

  import {
    getInboundOrderRawItems,
    addInboundOrderRawItem,
    updateInboundOrderRawItem,
    deleteInboundOrderRawItem,
    getProductSerialNumbers
  } from '@/api/inboundorderrawitem.js'

  import { getCodeRules } from '@/api/coderule'

  import waves from '@/directive/waves' // Waves directive
  import Pagination from '@/components/Pagination/index.vue' // Secondary package based on el-pagination
  import Material from '@/components/Material'
  import { getVendors } from '@/api/vendor'
  import { getCustomers } from '@/api/customer'

  export default {
    name: 'inboundRaw',
    components: { Pagination, Material },
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
          status: undefined
        },
        temp: {
          id: undefined,
          receivingTime: '',
          materialNumber: undefined,
          productNumber: '',
          steelGrade: this.steelGrade,
          vendorId: undefined,
          vendorName: undefined,
          thickness: undefined,
          width: undefined,
          grossWeight: undefined,
          netWeight: undefined,
          grossWeight2: undefined,
          packageWeight: undefined,
          contractNumber: undefined,
          customerId: undefined,
          customerName: undefined,
          orderTime: undefined,
          orderThickness: undefined,
          rollingThickness: undefined,

          createTime: undefined,
          updateTime: undefined
          /*          workOrderId: undefined,
                    workOrderNumber: undefined*/
        },
        tempCopy: null,
        statuses: ['未完成', '已完成'],
        tagTypes: ['success', 'info', 'warning', 'danger'],
        selectedMaterial: undefined,

        codeRules: [],
        codeRule: '',
        vendors: [],
        vendorMap: undefined,
        customers: [],
        customerMap: undefined,
        dialogFormVisible: false,
        dialogStatus: '',

        materialDialogFormVisible: false,
        textMap: {
          update: '编辑',
          create: '添加'
        },
        rules: {
          receivingTime: [
            { required: true, trigger: 'blur', message: '请填写收货日期' },
            { required: true, message: '请选择收货日期', trigger: 'change' }
          ],
          materialNumber: [
            { required: true, trigger: 'blur', message: '请填写原料编号' }
          ],
          productNumber: [
            { required: true, trigger: 'blur', message: '请填写我司编号' }
          ],
          steelGrade: [
            { required: true, trigger: 'blur', message: '请填写钢种' }
          ],
          vendorId: [
            { required: true, trigger: 'blur', message: '请填写产地' }
          ],
          width: [
            { required: true, trigger: 'blur', message: '请填写宽度' }
          ],
          thickness: [
            { required: true, trigger: 'blur', message: '请填写厚度' }
          ],
          length: [
            { required: true, trigger: 'blur', message: '请填写长度' }
          ],
          grossWeight: [
            { required: true, trigger: 'blur', message: '请填写毛重' }
          ],
          netWeight: [
            { required: true, trigger: 'blur', message: '请填写净重' }
          ],
          grossWeight2: [
            { required: true, trigger: 'blur', message: '请填写复磅毛重' }
          ],
          packageWeight: [
            { required: true, trigger: 'blur', message: '请填写包装重量' }
          ],
          contractNumber: [
            { required: true, trigger: 'blur', message: '请填写合同号' }
          ],
          grossWeight: [
            { required: true, trigger: 'blur', message: '请填写实磅毛重' }
          ],
          customerId: [
            { required: true, trigger: 'blur', message: '请填写客户' }
          ],
          orderTime: [
            { required: true, trigger: 'blur', message: '请填写下单日期' },
            { required: true, message: '请选择下单日期', trigger: 'change' }
          ],
          orderThickness: [
            { required: true, trigger: 'blur', message: '请填写订单厚度' }
          ],
          rollingThickness: [
            { required: true, trigger: 'blur', message: '请填写轧延厚度' }
          ]

        }
      }
    },
    created() {
      this.tempCopy = deepClone(this.temp)
      this.$nextTick(async() => {
        this.getCodeRules()
        this.getVendors()
        this.getCustomers()
        // this.codeRule = this.codeRules[0].rule
        this.getList()
      })
    },
    watch: {
      'temp.vendorId': {
        handler: function(val) {
          if (val) {
            this.temp.vendorName = this.vendorMap[val].name
          } else {
            this.temp.vendorName = ''
          }
        }
        // deep: true
      },
      'temp.customerId': {
        handler: function(val) {
          if (val) {
            this.temp.customerName = this.customerMap[val].name
          } else {
            this.temp.customerName = ''
          }
        }
        // deep: true
      }
    },
    methods: {
      renderHeader(h, { column, $index }) {
        return h('span', {}, [
          h('span', {}, column.label.split('|')[0]),
          h('br'),
          h('span', {}, column.label.split('|')[1])
        ])
      },
      translateStatus(status) {
        return {
          tagType: this.tagTypes[status],
          text: this.statuses[status]
        }
      },
      handleGetProductSerialNumber() {
        getProductSerialNumbers(this.codeRule, 1).then(res => {
          this.temp.productNumber = res.model[0]
        })
      },
      handleSelectMaterial() {
        this.materialDialogFormVisible = true
      },
      confirmMaterial() {
        this.materialDialogFormVisible = false
        this.temp.materialId = this.$refs['material'].selectedMaterial && this.$refs['material'].selectedMaterial.id
        this.temp.steelGrade = this.$refs['material'].selectedMaterial && this.$refs['material'].selectedMaterial.steelGrade
        this.temp.density = this.$refs['material'].selectedMaterial && this.$refs['material'].selectedMaterial.density
      },
      getList() {
        this.listLoading = true
        getInboundOrderRawItems(this.listQuery).then(res => {
          this.list = res.queryResult.list
          this.total = res.queryResult.total
          // this.$emit('update:receivedQuantity', this.total)
          this.listLoading = false
        })
      },
      getCodeRules() {
        getCodeRules({}).then(res => {
          this.codeRules = res.queryResult.list.filter(item => {
            return item.name.startsWith('PRODUCT_NUMBER')
          })
        })
      },
      getCustomers() {
        getCustomers({}).then(res => {
          this.customers = res.queryResult.list
          this.customerMap = _.fromPairs(this.customers.map(customer => {
            return [customer.id, customer]
          }))
        })
      },
      getVendors() {
        getVendors({}).then(res => {
          this.vendors = res.queryResult.list
          this.vendorMap = _.fromPairs(this.vendors.map(vendor => {
            return [vendor.id, vendor]
          }))
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
        this.resetForm('inboundOrderRawItemForm')
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        // this.rules.password[0].required = true
        this.$nextTick(() => {
          this.$refs['inboundOrderRawItemForm'].clearValidate()
        })
      },
      submit() {
        this.$refs['inboundOrderRawItemForm'].validate((valid) => {
          if (valid) {
            // const tempData = deepClone(this.temp)
            let inboundOrderRawItem = deepClone(this.temp)
            addInboundOrderRawItem(inboundOrderRawItem).then((res) => {
              this.list.unshift(res.model)
              // this.$emit('update:receivedQuantity', ++this.total)
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
          this.$refs['inboundOrderRawItemForm'].clearValidate()
        })
      },
      updateData() {
        this.$refs['inboundOrderRawItemForm'].validate((valid) => {
          if (valid) {
            let inboundOrderRawItem = deepClone(this.temp)
            updateInboundOrderRawItem(inboundOrderRawItem).then(() => {
              for (const v of this.list) {
                if (v.id === inboundOrderRawItem.id) {
                  const index = this.list.indexOf(v)
                  this.list.splice(index, 1, inboundOrderRawItem)
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
        this.$confirm('此操作将永久删除该出货单项, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteInboundOrderRawItem(row.id).then(() => {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
            const index = this.list.indexOf(row)
            this.list.splice(index, 1)
            // this.$emit('update:receivedQuantity', --this.total)
          })
        })
      }

    }
  }
</script>
<style lang="scss">
  .inbound-order-raw-item {

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

  .product-number {
    /*width: 100%;*/
    display: flex;
  }

  }

</style>

