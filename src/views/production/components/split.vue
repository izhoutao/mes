<template>

  <div class="outbound-order-raw-item">
    <div v-show="!splitEditorVisible">

      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span style="font-size: 25px">分卷操作台</span>
          <el-button style="float: right;"
                     v-waves class="filter-item" type="danger"
                     icon="el-icon-arrow-left" size="small"
                     @click="$emit('update:splitVisible', false)">返回
          </el-button>
        </div>
        <div class="filter-container">
          <el-form ref="filterForm" :model="listQuery" :inline="true" size="small">
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
            <el-button v-waves class="filter-item" type="primary" size="small" icon="el-icon-search"
                       @click="handleFilter">搜索
            </el-button>
            <el-button v-waves class="filter-item" size="small" @click="resetForm('filterForm');handleFilter()">重置
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
        <el-table :key="tableKey" v-loading="listLoading" :data="list" border fit highlight-current-row
                  style="width: 100%">
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
              <span>{{ scope.row.packageWeight }}</span>
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
<!--          <el-table-column label="条码" width="150px" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.barcode }}</span>
            </template>
          </el-table-column>-->
          <el-table-column label="时间" width="100px" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.time | parseTime('{y}-{m}-{d}') }}</span>
            </template>
          </el-table-column>
          <el-table-column label="备注" width="150px" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.description }}</span>
            </template>
          </el-table-column>

          <el-table-column label="操作" align="center" width="150" fixed="right">
            <template slot-scope="scope">
              <el-button type="primary" size="mini"
                         @click="handleUpdate(scope.row)">分卷
              </el-button>
              <el-button type="warning" size="mini" v-if="scope.row.parentId"
                         @click="handleRevoke(scope.row)">撤销
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
    <split-editor :parentItem="this.temp" v-if="splitEditorVisible"
                  :splitEditorVisible.sync="splitEditorVisible"></split-editor>
  </div>
</template>

<script>
  import { deepClone } from '@/utils'

  import {
    getOutboundOrderRawItems,
    getStoredRawItems
  } from '@/api/outboundorderrawitem.js'

  import waves from '@/directive/waves' // Waves directive
  import Pagination from '@/components/Pagination/index.vue' // Secondary package based on el-pagination
  import SplitEditor from './split-editor' // Secondary package based on el-pagination

  export default {
    name: 'split',
    components: { Pagination, SplitEditor },
    directives: { waves },
    props: ['operation', 'splitVisible'],

    watch: {
      splitEditorVisible: {
        handler: function(route) {
          this.listQuery.current = 1
          this.getList()
        }
        // immediate: true
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
          size: 10,
          nextOperationLabel: '',
          status: 0
        },
        temp: {
          id: undefined,
          materialNumber: undefined,
          productNumber: '',
          steelGrade: this.steelGrade,
          surfaceFinish: undefined,
          width: undefined,
          thickness: undefined,
          length: undefined,
          labelSpecification: undefined,
          specification: undefined,
          packageWeight: undefined,
          labelGrossWeight: undefined,
          netWeight: undefined,
          grossWeight: undefined,
          edge: undefined,
          grade: undefined,
          inspector: undefined,
          // barcode: undefined,
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

        splitEditorVisible: false,

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
          packageWeight: [
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
          // barcode: [
          //   { required: true, trigger: 'blur', message: '请填写条码' }
          // ],
          time: [
            { required: true, trigger: 'blur', message: '请填写日期' },
            { required: true, message: '请选择时间', trigger: 'change' }
          ]
        }
      }
    },
    created() {
      this.listQuery.nextOperationLabel = this.operation
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
      getList() {
        this.listLoading = true
        getOutboundOrderRawItems(this.listQuery).then(res => {
          this.list = res.queryResult.list
          this.total = res.queryResult.total
          this.$emit('update:outQuantity', this.total)
          this.listLoading = false
        })
      },

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

      handleUpdate(row) {
        this.temp = deepClone(row) // copy obj
        this.splitEditorVisible = true
      },
      handleRevoke(row) {
        getOutboundOrderRawItems({id:row.parentId}).then(res => {
          this.temp = res.queryResult.list[0]
          this.splitEditorVisible = true
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
    margin-bottom: 10px;
  }

  }

  .product-number {
    /*width: 100%;*/
    display: flex;
  }

  }

</style>

