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
        <el-table-column prop="name" label="公司名称">
        </el-table-column>
        <el-table-column label="平均分(去掉1个最高分、1个最低分)">
          <template slot-scope="scope">
            {{ bidderMeanScore.get(scope.row.id) }}
          </template>
        </el-table-column>
        <el-table-column label="投标价(万元)">
          <template slot-scope="scope">
            {{ bidderPriceMap.get(scope.row.id) }}
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
        var bidderMaxScoreMap = new Map()
        var bidderMinScoreMap = new Map()
        for (var score of this.pkg.totalItem.scores) {
          if (score.score === null) {
            continue
          }
          // 专家最高分
          var max = bidderMaxScoreMap.get(score.bidderId)
          if (max === null || isNaN(max) || max === '') {
            bidderMaxScoreMap.set(score.bidderId, score.score)
          } else if (max < score.score) {
            bidderMaxScoreMap.set(score.bidderId, score.score)
          }
          // 专家最低分
          var min = bidderMinScoreMap.get(score.bidderId)
          if (min === null || isNaN(min) || min === '') {
            bidderMinScoreMap.set(score.bidderId, score.score)
          } else if (min > score.score) {
            bidderMinScoreMap.set(score.bidderId, score.score)
          }
          var bidderTotal = this.bidderMeanScore.get(score.bidderId)
          if (bidderTotal === null || isNaN(bidderTotal) || bidderTotal === '') {
            bidderTotal = 0.0
          }
          bidderTotal += score.score
          this.bidderMeanScore.set(score.bidderId, bidderTotal)
        }
        console.log(bidderMaxScoreMap)
        console.log(bidderMinScoreMap)
        for (var [bidderId, totalScore] of this.bidderMeanScore) {
          var total = totalScore - bidderMaxScoreMap.get(bidderId) - bidderMinScoreMap.get(bidderId)
          this.bidderMeanScore.set(bidderId, toDecimal(total / (this.pkg.experts.length - 2)))
        }
        for (var p of this.pkg.bidPrices) {
          this.bidderPriceMap.set(p.bidderId, p.price)
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
      bidderMeanScore: {},
      bidderPriceMap: new Map()
    }
  }
}
</script>
