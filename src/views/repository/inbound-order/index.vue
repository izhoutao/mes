<template>
  <div class="app-container">
    <inbound-order v-bind:orderId.sync="orderId"/>
    <inbound-order-detail :orderId="orderId" v-show="orderId" :key="orderId"/>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import InboundOrder from './components/InboundOrder.vue'
  import InboundOrderDetail from './components/InboundOrderDetail.vue'

  export default {
    name: 'inbound',
    components: { InboundOrder, InboundOrderDetail },
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
