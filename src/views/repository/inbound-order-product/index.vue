<template>
  <div class="app-container">
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

      <el-table-column label="钢种" width="100px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.steelGrade }}</span>
        </template>
      </el-table-column>

      <el-table-column label="表面品级" width="100px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.surfaceFinish }}</span>
        </template>
      </el-table-column>
      <el-table-column label="规格|mm*mm" width="100px" align="center" :render-header="renderHeader">
        <template slot-scope="scope">
          <span>{{ scope.row.specification }}</span>
        </template>
      </el-table-column>
      <el-table-column label="净重|(kg)" width="100px" align="center" :render-header="renderHeader">
        <template slot-scope="scope">
          <span>{{ scope.row.netWeight }}</span>
        </template>
      </el-table-column>
      <el-table-column label="毛重|(kg)" width="100px" align="center" :render-header="renderHeader">
        <template slot-scope="scope">
          <span>{{ scope.row.grossWeight }}</span>
        </template>
      </el-table-column>
      <el-table-column label="参考厚度|(mm)" width="100px" align="center" :render-header="renderHeader">
        <template slot-scope="scope">
          <span>{{ scope.row.referenceThickness }}</span>
        </template>
      </el-table-column>

      <el-table-column label="参考宽度|(mm)" width="100px" align="center" :render-header="renderHeader">
        <template slot-scope="scope">
          <span>{{ scope.row.referenceWidth }}</span>
        </template>
      </el-table-column>

      <el-table-column label="参考长度|(mm)" width="100px" align="center" :render-header="renderHeader">
        <template slot-scope="scope">
          <span>{{ scope.row.referenceLength }}</span>
        </template>
      </el-table-column>
      <!--    <el-table-column label="标签规格|mm*mm" width="100px" align="center" :render-header="renderHeader">
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
          </el-table-column>-->
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
      <el-table-column label="日期" width="100px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.date }}</span>
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
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.current"
      :limit.sync="listQuery.size"
      @pagination="getList"
    />
    <el-dialog :close-on-click-modal="false" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible"
               width="1200px">
      <el-form
        ref="inboundOrderProductItemForm"
        :rules="rules"
        :model="temp"
        :inline="true"
        label-position="right"
        label-width="150px"
      >
        <el-form-item label="钢卷编号：" prop="productNumber">
          <el-select
            v-model="temp.productNumber"
            filterable
            remote
            reserve-keyword
            placeholder="请输入钢卷号"
            :remote-method="getPendingRawItemsByNumberType('productNumber')"
            :loading="loading"
            @change="handleProductNumberChange">
            <el-option
              v-for="item in pendingRawItems"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>

        </el-form-item>
        <el-form-item label="原料编号：" prop="materialNumber">
          <el-input v-model="temp.materialNumber"/>
        </el-form-item>
        <el-form-item label="钢种：" prop="steelGrade">
          <el-input v-model="temp.steelGrade"/>
        </el-form-item>
        <el-form-item label="表面品级：" prop="surfaceFinish">
          <el-input v-model="temp.surfaceFinish"/>
        </el-form-item>
        <el-form-item label="规格mm*mm：" prop="specification">
          <el-input v-model="temp.specification"/>
        </el-form-item>
        <el-form-item label="净重(kg)：" prop="netWeight">
          <el-input v-model="temp.netWeight"/>
        </el-form-item>
        <el-form-item label="标签毛重(kg)：" prop="grossWeight">
          <el-input v-model="temp.grossWeight"/>
        </el-form-item>
        <el-form-item label="参考厚度(mm)：" prop="referenceThickness">
          <el-input v-model="temp.referenceThickness"/>
        </el-form-item>
        <el-form-item label="参考宽度(mm)：" prop="referenceWidth">
          <el-input v-model="temp.referenceWidth"/>
        </el-form-item>
        <el-form-item label="参考长度(mm)：" prop="referenceLength">
          <el-input v-model="temp.referenceLength"/>
        </el-form-item>
        <el-form-item label="边部：" prop="edge">
          <el-input v-model="temp.edge"/>
        </el-form-item>
        <el-form-item label="等级：" prop="grade">
          <el-input v-model="temp.grade"/>
        </el-form-item>
        <el-form-item label="检验员：" prop="inspector">
          <el-input v-model="temp.inspector"/>
        </el-form-item>
        <el-form-item label="条码：" prop="barcode">
          <el-input v-model="temp.barcode"/>
        </el-form-item>
        <el-form-item label="日期：" prop="date">
          <el-date-picker v-model="temp.date" type="date" placeholder="请选择日期" style="width: 100%;"
                          format="yyyy 年 MM 月 dd 日"
                          value-format="yyyy-MM-dd"/>
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
    getInboundOrderProductItems,
    addInboundOrderProductItem,
    updateInboundOrderProductItem,
    deleteInboundOrderProductItem,
    getProductSerialNumbers
  } from '@/api/inboundorderproductitem.js'


  import waves from '@/directive/waves' // Waves directive
  import Pagination from '@/components/Pagination/index.vue'
  import { getOutboundOrderRawItems } from '@/api/outboundorderrawitem' // Secondary package based on el-pagination

  export default {
    name: 'InboundOrderProductItem',
    components: { Pagination },
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
          materialNumber:'',
          productNumber:'',
        },
        temp: {
          id: undefined,
          materialNumber: undefined,
          productNumber: '',
          steelGrade: '',
          surfaceFinish: undefined,
          specification: undefined,
          netWeight: undefined,
          grossWeight: undefined,
          referenceThickness: undefined,
          referenceWidth: undefined,
          referenceLength: undefined,
          edge: undefined,
          grade: undefined,
          inspector: undefined,
          barcode: undefined,
          date: undefined,
          workOrderNumber: undefined
        },
        tempCopy: null,
        pendingRawItems: [],
        loading: false,

        statuses: ['未完成', '已完成'],
        tagTypes: ['success', 'info', 'warning', 'danger'],

        dialogFormVisible: false,
        dialogStatus: '',

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
            { required: true, trigger: 'blur', message: '请填写时间' },
            { required: true, message: '请选择时间', trigger: 'change' }
          ]
        }
      }
    },

    created() {
      this.tempCopy = deepClone(this.temp)
      this.$nextTick(async() => {
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
      translateStatus(status) {
        return {
          tagType: this.tagTypes[status],
          text: this.statuses[status]
        }
      },
      getPendingRawItemsByNumberType(type) {
        return query => {
          if (query !== '') {
            this.loading = true
            getOutboundOrderRawItems({ next_operation_label: '成品入库' }).then(res => {
              this.loading = false
              this.pendingRawItems = res.queryResult.list.map(item => item[type]).filter(item => {
                return item.toLowerCase()
                  .indexOf(query.toLowerCase()) > -1
              })
            })
          } else {
            this.pendingRawItems = []
          }
        }
      },

      handleProductNumberChange(val) {
        if (val) {
          getOutboundOrderRawItems({ next_operation_label: '成品入库', product_number: val }).then(res => {
            if (res.queryResult.list.length == 1) {
              this.temp.materialNumber = res.queryResult.list[0].materialNumber
            } else {
              this.temp.materialNumber = ''
            }
          })
        }
      },

      handleMaterialNumberChange(val) {
        if (val) {
          getOutboundOrderRawItems({ next_operation_label: '成品入库', material_number: val }).then(res => {
            if (res.queryResult.list.length == 1) {
              this.temp.productNumber = res.queryResult.list[0].productNumber
            } else {
              this.temp.productNumber = ''
            }
          })
        }
      },

      getList() {
        this.listLoading = true
        getInboundOrderProductItems(this.listQuery).then(res => {
          this.list = res.queryResult.list
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
        this.resetForm('inboundOrderProductItemForm')
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        // this.rules.password[0].required = true
        this.$nextTick(() => {
          this.$refs['inboundOrderProductItemForm'].clearValidate()
        })
      },
      submit() {
        this.$refs['inboundOrderProductItemForm'].validate((valid) => {
          if (valid) {
            // const tempData = deepClone(this.temp)
            let inboundOrderProductItem = deepClone(this.temp)
            addInboundOrderProductItem(inboundOrderProductItem).then((res) => {
              this.list.unshift(res.model)
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
          this.$refs['inboundOrderProductItemForm'].clearValidate()
        })
      },
      updateData() {
        this.$refs['inboundOrderProductItemForm'].validate((valid) => {
          if (valid) {
            let inboundOrderProductItem = deepClone(this.temp)
            updateInboundOrderProductItem(inboundOrderProductItem).then(() => {
              for (const v of this.list) {
                if (v.id === inboundOrderProductItem.id) {
                  const index = this.list.indexOf(v)
                  this.list.splice(index, 1, inboundOrderProductItem)
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
          deleteInboundOrderProductItem(row.id).then(() => {
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

</style>

