<template>
  <div id="app">
    <keep-alive>
      <router-view
        v-if="$route.meta.keepAlive"

        v-wechat-title="$route.meta.title"
      ></router-view>
      <!--<router-view v-wechat-title="$route.meta.title"></router-view>-->
    </keep-alive>
    <router-view
      v-if="!$route.meta.keepAlive"
      v-wechat-title="$route.meta.title"
    ></router-view>
    <!--<router-view v-wechat-title="$route.meta.title"></router-view>-->
  </div>
</template>

<script>
var store = require('store')
export default {
  name: 'App',
  data(){
    return{

    }
  },
  computed: {
    keepAlive () {
      return this.$store.getters.keepAlive
    }
  },
  mounted() {
//  console.log(this.$store.getters.keepAlive)
    // 关闭浏览器窗口的时候清空浏览器缓存在localStorage的数据
    window.onbeforeunload = function (e) {
    //   let shopId=store.get("shopId");
    //  store.clearAll();
    //  alert("shopId")
    //   store.set("shopId",shopId)
    }
  }
}
</script>

<style>
#app {
  font-family: MicrosoftYaHei;
  background: #161723;; 
  min-height: 100%;
}
.widthImg{width: 100%;}
/* 禁止图片放大 */
</style>
