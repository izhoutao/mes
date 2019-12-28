<template>
  <div class="app-container journaling-rewind-item">
    <div v-show="!dialogFormVisible">
      <div class="filter-container">
        <el-form ref="filterForm" :model="listQuery" :inline="true">
          <el-form-item label="" prop="journalingBeginTime">
            <el-date-picker
              v-model="listQuery.journalingBeginTime"
              type="datetime"
              placeholder="选择起始日期时间"
              default-time="00:00:00"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-ddTHH:mm:ss"
            >
            </el-date-picker>
          </el-form-item>

          <el-form-item label="" prop="journalingEndTime">
            <el-date-picker
              v-model="listQuery.journalingEndTime"
              type="datetime"
              placeholder="选择结束日期时间"
              default-time="23:59:59"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-ddTHH:mm:ss"
            >
            </el-date-picker>
          </el-form-item>
          <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索
          </el-button>
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
      <el-table :key="tableKey" v-loading="listLoading" :data="list" border fit highlight-current-row>
        <el-table-column label="序号" min-width="40px" align="center">
          <template slot-scope="scope">
            {{ scope.$index }}
          </template>
        </el-table-column>
        <el-table-column label="钢卷编号" min-width="80px" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.serialNumber }}</span>
          </template>
        </el-table-column>
        <el-table-column label="钢种" min-width="80px" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.materialName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="产地" min-width="80px" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.vendorName }}</span>
          </template>
        </el-table-column>

        <el-table-column label="进料" align="center">
          <el-table-column label="厚度|(mm)" min-width="50px" align="center" :render-header="renderHeader">
            <template slot-scope="scope">
              <span>{{ scope.row.inputThickness }}</span>
            </template>
          </el-table-column>
          <el-table-column label="重量|(kg)" min-width="50px" align="center" :render-header="renderHeader">
            <template slot-scope="scope">
              <span>{{ scope.row.inputWeight }}</span>
            </template>
          </el-table-column>
        </el-table-column>

        <el-table-column label="生产参数" align="center">
          <el-table-column label="速度|(m/min)" min-width="50px" align="center" :render-header="renderHeader">
            <template slot-scope="scope">
              <span>{{ scope.row.processVelocity }}</span>
            </template>
          </el-table-column>
          <el-table-column label="焊机参数" align="center">
            <el-table-column label="电流" min-width="50px" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.welderCurrent }}</span>
              </template>
            </el-table-column>
            <el-table-column label="速度" min-width="50px" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.welderVelocity }}</span>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="上下机时间" min-width="65px" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.beginTime  | parseTime('{h}:{i}') }}-{{ scope.row.endTime | parseTime('{h}:{i}') }}</span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="出料" align="center">
          <el-table-column label="重量|(kg)" min-width="50px" align="center" :render-header="renderHeader">
            <template slot-scope="scope">
              <span>{{ scope.row.outputWeight }}</span>
            </template>
          </el-table-column>
          <el-table-column label="长度|(m)" min-width="50px" align="center" :render-header="renderHeader">
            <template slot-scope="scope">
              <span>{{ scope.row.outputLength }}</span>
            </template>
          </el-table-column>
          <el-table-column label="损耗原因" min-width="50px" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.lossReason }}</span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="操作" align="center" min-width="60">
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
    </div>
    <div v-show="dialogFormVisible">
      <div style="font-size: 20px;">{{textMap[dialogStatus]}}报工</div>
      <div style="margin: 10px 0px 20px;">
        <el-button type="primary" size="small" @click="dialogStatus==='create'?submit():updateData()">确认</el-button>
        <el-button type="danger" size="small" @click="dialogFormVisible = false">取消</el-button>
      </div>

      <el-form
        ref="journalingRewindItemForm"
        :rules="rules"
        :model="temp"
        label-position="right"
        label-width="150px"
      >

        <el-row>
          <el-col :span="8">
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
          <el-col :span="8">
            <el-form-item label="钢卷编号：" prop="serialNumber">
              <el-input v-model="temp.serialNumber"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="钢种：" prop="materailType">
              <el-input v-model="temp.materialName" @click.native="handleSelectMaterial"/>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="8">
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
          <el-col :span="8">
            <el-form-item label="进料厚度(mm)：" prop="inputThickness">
              <el-input v-model="temp.inputThickness"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="进料重量(kg)：" prop="inputWeight">
              <el-input v-model="temp.inputWeight"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="生产速度(m/min)：" prop="processVelocity">
              <el-input v-model="temp.processVelocity"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="焊机电流：" prop="welderCurrent">
              <el-input v-model="temp.welderCurrent"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="焊机速度：" prop="welderVelocity">
              <el-input v-model="temp.welderVelocity"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="上机时间：" prop="startTime">
              <el-date-picker
                v-model="temp.beginTime"
                type="datetime"
                placeholder="选择日期时间"
                default-time="12:00:00"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-ddTHH:mm:ss"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="下机时间：" prop="stopTime">
              <el-date-picker
                v-model="temp.endTime"
                type="datetime"
                placeholder="选择日期时间"
                default-time="12:00:00"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-ddTHH:mm:ss"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="出料重量(kg)：" prop="outputWeight">
              <el-input v-model="temp.outputWeight"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="出料长度(m)：" prop="outputLength">
              <el-input v-model="temp.outputLength"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="损耗原因：" prop="lossReason">
              <el-input v-model="temp.lossReason"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
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
  import { deepClone, parseTime } from '@/utils'

  import {
    getJournalingRewindItems,
    addJournalingRewindItem,
    updateJournalingRewindItem,
    deleteJournalingRewindItem
  } from '@/api/journalingrewinditem'

  import waves from '@/directive/waves' // Waves directive
  import Pagination from '@/components/Pagination/index.vue' // Secondary package based on el-pagination
  import Material from './material.vue'
  import { getVendors } from '@/api/vendor'
  import { getShifts } from '@/api/shift'

  export default {
    name: 'JournalingRewindItem',
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
          journalingBeginTime: parseTime(new Date(new Date(new Date().toLocaleDateString()).getTime()), '{y}-{m}-{d}T{h}:{i}:{s}'),
          journalingEndTime: parseTime(new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1), '{y}-{m}-{d}T{h}:{i}:{s}')
        },
        temp: {
          id: undefined,
          serialNumber: '',
          materialId: '',
          vendorId: undefined,
          inputThickness: '',
          inputWeight: '',
          processVelocity: '',
          welderCurrent: '',
          welderVelocity: '',
          beginTime: undefined,
          endTime: undefined,
          outputWeight: '',
          outputLength: '',
          lossReason: '',
          shiftId: ''
        },
        tempCopy: null,
        shifts: [],
        shiftMap: null,
        vendors: [],
        vendorMap: null,
        selectedMaterial: undefined,

        dialogFormVisible: false,
        dialogStatus: '',

        materialDialogFormVisible: false,
        textMap: {
          update: '编辑',
          create: '添加'
        },
        rules: {
          name: [
            { required: true, trigger: 'blur', message: '请填写子订单名称' }
          ],
          code: [
            { required: true, trigger: 'blur', message: '请填写子订单编码' }
          ]
        }
      }
    },
    created() {
      this.tempCopy = deepClone(this.temp)
      this.listLoading = true
      this.$nextTick(async() => {
        await Promise.all([
          this.getVendors({}),
          this.getShifts({})
        ])
        this.getList()
      })
    },
    methods: {
      renderHeader(h, { column, $index }) {
        return h('span', {}, [
          h('span', {}, column.label.split('|')[0]),
          h('br'),
          h('span', {}, column.label.split('|')[1])
        ])
      },

      handleSelectMaterial() {
        this.materialDialogFormVisible = true
      },
      confirmMaterial() {
        this.materialDialogFormVisible = false
        this.temp.materialId = this.selectedMaterial && this.selectedMaterial.id
        this.temp.materialName = this.selectedMaterial && this.selectedMaterial.name
      },
      async getShifts(query) {
        const res = await getShifts(query)
        this.shifts = res.queryResult.list
        this.shiftMap = _.fromPairs(this.shifts.map(shift => {
          return [shift.id, shift]
        }))
      }, async getVendors(query) {
        const res = await getVendors(query)
        this.vendors = res.queryResult.list
        this.vendorMap = _.fromPairs(this.vendors.map(vendor => {
          return [vendor.id, vendor]
        }))
      },
      getList() {
        this.listLoading = true
        getJournalingRewindItems(this.listQuery).then(res => {
          this.list = res.queryResult.list.map(item => {
            let vendor = this.vendorMap[item.vendorId]
            item.vendorName = vendor.name
            let shift = this.shiftMap[item.shiftId]
            item.shiftName = shift.name
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
      handleAdd() {
        this.resetForm('journalingRewindItemForm')
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        // this.rules.password[0].required = true
        this.$nextTick(() => {
          this.$refs['journalingRewindItemForm'].clearValidate()
        })
      },
      submit() {
        this.$refs['journalingRewindItemForm'].validate((valid) => {
          if (valid) {
            // const tempData = deepClone(this.temp)
            let journalingRewindItem = deepClone(this.temp)
            delete journalingRewindItem.vendorName
            delete journalingRewindItem.shiftName
            delete journalingRewindItem.materialName
            addJournalingRewindItem(journalingRewindItem).then((res) => {
              let vendor = this.vendorMap[journalingRewindItem.vendorId]
              let shift = this.shiftMap[journalingRewindItem.shiftId]
              res.model.vendorName = vendor.name
              res.model.shiftName = shift.name
              res.model.materialName = this.temp.materialName
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
          this.$refs['journalingRewindItemForm'].clearValidate()
        })
      },
      updateData() {
        this.$refs['journalingRewindItemForm'].validate((valid) => {
          if (valid) {
            let journalingRewindItem = deepClone(this.temp)
            delete journalingRewindItem.vendorName
            delete journalingRewindItem.shiftName
            delete journalingRewindItem.materialName
            updateJournalingRewindItem(journalingRewindItem).then(() => {
              let vendor = this.vendorMap[journalingRewindItem.vendorId]
              let shift = this.shiftMap[journalingRewindItem.shiftId]
              journalingRewindItem.shiftName = shift.name
              journalingRewindItem.materialName = this.temp.materialName
              for (const v of this.list) {
                if (v.id === journalingRewindItem.id) {
                  const index = this.list.indexOf(v)
                  this.list.splice(index, 1, journalingRewindItem)
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
        this.$confirm('此操作将永久删除该子订单, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteJournalingRewindItem(row.id).then(() => {
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
      }

    }
  }
</script>
<style lang="scss">
  .journaling-rewind-item {

  .el-table td, .el-table th {
    padding: 5px 0;
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

  }

</style>

