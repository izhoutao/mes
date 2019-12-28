<template>
  <div class="bulletin-board-container">
    <slot name="header" class="header"></slot>
    <slot name="content" class="content"></slot>
  </div>
</template>

<script>
  export default {
    name: 'BulletinBoard',
  }
</script>

<style lang="scss" scoped>
  .bulletin-board-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
  }
</style>
