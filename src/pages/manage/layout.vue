<style scoped>
  .el-aside {
    background-color: #D3DCE6;
  }
  .el-header {
    background-color: #D3DCE6;
  }
</style>
<template>
  <el-container>
    <el-header>logo</el-header>
    <el-container>
      <el-aside width="120px">
        <el-menu :default-active="active" class="el-menu-demo" background-color="#D3DCE6" @select="handleSelect">
            <el-menu-item index="1"><i class="el-icon-price-tag"></i>会议管理</el-menu-item>
            <el-menu-item index="2"><i class="el-icon-notebook-1"></i>项目管理</el-menu-item>
            <el-menu-item index="3"><i class="el-icon-view"></i>分包管理</el-menu-item>
            <el-menu-item index="4"><i class="el-icon-view"></i>专家管理</el-menu-item>
            <el-menu-item index="5"><i class="el-icon-view"></i>厂商管理</el-menu-item>
        </el-menu>
      </el-aside>
      <el-container>
        <el-main>
          <router-view/>
        </el-main>
        <el-footer style="text-align: center">2019-2022 &copy; Beifang</el-footer>
      </el-container>
    </el-container>
  </el-container>
</template>
<script>
export default {
  mounted () {
  },
  methods: {
  },
  data () {
    return {
    }
  }
}
</script>
