<template>
  <div class="dashboard-container">
    <el-row :gutter="60">
      <el-col :span="12">
        <el-container>
          <el-header>Header</el-header>
          <el-main>Main</el-main>
        </el-container>
      </el-col>
      <el-col :span="12">
        <el-container>
          <el-header>Header</el-header>
          <el-main>Main</el-main>
        </el-container>
      </el-col>
      <el-col :span="12">
        <el-container>
          <el-header>Header</el-header>
          <el-main>Main</el-main>
        </el-container>
      </el-col>
      <el-col :span="12">
        <el-container>
          <el-header>Header</el-header>
          <el-main>Main</el-main>
        </el-container>
      </el-col>
      <el-col :span="12">
        <el-container>
          <el-header>Header</el-header>
          <el-main>Main</el-main>
        </el-container>
      </el-col>
    </el-row>
    <el-row :gutter="60">
      <el-col :span="20"></el-col>
      <el-col :span="20">
        <el-row :span="60">
          <el-col :span="20"></el-col>
          <el-col :span="20"></el-col>
          <el-col :span="20"></el-col>
        </el-row>
      </el-col>
      <el-col :span="20"></el-col>
    </el-row>
    <el-row :gutter="60">
      <el-col :span="20"></el-col>
      <el-col :span="20"></el-col>
      <el-col :span="20"></el-col>
    </el-row>
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
