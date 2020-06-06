<template>
  <div class="outbound-order-raw-item">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span style="font-size: 25px">分卷操作台--{{parentItem.productNumber}}</span>
        <el-button style="float: right;"
                   v-waves class="filter-item" type="danger"
                   icon="el-icon-arrow-left" size="small"
                   @click="$emit('update:splitEditorVisible', false)">返回
        </el-button>
      </div>
      <div class="filter-container">
        <el-form ref="filterForm" :model="listQuery" :inline="true">
          <el-button class="filter-item" size="small" type="primary"
                     icon="el-icon-edit" @click="handleAdd" v-if="parentItem.status==0">
            添加
          </el-button>
          <el-button class="filter-item" size="small" type="success"
                     icon="el-icon-check" @click="handleConfirm" v-if="parentItem.status==0">
            提交
          </el-button>
          <el-button class="filter-item" size="small" type="success"
                     icon="el-icon-check" @click="handleRevoke" v-if="parentItem.status==1">
            撤销分卷
          </el-button>
        </el-form>
      </div>
      <el-table
        :key="tableKey"
        default-expand-all
        row-key="id"
        v-loading="listLoading"
        :data="tableData"
        border
        fit
        highlight-current-row
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      >
        <!--      <el-table-column label="序号" width="60px" type="index" align="center" fixed>
              </el-table-column>-->
        <el-table-column label="钢卷编号" width="200px" align="left">
          <template slot-scope="scope">
            <span>{{ scope.row.productNumber }}</span>
          </template>
        </el-table-column>
        <el-table-column label="原料编号" width="150px" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.materialNumber }}</span>
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
        <el-table-column label="条码" width="150px" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.barcode }}</span>
          </template>
        </el-table-column>
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

        <el-table-column label="操作" align="center" width="200" fixed="right" v-if="parentItem.status==0">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" v-if="scope.$index!=0"
                       @click="handleUpdate(scope.row)">编辑
            </el-button>
            <el-button
              icon="el-icon-delete"
              size="mini"
              type="danger"
              v-if="scope.$index!=0"
              @click="handleDelete(scope.row,'true')"
            >删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog :close-on-click-modal="false" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible"
                 width="800px">
        <!-- <el-form
           ref="splitEditorForm"
           :rules="rules"
           :model="temp"
           :inline="true"
           label-position="right"
           label-width="150px"
         >
           <el-row>
             <el-col :span="8">
               <el-form-item label="原料编号：" prop="materialNumber">
                 <el-input v-model="temp.materialNumber"/>
               </el-form-item>
             </el-col>
             <el-col :span="16">
               <el-form-item label="钢卷编号：" prop="productNumber">
                 <el-input v-model="temp.productNumber"/>
               </el-form-item>
             </el-col>
           </el-row>
           <el-row>
             <el-col :span="8">
               <el-form-item label="表面品级：" prop="surfaceFinish">
                 <el-input v-model="temp.surfaceFinish"/>
               </el-form-item>
             </el-col>
             <el-col :span="8">
               <el-form-item label="宽度(mm)：" prop="width">
                 <el-input v-model="temp.width"/>
               </el-form-item>
             </el-col>
             <el-col :span="8">
               <el-form-item label="厚度(mm)：" prop="thickness">
                 <el-input v-model="temp.thickness" @input="temp.thickness=temp.thickness.replace(/[^0-9.]/g,'')"/>
               </el-form-item>
             </el-col>
           </el-row>
           <el-row>
             <el-col :span="8">
               <el-form-item label="长度(mm)：" prop="length">
                 <el-input v-model="temp.length"/>
               </el-form-item>
             </el-col>
             <el-col :span="8">
               <el-form-item label="标签规格mm*mm：" prop="labelSpecification">
                 <el-input v-model="temp.labelSpecification"/>
               </el-form-item>
             </el-col>
             <el-col :span="8">
               <el-form-item label="实际规格mm*mm：" prop="specification">
                 <el-input v-model="temp.specification"/>
               </el-form-item>
             </el-col>
           </el-row>
           <el-row>
             <el-col :span="8">
               <el-form-item label="标签净重(kg)：" prop="labelNetWeight">
                 <el-input v-model="temp.labelNetWeight"/>
               </el-form-item>
             </el-col>
             <el-col :span="8">
               <el-form-item label="标签毛重(kg)：" prop="labelGrossWeight">
                 <el-input v-model="temp.labelGrossWeight"/>
               </el-form-item>
             </el-col>
             <el-col :span="8">
               <el-form-item label="实磅净重(kg)：" prop="netWeight">
                 <el-input v-model="temp.netWeight"/>
               </el-form-item>
             </el-col>
           </el-row>
           <el-row>
             <el-col :span="8">
               <el-form-item label="实磅毛重(kg)：" prop="grossWeight">
                 <el-input v-model="temp.grossWeight"/>
               </el-form-item>
             </el-col>
             <el-col :span="8">
               <el-form-item label="边部：" prop="edge">
                 <el-input v-model="temp.edge"/>
               </el-form-item>
             </el-col>
             <el-col :span="8">
               <el-form-item label="等级：" prop="grade">
                 <el-input v-model="temp.grade"/>
               </el-form-item>
             </el-col>
           </el-row>
           <el-row>
             <el-col :span="8">
               <el-form-item label="检验员：" prop="inspector">
                 <el-input v-model="temp.inspector"/>
               </el-form-item>
             </el-col>
             <el-col :span="8">
               <el-form-item label="条码：" prop="barcode">
                 <el-input v-model="temp.barcode"/>
               </el-form-item>
             </el-col>
             <el-col :span="8">
               <el-form-item label="时间：" prop="time">
                 <el-date-picker v-model="temp.time" type="datetime" placeholder="请选择时间" style="width: 100%;"
                                 format="yyyy-MM-dd HH:mm:ss"
                                 value-format="yyyy-MM-ddTHH:mm:ss"
                 />
               </el-form-item>
             </el-col>
           </el-row>
           <el-row>
             <el-col :span="24">
               <el-form-item label="描述：" prop="description">
                 <el-input
                   v-model="temp.description"
                   :autosize="{ minRows: 2, maxRows: 4}"
                   type="textarea"
                   placeholder="描述"
                 />
               </el-form-item>
             </el-col>
           </el-row>
         </el-form>-->

        <!--<el-form
          ref="splitEditorForm"
          :rules="rules"
          :model="temp"
          :inline="true"
          label-position="right"
          label-width="150px"
        >
          <el-row>
            <el-col :span="8">
              <el-form-item label="长度(mm)：" prop="length">
                <el-input v-model="temp.length"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="实磅净重(kg)：" prop="netWeight">
                <el-input v-model="temp.netWeight"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="实磅毛重(kg)：" prop="grossWeight">
                <el-input v-model="temp.grossWeight"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-col :span="8">
            <el-form-item label="检验员：" prop="inspector">
              <el-input v-model="temp.inspector"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="条码：" prop="barcode">
              <el-input v-model="temp.barcode"/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="描述：" prop="description">
              <el-input
                v-model="temp.description"
                :autosize="{ minRows: 2, maxRows: 4}"
                type="textarea"
                placeholder="描述"
              />
            </el-form-item>
          </el-col>
          </el-row>

        </el-form>-->

        <el-form
          ref="splitEditorForm"
          :rules="rules"
          :model="temp"
          :inline="true"
          label-position="right"
          label-width="150px"
        >

          <el-form-item label="长度(mm)：" prop="length">
            <el-input v-model="temp.length"/>
          </el-form-item>
          <el-form-item label="实磅净重(kg)：" prop="netWeight">
            <el-input v-model="temp.netWeight"/>
          </el-form-item>

          <el-form-item label="实磅毛重(kg)：" prop="grossWeight">
            <el-input v-model="temp.grossWeight"/>
          </el-form-item>

          <el-form-item label="检验员：" prop="inspector">
            <el-input v-model="temp.inspector"/>
          </el-form-item>

          <el-form-item label="条码：" prop="barcode">
            <el-input v-model="temp.barcode"/>
          </el-form-item>

          <el-form-item label="描述：" prop="description">
            <el-input
              v-model="temp.description"
              :autosize="{ minRows: 2, maxRows: 4}"
              type="textarea"
              placeholder="描述"
            />
          </el-form-item>


        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button type="danger" size="small" @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" size="small" @click="dialogStatus==='create'?submit():updateData()">确认</el-button>
        </div>
      </el-dialog>

    </el-card>
  </div>
</template>

<script>
  import { deepClone } from '@/utils'

  import {
    getOutboundOrderRawItems,
  } from '@/api/outboundorderrawitem.js'

  import {
    saveOrUpdateSplitRawItem,
    splitRawItem,
    undoSplitRawItem,
    removeSplitRawItem
  } from '@/api/journalingrewinditem.js'

  import waves from '@/directive/waves' // Waves directive
  import Pagination from '@/components/Pagination/index.vue' // Secondary package based on el-pagination

  export default {
    name: 'SplitEditor',
    components: { Pagination },
    directives: { waves },
    props: ['parentItem', 'splitEditorVisible'],
    computed: {
      tableData() {
        this.parentItem.children = this.list
        return [this.parentItem]
      }
    },
    data() {
      return {
        tableKey: 0,
        list: [],
        total: 0,
        listLoading: true,
        listQuery: {
          parentId: '',
          status: undefined
        },
        temp: {
          id: undefined,
          materialNumber: undefined,
          productNumber: '',
          steelGrade: '',
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

      this.listQuery.parentId = this.parentItem.id
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

      getList() {
        this.listLoading = true
        getOutboundOrderRawItems(this.listQuery).then(res => {
          this.list = res.queryResult.list
          this.total = res.queryResult.total
          this.$emit('update:outQuantity', this.total)
          this.listLoading = false
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
        this.resetForm('splitEditorForm')
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        // this.rules.password[0].required = true
        this.$nextTick(() => {
          this.$refs['splitEditorForm'].clearValidate()
        })
      },
      submit() {
        this.$refs['splitEditorForm'].validate((valid) => {
          if (valid) {
            // const tempData = deepClone(this.temp)
            let outboundOrderRawItem = deepClone(this.temp)
            saveOrUpdateSplitRawItem(this.parentItem.productNumber, outboundOrderRawItem).then((res) => {
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
          this.$refs['splitEditorForm'].clearValidate()
        })
      },
      updateData() {
        this.$refs['splitEditorForm'].validate((valid) => {
          if (valid) {
            let outboundOrderRawItem = deepClone(this.temp)
            saveOrUpdateSplitRawItem(this.parentItem.productNumber, outboundOrderRawItem).then((res) => {
              for (const v of this.list) {
                if (v.id === outboundOrderRawItem.id) {
                  const index = this.list.indexOf(v)
                  this.list.splice(index, 1, res.model)
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
        this.$confirm('此操作将永久删除该分卷单项, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          removeSplitRawItem(row.id).then(() => {
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
      },
      handleConfirm() {
        splitRawItem(this.parentItem.productNumber).then(() => {
          this.$notify({
            title: '成功',
            message: '分卷成功',
            type: 'success',
            duration: 2000
          })
          this.$emit('update:splitEditorVisible', false)
        })
      },
      handleRevoke() {
        undoSplitRawItem(this.parentItem.productNumber).then(() => {
          this.$notify({
            title: '成功',
            message: '撤销分卷成功',
            type: 'success',
            duration: 2000
          })
          this.$emit('update:splitEditorVisible', false)
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
    margin-bottom: 16px;
  }

  .el-table th, td {
    padding: 3px 0 !important;

  }

  .product-number {
    /*width: 100%;*/
    display: flex;
  }

  }

</style>

