<template>
  <el-tabs :value="activeName" @tab-click="handleClick">
    <el-tab-pane label="工单详情" name="first">
      <el-form label-width="110px">
        <el-row>
          <el-col :span="7">
            <el-form-item label="产品名称：" prop="materialName">
              <el-input :value="detail.materialName" :disabled="true"/>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="需求重量(kg)：" prop="num">
              <el-input :value="detail.num" :disabled="true"/>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="完成重量(kg)：" prop="num">
              <el-input :value="detail.outputNum" :disabled="true"/>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="上线重量(kg)：" prop="num">
              <el-input :value="detail.onLineNum" :disabled="true"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="7">
            <el-form-item label="预计开始日期：" prop="schStartTime">
              <el-date-picker
                :value="detail.schStartTime"
                type="datetime"
                placeholder="选择日期时间"
                default-time="00:00:00"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-ddTHH:mm:ss"
                :disabled="true"
              />
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="预计结束日期：" prop="schCloseTime">
              <el-date-picker
                :value="detail.schCloseTime"
                type="datetime"
                placeholder="选择日期时间"
                default-time="00:00:00"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-ddTHH:mm:ss"
                :disabled="true"
              />
            </el-form-item>
          </el-col>

          <el-col :span="5">
            <el-form-item label="工艺流程：" prop="workflowId">
              <el-select :value="detail.workflowId" filterable placeholder="请选择" style="width:100%" :disabled="true">
                <el-option
                  v-for="item in workflows"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="5">
            <el-form-item label="产线：" prop="lineId">
              <el-select :value="detail.lineId" filterable placeholder="请选择" style="width:100%" :disabled="true">
                <el-option
                  v-for="item in lines"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="7">
            <el-form-item label="创建时间：" prop="updateTime">
              <el-input
                :value="detail.updateTime"
                :disabled="true">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="最后更新时间：" prop="updateTime">
              <el-input
                :value="detail.updateTime"
                :disabled="true">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="创建人：" prop="createPerson">
              <el-input
                :value="detail.createPerson"
                :disabled="true">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="最后更新人：" prop="updatePerson">
              <el-input
                :value="detail.updatePerson"
                :disabled="true">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-tab-pane>

    <el-tab-pane label="工单物料" name="second">
      <work-order-raw-material :workOrderNumber="detail.workOrderNumber"/>
    </el-tab-pane>
  </el-tabs>
</template>
<script>
  import workOrderRawMaterial from './work-order-raw-material'

  export default {
    components: { workOrderRawMaterial },
    props: ['detail', 'workflows', 'lines'],
    data() {
      return {
        name: 'WorkOrderDetail',
        activeName: 'first',
        detailInfo: this.detail
      }
    },
    methods: {
      handleClick(tab, event) {
        // console.log(tab, event)
      }
    }
  }
</script>
