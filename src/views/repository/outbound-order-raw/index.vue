<template>
  <div class="app-container">
    <outbound-order-raw v-bind:orderId.sync="orderId"/>
    <outbound-order-raw-detail :orderId="orderId" v-show="orderId" :key="orderId"/>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import OutboundOrderRaw from './components/OutboundOrderRaw.vue'
  import OutboundOrderRawDetail from './components/OutboundOrderRawDetail.vue'

  export default {
    name: 'outboundRaw',
    components: { OutboundOrderRaw, OutboundOrderRawDetail },
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
