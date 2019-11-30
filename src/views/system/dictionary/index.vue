<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="12" :xs="24">
        <dict-type v-bind:typeId.sync="typeId"/>
        </el-card>
      </el-col>
      <el-col :span="12" :xs="24">
        <dict-info :typeId="typeId" :key="typeId"/>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import DictType from './components/DictType'
  import DictInfo from './components/DictInfo'

  export default {
    name: 'Dictionary',
    components: { DictInfo, DictType },
    data() {
      return {
        typeId: ''
      }
    },
    created() {

    },
    methods: {}
  }
</script>
