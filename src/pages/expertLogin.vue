<template>
  <div class="index">
    <el-container>
      <el-header></el-header>
      <el-main>
        <h2>
          <p>{{ conference.name }} 招标会议</p>
        </h2>
        <div >
          <el-select v-model="expertId" placeholder="专家姓名">
            <el-option v-for="e in experts" :key="e.id" :label="e.name" :value="e.id">
            </el-option>
          </el-select>
          <el-button type="primary" plain v-on:click="checkAndLogin" >进入会议</el-button>
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
      expertId: ''
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
      console.log(this.expertId)
      if (this.expertId > 0) {
        rootVm.$router.push({
          path: 'expertPkgs',
          query: {
            cfrsId: this.conference.id,
            expertId: this.expertId
          }
        })
      } else {
        this.$message.error(this.expert.name + ', 您不是本次会议的专家')
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
</style>
