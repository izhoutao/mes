<template>
  <div class="app-container">
    <inbound-order-raw v-bind:orderId.sync="orderId"/>
    <inbound-order-raw-detail :orderId="orderId" v-show="orderId" :key="orderId"/>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import InboundOrderRaw from './components/InboundOrderRaw.vue'
  import InboundOrderRawDetail from './components/InboundOrderRawDetail.vue'

  export default {
    name: 'inboundRaw',
    components: { InboundOrderRaw, InboundOrderRawDetail },
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
