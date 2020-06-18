<template>
  <div :id="id" :class="className" :style="{height:height,width:width}"/>
</template>

<script>
  import echarts from 'echarts'
  // import resize from './mixins/resize'
  import { getMonthUnpunctualWorkOrderQuantity } from '@/api/workorder'

  export default {
    // mixins: [resize],
    props: {
      className: {
        type: String,
        default: 'chart'
      },
      id: {
        type: String,
        default: 'chart'
      },
      width: {
        type: String,
        default: '700px'
      },
      height: {
        type: String,
        default: '400px'
      }
    },
    data() {
      return {
        chart: null
      }
    },
    mounted() {
      this.initChart()
      this.refresh()
      setInterval(this.refresh, 3000)
    },
    beforeDestroy() {
      if (!this.chart) {
        return
      }
      this.chart.dispose()
      this.chart = null
    },
    methods: {
      initChart() {
        this.chart = echarts.init(document.getElementById(this.id))
      },
      refresh() {
        getMonthUnpunctualWorkOrderQuantity(6).then(res => {
          const xData = (function() {
            const data = []
            let m = new Date().getMonth() + 1
            for (let i = m - 6; i < m; i++) {
              data.push((i <= 0 ? i + 12 : i) + '月')
            }
            return data
          }())
          // 填入数据
          this.chart.setOption({
            backgroundColor: '#fff',
            title: {
              text: '工单完成情况',
              left: 'center',
              top: '10',
              textStyle: {
                color: '#8b8b8b',
                fontSize: '16'
              }
            },
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                textStyle: {
                  color: '#fff'
                }
              }
            },
            grid: {
              left: '10%',
              right: '0%',
              borderWidth: 0,
              top: 80,
              bottom: 30,
              textStyle: {
                color: '#fff'
              }
            },
            legend: {
              left: 'center',
              top: '10%',
              textStyle: {
                color: '#00660a'
              },
              data: ['已准时完成', '未准时完成', '准时完成率']
            },
            calculable: true,
            xAxis: [{
              type: 'category',
              axisLine: {
                lineStyle: {
                  color: '#90979c'
                }
              },
              splitLine: {
                show: false
              },
              axisTick: {
                show: false
              },
              splitArea: {
                show: false
              },
              axisLabel: {
                interval: 0

              },
              data: xData
            }],
            yAxis: [{
              type: 'value',
              position: 'left',
              splitLine: {
                show: false
              },
              axisLine: {
                lineStyle: {
                  color: '#90979c'
                }
              },
              axisTick: {
                show: false
              },
              axisLabel: {
                interval: 0
              },
              splitArea: {
                show: false
              }
            }, //右边y轴
              {
                type: 'value',
                position: 'right',
                axisLabel: {
                  show: true,
                  interval: 'auto',
                  formatter: '{value} %'
                },
                splitNumber: 10,
                splitLine: {
                  show: false
                },
                splitArea: {
                  show: false
                },
                // max: 100,
                // interval: 10,
              }],
            series: [
              {
                name: '已准时完成',
                type: 'bar',
                stack: 'total',
                barMaxWidth: 35,
                barGap: '5%',
                itemStyle: {
                  normal: {
                    color: 'rgba(255,144,128,1)',
                    label: {
                      show: true,
                      textStyle: {
                        color: '#fff'
                      },
                      position: 'insideTop',
                      formatter: '{c}',
                    }
                  }
                },
                // data: res.model.punctuals
                data: res.model.punctuals
              },
              {
                name: '未准时完成',
                type: 'bar',
                stack: 'total',
                itemStyle: {
                  normal: {
                    color: 'rgba(0,191,183,1)',
                    barBorderRadius: 0,
                    label: {
                      show: true,
                      position: 'top',
                      formatter: '{c}',
                    }
                  }
                },
                data: res.model.unpunctuals
              },
              {
                name: '准时完成率',
                type: 'line',
                // stack: 'total',
                symbolSize: 10,
                symbol: 'circle',
                yAxisIndex: '1',
                itemStyle: {
                  normal: {
                    color: 'rgba(252,230,48,1)',
                    barBorderRadius: 0,
                    label: {
                      show: true,
                      position: 'top',
                      formatter: '{c}%',
                    }
                  }
                },
                data: res.model.rates
              }
            ]
          })
        }).catch(console.log)

      }

    }
  }
</script>
