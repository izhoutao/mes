<template>
  <div class="outbound-order-raw-item">
    <div class="filter-container">
      <el-form ref="filterForm" :model="listQuery" :inline="true">
        <el-form-item label="" prop="materialNumber">
          <el-input
            v-model="listQuery.materialNumber"
            placeholder="请输入来料编号"
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
      <el-table-column label="序号" width="60px" type="index" align="center" fixed>
      </el-table-column>
      <el-table-column label="原料编号" width="160px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.materialNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column label="钢卷编号" width="160px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.productNumber }}</span>
        </template>
      </el-table-column>
      <!--      <el-table-column label="钢种" width="100px" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.steelGrade }}</span>
              </template>
            </el-table-column>-->
      <el-table-column label="表面品级" width="100px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.surfaceFinish }}</span>
        </template>
      </el-table-column>
      <el-table-column label="宽度|(mm)" width="100px" align="center" :render-header="renderHeader">
        <template slot-scope="scope">
          <span>{{ scope.row.width }}</span>
        </template>
      </el-table-column>
      <el-table-column label="厚度|(mm)" width="100px" align="center" :render-header="renderHeader">
        <template slot-scope="scope">
          <span>{{ scope.row.thickness }}</span>
        </template>
      </el-table-column>
      <el-table-column label="长度|(mm)" width="100px" align="center" :render-header="renderHeader">
        <template slot-scope="scope">
          <span>{{ scope.row.length }}</span>
        </template>
      </el-table-column>
      <el-table-column label="标签规格|mm*mm" width="100px" align="center" :render-header="renderHeader">
        <template slot-scope="scope">
          <span>{{ scope.row.labelSpecification }}</span>
        </template>
      </el-table-column>
      <el-table-column label="实际规格|mm*mm" width="100px" align="center" :render-header="renderHeader">
        <template slot-scope="scope">
          <span>{{ scope.row.specification }}</span>
        </template>
      </el-table-column>
      <el-table-column label="标签净重|(kg)" width="100px" align="center" :render-header="renderHeader">
        <template slot-scope="scope">
          <span>{{ scope.row.labelNetWeight }}</span>
        </template>
      </el-table-column>
      <el-table-column label="标签毛重|(kg)" width="100px" align="center" :render-header="renderHeader">
        <template slot-scope="scope">
          <span>{{ scope.row.labelGrossWeight }}</span>
        </template>
      </el-table-column>
      <el-table-column label="实磅净重|(kg)" width="100px" align="center" :render-header="renderHeader">
        <template slot-scope="scope">
          <span>{{ scope.row.netWeight }}</span>
        </template>
      </el-table-column>
      <el-table-column label="实磅毛重|(kg)" width="100px" align="center" :render-header="renderHeader">
        <template slot-scope="scope">
          <span>{{ scope.row.grossWeight }}</span>
        </template>
      </el-table-column>
      <el-table-column label="边部" width="100px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.edge }}</span>
        </template>
      </el-table-column>
      <el-table-column label="等级" width="100px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.grade }}</span>
        </template>
      </el-table-column>
      <el-table-column label="检验员" width="100px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.inspector }}</span>
        </template>
      </el-table-column>
      <el-table-column label="条码" width="120px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.barcode }}</span>
        </template>
      </el-table-column>
      <el-table-column label="时间" width="100px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.description }}</span>
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
               width="500px">
      <el-form
        ref="outboundOrderRawItemForm"
        :rules="rules"
        :model="temp"
        :inline="true"
        label-position="right"
        label-width="150px"
      >

        <!--        <el-form-item label="钢卷编号：" prop="productNumber">
                  <el-select
                    v-model="temp.productNumber"
                    filterable
                    remote
                    reserve-keyword
                    placeholder="请输入钢卷号"
                    :remote-method="getStoredRawItems"
                    :loading="loading">
                    <el-option
                      v-for="item in storedRawItems"
                      :key="item"
                      :label="item"
                      :value="item">
                    </el-option>
                  </el-select>

                </el-form-item>-->

        <el-form-item label="钢卷编号：" prop="productNumber">
          <el-autocomplete
            v-model="temp.productNumber"
            :fetch-suggestions="getStoredRawItems"
            placeholder="请输入钢卷号"
          ></el-autocomplete>
        </el-form-item>
        <el-form-item label="日期：" prop="time">
          <el-date-picker v-model="temp.time" type="datetime" placeholder="请选择时间" style="width: 100%;"
                          format="yyyy-MM-dd HH:mm:ss"
                          value-format="yyyy-MM-ddTHH:mm:ss"
          />
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
      <material :selectedMaterial.sync="selectedMaterial"/>
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
    getOutboundOrderRawItems,
    addOutboundOrderRawItem,
    updateOutboundOrderRawItem,
    deleteOutboundOrderRawItem,
    getStoredRawItems
  } from '@/api/outboundorderrawitem.js'
  import {
    getInboundOrderRawItems,
    addInboundOrderRawItem,
    updateInboundOrderRawItem,
    deleteInboundOrderRawItem,
    getProductSerialNumbers
  } from '@/api/inboundorderrawitem.js'
  import waves from '@/directive/waves' // Waves directive
  import Pagination from '@/components/Pagination/index.vue' // Secondary package based on el-pagination
  import Material from './material.vue'

  export default {
    name: 'OutboundOrderRawItem',
    components: { Pagination, Material },
    directives: { waves },
    props: ['outboundOrderRawDetailId', 'materialName', 'outQuantity'],
    data() {
      return {
        tableKey: 0,
        list: [],
        total: this.outQuantity,
        listLoading: true,
        listQuery: {
          current: 1,
          size: 10,
          outboundOrderRawDetailId: this.outboundOrderRawDetailId,
        },
        temp: {
          id: undefined,
          outboundOrderRawRawId: '',
          outboundOrderRawDetailId: this.outboundOrderRawDetailId,
          materialNumber: undefined,
          productNumber: '',
          steelGrade: this.materialName,
          surfaceFinish: undefined,
          width: undefined,
          thickness: undefined,
          length: undefined,
          labelSpecification: undefined,
          specification: undefined,
          labelNetWeight: undefined,
          labelGrossWeight: undefined,
          netWeight: undefined,
          grossWeight: undefined,
          edge: undefined,
          grade: undefined,
          inspector: undefined,
          barcode: undefined,
          time: undefined,
          description: undefined,
          createTime: undefined,
          updateTime: undefined
          /*          workOrderId: undefined,
                    workOrderNumber: undefined*/
        },
        tempCopy: null,
        // storedRawItems: [],
        // loading: false,
        statuses: ['未完成', '已完成'],
        tagTypes: ['success', 'info', 'warning', 'danger'],
        selectedMaterial: undefined,

        dialogFormVisible: false,
        dialogStatus: '',

        materialDialogFormVisible: false,
        textMap: {
          update: '编辑',
          create: '添加'
        },
        rules: {
          materialNumber: [
            { required: true, trigger: 'blur', message: '请填写来料编号' }
          ],
          productNumber: [
            { required: true, trigger: 'blur', message: '请填写钢卷编号' }
          ],
          /*          steelGrade: [
                      { required: true, trigger: 'blur', message: '请填写钢种' }
                    ],*/
          surfaceFinish: [
            { required: true, trigger: 'blur', message: '请填写表面品级' }
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
          labelSpecification: [
            { required: true, trigger: 'blur', message: '请填写标签规格' }
          ],
          specification: [
            { required: true, trigger: 'blur', message: '请填写实际规格' }
          ],
          labelNetWeight: [
            { required: true, trigger: 'blur', message: '请填写标签净重' }
          ],
          labelGrossWeight: [
            { required: true, trigger: 'blur', message: '请填写标签毛重' }
          ],
          netWeight: [
            { required: true, trigger: 'blur', message: '请填写实磅净重' }
          ],
          grossWeight: [
            { required: true, trigger: 'blur', message: '请填写实磅毛重' }
          ],
          edge: [
            { required: true, trigger: 'blur', message: '请填写边部' }
          ],
          grade: [
            { required: true, trigger: 'blur', message: '请填写等级' }
          ],
          inspector: [
            { required: true, trigger: 'blur', message: '请填写检验员' }
          ],
          barcode: [
            { required: true, trigger: 'blur', message: '请填写条码' }
          ],
          time: [
            { required: true, trigger: 'blur', message: '请填写日期' },
            { required: true, message: '请选择时间', trigger: 'change' }
          ]
        }
      }
    },
    created() {
      this.tempCopy = deepClone(this.temp)
      this.getList()
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
        getProductSerialNumbers(1).then(res => {
          // console.log(res)
          this.temp.productNumber = res.model[0]
        })
      },
      handleSelectMaterial() {
        this.materialDialogFormVisible = true
      },
      confirmMaterial() {
        this.materialDialogFormVisible = false
        this.temp.materialId = this.selectedMaterial && this.selectedMaterial.id
        this.temp.materialName = this.selectedMaterial && this.selectedMaterial.name
      },
      getList() {
        this.listLoading = true
        getOutboundOrderRawItems(this.listQuery).then(res => {
          this.list = res.queryResult.list
          this.total = res.queryResult.total
          this.$emit('update:outQuantity', this.total)
          this.listLoading = false
        })
      },

      /*      getStoredRawItems(query) {
              if (query !== '') {
                this.loading = true
                getStoredRawItems().then(res => {
                  this.loading = false
                  this.storedRawItems = res.queryResult.list.filter(item => {
                    return item.toLowerCase()
                      .indexOf(query.toLowerCase()) > -1
                  })
                })
              } else {
                this.storedRawItems = []
              }
            },*/
      getStoredRawItems(queryString, cb) {
        getStoredRawItems().then(res => {
          let storedRawItems = res.queryResult.list.map(item => {
            return { value: item }
          }).filter(this.createStateFilter(queryString))
          cb(storedRawItems)
        })

      },
      createStateFilter(queryString) {
        return (state) => {
          return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) > -1)
        }
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
        this.resetForm('outboundOrderRawItemForm')
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        // this.rules.password[0].required = true
        this.$nextTick(() => {
          this.$refs['outboundOrderRawItemForm'].clearValidate()
        })
      },
      submit() {
        this.$refs['outboundOrderRawItemForm'].validate((valid) => {
          if (valid) {
            // const tempData = deepClone(this.temp)
            let outboundOrderRawItem = deepClone(this.temp)
            addOutboundOrderRawItem(outboundOrderRawItem).then((res) => {
              this.list.unshift(res.model)
              this.$emit('update:outQuantity', ++this.total)
              this.dialogFormVisible = false
              // this.storedRawItems = []
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
          this.$refs['outboundOrderRawItemForm'].clearValidate()
        })
      },
      updateData() {
        this.$refs['outboundOrderRawItemForm'].validate((valid) => {
          if (valid) {
            let outboundOrderRawItem = deepClone(this.temp)
            updateOutboundOrderRawItem(outboundOrderRawItem).then(() => {
              for (const v of this.list) {
                if (v.id === outboundOrderRawItem.id) {
                  const index = this.list.indexOf(v)
                  this.list.splice(index, 1, outboundOrderRawItem)
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
          deleteOutboundOrderRawItem(row.id).then(() => {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
            const index = this.list.indexOf(row)
            this.list.splice(index, 1)
            this.$emit('update:outQuantity', --this.total)
          })
        })
      }

    }
  }
</script>
<style lang="scss">
  .outbound-order-raw-item {

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

