<style scoped>
</style>
<template>
  <el-container>
    <el-header>
    </el-header>
    <el-main>
      <p>评分列表</p>
      <el-table :data="pkgs" border height="350" style="width: 100%">
        <el-table-column prop="id" label="ID" width="150">
        </el-table-column>
        <el-table-column prop="projectName" label="项目名">
        </el-table-column>
        <el-table-column prop="name" label="包名">
        </el-table-column>
        <el-table-column prop="indexNumber" label="分包号" width="120">
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template slot-scope="scope">
            <el-button @click="grade(scope.row)" type="text" size="small">评分</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <el-footer style="text-align: center">2019-2022 &copy; Beifang</el-footer>
  </el-container>
</template>
<script>
export default {
  mounted () {
    this.$http.get('/api/pkg/expert?cfrsId=' + this.$route.query.cfrsId + '&expertId=' + this.$route.query.expertId)
      .then((resp) => {
        console.log(resp.data)
        this.pkgs = resp.data
      })
  },
  methods: {
    grade (row) {
      console.log(row)
      console.log(this.$root.expert)
      this.$router.push({
        path: 'expertScoreDetail',
        query: {
          pkgId: row.id,
          expertId: this.$route.query.expertId
        }
      })
    }
  },
  data () {
    return {
      pkgs: []
    }
  }
}
</script>
