<template>
  <div class="app-container">
    <outbound-order v-bind:orderId.sync="orderId"/>
    <outbound-order-detail :orderId="orderId" v-show="orderId" :key="orderId"/>
  </div>
</template>

<script>
  import OutboundOrder from './components/OutboundOrder.vue'
  import OutboundOrderDetail from './components/OutboundOrderDetail.vue'

  export default {
    name: 'Outbound',
    components: { OutboundOrder, OutboundOrderDetail },
    data() {
      return {
        orderId: ''
      }
    },
    created() {

    },
    methods: {}
  }
</script>
