import { getDictInfos, getDictMap } from '@/api/dictionary'

export default {
  data() {
    return {
      dicts: [], dictMap: {}
    }
  },
  methods: {
    async getDict(typeId) {
      return new Promise((resolve, reject) => {
        getDictInfos({ type_id: typeId }).then(res => {
          this.dicts = res.queryResult.list
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 多个字典查询时使用逗号拼接， 如：
    // 加载多个数据字典，如何调用如下：
    // this.getDict('user_status,job_status')
    // 在vue中使用加载出来的字典：
    // dictMap.[字典名称] 如：dictMap.user_status、 dictMap.job_status
    async getDictMap(typeIds) {
      // 优先放入到dictMap中，避免页面加载时 undefined
      const arr = typeIds.split(',')
      for (let i = 0; i < arr.length; i++) {
        this.dictMap[arr[i]] = []
      }
      return new Promise((resolve, reject) => {
        getDictMap(typeIds).then(res => {
          this.dictMap = res
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    }
  }
}
