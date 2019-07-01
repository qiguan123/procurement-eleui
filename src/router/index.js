import Vue from 'vue'
import Router from 'vue-router'
import expertLogin from '../pages/expertLogin.vue'
import expertPkgs from '../pages/expertPkgs.vue'
import expertScoreDetail from '../pages/expertScoreDetail.vue'
import hostPkgsPrice from '../pages/hostPkgsPrice.vue'
import hostPkgList from '../pages/hostPkgList.vue'
import hostPkgTotalScore from '../pages/hostPkgTotalScore.vue'
import hostWaitExpertScore from '../pages/hostWaitExpertScore.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'expertLogin',
      component: expertLogin
    },
    {
      path: '/expertPkgs',
      component: expertPkgs
    },
    {
      path: '/expertScoreDetail',
      component: expertScoreDetail
    },
    {
      path: '/hostPkgsPrice',
      component: hostPkgsPrice
    },
    {
      path: '/hostPkgList',
      component: hostPkgList
    },
    {
      path: '/hostPkgTotalScore',
      component: hostPkgTotalScore
    },
    {
      path: '/hostWaitExpertScore',
      component: hostWaitExpertScore
    }
  ]
})
