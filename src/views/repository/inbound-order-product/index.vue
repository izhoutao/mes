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
        <el-form-item label="" prop="workOrderNumber">
          <el-input
            v-model="listQuery.workOrderNumber"
            placeholder="请输入工单号"
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
    <!--startprint-->
    <div id="label-container" v-show="false">
      <div id="product-label"
           style="padding: 10px;border: 6px solid blue;border-radius: 60px; width: 710px;display: flex;flex-direction: column;justify-content: space-between;align-items:center;">
        <div
          style="width:590px;display: flex;flex-direction: column;justify-content: space-between;align-items:center;">
          <div
            style="margin-bottom: 10px;width:100%;display: flex;flex-direction: row;justify-content: space-around;align-items:flex-start;">
            <img src="@/assets/haili-logo.jpg" style="width:120px;height: 100px;">
            <div
              style="width:100%;height: 100%;display: flex;flex-direction: column;justify-content: space-around;align-items:center;">
              <div style="margin-bottom: 20px; font-size:25px;font-family:'楷体';font-weight: bold;"> 抚州市海利金属科技有限公司</div>
              <div style="font-size:14px;font-family:'Microsoft YaHei';font-weight: bold;">FUZHOU HAILI METAL TECHNOLOGY
                CO., LTD
              </div>
            </div>
            <img src="@/assets/haili-qrcode.png" style="width:100px;height: 100px;">
          </div>
          <div
            style="margin-bottom: 10px;width:100%;display: flex;flex-direction: row;justify-content:space-around;align-items:center;font-size:20px;font-family:'楷体';font-weight: bold;">
            <div>电&nbsp;话&nbsp;号：0794-2192888</div>
            <div>Telephone：0794-2192888</div>
          </div>
        </div>
        <div
          style="width:680px;font-size:20px;font-family:'楷体';display: flex;flex-direction: column;justify-content: space-between;align-items:flex-start;">
          <div style="display: flex;flex-direction: row;justify-content: space-between;align-items:center;">
            <div
              style="width: 120px;height: 60px; border:1px solid black;border-right:none;border-bottom:none;display: flex;flex-direction: column;justify-content:center;align-items:center;">
              <div>钢卷编号</div>
              <div style="font-size:15px;font-family:'Microsoft YaHei';">Product ID</div>
            </div>
            <div
              style="width: 140px;height: 60px;border:1px solid black;border-right:none;border-bottom:none;text-align:center;line-height:60px;">
              {{temp.productNumber}}
            </div>
            <div
              style="width: 120px;height: 60px;border:1px solid black;border-right:none;border-bottom:none;display: flex;flex-direction: column;justify-content:center;align-items:center;">
              <div>钢种</div>
              <div style="font-size:15px;font-family:'Microsoft YaHei';">Steel grade</div>
            </div>
            <div
              style="width: 90px;height: 60px;border:1px solid black;border-right:none;border-bottom:none;text-align:center;line-height:60px;">
              {{temp.steelGrade}}
            </div>
            <div
              style="width: 120px;height: 60px;border:1px solid black;border-right:none;border-bottom:none;display: flex;flex-direction: column;justify-content:center;align-items:center;">
              <div>表面品级</div>
              <div style="font-size:15px;font-family:'Microsoft YaHei';">Surface Finish</div>
            </div>
            <div
              style="width: 90px;height: 60px;border:1px solid black;border-bottom:none;text-align:center;line-height:60px;">
              {{temp.surfaceFinish}}
            </div>
          </div>
          <div style="display: flex;flex-direction: row;justify-content: space-between;align-items:center;">
            <div
              style="width: 120px;height: 60px;border:1px solid black;border-right:none;border-bottom:none;display: flex;flex-direction: column;justify-content:center;align-items:center;">
              <div>规格mm*mm</div>
              <div style="font-size:15px;font-family:'Microsoft YaHei';">Specifications</div>
            </div>
            <div
              style="width: 140px;height: 60px;border:1px solid black;border-right:none;border-bottom:none;text-align:center;line-height:60px;">
              {{temp.specification}}
            </div>
            <div
              style="width: 120px;height: 60px;border:1px solid black;border-right:none;border-bottom:none;display: flex;flex-direction: column;justify-content:center;align-items:center;">
              <div>净重</div>
              <div style="font-size:15px;font-family:'Microsoft YaHei';">NET WT (Kg)</div>
            </div>
            <div
              style="width: 90px;height: 60px;border:1px solid black;border-right:none;border-bottom:none;text-align:center;line-height:60px;">
              {{temp.netWeight}}
            </div>
            <div
              style="width: 120px;height: 60px;border:1px solid black;border-right:none;border-bottom:none;display: flex;flex-direction: column;justify-content:center;align-items:center;">
              <div>毛重</div>
              <div style="font-size:15px;font-family:'Microsoft YaHei';">GR WT (Kg)</div>
            </div>
            <div
              style="width: 90px;height: 60px;border:1px solid black;border-bottom:none;text-align:center;line-height:60px;">
              {{temp.grossWeight}}
            </div>
          </div>
          <div style="display: flex;flex-direction: row;justify-content: space-between;align-items:center;">
            <div
              style="width: 120px;height: 60px;border:1px solid black;border-right:none;border-bottom:none;display: flex;flex-direction: column;justify-content:center;align-items:center;">
              <div>参考厚度mm</div>
              <div style="font-size:15px;font-family:'Microsoft YaHei';">Reference T</div>
            </div>
            <div
              style="width: 140px;height: 60px;border:1px solid black;border-right:none;border-bottom:none;text-align:center;line-height:60px;">
              {{temp.referenceThickness}}
            </div>
            <div
              style="width: 120px;height: 60px;border:1px solid black;border-right:none;border-bottom:none;display: flex;flex-direction: column;justify-content:center;align-items:center;">
              <div>参考宽度mm</div>
              <div style="font-size:15px;font-family:'Microsoft YaHei';">Reference W</div>
            </div>
            <div
              style="width: 90px;height: 60px;border:1px solid black;border-right:none;border-bottom:none;text-align:center;line-height:60px;">
              {{temp.referenceWidth}}
            </div>
            <div
              style="width: 120px;height: 60px;border:1px solid black;border-right:none;border-bottom:none;display: flex;flex-direction: column;justify-content:center;align-items:center;">
              <div>参考长度mm</div>
              <div style="font-size:15px;font-family:'Microsoft YaHei';">Reference L</div>
            </div>
            <div
              style="width: 90px;height: 60px;border:1px solid black;border-bottom:none;text-align:center;line-height:60px;">
              {{temp.referenceLength}}
            </div>
          </div>
          <div style="display: flex;flex-direction: row;justify-content: space-between;align-items:center;">
            <div
              style="width: 120px;height: 60px;border:1px solid black;border-right:none;border-bottom:none;display: flex;flex-direction: column;justify-content:center;align-items:center;">
              <div>边部</div>
              <div style="font-size:15px;font-family:'Microsoft YaHei';">Edge</div>
            </div>
            <div
              style="width: 140px;height: 60px;border:1px solid black;border-right:none;border-bottom:none;text-align:center;line-height:60px;">
              {{temp.edge}}
            </div>
            <div
              style="width: 120px;height: 60px;border:1px solid black;border-right:none;border-bottom:none;display: flex;flex-direction: column;justify-content:center;align-items:center;">
              <div>等级</div>
              <div style="font-size:15px;font-family:'Microsoft YaHei';">Grade</div>
            </div>
            <div
              style="width: 90px;height: 60px;border:1px solid black;border-right:none;border-bottom:none;text-align:center;line-height:60px;">
              {{temp.grade}}
            </div>
            <div
              style="width: 120px;height: 60px;border:1px solid black;border-right:none;border-bottom:none;display: flex;flex-direction: column;justify-content:center;align-items:center;">
              <div>检验员</div>
              <div style="font-size:15px;font-family:'Microsoft YaHei';">Insp.</div>
            </div>
            <div
              style="width: 90px;height: 60px;border:1px solid black;border-bottom:none;text-align:center;line-height:60px;">
              {{temp.inspector}}
            </div>
          </div>
          <div style="display: flex;flex-direction: row;justify-content: space-between;align-items:center;">
            <div
              style="width: 120px;height: 80px;border:1px solid black;border-right:none;display: flex;flex-direction: column;justify-content:center;align-items:center;">
              <div>日期</div>
              <div style="font-size:15px;font-family:'Microsoft YaHei';">Date</div>
            </div>
            <div
              style="width: 140px;height: 80px;border:1px solid black;border-right:none;text-align:center;line-height:80px;">
              {{temp.date}}
            </div>
            <div
              style="width: 120px;height: 80px;border:1px solid black;border-right:none;display: flex;flex-direction: column;justify-content:center;align-items:center;">
              <div>条码</div>
              <div style="font-size:15px;font-family:'Microsoft YaHei';">barcode</div>
            </div>
            <div
              style="width: 302px;height: 80px;border:1px solid black;display: flex;flex-direction: column;justify-content:center;align-items:center;">
              <svg id="barcode"
                   jsbarcode-format="CODE128"
                   :jsbarcode-value=temp.productNumber
                   jsbarcode-textmargin="0"
                   jsbarcode-fontoptions="bold"
                   jsbarcode-width="1.5"
                   jsbarcode-height="35"
              ></svg>
            </div>

            <!--            <div-->
            <!--              style="width: 120px;height: 80px;border:1px solid black;border-left:none;display: flex;flex-direction: column;justify-content:center;align-items:center;">-->

            <!--            </div>-->
            <!--            <div-->
            <!--              style="width: 91px;height: 80px;border:1px solid black;border-left:none;text-align:center;line-height:60px;">-->

            <!--            </div>-->
          </div>
        </div>
      </div>
    </div>
    <!--endprint-->

    <!--    <el-dropdown>
          <el-button icon="printer" type="primary">
            打印选项
            <el-icon type="down"/>
            <i class="el-icon-edit"></i>

          </el-button>
          <el-menu slot="dropdown">
            <el-menu-item type="primary" @click="printPreview(0)">直接打印</el-menu-item>
            <el-menu-item type="primary" @click="printPreview(1)">打印预览</el-menu-item>
            <el-menu-item type="primary" @click="printPreview(2)">打印维护</el-menu-item>
            <el-menu-item type="primary" @click="printPreview(3)">打印设计</el-menu-item>
          </el-menu>
        </el-dropdown>-->


    <!--    <el-dropdown>
          <span class="el-dropdown-link">
            打印选项<i class="el-icon-arrow-down el-icon&#45;&#45;right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click="printPreview(0)">直接打印</el-dropdown-item>
            <el-dropdown-item @click="printPreview(1)">打印预览</el-dropdown-item>
            <el-dropdown-item @click="printPreview(2)">打印维护</el-dropdown-item>
            <el-dropdown-item @click="printPreview(3)">打印设计</el-dropdown-item>

          </el-dropdown-menu>
        </el-dropdown>-->
    <!--
        <el-button @click="setImage"></el-button>
    -->

    <!--    <el-dropdown @command="handleCommand">
          <span class="el-dropdown-link">
            打印选项<i class="el-icon-arrow-down el-icon&#45;&#45;right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command=1>直接打印</el-dropdown-item>
            <el-dropdown-item command=2>打印预览</el-dropdown-item>
            <el-dropdown-item command=3>打印维护</el-dropdown-item>
            <el-dropdown-item command=4>打印设计</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>-->


    <el-table :key="tableKey" v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column label="序" width="40px" type="index" align="center" fixed>
      </el-table-column>
      <el-table-column label="工单号" min-width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.workOrderNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column label="原料编号" min-width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.materialNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column label="钢卷编号" min-width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.productNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column label="钢种" min-width="100px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.steelGrade }}</span>
        </template>
      </el-table-column>
      <el-table-column label="表面品级" min-width="80px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.surfaceFinish }}</span>
        </template>
      </el-table-column>
      <el-table-column label="规格|mm*mm" min-width="100px" align="center" :render-header="renderHeader">
        <template slot-scope="scope">
          <span>{{ scope.row.specification }}</span>
        </template>
      </el-table-column>
      <el-table-column label="净重|(kg)" min-width="80px" align="center" :render-header="renderHeader">
        <template slot-scope="scope">
          <span>{{ scope.row.netWeight }}</span>
        </template>
      </el-table-column>
      <el-table-column label="毛重|(kg)" min-width="80px" align="center" :render-header="renderHeader">
        <template slot-scope="scope">
          <span>{{ scope.row.grossWeight }}</span>
        </template>
      </el-table-column>
      <el-table-column label="参考厚度|(mm)" min-width="80px" align="center" :render-header="renderHeader">
        <template slot-scope="scope">
          <span>{{ scope.row.referenceThickness }}</span>
        </template>
      </el-table-column>
      <el-table-column label="参考宽度|(mm)" min-width="80px" align="center" :render-header="renderHeader">
        <template slot-scope="scope">
          <span>{{ scope.row.referenceWidth }}</span>
        </template>
      </el-table-column>
      <el-table-column label="参考长度|(mm)" min-width="80px" align="center" :render-header="renderHeader">
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
      <el-table-column label="边部" min-width="80px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.edge }}</span>
        </template>
      </el-table-column>
      <el-table-column label="等级" min-width="80px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.grade }}</span>
        </template>
      </el-table-column>
      <el-table-column label="检验员" min-width="100px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.inspector }}</span>
        </template>
      </el-table-column>
      <!--      <el-table-column label="条码" width="120px" align="center">
              <template slot-scope="scope">
                &lt;!&ndash;          <span>{{ scope.row.barcode }}</span>&ndash;&gt;
              </template>
            </el-table-column>-->
      <el-table-column label="日期" min-width="100px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.date }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="120" fixed="right">
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
          <!--          <el-button type="success" @click="handlePrint">打印</el-button>-->
          <!--          <button v-print="'#printMe'">Print local range</button>-->

          <i class="el-icon-edit update" @click="handleUpdate(scope.row)"/>
          <i class="el-icon-delete delete" @click="handleDelete(scope.row,'true')"/>
          <i class="el-icon-printer" @click="handlePrint(scope.row,2)"/>
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
          <el-autocomplete
            :disabled="this.dialogStatus != 'create'"
            v-model="temp.productNumber"
            :fetch-suggestions="getPendingItemsByNumberType('productNumber')"
            placeholder="请输入钢卷号"
            @select="item => handleNumberChange(item,'materialNumber')"
          ></el-autocomplete>
        </el-form-item>
        <el-form-item label="原料编号：" prop="materialNumber">
          <el-autocomplete
            :disabled="this.dialogStatus != 'create'"
            v-model="temp.materialNumber"
            :fetch-suggestions="getPendingItemsByNumberType('materialNumber')"
            placeholder="请输入原料编号"
            @select="item => handleNumberChange(item,'productNumber')"
          ></el-autocomplete>
        </el-form-item>
        <el-form-item label="钢种：" prop="steelGrade">
          <el-input :disabled="this.dialogStatus != 'create'" v-model="temp.steelGrade"/>
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
        <!--        <el-form-item label="条码：" prop="barcode">
                  <el-input v-model="temp.barcode"/>
                </el-form-item>-->
        <el-form-item label="日期：" prop="date">
          <el-date-picker v-model="temp.date" type="date" placeholder="请选择日期" style="width: 100%;"
                          format="yyyy-MM-dd"
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
    deleteInboundOrderProductItem
  } from '@/api/inboundorderproductitem.js'

  import waves from '@/directive/waves' // Waves directive
  import Pagination from '@/components/Pagination/index.vue'
  import { getOutboundOrderRawItems } from '@/api/outboundorderrawitem' // Secondary package based on el-pagination
  // Local instruction
  // import print from 'vue-print-nb'
  // import { getLodop } from '@/assets/js/LodopFuncs'
  import html2canvas from 'html2canvas'
  import JsBarcode from 'jsbarcode'

  export default {
    name: 'inboundOrderProduct',
    components: { Pagination },
    directives: { waves, print },
    data() {
      return {
        tableKey: 0,
        list: [],
        total: 0,
        listLoading: true,
        listQuery: {
          current: 1,
          size: 10,
          materialNumber: '',
          productNumber: '',
          workOrderNumber: ''
        },
        temp: {
          id: undefined,
          materialNumber: '',
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
          // barcode: undefined,
          date: undefined,
          workOrderNumber: undefined
        },
        tempCopy: null,

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
            { required: true, trigger: 'blur', message: '请填写原料编号' }
          ],
          productNumber: [
            { required: true, trigger: 'blur', message: '请填写钢卷编号' }
          ],
          steelGrade: [
            { required: true, trigger: 'blur', message: '请填写钢种' }
          ],
          surfaceFinish: [
            { required: true, trigger: 'blur', message: '请填写表面品级' }
          ],
          specification: [
            { required: true, trigger: 'blur', message: '请填写规格' }
          ],
          netWeight: [
            { required: true, trigger: 'blur', message: '请填写净重' }
          ],
          grossWeight: [
            { required: true, trigger: 'blur', message: '请填写标签毛重' }
          ],
          referenceWidth: [
            { required: true, trigger: 'blur', message: '请填写参考宽度' }
          ],
          referenceThickness: [
            { required: true, trigger: 'blur', message: '请填写参考厚度' }
          ],
          referenceLength: [
            { required: true, trigger: 'blur', message: '请填写参考长度' }
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
          date: [
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
      /*      setImage() {
              let that = this
              event.preventDefault()
              var canvas2 = document.createElement('canvas')
              let _canvas = document.getElementById('product-label')
              var w = parseInt(window.getComputedStyle(_canvas).width)
              var h = parseInt(window.getComputedStyle(_canvas).height)
              //将canvas画布放大若干倍，然后盛放在较小的容器内，就显得不模糊了
              canvas2.width =  w
              canvas2.height =  h
              canvas2.style.width = w + 'px'
              canvas2.style.height = h + 'px'
              console.log(canvas2)
              //可以按照自己的需求，对context的参数修改,translate指的是偏移量
              //  var context = canvas.getContext("2d");
              //  context.translate(0,0);

              var context = canvas2.getContext('2d')
              /!*        context.scale(1, 1)
                      console.log(canvas2)*!/


              html2canvas(_canvas).then(canvas => {
                var dataURL = canvas.toDataURL('image/png')

                var img = new Image()
                img.src = dataURL
                context.drawImage(img, 0, 0,710,573)

                // var a = document.getElementById('download')
                // a.setAttribute('src', dataURL)
                LODOP = getLodop()

                LODOP.PRINT_INIT('订单') //打印初始化
                // LODOP.SET_PRINT_PAGESIZE(0, 710, 514, '') //设定纸张大小
                // LODOP.SET_PRINT_MODE('PRINT_PAGE_PERCENT', '55%')//设置缩放
                // LODOP.SET_PREVIEW_WINDOW(1, 1, 0, 0, 0, '')//设置窗口
                let str = '<img border=\'0\' src=\'' + dataURL + '\' width=\'710px\' height=\'573px\'>'
                // console.log(str)
                LODOP.ADD_PRINT_IMAGE(-400, 30, 710, 800, str)
                // LODOP.SET_PRINT_STYLEA(0,"Stretch",2);//按原图比例(不变形)缩放模式



                LODOP.SET_PRINT_MODE("POS_BASEON_PAPER",true);
                LODOP.PRINT_DESIGN() //打印预览
              })


              /!*html2canvas(document.getElementById('product-label'), {
                canvas: canvas2
              }).then(canvas => {
                var dataURL = canvas.toDataURL('image/png')

                var img = new Image()
                img.src = dataURL
                context.drawImage(img, 0, 0,710,514)

                // var a = document.getElementById('download')
                // a.setAttribute('src', dataURL)
                LODOP = getLodop()

                LODOP.PRINT_INIT('订单') //打印初始化
                LODOP.SET_PRINT_STYLE('FontSize', 18) //设置对象风格
                LODOP.SET_PRINT_STYLE('Bold', 1) ////设置对象风格
                // LODOP.ADD_PRINT_TEXT(50, 521, 130, 39, this.description) //增加纯文本项
                LODOP.SET_PRINT_PAGESIZE(0, 710, 514, '') //设定纸张大小
                LODOP.SET_PRINT_MODE('PRINT_PAGE_PERCENT', '55%')//设置缩放
                LODOP.SET_PREVIEW_WINDOW(1, 1, 0, 0, 0, '')//设置窗口
                let str = '<img border=\'0\' src=\'' + dataURL + '\' width=\'1000px\' height=\'1000px\'>'
                console.log(str)
                LODOP.ADD_PRINT_IMAGE(0, 0, 710, 573, str)
                LODOP.SET_PRINT_MODE("POS_BASEON_PAPER",true);
                LODOP.PRINT_DESIGN() //打印预览

                /!*        var blob = that.getBlob(canvas);
                        var oMyForm = new FormData();
                        var fileName = "mobile" + '.jpg'
                        oMyForm.append("file", blob, fileName);
                        //				oMyForm.append("fileName", fileName);　　　　
                        oMyForm.append("fileType", 'image');
                        oMyForm.append("user_id", that.global.company.id)
                        that.uploadFile(that.global.ossservice + "/oss/uploadorgFile", oMyForm).then(res => {
                          if (res.data.errorCode != '00') {
                            that.$message.error(res.data.errorMsg);
                            return;
                          }
                          return res.data.sprbody.urlAddress;
                        });*!/

              })*!/
            },
            getBlob(canvas) { //获取blob对象
              var data = canvas.toDataURL('image/jpeg', 1)
              data = data.split(',')[1]
              data = window.atob(data)
              var ia = new Uint8Array(data.length)
              for (var i = 0; i < data.length; i++) {
                ia[i] = data.charCodeAt(i)
              }
              return new Blob([ia], {
                type: 'image/jpeg'
              })
            },*/
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
      getPendingItemsByNumberType(type) {
        return (queryString, cb) => {
          getOutboundOrderRawItems({ next_operation_label: '成品入库', status: 0 }).then(res => {
            let pendingItems = res.queryResult.list.map(item => {
              return { ...item, value: item[type] }
            }).filter(this.createStateFilter(queryString))
            cb(pendingItems)
          })
        }
      },
      createStateFilter(queryString) {
        return (state) => {
          return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) > -1)
        }
      },
      handleNumberChange(item, type) {
        if (item) {
          this.temp[type] = item[type]
          this.temp.steelGrade = item.steelGrade
        } else {
          this.temp[type] = ''
        }
      },
      handleCommand(command) {
        this.printPreview(command)
      },

      printPreview(s) {
        this.CreateOneFormPage()
        if (s == 0) {
          LODOP.PRINT() //直接打印
        }
        if (s == 1) {
          LODOP.PREVIEW() //打印预览
        }
        if (s == 2) {
          LODOP.PRINT_SETUP() //打印维护
        }
        if (s == 3) {
          LODOP.PRINT_DESIGN() //打印设计
        }
      },
      CreateOneFormPage() {
        LODOP = getLodop()
        //样式
        // var olstyle1 = '<style>' + document.getElementById('olstyle1') + '</style>'
        var olstyle1 = ''
        var body = olstyle1 + '<body>' + document.getElementById('label-container').innerHTML + '</body>'
        LODOP.PRINT_INIT('订单') //打印初始化
        // LODOP.SET_PRINT_STYLE('FontSize', 18) //设置对象风格
        // LODOP.SET_PRINT_STYLE('Bold', 1) ////设置对象风格
        // LODOP.ADD_PRINT_TEXT(50, 521, 130, 39, this.description) //增加纯文本项
        LODOP.SET_PRINT_PAGESIZE(0, 710, 573, '') //设定纸张大小
        LODOP.SET_PRINT_MODE('PRINT_PAGE_PERCENT', '100%')//设置缩放
        LODOP.SET_PREVIEW_WINDOW(2, 2, 0, 0, 0, '')//设置窗口

        //打印网址
        // LODOP.ADD_PRINT_URL(222,2000,2000,233,"https://blog.csdn.net/qq_43652509");
        //打印图片
        // LODOP.ADD_PRINT_IMAGE(100,100,400,400,"<img border='0' src='http://s1.sinaimg.cn/middle/4fe4ba17hb5afe2caa990&690' width='345' height='250'>");
        LODOP.ADD_PRINT_HTM(88, 20, '100%', '100%', body) //增加超文本项
        // 打印二维码
        LODOP.ADD_PRINT_BARCODE(482, 500, 250, 65, '128A', this.temp.productNumber)
      },

      doPrint() {
        JsBarcode('#barcode').init()
        //判断iframe是否存在，不存在则创建iframe
        var iframe = document.getElementById('print-iframe')
        if (iframe) {
          iframe.childNodes.forEach(node => document.removeChild(node))
        } else {
          iframe = document.createElement('IFRAME')
          iframe.setAttribute('id', 'print-iframe')
        }
        iframe.style.display = 'none'
        var el = document.getElementById('label-container')
        var doc = null
        // iframe.setAttribute('style', 'position:absolute;width:0px;height:0px;left:-500px;top:-500px;');
        document.body.appendChild(iframe)
        doc = iframe.contentWindow.document
        //这里可以自定义样式
        //doc.write("<LINK rel="stylesheet" type="text/css" href="css/print.css">");
        doc.write('<div>' + el.innerHTML + '</div>')
        doc.close()
        iframe.contentWindow.focus()

        iframe.contentWindow.print()
        if (navigator.userAgent.indexOf('MSIE') > 0) {
          document.body.removeChild(iframe)
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
        this.$confirm('此操作将永久删除该成品入库单项, 是否继续?', '提示', {
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
      },
      handlePrint(row, type) {
        this.temp = deepClone(row) // copy obj
        this.$nextTick(() => {
          // this.handleCommand(type)
          this.doPrint()
        })
      }
    }
  }
</script>
<style lang="scss">
  .el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
  }

  .el-icon-arrow-down {
    font-size: 12px;
  }

  .el-icon-edit.update, .el-icon-delete.delete, .el-icon-printer {
    margin: 3px;
    font-size: 18px !important;
  }
</style>

