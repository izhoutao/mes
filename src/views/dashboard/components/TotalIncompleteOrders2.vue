<template>
  <div class="dashboard-container">
    <bulletin-board>
      <template slot="header">
        当月已交付订单
      </template>
      <template slot="content">
99
      </template>
    </bulletin-board>
  </div>
</template>

<script>
  import BulletinBoard from "./components/BulletinBoard"

  export default {
    name: 'Dashboard',
    components:{BulletinBoard},

  }
</script>

<style lang="scss" scoped>
  .dashboard {
  &-container {
     margin: 30px;
   }
  &-text {
     font-size: 30px;
     line-height: 46px;
   }
  }
</style>
