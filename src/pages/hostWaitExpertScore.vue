<template>
  <el-container>
    <el-header>
      <host-nav active="3"></host-nav>
    </el-header>
    <el-main>
      <div v-for="pkg in pkgs" v-bind:key="pkg.id">
        <div style="border:1px solid black;">
          <h1>{{pkg.name}}</h1>
          <h1>已提交评分专家：
            <span v-for="e in pkg.expertRels" v-bind:key="e.expertId" v-if="e.modifiable === 0">{{idWithExpertNameMap.get(e.expertId)}} &nbsp;&nbsp;</span>
          </h1>
          <h1>未提交评分专家：
            <span v-for="ee in pkg.expertRels" v-bind:key="ee.expertId" v-if="ee.modifiable === 1">{{idWithExpertNameMap.get(ee.expertId)}} &nbsp;&nbsp;</span>
          </h1>
        </div>
        <br/>
      </div>
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
  created () {
    this.$http.get('/api/cfrs/ongoing')
      .then((resp) => {
        this.cfrsId = resp.data.id
        this.$http.get('/api/pkg/cfrs?cfrsId=' + this.cfrsId)
          .then((resp) => {
            this.pkgs = resp.data
            var allExpertSubmit = true
            for (var pkg of this.pkgs) {
              for (var e of pkg.experts) {
                this.idWithExpertNameMap.set(e.id, e.name)
              }
            }
            for (var rel of pkg.expertRels) {
              if (rel.modifiable === 1) {
                allExpertSubmit = false
              }
            }
            if (!allExpertSubmit) {
              this.timer = setInterval(this.fetchPkgs, 5000)
            }
          })
      })
  },
  methods: {
    fetchPkgs: function () {
      this.$http.get('/api/pkg/cfrs?cfrsId=' + this.cfrsId)
        .then((resp) => {
          this.pkgs = resp.data
          console.log(resp.data)
        })
    }
  },
  beforeDestroy () {
    clearInterval(this.timer)
  },
  data () {
    return {
      pkgs: [],
      timer: '',
      cfrsId: 0,
      idWithExpertNameMap: new Map()
    }
  }
}
</script>
