<template>
  <el-container>
    <el-header>
      <host-nav active="1"></host-nav>
    </el-header>
    <el-main>
      <h1 style="text-align: center">{{cfrs.name}} 招标价格评分</h1>
      <div v-for="pkg in pkgWithPriceList" v-bind:key="pkg.id">
        <el-table :data="[pkg]" border height="200" style="width: 100%">
          <el-table-column prop="id" label="ID" width="40">
          </el-table-column>
          <el-table-column prop="projectName" label="项目名" width="120">
          </el-table-column>
          <el-table-column prop="indexNumber" label="分包号" width="80">
          </el-table-column>
          <el-table-column prop="name" label="包名" width="120">
          </el-table-column>
          <el-table-column prop="priceItem.maxValue" label="分值" width="80">
          </el-table-column>
          <el-table-column v-for="(bidder) in pkg.bidders" :key="bidder.id" :label="bidder.name">
            <el-table-column label="价格">
              <template slot-scope="scope">
                <el-input v-model="pkgBidderPriceMap.get(scope.row.id).get(bidder.id).price" v-on:blur="checkPrice(pkgBidderPriceMap.get(scope.row.id).get(bidder.id))"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="分数">
              {{pkgBidderScoreMap.get(pkg.id).get(bidder.id)}}
            </el-table-column>
          </el-table-column>
          <el-table-column label="操作" width="120">
            <template slot-scope="scope">
              <el-button size="mini" @click="confirmPrice(scope.row.id)">确认</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
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
    var idWithBidderMap = new Map()
    this.$http.get('/api/cfrs/ongoing')
      .then((resp) => {
        this.cfrs = resp.data
        this.$http.get('/api/pkg/priceWithScore?cfrsId=' + this.cfrs.id)
          .then((resp) => {
            this.pkgWithPriceList = resp.data
            this.pkgBidderPriceMap = new Map()
            this.pkgPriceMaxValue = new Map()
            for (var pkg of this.pkgWithPriceList) {
              var bidderPrice = new Map()
              for (var price of pkg.bidPrices) {
                bidderPrice.set(price.bidderId, price)
              }
              this.pkgBidderPriceMap.set(pkg.id, bidderPrice)
              this.pkgPriceMaxValue.set(pkg.id, pkg.priceItem.maxValue)
              for (var bidder of pkg.bidders) {
                idWithBidderMap.set(bidder.id, bidder)
              }
            }
            this.bidderList = idWithBidderMap.values()
            console.log(this.pkgBidderPriceMap)
          })
      })
  },
  computed: {
    pkgBidderScoreMap: function () {
      var result = new Map()
      for (var [pkgId, bidderPrice] of this.pkgBidderPriceMap) {
        var bidderScore = new Map()
        var meanPrice = 0.0
        for (var p of bidderPrice.values()) {
          if (p.price == null || isNaN(p.price) || p.price === '') {
            continue
          }
          meanPrice += parseFloat(p.price)
        }
        meanPrice /= bidderPrice.size
        console.log(meanPrice)
        for (var [bidderId, price] of bidderPrice) {
          var score = 0.0
          if (meanPrice !== 0.0) {
            if (price.price == null || isNaN(price.price) || price.price === '') {
              score = toDecimal((0 - meanPrice) / meanPrice) * 100
            } else {
              score = toDecimal((parseFloat(price.price) - meanPrice) / meanPrice) * 100
            }
            if (score < 0) {
              score = (0 - score) * 0.8
            }
            score = this.pkgPriceMaxValue.get(pkgId) - score
          }
          bidderScore.set(bidderId, toDecimal(score))
        }
        result.set(pkgId, bidderScore)
      }
      console.log(result)
      return result
    }
  },
  methods: {
    checkPrice (price) {
      if (price.price == null || isNaN(price.price)) {
        this.$message('仅接受数字输入！')
        price.price = null
      }
    },
    confirmPrice (pkgId) {
      for (var price of this.pkgBidderPriceMap.get(pkgId).values()) {
        if (price.price == null || isNaN(price.price) || price.price === '') {
          this.$message({
            message: '该包还有投标价未输入！',
            type: 'warning'
          })
          return
        }
      }
      this.$http.post('/api/pkg/' + pkgId + '/price/score', {
        prices: Array.from(this.pkgBidderPriceMap.get(pkgId).values())
      }).then((resp) => {
        console.log(resp.data)
        this.$message({
          message: '价格和价格分数保存成功',
          type: 'success'
        })
      })
    }
  },
  data () {
    return {
      cfrs: {},
      bidderList: {},
      pkgBidderPriceMap: {},
      pkgWithPriceList: [],
      pkgPriceMaxValue: {}
    }
  }
}
</script>
