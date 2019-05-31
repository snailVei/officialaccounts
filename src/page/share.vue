<template>
  <div class="share">
    <div class="content">
      <video class="video-show" muted autoplay="autoplay" @ended="showDownloadPage" v-show="showVideo" playsinline="true"
             webkit-playsinline="true"
             x5-playsinline="true">
        <source :src="videoAddress" type="video/mp4">
      </video>
      <!--<transition>-->
        <!--<router-view></router-view>-->
      <!--</transition>-->
      <div class="wrap" v-show="showActiveDiv">
        <div class="activediv">
          <div class="activebody">
            <div>
              <img src="../../static/img/logoapp@2x.png" width="105px;">
            </div>
            <div>
              <img src="../../static/img/xihaapp@2x.png" width="100px;">
            </div>
            <div>
              <span style="color: #fff;">去嘻哈观看更多好玩的小视频</span>
            </div>
          </div>
          <div class="downloadDiv" @click="download">
            <a :href="downloadUrl" id="downloadApp"><span style="color: #fff;" class="downloadSpan">下载应用</span></a>
            <!--<img src="../assets/downloadapp@2x.png" @click="">-->
          </div>
        </div>
      </div>

    </div>
    <div class="bottem">
      <div class="left">
        <img class="logo" src="../../static/img/logo@2x.png">
        <img class="xiha" src="../../static/img/xiha@2x.png">
      </div>
    </div>
  </div>
</template>

<script>
//    import { Toast } from "mint-ui";
export default {
  name: 'share',
  data () {
    return {
        downloadUrl: '',
        showVideo:true,
        showActiveDiv:false,
        videoAddress:''
    }
  },
    methods:{
      download:function () {
//            this.$toast({
//                message: "8888888888",
//            });
          //判断终端类型
          var u = navigator.userAgent;
          var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
          var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
          if(isiOS){
              this.downloadUrl = 'https://itunes.apple.com/cn/app/id1463268258?mt=8';
          }

      },
        showDownloadPage:function () {
          this.showVideo=false;
          this.showActiveDiv=true;
        }
    },
    created:function () {
        var location= this.$route.fullPath;
        var videoAddress =location.substr(location.indexOf("?videoAddress")+14,location.length-2);
        console.log(videoAddress);
        this.videoAddress = unescape(videoAddress);

        //获取安卓下载地址
        let that = this;
        that.$indicator.open();
        that.$ajax.post('/usercenter/appVersionControl/getLastVersion',
            {},
            res=>{
                that.$indicator.close();
                if(res.code != 'E000'){
                    that.$toast(res.data.msg);
                    return false;
                }
                console.log(res.data.appUpdateUrl);
                this.downloadUrl=res.data.appUpdateUrl;
            });

//        //获取安卓下载地址
//        this.$http.post('appVersionControl/getLastVersion',{}).then(function (result) {
//            if(result.body.msg='success'){
//                console.log(result.body.data.appUpdateUrl);
//                this.downloadUrl=result.body.data.appUpdateUrl;
//            }
//        });
    }
}



//地址栏上面获取参数
function getQueryString(key) {
    // 获取参数
    var url = window.location.search;
    // 正则筛选地址栏
    var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)");
    // 匹配目标参数
    var result = url.substr(1).match(reg);
    //返回参数值
    return result ? decodeURIComponent(result[2]) : null;
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .content{
    width: 100%;
    height: 92vh;
    
    background-image: url("../../static/img/background@2x.jpg");
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
  }

  .share{
    width: 100%;
    height: 100vh;
    position: relative;
  }
  .bottem{
    background-color: black;
    width: 100%;
    height: 8vh;

    display: flex;
    justify-content: space-between;
    align-items: center;

    position: fixed;
    z-index: 999;
    bottom:0px;
    left:0px;
  }
  .video-show{
    width: 100%;
  }
  .left{
    width: 60%;
    align-items: center;
  }
  .logo{
    width: 42px;
    margin-left: 15px;
    float: left;
  }
  .xiha {
    width: 98px;
    margin-left: 15px;
    margin-top: 5%;
  }
  .downloadDiv{
    width: 150px;
    height: 30px;
    background: #ff453a;
    border-radius: 10px;
  }
  .wrap{
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
    position: fixed;
    left: 0;
    top: 0;
  }
  .activediv{
    /*position: absolute;*/
    /*background: red;*/
    /*width: 250px;*/
    /*height: 250px;*/
    /*margin: auto auto;*/
    /*overflow: hidden;*/

    position: absolute;
    z-index: 9999;
    width:80%;
    left: 10%;
    top: 50%;
    transform: translateY(-50%);

    height: 58%;

    display: flex;
    justify-content: space-around;
    align-items: center;
    flex-direction: column;
  }
  .activebody{
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: column;

    height: 48%;
  }
  #downloadApp{
    display: block;
    margin: 0 auto;
    width: 64px;
    line-height: 28px;
    text-decoration: none;
    color: #ffff;

    width: 100%;
    height: 100%;
  }
  .downloadSpan{
    padding-left: 30%;
  }
</style>
