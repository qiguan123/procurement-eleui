<style scoped>
</style>
<template>
    <el-container>
    <el-main>
      <h1 style="text-align: center">{{pkgName}} 评分表</h1>
      <div v-if="pkgExpertRel.modifiable === 1" style="float: right"><el-button type="primary" plain v-on:click="checkAndSubmit" >提交</el-button></div>
      <el-table :data="gradeItemList" border height="450" style="width: 100%">
        <el-table-column type="index" width="40"></el-table-column>
        <el-table-column prop="category" label="分类" width="50">
        </el-table-column>
        <el-table-column prop="name" label="二级项" width="100">
        </el-table-column>
        <el-table-column prop="content" label="内容" width="250">
        </el-table-column>
        <el-table-column prop="standard" label="标准">
        </el-table-column>
        <el-table-column prop="relateFilesName" label="评审依据" width="120">
        </el-table-column>
        <el-table-column prop="maxValue" label="分值" width="50">
        </el-table-column>
        <el-table-column v-for="bidder in bidderList" :key="bidder.id" :label="bidder.name" width="80">
          <template slot-scope="scope">
            <el-input v-model="itemBidderScoreMap.get(scope.row.id).get(bidder.id).score" v-on:blur="checkScoreThenChange(itemBidderScoreMap.get(scope.row.id).get(bidder.id), scope.row.maxValue)" :disabled="scope.row.categoryId === 3 || pkgExpertRel.modifiable != 1"></el-input>
            <span v-if="scope.row.categoryId === 3">报价: {{bidPriceMap.get(bidder.id)}} 万元</span>
          </template>
        </el-table-column>
      </el-table>
      <table style="width: 100%">
        <tbody>
          <tr>
            <td>总计：</td>
            <td width="60">{{totalItem.maxValue}}</td>
            <td v-for="bidder in bidderList" :key="bidder.id" width="70">{{bidderTotalMap.get(''+bidder.id)}}</td>
          </tr>
        </tbody>
      </table>
    </el-main>
    <el-footer style="text-align: center">2019-2022 &copy; Beifang</el-footer>
  </el-container>
</template>
<script>
import toDecimal from '../common/math.js'
import rootVm from '../main.js'
export default {
  mounted () {
    this.$http.get('/api/pkg/' + this.$route.query.pkgId + '/score')
      .then((resp) => {
        console.log(resp.data)
        this.pkgName = resp.data.name
        this.bidderList = resp.data.bidders
        this.totalItem = resp.data.totalItem
        // 去除总分item
        this.gradeItemList = resp.data.allItems.filter(item => item.categoryId < 4)
        this.pkgExpertRel = resp.data.expertRels.filter(item => item.expertId === this.expertId)[0]
        console.log(this.pkgExpertRel)
        for (var item of this.gradeItemList) {
          var bidderScoresMap = new Map()
          var bidderScoresObj = item.expertBidderScores[this.expertId]
          for (var p in bidderScoresObj) {
            bidderScoresMap.set(parseInt(p), bidderScoresObj[p])
          }
          this.itemBidderScoreMap.set(item.id, bidderScoresMap)
        }
        console.log(this.itemBidderScoreMap)
        for (var price of resp.data.bidPrices) {
          this.bidPriceMap.set(price.bidderId, price.price)
        }
      })
  },
  computed: {
    bidderTotalMap: function () {
      var bidderTotal = new Map()
      for (var item of this.gradeItemList) {
        var bidderScores = item.expertBidderScores[this.expertId]
        for (var bidderId in bidderScores) {
          var score = bidderScores[bidderId]
          if (score.score !== null && !isNaN(score.score) && score.score !== '') {
            var total = bidderTotal.get(bidderId)
            var scoreValue = parseFloat(score.score)
            if (total === null || isNaN(total) || total === '') {
              bidderTotal.set(bidderId, toDecimal(scoreValue))
            } else {
              bidderTotal.set(bidderId, toDecimal(scoreValue + total))
            }
          }
        }
      }
      console.log(bidderTotal)
      return bidderTotal
    }
  },
  methods: {
    checkAndSubmit () {
      // 检查所有input
      for (var item of this.gradeItemList) {
        var bidderScores = item.expertBidderScores[this.expertId]
        for (var bidderId in bidderScores) {
          var score = bidderScores[bidderId]
          if (score.score === null || isNaN(score.score) || score.score === '') {
            this.$alert('请完成评分', '还有未打分项', {
              confirmButtonText: '确定'
            })
            return
          }
        }
      }
      this.$confirm('请仔细核对，确认后不能修改！', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.post('/api/pkg/' + this.$route.query.pkgId + '/expert/submit?expertId=' + this.expertId)
          .then((resp) => {
            rootVm.$router.go(-1)
          })
        this.$message({
          type: 'success',
          message: '提交成功!'
        })
      })
    },
    checkScoreThenChange (score, maxValue) {
      if (score.score === null || score.score === '') {
        return
      }
      if (isNaN(score.score)) {
        this.$message.error('仅接受数字输入！')
        score.score = null
        return
      }
      score.score = parseFloat(score.score)
      if (score.score > maxValue || score.score < 0) {
        this.$message.error('您的输入不在分值范围内！')
        score.score = null
        return
      }
      var tem = (score.score) * 10 - Math.floor((score.score) * 10)
      if (tem > 0.000001 || tem < -0.000001) {
        this.$confirm('仅接受小数点后一位数字', '输入格式有误', {
          distinguishCancelAndClose: true,
          showCancelButton: false,
          showConfirmButton: false,
          showClose: false
        })
          .then(() => {})
          .catch(action => {})
        score.score = null
        return
      }

      console.log(score)
      console.log(this.bidderTotalObj)
      this.$http.post('/api/pkg/score', score)
        .then((resp) => {
          console.log(resp.data)
        })
        .catch((error) => {
          console.log(error)
          score.score = null
        })
    }
  },
  data () {
    return {
      expertId: parseInt(this.$route.query.expertId),
      bidderList: [],
      gradeItemList: [],
      totalItem: {},
      pkgName: '',
      pkgExpertRels: [],
      pkgExpertRel: {},
      itemBidderScoreMap: new Map(),
      bidderTotalObj: {},
      bidPriceMap: new Map()
    }
  }
}
</script>
