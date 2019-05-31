import Vue from 'vue'
import Vuex from 'vuex'
// import uploader from 'vue-easy-uploader'
Vue.use(Vuex)


const store = new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  state: {
    count: 0, //测试用
    loadShow: false, //加载状态
    token: null,
    userId: null,
    deviceInfo: null, //页面打开环境
    inviteNum: 0, //已邀请人数
    shopLocSearchHistory: [], //商铺搜索记录
    actInvitationNum: 1, //每邀请?人
    receiveArea: '', //省市区
    receivePrince:'',
    receiveCity:'',
    receiveProper:'',
    receivePrinceCode:'',
    receiveCityCode:'',
    receiveProperCode:'',
    reason: '', //退款原因,
    payClicked: false, //是否点击付款
    adObj:{},//供应链广告内容
    webShareShow:false,//分享箭头
    userInfo:{},//用户基本信息
    shareAdList:[],//生成的分享图片
    refresh:false,//页面需要刷新
  },
  mutations: {
    increment: (state) => {
      state.count++
    },
    decrement: (state) => {
      state.count--
    }, //以上测试用
    loadChange: (state, data) => {
      state.loadShow = data; //通用加载状态管理
    },
    setData: (state, data) => {
      for (let k in data) {
        state[k] = data[k]; //通用数据赋值
      }
    },
  },

  actions: {
 
  }

})

Vue.use(store)
export default store
export function getLocalStorage(key){
	return JSON.parse(localStorage.getItem(key))
}
export function setLocalStorage(key,value){
	localStorage.setItem(key,JSON.stringify(value))
}
export function removeLocalStorage(key){
	window.localStorage.removeItem(key)
}

