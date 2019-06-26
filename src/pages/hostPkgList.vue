<template>
  <el-container>
    <el-header>
      <host-nav active="2"></host-nav>
    </el-header>
    <el-main>
      <h1 style="text-align: center">{{cfrs.name}} 评分列表</h1>
      <el-table :data="pkgList" border style="width: 100%">
        <el-table-column prop="id" label="ID" width="100">
        </el-table-column>
        <el-table-column prop="projectName" label="项目名">
        </el-table-column>
        <el-table-column prop="indexNumber" label="分包号" width="100">
        </el-table-column>
        <el-table-column prop="name" label="包名">
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template slot-scope="scope">
            <el-button size="mini" @click="scoreDetail(scope.row.id)">总分详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <el-footer style="text-align: center">2019-2022 &copy; Beifang</el-footer>
  </el-container>
</template>

<script>
import hostNav from '../components/hostNav.vue'
export default {
  components: {
    'host-nav': hostNav
  },
  mounted () {
    this.$http.get('/api/cfrs/ongoing')
      .then((resp) => {
        this.cfrs = resp.data
        this.$http.get('/api/pkg/cfrs?cfrsId=' + this.cfrs.id)
          .then((resp) => {
            this.pkgList = resp.data
          })
      })
  },
  methods: {
    scoreDetail (pkgId) {
      this.$router.push({
        path: 'hostPkgTotalScore',
        query: {
          pkgId: pkgId
        }
      })
    }
  },
  data () {
    return {
      cfrs: {},
      pkgList: []
    }
  }
}
</script>
