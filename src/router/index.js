import Vue from 'vue'
import Router from 'vue-router'


const login = r => require.ensure([], () => r(require('@/page/login')), "login");
const mine = r => require.ensure([], () => r(require('@/page/mine')), "mine");
const deposit = r => require.ensure([], () => r(require('@/page/deposit')), "deposit");
const members = r => require.ensure([], () => r(require('@/page/members')), "members");
const recharge = r => require.ensure([], () => r(require('@/page/recharge')), "recharge");
const share = r => require.ensure([], () => r(require('@/page/share')), "share");
const contribution = r => require.ensure([], () => r(require('@/page/contribution')), "contribution");
const love = r => require.ensure([], () => r(require('@/page/love')), "love");

Vue.use(Router)


export default new Router({
  routes: [
  	{path: '/',component: login,meta: {title: "登录"}},
    {path: '/mine',component: mine,meta: {title: "我的嘻哈",requireAuth:false }},
    {path: '/deposit',component: deposit,meta: {title: "收益提现",requireAuth:false }},
    {path: '/members',component: members,meta: {title: "会员",requireAuth:false }},
    {path: '/recharge',component: recharge,meta: {title: "星星充值",requireAuth:false }},
    {path: '/share',component: share,meta: {title: "app分享",requireAuth:false }},
    {path: '/love',component: love,meta: {title: "爱心池",requireAuth:false }},
    {path: '/contribution',component: contribution,meta: {title: "排行榜",requireAuth:false }}
  ]
})
