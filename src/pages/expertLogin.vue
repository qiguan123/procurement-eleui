<template>
  <div class="index">
    <el-container>
      <el-header></el-header>
      <el-main>
        <h1>
          <p>{{ conference.name }} 招标会议</p>
        </h1>
        <div>
          <el-select v-model="expertId" placeholder="专家姓名">
            <el-option v-for="e in experts" :key="e.id" :label="e.name" :value="e.id">
            </el-option>
          </el-select>
          <el-button type="primary" plain v-on:click="checkAndLogin" >进入会议</el-button>
        </div>
        <div>
          <el-checkbox v-model="agree"></el-checkbox>
          同意遵守<a href="/api/expert_policy.html" target="_blank">招标评审纪律</a>
        </div>
      </el-main>
      <el-footer>
        <span> 2019-2022 &copy; Beifang</span>
      </el-footer>
    </el-container>
  </div>
</template>
<script>
import rootVm from '../main.js'
export default {
  data () {
    return {
      conference: {
        name: ''
      },
      experts: [],
      expertId: '',
      agree: false
    }
  },
  created () {
    this.fetchData()
  },
  watch: {
    '$route': 'fetchData'
  },
  methods: {
    fetchData () {
      this.$http.get('/api/cfrs/ongoing')
        .then((resp) => {
          this.conference = resp.data
          this.$http.get('/api/expert/cfrs?cfrsId=' + this.conference.id)
            .then((resp) => {
              this.experts = resp.data
            })
        })
        .catch((error) => {
          console.log(error)
        })
    },
    checkAndLogin: function () {
      if (!(this.agree)) {
        this.$message.error('请阅读并接受评审纪律')
        return
      }
      if (this.expertId > 0) {
        rootVm.$router.push({
          path: 'expertPkgs',
          query: {
            cfrsId: this.conference.id,
            expertId: this.expertId
          }
        })
      }
    }
  }
}
</script>
<style scoped>
    .index{
        width: 100%;
        text-align: center;
    }
    .index div {
      padding: 10px
    }

</style>
