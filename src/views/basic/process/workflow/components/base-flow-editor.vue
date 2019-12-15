<template>
  <div id="editor">
    <!--    <toolbar @save-data="saveData" @load-data="loadData"/>-->
    <toolbar @save-data="saveData"/>
    <div :style="{height:'42px'}"/>
    <div class="bottom-container">
      <context-menu/>
      <div id="itempannel">
        <!--        <img
                  draggable="false"
                  src="https://gw.alipayobjects.com/zos/rmsportal/ZnPxbVjKYADMYxkTQXRi.svg"
                  data-type="node"
                  data-shape="flow-circle"
                  data-size="72*72"
                  data-color="#FA8C16"
                  data-label="起止节点"
                  class="getItem"
                />-->
        <div class="filter-container">
          <el-form :inline="true" :model="listQuery" style="margin: 0px;" @submit.native.prevent>
            <el-form-item label="" prop="name" style="margin: 0px;">
              <el-input
                v-model="listQuery.name"
                placeholder="请输入制程名字"
                prefix-icon="el-icon-search"
                style="width: 100%;padding: 0px 5px"
                class="filter-item"
                clearable=""
                @keyup.enter.native="handleFilter"
                size="mini"
              />
            </el-form-item>
          </el-form>
        </div>
        <el-scrollbar wrap-class="scrollbar-wrapper">
          <p
            draggable="false"
            data-type="node"
            data-shape="flow-rect"
            data-size="80*48"
            data-color="#1890FF"
            :data-label="label"
            class="getItem"
            v-for="label in labels_data" :key="label"
          >
            {{label}}
          </p>
        </el-scrollbar>
      </div>
      <div id="detailpannel">
        <div id="node_detailpannel" data-status="node-selected" class="pannel">
          <div class="pannel-title">节点</div>
          <div class="block-container">test</div>
        </div>
        <div id="edge_detailpannel" data-status="edge-selected" class="pannel">
          <div class="pannel-title">边</div>
          <div class="block-container">test</div>
        </div>
        <div id="group_detailpannel" data-status="group-selected" class="pannel">
          <div class="pannel-title">组</div>
          <div class="block-container">test</div>
        </div>
        <div id="canvas_detailpannel" data-status="canvas-selected" class="pannel">
          <div class="pannel-title">画布</div>
          <div class="block-container">test</div>
        </div>
        <div id="multi_detailpannel" data-status="multi-selected" class="pannel">
          <div class="pannel-title">多选</div>
          <div class="block-container">test</div>
        </div>
      </div>
      <navigator
        :cur-zoom="curZoom"
        :min-zoom="minZoom"
        :max-zoom="maxZoom"
        @change-zoom="changeZoom"
      />
      <page/>
    </div>
  </div>
</template>

<script>
  import Navigator from './navigator.vue'
  import Toolbar from './toolbar.vue'
  import ContextMenu from './context-menu.vue'
  import Page from './page.vue'
  import Editor from './editor.vue'
  import { getOperations, updateWorkflow } from '@/api/workflow.js'

  export default {
    components: {
      Navigator,
      Toolbar,
      ContextMenu,
      Page
    },
    extends: Editor,
    data() {
      return {
        labels_data: this.labels,
        temp: 'base-flow-editor',
        listQuery: {
          name: ''
        }
      }
    },
    props: ['labels', 'currentWorkflow'],
    watch: {
      labels: {
        handler: function(val) {
          this.labels_data = val
        },
        immediate: true
      },
      currentWorkflow: {
        handler: function(val) {
          this.$nextTick(() => {
            if (val && val.jsonText) {
              let data = JSON.parse(val.jsonText)
              this.page.read(data)
            }
          })

        }
        ,
        immediate: true
      }
    },

    mounted() {
      const page = this.page
      page.changeAddEdgeModel({
        shape: 'flow-polyline'
      })
      page.on('afterchange', ev => {
        if (!this.currentWorkflow.id && Object.keys(this.page.save()).length !== 0) {
          this.$message({
            message: '请选择一条生产路线',
            type: 'warning'
          })
          this.editor.executeCommand('clear')
        }
      })
    }
    ,
    methods: {
      handleFilter() {
        getOperations(this.listQuery).then(res => {
          this.labels_data = res.queryResult.list.map(item => item.name)
        })
      }
      ,
      saveData(data) {
        if (!this.currentWorkflow.id) {
          this.$message({
            message: '请选择一条生产路线',
            type: 'warning'
          })
          return
        }

        this.currentWorkflow.jsonText = JSON.stringify(this.page.save())
        updateWorkflow(this.currentWorkflow).then(response => {
          this.$notify({
            title: '成功',
            message: '保存成功',
            type: 'success',
            duration: 2000
          })
        }).catch(error => {
          console.log(error);
        })
      }
      /*      loadData(data) {

              console.log(
                JSON.stringify(
                  this.page.read({
                    nodes: [
                      {
                        type: 'node',
                        shape: 'flow-rect',
                        size: '80*48',
                        color: '#1890FF',
                        label: '常规节点',
                        x: 372,
                        y: 162,
                        id: 'd56c41f0',
                        index: 0
                      },
                      {
                        type: 'node',
                        shape: 'flow-rect',
                        size: '80*48',
                        color: '#1890FF',
                        label: '常规节点',
                        x: 370,
                        y: 281.20000076293945,
                        id: '3702481e',
                        index: 1
                      },
                      {
                        type: 'node',
                        shape: 'flow-rect',
                        size: '80*48',
                        color: '#1890FF',
                        label: '常规节点',
                        x: 613,
                        y: 122,
                        id: '84a1cf0a',
                        index: 3
                      }
                    ],
                    edges: [
                      {
                        shape: 'flow-polyline',
                        source: 'd56c41f0',
                        sourceAnchor: 2,
                        target: '3702481e',
                        targetAnchor: 0,
                        id: 'ae2e4687',
                        index: 2
                      },
                      {
                        shape: 'flow-polyline',
                        source: '84a1cf0a',
                        sourceAnchor: 2,
                        target: '3702481e',
                        targetAnchor: 1,
                        id: '7cbabed6',
                        index: 4
                      }
                    ]
                  })
                )
              )
            }*/
    }
  }
</script>
<style lang="scss">
  #editor {

  #itempannel {
    height: 100%;
    position: absolute;
    left: 0px;
    z-index: 2;
    background: #f7f9fb;
    width: 160px;
    /*margin: 10px 15px;*/
    padding-top: 8px;
    border-right: 1px solid #e6e9ed;
  }

  #itempannel p {
    /*
        width: 100%;
        height: 36px !important;
        !*padding: 4px;*!
        border-radius: 2px;
        border: 1px solid rgba(0, 0, 0, 0);
    */


    margin: 10px 15px;
    background-color: #e7f8ff;
    border: 1px solid #42a5ff;
    border-radius: 3px;
    font-size: 14px;
    padding: 10px 5px;
    word-wrap: break-word;
    cursor: pointer;
    text-align: center;
  }

  #itempannel img:hover {
    cursor: move;
    border: 1px solid #ccc;
  }

  #detailpannel {
    height: 100%;
    position: absolute;
    right: 0px;
    z-index: 2;
    background: #f7f9fb;
    width: 200px;
    border-left: 1px solid #e6e9ed;
  }

  #detailpannel .pannel {
    display: none;
  }

  #detailpannel .block-container {
    padding-top: 20px;
  }

  #detailpannel .input {
    margin-left: 16px;
  }

  #detailpannel .name-input {
    width: 120px;
  }

  #detailpannel .width-input {
    width: 52px;
  }

  #detailpannel .height-input {
    width: 52px;
  }

  #detailpannel .block-container {
    padding: 16px 8px;
  }

  .bottom-container {
    position: relative;
    height: 100%;
  }

  .pannel-title {
    height: 32px;
    border-top: 1px solid #dce3e8;
    border-bottom: 1px solid #dce3e8;
    background: #ebeef2;
    color: #000;
    line-height: 28px;
    padding-left: 12px;
  }

  .zoom-dropdown-btn {
    color: rgba(0, 0, 0, 0.45);
    margin-left: 4px;
    line-height: 24px;
    font-weight: 100;
    text-decoration: none;
  }

  .color-picker {
    vertical-align: middle;
    margin-left: 16px;
  }

  .p {
    margin-bottom: 12px;
  }

  .zy-main {
    height: 100%;
    overflow: hidden;
  }

  .el-scrollbar {
    height: 100%;
  }

  .el-scrollbar__wrap {
    overflow: scroll;
    overflow-x: auto
  }

  }
</style>
