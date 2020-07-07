<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form ref="filterForm" :model="listQuery" :inline="true" @submit.native.prevent>
        <el-form-item label="" prop="name">
          <el-input
            v-model="listQuery.name"
            placeholder="请输入钢种"
            prefix-icon="el-icon-search"
            style="width: 200px;"
            class="filter-item"
            clearable=""
            @keyup.enter.native="handleFilter"
          />
        </el-form-item>
      </el-form>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="listQuery.current"
        :limit.sync="listQuery.size"
        @pagination="getList"
      />
    </div>
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border fit highlight-current-row
      ref="selectMaterialTable"
      @select="handleSelect"
      @select-all="handleSelectAll"
    >
      <el-table-column

        type="selection"
        width="55px">
      </el-table-column>
      <el-table-column label="钢种" min-width="80px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.steelGrade }}</span>
        </template>
      </el-table-column>
      <el-table-column label="密度" min-width="80px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.density  }}</span>
        </template>
      </el-table-column>
      <el-table-column label="类型" min-width="80px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.typeName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="描述" min-width="100px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.description }}</span>
        </template>
      </el-table-column>
    </el-table>

  </div>
</template>

<script>
  import { deepClone } from '@/utils'

  import { getMaterials, addMaterial, updateMaterial, deleteMaterial, getMaterialTypes } from '@/api/material.js'

  import waves from '@/directive/waves' // Waves directive
  import Pagination from '@/components/Pagination/index.vue' // Secondary package based on el-pagination

  export default {
    name: 'Material',
    components: { Pagination },
    props: ['steelGrade'],
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
          steelGrade: undefined
          /*orders: ['code desc']*/
        },
        selectedMaterial: {
          id: undefined,
          steelGrade: '',
          density: '',
          typeId: '',
          description: ''
        },
        materialTypes: [],
        materialTypeMap: null
      }
    },
    created() {
      this.listQuery.steelGrade = this.steelGrade
      this.listLoading = true
      this.$nextTick(async() => {
        await this.getMaterialTypes()
        this.getList()
      })

    },
    methods: {
      handleSelect(selection, row) {
        //clearSelection：用于多选表格，清空用户的选择
        //此时所有的checkbox处于未勾选，当用户第一次点击的时候，selection为一个数组，里面存放的为当前这一行的数据
        this.$refs.selectMaterialTable.clearSelection()
        //此时selection仍然有值 ，只是勾选状态不显示了。
        if (selection.length === 0) {
          return
        }
        //这这里将这行的状态又变为了勾选
        this.$refs.selectMaterialTable.toggleRowSelection(row, true)
        //用于多选表格，切换某一行的选中状态，如果使用了第二个参数，则是设置这一行选中与否（selected 为 true 则选中）
        // this.$emit('update:selectedMaterial', row)
        this.selectedMaterial = deepClone(row)
      },
      handleSelectAll(selection) {
        this.$refs.selectMaterialTable.clearSelection()
      },

      getList() {
        this.listLoading = true
        getMaterials(this.listQuery).then(res => {
          this.list = res.queryResult.list.map(item => {
            let materialType = this.materialTypeMap[item.typeId]
            item.typeName = materialType.name
            return item
          })
          this.total = res.queryResult.total
          this.listLoading = false
        })
      },
      async getMaterialTypes() {
        let res = await getMaterialTypes({})
        this.materialTypes = res.queryResult.list
        this.materialTypeMap = _.fromPairs(this.materialTypes.map(materialType => {
          return [materialType.id, materialType]
        }))
      },
      handleFilter() {
        this.listQuery.current = 1
        this.getList()
      }
    }
  }
</script>
<style lang="scss" scoped>
  .form-footer {
    float: right;
  }

  .filter-container {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;

  .el-form-item {
    margin-bottom: 16px;
  }

  }

</style>


