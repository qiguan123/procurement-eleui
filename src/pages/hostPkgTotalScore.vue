<template>
  <el-container>
    <el-header>
      <host-nav active="2"></host-nav>
    </el-header>
    <el-main>
      <h1>
        <p style="text-align: center">{{pkg.name}} 招标价格评分</p>
      </h1>
      <h2>
        <el-button type="primary" size="mini" @click="exportScoreExcel(pkg.id)">导出评分表</el-button>
      </h2>
      <el-table :data="pkg.bidders" border style="width: 100%">
        <el-table-column prop="name" label="公司名称" width="200">
        </el-table-column>
        <el-table-column v-for="(expert) in pkg.experts" :key="expert.id" :label="expert.name">
          <template slot-scope="scope">
            {{pkg.totalItem.expertBidderScores[expert.id][scope.row.id].score}}
          </template>
        </el-table-column>
        <el-table-column label="平均分" width="120">
          <template slot-scope="scope">
            {{ bidderMeanScore.get(scope.row.id) }}
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <el-footer style="text-align: center">2019-2022 &copy; Beifang</el-footer>
  </el-container>
</template>
<script>
import hostNav from '../components/hostNav.vue'
import toDecimal from '../common/math.js'
export default {
  components: {
    'host-nav': hostNav
  },
  mounted () {
    this.bidderMeanScore = new Map()
    this.$http.get('/api/pkg/' + this.$route.query.pkgId + '/score')
      .then((resp) => {
        this.pkg = resp.data
        console.log(this.pkg)
        for (var score of this.pkg.totalItem.scores) {
          if (score.score === null) {
            continue
          }
          var bidderTotal = this.bidderMeanScore.get(score.bidderId)
          if (bidderTotal === null || isNaN(bidderTotal) || bidderTotal === '') {
            bidderTotal = 0.0
          }
          bidderTotal += score.score
          this.bidderMeanScore.set(score.bidderId, bidderTotal)
        }
        for (var [bidderId, totalScore] of this.bidderMeanScore) {
          this.bidderMeanScore.set(bidderId, toDecimal(totalScore / (this.pkg.experts.length)))
        }
      })
  },
  methods: {
    exportScoreExcel (pkgId) {
      console.log(pkgId)
      window.location.href = '/api/pkg/' + pkgId + '/score/export'
    }
  },
  data () {
    return {
      pkg: {},
      bidderMeanScore: {}
    }
  }
}
</script>
