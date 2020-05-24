<template>
  <div class="app-container">
    <div v-show="!dialogFormVisible">

      <div class="filter-container">
        <el-form ref="filterForm" :model="listQuery" :inline="true">
          <el-form-item label="" prop="isMark">
            <el-select v-model="listQuery.isMark" filterable placeholder="巡检单状态" @change="handleFilter">
              <el-option
                v-for="item in markStatuses"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索
          </el-button>
          <el-button v-waves class="filter-item" @click="resetForm('filterForm');handleFilter()">重置</el-button>
          <el-button class="filter-item" style="margin-left: 10px;" type="success"
                     icon="el-icon-edit" @click="handleAdd">
            添加
          </el-button>
        </el-form>
      </div>

      <el-table :key="tableKey" v-loading="listLoading" :data="list" border fit highlight-current-row>
        <el-table-column label="序号" min-width="40px" type="index" align="center">
        </el-table-column>
        <el-table-column label="批号" min-width="80px" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column label="序列号" min-width="80px" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.serialNumber }}</span>
          </template>
        </el-table-column>
        <el-table-column label="检验日期" min-width="80px" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.inspectDate | parseTime('{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="料号" min-width="80px" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.materialCode }}</span>
          </template>
        </el-table-column>
        <el-table-column label="线别" min-width="80px" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.lineName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" min-width="50px" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.isMark?'已提交':'未提交' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" min-width="100">
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

      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="listQuery.current"
        :limit.sync="listQuery.size"
        @pagination="getList"
      />
    </div>
    <div v-show="dialogFormVisible">
      <div style="font-size: 20px;">{{textMap[dialogStatus]}}检查单</div>
      <div style="margin: 10px 0px 20px;">
        <el-button type="primary" size="small" @click="dialogStatus==='create'?submit():updateData()">确认</el-button>
        <el-button type="danger" size="small" @click="dialogFormVisible = false">取消</el-button>
      </div>
      <el-form
        ref="ipqcForm"
        :rules="rules"
        :model="temp"
        label-position="right"
        label-width="100px"
      >
        <el-row>
          <el-col :span="6">
<!--            <el-form-item label="原料编号：" prop="materialId">
              <el-select v-model="temp.materialId" filterable placeholder="请选择" style="width:100%">
                <el-option
                  v-for="item in materials"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>-->
            <el-form-item label="料号：" prop="materialCode">
              <el-input v-model="temp.materialCode" @click.native="handleSelectMaterial"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="钢卷编号：" prop="serialNumber">
              <el-input v-model="temp.serialNumber"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="检验日期：" prop="inspectDate">
              <el-date-picker v-model="temp.inspectDate" type="date" placeholder="请选择日期" style="width: 100%;"
                              format="yyyy 年 MM 月 dd 日"
                              value-format="yyyy-MM-dd"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="产线：" prop="lineId">
              <el-select v-model="temp.lineId" filterable placeholder="请选择" style="width:100%">
                <el-option
                  v-for="item in lines"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="下制程：" prop="nextOperationId">
              <el-select v-model="temp.nextOperationId" filterable placeholder="请选择" style="width:100%">
                <el-option
                  v-for="item in operations"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="班别：" prop="shiftId">
              <el-select v-model="temp.shiftId" filterable placeholder="请选择" style="width:100%">
                <el-option
                  v-for="item in shifts"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="钢种：" prop="materailType">
              <el-select v-model="temp.materialTypeId" filterable placeholder="请选择" style="width:100%">
                <el-option
                  v-for="item in materialTypes"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="表面品级：" prop="surfaceGrade">
              <el-input v-model="temp.surfaceGrade"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="用途：" prop="uses">
              <el-input v-model="temp.uses"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="客户：" prop="customer">
              <el-select v-model="temp.customerId" filterable placeholder="请选择" style="width:100%">
                <el-option
                  v-for="item in customers"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-tabs value="first">
        <el-tab-pane label="检验记录" name="first">

          <el-table :key="tableKey" v-loading="listLoading" :data="temp.checkList" border fit highlight-current-row>
            <el-table-column label="序号" min-width="40px" type="index" align="center">
            </el-table-column>
            <el-table-column label="检验项目" min-width="80px" align="center">
              <template slot-scope="scope">
                <span>{{ temp.checkList[scope.$index].name }}</span>
              </template>
            </el-table-column>
            <el-table-column label="检验内容" min-width="80px" align="center">
              <template slot-scope="scope">
                <span>{{ temp.checkList[scope.$index].description }}</span>
              </template>
            </el-table-column>
            <el-table-column label="检验规格" min-width="80px" align="center">
              <template slot-scope="scope">
                <span>{{ temp.checkList[scope.$index].specification }}</span>
              </template>
            </el-table-column>
            <el-table-column label="规格单位" min-width="80px" align="center">
              <template slot-scope="scope">
                <span>{{ temp.checkList[scope.$index].specificationUnit }}</span>
              </template>
            </el-table-column>
            <el-table-column label="检验工具" min-width="100px" align="center">
              <template slot-scope="scope">
                <span>{{ temp.checkList[scope.$index].tool }}</span>
              </template>
            </el-table-column>
            <el-table-column label="检测结果" min-width="100px" align="center">
              <template slot-scope="scope">
                <el-input v-model="temp.checkList[scope.$index].result"/>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <el-tabs value="first" style="margin-bottom: 20px;">
        <el-tab-pane label="不良类别" name="first">
          <qc-defect v-bind:defectList.sync="temp.defectList" :key="temp.id"/>
        </el-tab-pane>
      </el-tabs>

      <el-dialog
        :close-on-click-modal="false"
        title="请选择"
        :visible.sync="materialDialogFormVisible"
        width="800px"
      >
        <material :selectedMaterial.sync="selectedMaterial"/>
        <div slot="footer" class="dialog-footer">
          <el-button type="danger" size="small" @click="materialDialogFormVisible = false">取消</el-button>
          <el-button type="primary" size="small" @click="confirmMaterial()">确认</el-button>
        </div>
      </el-dialog>

    </div>
  </div>
</template>

<script>
  import { deepClone } from '@/utils'
  import { getLines } from '@/api/line.js'
  import { getOperations } from '@/api/workflow.js'
  import { getShifts } from '@/api/shift.js'
  import { getMaterialTypes } from '@/api/material.js'
  import { getCustomers } from '@/api/customer.js'
  import { getIpqcs, addIpqc, updateIpqc, deleteIpqc } from '@/api/ipqc.js'
  import { getInspectionRuleMaterials } from '@/api/inspectionrulematerial.js'
  import { getInspectionRuleItems } from '@/api/inspectionruleitem.js'

  import waves from '@/directive/waves' // Waves directive
  import Pagination from '@/components/Pagination/index.vue' // Secondary package based on el-pagination
  import QcDefect from './qc-defect' // Secondary package based on el-pagination
  import Material from './material.vue'

  export default {
    name: 'ipqc',
    components: { Pagination, QcDefect, Material },
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
          name: undefined,
          isMark: undefined
          /*orders: ['code desc']*/
        },
        temp: {
          id: undefined,
          inspectDate: '',
          lineId: '',
          nextOperationId: '',
          shiftId: '',
          materialTypeId: '',
          surfaceGrade: '',
          uses: '',
          customerId: '',
          materialId: '',
          serialNumber: '',
          isMark: 0,
          checkList: [],
          defectList: [],
          inspectionRuleId: '',
          inspector: ''
        },
        tempCopy: null,
        markStatuses: [{ id: 0, name: '未提交' }, { id: 1, name: '已提交' }],
        lines: [],
        lineMap: null,
        operations: [],
        operationMap: null,
        shifts: [],
        shiftMap: null,
        materialTypes: [],
        materialTypeMap: null,
        customers: [],
        customerMap: null,

        materials: [],
        materialMap: null,
        vendors: [],
        vendorMap: null,
        inspectionRules: [],
        inspectionRuleMap: null,

        selectedMaterial: undefined,

        dialogFormVisible: false,
        dialogStatus: '',
        materialDialogFormVisible: false,
        defectDialogFormVisible: false,
        textMap: {
          update: '编辑',
          create: '添加'
        },
        rules: {
          name: [
            { required: true, trigger: 'blur', message: '请填写工艺名称' }
          ],
          code: [
            { required: true, trigger: 'blur', message: '请填写工艺编码' }
          ]
        }
      }
    },
    watch: {
      // 'temp.inboundOrderId': {
      //   handler: async function(val) {
      //     if (val) this.temp.vendorId = this.inboundOrderMap[val].vendorId
      //     let query = { inboundOrderId: val }
      //     await this.getInboundOrderDetails(query)
      //     this.materials = this.inboundOrderDetails.map(item => {
      //       let material = {}
      //       material.id = item.materialId
      //       material.name = item.materialName
      //       return material
      //     })
      //   }
      //   // deep: true
      // },
      'temp.materialId': {
        handler: async function(val) {
          if (val) {
            let query = { materialId: val }
            let res = await getInspectionRuleMaterials(query)
            if (res.queryResult.total) {
              this.temp.inspectionRuleId = res.queryResult.list[0].inspectionRuleId
              query = { inspectionRuleId: this.temp.inspectionRuleId }
              res = await getInspectionRuleItems(query)
              this.temp.checkList = this.generateCheckList(res.queryResult.list)
            } else {
              this.temp.checkList = []
            }
          } else {
            this.temp.checkList = []
          }
        }
        // deep: true
      }

    },
    created() {
      this.tempCopy = deepClone(this.temp)
      this.listLoading = true
      this.$nextTick(async() => {
        await Promise.all([
          this.getLines({}),
          this.getOperations({orders: ['sequence_number asc']}),
          this.getShifts({}),
          this.getMaterialTypes({}),
          this.getCustomers({}),
        ])
        this.getList()
      })

    },
    methods: {
      handleSelectMaterial() {
        this.materialDialogFormVisible = true
      },
      confirmMaterial() {
        this.materialDialogFormVisible = false
        this.temp.materialId = this.selectedMaterial && this.selectedMaterial.id
        this.temp.materialCode = this.selectedMaterial && this.selectedMaterial.code
        this.temp.materialName = this.selectedMaterial && this.selectedMaterial.name
        this.temp.materialTypeName = this.selectedMaterial && this.selectedMaterial.typeName
      },
      generateCheckList(checkList) {
        const checkMap = _.fromPairs(this.temp.checkList.map(check => {
          return [check.id, check]
        }))
        checkList.map(item => {
          if (checkMap[item.id]) {
            item.result = checkMap[item.id].result
          }
          return item
        })
        return checkList
      },
      async getLines(query) {
        const res = await getLines(query)
        this.lines = res.queryResult.list
        this.lineMap = _.fromPairs(this.lines.map(line => {
          return [line.id, line]
        }))
      },
      async getOperations(query) {
        const res = await getOperations(query)
        this.operations = res.queryResult.list
        this.operationMap = _.fromPairs(this.operations.map(operation => {
          return [operation.id, operation]
        }))
      },
      async getShifts(query) {
        const res = await getShifts(query)
        this.shifts = res.queryResult.list
        this.shiftMap = _.fromPairs(this.shifts.map(shift => {
          return [shift.id, shift]
        }))
      },
      async getMaterialTypes(query) {
        const res = await getMaterialTypes(query)
        this.materialTypes = res.queryResult.list
        this.materialTypeMap = _.fromPairs(this.materialTypes.map(materialType => {
          return [materialType.id, materialType]
        }))
      },
      async getCustomers(query) {
        const res = await getCustomers(query)
        this.customers = res.queryResult.list
        this.customerMap = _.fromPairs(this.customers.map(customer => {
          return [customer.id, customer]
        }))
      },
      // async getVendors(query) {
      //   const res = await getVendors(query)
      //   this.vendors = res.queryResult.list
      //   this.vendorMap = _.fromPairs(this.vendors.map(vendor => {
      //     return [vendor.id, vendor]
      //   }))
      // },
      async getInspectionRules(query) {
        const res = await getInspectionRules(query)
        this.inspectionRules = res.queryResult.list
        this.inspectionRuleMap = _.fromPairs(this.inspectionRules.map(inspectionRule => {
          return [inspectionRule.id, inspectionRule]
        }))
      },
      getList() {
        this.listLoading = true
        getIpqcs(this.listQuery).then(res => {
          this.list = res.queryResult.list.map(item => {
            let line = this.lineMap[item.lineId]
            item.lineName = line.name
            item.checkList = JSON.parse(item.checkList)
            item.defectList = JSON.parse(item.defectList)
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

        this.temp = deepClone(this.tempCopy)
      },
      async handleInboundOrderChange(val) {
        let query = { inboundOrderId: val }
        await this.getInboundOrderDetails(query)
      },
      async handleAdd() {
        this.resetForm('ipqcForm')
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        // this.rules.password[0].required = true
        this.$nextTick(() => {
          this.$refs['ipqcForm'].clearValidate()
        })
      },
      submit() {
        this.$refs['ipqcForm'].validate((valid) => {
          if (valid) {
            // const tempData = deepClone(this.temp)
            let ipqc = deepClone(this.temp)
            ipqc.checkList = JSON.stringify(ipqc.checkList)
            ipqc.defectList = JSON.stringify(ipqc.defectList)
            delete ipqc.materialCode
            delete ipqc.materialName
            delete ipqc.materialTypeName
            addIpqc(ipqc).then((res) => {
              let line = this.lineMap[ipqc.lineId]
              res.model.lineName = line.name
              res.model.materialCode=this.temp.materialCode
              res.model.materialName=this.temp.materialName
              res.model.materialTypeName=this.temp.materialTypeName
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
          this.$refs['ipqcForm'].clearValidate()
        })
      },
      updateData() {
        this.$refs['ipqcForm'].validate((valid) => {
          if (valid) {
            let ipqc = deepClone(this.temp)
            ipqc.checkList = JSON.stringify(ipqc.checkList)
            ipqc.defectList = JSON.stringify(ipqc.defectList)
            delete ipqc.materialCode
            delete ipqc.materialName
            delete ipqc.materialTypeName
            updateIpqc(ipqc).then(() => {
              let line = this.lineMap[ipqc.lineId]
              ipqc.lineName = line.name
              ipqc.checkList = this.temp.checkList
              ipqc.defectList = this.temp.defectList
              ipqc.materialCode=this.temp.materialCode
              ipqc.materialName=this.temp.materialName
              ipqc.materialTypeName=this.temp.materialTypeName
              for (const v of this.list) {
                if (v.id === ipqc.id) {
                  const index = this.list.indexOf(v)
                  this.list.splice(index, 1, ipqc)
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
        this.$confirm('此操作将永久删除该工艺, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteIpqc(row.id).then(() => {
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
      }

    }
  }
</script>
<style lang="scss" scoped>


</style>


