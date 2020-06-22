<template>
  <div :class="className" :style="{height:height,width:width}"/>
</template>

<script>
  import echarts from 'echarts'

  require('echarts/theme/macarons') // echarts theme
  import { getTopDefects } from '@/api/qcdefect'

  export default {
    props: {
      className: {
        type: String,
        default: 'chart'
      },
      width: {
        type: String,
        default: '100%'
      },
      height: {
        type: String,
        default: '300px'
      }
    },
    data() {
      return {
        chart: null,
        timer: null
      }
    },
    mounted() {
      this.initChart()
      this.refreshSeries()
      this.timer = setInterval(this.refreshSeries, 3000)
    },
    beforeDestroy() {
      if (!this.chart) {
        return
      }
      this.chart.dispose()
      this.chart = null
    },
    destroyed() {
      clearInterval(this.timer)
    },

    methods: {
      initChart() {
        this.chart = echarts.init(this.$el, 'macarons')
      },
      refreshSeries() {
        getTopDefects(5).then(res => {
          let legendData = []
          let seriesData = []
          res.model.forEach(item => {
              legendData = [...legendData, item.defectCode]
              seriesData = [...seriesData, {
                name: item.defectCode,
                value: item.occurrence
              }]
            }
          )
          // 填入数据
          this.chart.setOption({
            title: {
              text: '当月不良类别TOP5',
              left: 'center',
              top: 10,
              textStyle: {
                color: '#8b8b8b',
                fontSize: '16'
              }
            },
            tooltip: {
              trigger: 'item',
              formatter: '{a} <br/>{b} : {c} ({d}%)'
            },
            legend: {
              left: 'center',
              bottom: '10',
              textStyle: {
                color: '#00660a'
              },
              data: legendData
            },
            series: [
              {
                name: '当月不良类别TOP5',
                type: 'pie',
                roseType: 'radius',
                radius: [0, 100],
                center: ['50%', '50%'],
                data: seriesData,
                animationEasing: 'cubicInOut',
                animationDuration: 500
              }
            ]
          })

        }).catch(console.log)

      }
    }
  }
</script>
