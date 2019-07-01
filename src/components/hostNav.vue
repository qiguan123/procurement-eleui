<template>
    <div>
        <el-menu :default-active="active" mode="horizontal" class="el-menu-vertical-demo" @select="handleSelect">
            <el-menu-item index="1"><i class="el-icon-price-tag"></i>价格评分</el-menu-item>
            <el-menu-item index="2"><i class="el-icon-notebook-1"></i>专家评分</el-menu-item>
            <el-menu-item index="3"><i class="el-icon-notebook-1"></i>评分过程</el-menu-item>
        </el-menu>
    </div>
</template>
<script>
export default {
  data () {
    return {
    }
  },
  props: {
    active: {
      default: '1'
    }
  },
  methods: {
    handleSelect (key, keyPath) {
      console.log(key)
      switch (key) {
        case '1':
          this.$router.push('/hostPkgsPrice')
          break
        case '2':
          this.$router.push('/hostPkgList')
          break
        case '3':
          this.$router.push('/hostWaitExpertScore')
          break
      }
    }
  }
}
</script>
