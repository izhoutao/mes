import { initData } from '@/api/data'

export default {
  data() {
    return {
      loading: true, data: [], current: 0, size: 10, total: 0, url: '', params: {}, query: {}, time: 50, isAdd: false, downloadLoading: false
    }
  },
  methods: {
    async init() {
      if (!await this.beforeInit()) {
        return
      }
      return new Promise((resolve, reject) => {
        this.loading = true
        initData(this.url, this.params).then(res => {
          this.total = res.queryResult.total
          this.data = res.queryResult.list
          setTimeout(() => {
            this.loading = false
          }, this.time)
          resolve(res)
        }).catch(err => {
          this.loading = false
          reject(err)
        })
      })
    },
    beforeInit() {
      return true
    },
    pageChange(e) {
      this.current = e - 1
      this.init()
    },
    sizeChange(e) {
      this.current = 0
      this.size = e
      this.init()
    },
    // 预防删除第二页最后一条数据时，或者多选删除第二页的数据时，页码错误导致请求无数据
    dleChangePage(size) {
      if (size === undefined) {
        size = 1
      }
      if (this.data.length === size && this.current !== 0) {
        this.current = this.current - 1
      }
    },
    toQuery() {
      this.current = 0
      this.init()
    }
  }
}
