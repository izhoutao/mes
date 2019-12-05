<template>
  <div class="app-container">
    <inspection-rule v-bind:ruleId.sync="ruleId"/>


    <el-tabs value="first" v-show="ruleId">
      <el-tab-pane label="检规对应料号" name="first">
        <inspection-rule-item :ruleId="ruleId"/>
      </el-tab-pane>
      <el-tab-pane label="检规项目" name="second">
        <inspection-rule-item :ruleId="ruleId"/>
      </el-tab-pane>
    </el-tabs>



  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import InspectionRule from './components/InspectionRule'
  import InspectionRuleItem from './components/InspectionRuleItem'

  export default {
    name: 'Inspection',
    components: { InspectionRule, InspectionRuleItem },
    data() {
      return {
        ruleId: ''
      }
    },
    created() {

    },
    methods: {}
  }
</script>
