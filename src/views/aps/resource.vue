<template>
  <div class="app-container">

  </div>
</template>

<script>
  import waves from '@/directive/waves'
  import { deepClone } from '@/utils'
  import { addResource, deleteResource, getResources, updateResource } from '@/api/resource'
  import { getDictMaps } from '@/api/dictionary' // Waves directive

  export default {
    name: 'resource',
    directives: { waves },
    data() {
      return {
      }
    },
    created() {
      this.tempCopy = deepClone(this.temp)
      this.listLoading = true
      this.$nextTick(async() => {
        await this.getDicts()
        this.getList()
      })
    },
    methods: {
      handleModifyState(index, row) {
        updateResource(row).then((res) => {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
        })
      },
      /*handleTest() {
        const a1 = {
          "edges": [
            {
              "id": "9e80edd9",
              "index": 1,
              "label": "FAIL",
              "shape": "flow-polyline",
              "source": "efd53d40",
              "target": "1f68defc",
              "sourceAnchor": 2,
              "targetAnchor": 0
            },
            {
              "id": "118b9795",
              "index": 2,
              "shape": "flow-polyline",
              "source": "1f68defc",
              "target": "3db2e388",
              "sourceAnchor": 2,
              "targetAnchor": 0
            },
            {
              "id": "c903b29e",
              "index": 3,
              "shape": "flow-polyline",
              "source": "3db2e388",
              "target": "16ac44dd",
              "sourceAnchor": 2,
              "targetAnchor": 0
            }
          ],
          "nodes": [
            {
              "x": 270.45001220703127,
              "y": 255.59999084472657,
              "id": "1f68defc",
              "size": "80*48",
              "type": "node",
              "color": "#1890FF",
              "index": 0,
              "label": "轧机",
              "shape": "flow-rect",
              "vDb40895e": ""
            },
            {
              "x": 270.95001220703127,
              "y": 348.09999084472659,
              "id": "3db2e388",
              "size": "80*48",
              "type": "node",
              "color": "#1890FF",
              "index": 4,
              "label": "退火",
              "shape": "flow-rect",
              "vDb40895e": ""
            },
            {
              "x": 269.45001220703127,
              "y": 154.59999084472657,
              "id": "efd53d40",
              "size": "80*48",
              "type": "node",
              "color": "#1890FF",
              "index": 5,
              "label": "重卷",
              "shape": "flow-rect",
              "vDb40895e": ""
            },
            {
              "x": 271.45001220703127,
              "y": 450.09999084472659,
              "id": "16ac44dd",
              "size": "80*48",
              "type": "node",
              "color": "#1890FF",
              "index": 6,
              "label": "精整拉矫",
              "shape": "flow-rect",
              "vDb40895e": ""
            }
          ]
        }

        const a = {
          "edges": [
            {
              "id": "5fafe5d8",
              "index": 1,
              "shape": "flow-polyline",
              "source": "fe798c5c",
              "target": "32e7235d",
              "sourceAnchor": 2,
              "targetAnchor": 0
            },
            {
              "id": "497ef5fa",
              "index": 2,
              "label": "FAIL",
              "shape": "flow-polyline",
              "source": "fe798c5c",
              "target": "be511544",
              "sourceAnchor": 1,
              "targetAnchor": 0
            },
            {
              "id": "ec93b549",
              "index": 3,
              "label": "RETURN",
              "shape": "flow-polyline",
              "source": "be511544",
              "target": "fe798c5c",
              "sourceAnchor": 1,
              "targetAnchor": 0
            },
            {
              "id": "23065d11",
              "index": 4,
              "shape": "flow-polyline",
              "source": "32e7235d",
              "target": "d6483930",
              "sourceAnchor": 2,
              "targetAnchor": 0
            }
          ],
          "nodes": [
            {
              "x": 320.95001220703127,
              "y": 198,
              "id": "be511544",
              "size": "80*48",
              "type": "node",
              "color": "#1890FF",
              "index": 0,
              "label": "退火",
              "shape": "flow-rect",
              "v-8345c01e": ""
            },
            {
              "x": 208.95001220703126,
              "y": 331.5,
              "id": "d6483930",
              "size": "80*48",
              "type": "node",
              "color": "#1890FF",
              "index": 5,
              "label": "精整拉矫",
              "shape": "flow-rect",
              "v-8345c01e": ""
            },
            {
              "x": 208.45001220703126,
              "y": 209.5,
              "id": "32e7235d",
              "size": "80*48",
              "type": "node",
              "color": "#1890FF",
              "index": 6,
              "label": "轧机",
              "shape": "flow-rect",
              "v-8345c01e": ""
            },
            {
              "x": 208.95001220703126,
              "y": 123.09999084472656,
              "id": "fe798c5c",
              "size": "80*48",
              "type": "node",
              "color": "#1890FF",
              "index": 7,
              "label": "重卷",
              "shape": "flow-rect",
              "v-8345c01e": ""
            }
          ]
        }

        const nodeMap = _.fromPairs(a.nodes.map(node => {
          return [node.id, node]
        }))
        let sources = []
        let targets = []
        let conditions = []
        for (let i = 0; i < a.edges.length; i++) {
          let src = {
            label: nodeMap[a.edges[i].source].label,
            next: []
          }
          let tgt = {
            label: nodeMap[a.edges[i].target].label,
            next: []
          }
          sources.push(src)
          targets.push(tgt)
          conditions.push(a.edges[i].label)
        }
        console.log(conditions)
        const arr = []
        for (let i = 0; i < sources.length; i++) {
          let index = arr.findIndex(val => val.label == sources[i].label)
          if (index == -1) {
            let source = deepClone(sources[i])
            arr.push(source)
            // sources[i].index = arr.length - 1
            index = arr.findIndex(val => val.label == targets[i].label)
            if (index == -1) {
              let target = deepClone(targets[i])
              arr.push(target)
              // targets[i].index = arr.length - 1
              source.next.push({
                index: arr.length - 1,
                condition: conditions[i]
              })
            } else {
              source.next.push({
                index,
                condition: conditions[i]
              })
            }
          } else {
            let source = arr[index]
            // sources[i].index = index
            index = arr.findIndex(val => val.label == targets[i].label)
            if (index == -1) {
              let target = deepClone(targets[i])
              arr.push(target)
              // targets[i].index = arr.length - 1
              source.next.push({
                index: arr.length - 1,
                condition: conditions[i]
              })
            } else {
              source.next.push({
                index,
                condition: conditions[i]
              })
            }
          }
        }
        console.log(JSON.stringify(arr))
      },*/
      async getDicts() {
        const dictTypeIds = ['c8356457265b4d22895f13f924806e46']
        let res = await getDictMaps(dictTypeIds)
        this.statuses = res.model[dictTypeIds[0]]
      },
      getList() {
        this.listLoading = true
        getResources(this.listQuery).then(res => {
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
        this.resetForm('resourceForm')
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        // this.rules.password[0].required = true
        this.$nextTick(() => {
          this.$refs['resourceForm'].clearValidate()
        })
      },
      submit() {
        this.$refs['resourceForm'].validate((valid) => {
          if (valid) {
            // const tempData = deepClone(this.temp)
            let resource = deepClone(this.temp)
            addResource(resource).then((res) => {
              this.list.unshift(res.model)
              this.total++
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
          this.$refs['resourceForm'].clearValidate()
        })
      },
      updateData() {
        this.$refs['resourceForm'].validate((valid) => {
          if (valid) {
            let resource = deepClone(this.temp)
            updateResource(resource).then(() => {
              for (const v of this.list) {
                if (v.id === resource.id) {
                  const index = this.list.indexOf(v)
                  this.list.splice(index, 1, resource)
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
        this.$confirm('此操作将永久删除该工艺, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteResource(row.id).then(() => {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
            const index = this.list.indexOf(row)
            this.list.splice(index, 1)
            this.total--
          })
        })
      }

    }
  }
</script>


