<template>
  <div class="love">
    <div class="title" v-if="0">
      <span>爱心池</span>
    </div>
    <div class="moneyWrap">
      <div class="money">
        <div>爱心池总额 (元)</div>
        <div class="total" v-text="totalMoney">0</div>
        <div @click="showContribution">爱心贡献榜 ></div>
      </div>
    </div>
    <div class="desc">
      <p>嘻哈爱心捐助公益</p>
      <div class="text">
        “嘻哈小视频”与“映山红助学联合会&学雷锋好人工作室”协商成立【爱心星光基金】,对口援助映山红助学项目,并接受苏州园区政府慈善基金会的监督。
      </div>
      <div class="t1">
        <img src="../../static/img/left@2x.png" @click="bigImgFun">
        <img src="../../static/img/right@2x.png" @click="bigImgFun">
      </div>
      <div class="t2">
        <img src="../../static/img/down1@2x.png" @click="bigImgFun">
      </div>
      <div class="t3">
        <img src="../../static/img/down2@2x.png" @click="bigImgFun">
      </div>
    </div>

    <div class="split"></div>

    <div class="action" v-if="0">
      <p>公益在行动</p>
      <div class="window">
        <div></div>
        <div></div>
      </div>
    </div>

    <div id="bigImg" @click="hideBigImg" v-show="showFlag">
      <img :src="bigImgSrc">
    </div>
  </div>
</template>

<script>
export default {
    name: 'love',
    data () {
        return {
            totalMoney:0,
            bigImgSrc:'',
            showFlag:true
        }
    },
    created: function () {
        let that = this;
        that.$indicator.open();
        that.$ajax.post('/usercenter/love-sum/getLovePoolMoneySum',
            {},
            res=>{
                that.$indicator.close();
                if(res.code != 'E000'){
                    that.$toast(res.data.msg);
                    return false;
                }
                that.totalMoney = res.data.lovePoolMoneySumVO.payAmt;
            });

//        this.$http.post('love-sum/getLovePoolMoneySum',{}).then(function (result) {
////        this.$http.post('usercenter/love-sum/getLovePoolMoneySum',{}).then(function (result) {
//            console.log(result.body);
//            if(result.body.msg='success'){
//                this.totalMoney = result.body.data.lovePoolMoneySumVO.payAmt;
//            }
//        });
    },
    methods: {
        showContribution: function () {
            if(this.totalMoney==0){
                this.$toast('暂无排行');
            }else {
                this.$router.push("/contribution");
            }
        },
        bigImgFun:function () {
//            this.bigImgSrc=event.target.src;
//            this.showFlag=!this.showFlag;
        },
        hideBigImg:function () {
            this.showFlag=!this.showFlag;
        }
    }
}
</script>

<!--
1.Add "scoped" attribute to limit CSS to this component only
2.npm install sass-loader node-sass webpack --save-dev
 -->
<style lang="scss" scoped>
.love{
  width: 100%;
  color:white;
}

p{
  text-align: center;

  font-size: 18px;
  font-family: "微软雅黑";

  padding-top: 2vh;
  padding-bottom: 2vh;
}

.title{
  border-bottom:1px solid rgba(241, 244, 255, 0.2);
    span{
      width: 55px;
      height: 10vh;
      display: block;
      margin: auto;
      line-height: 10vh;
    }
}
.moneyWrap {
  border-bottom: 1px solid rgba(241, 244, 255, 0.2);
  .money {
    height: 35vh;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    .total {
      font-size: xx-large;
    }
  }
}
.desc{
	font-size: 4.53vw;
  div{
  	font-size: 3.88vw;
    padding-left: 3vw;
    padding-right: 3vw;
    padding-bottom: 1vh;
    overflow-y: auto;
    line-height: 20px;
  }
  .text{
    overflow-y: auto;
    padding-bottom: 2vh;
  }
  .t1{
    display: flex;
    align-items: center;
    justify-content: space-between;
  /*background:red;*/
  img{
    display: block;
    width: 46vw;
  }
  }
  .t2{
    img{
      display: block;
      width: 94vw;
    }
  }
  .t3{
    img{
      display: block;
      width: 94vw;
    }
  }
}

.split{
  background: #21222E;
  height: 10px;
}

.action{
  .window{
    padding-left: 10px;
    padding-right: 10px;
}

.window{
  display: flex;
  justify-content: space-between;
  align-items: center;
  height:25vh;
  div{
    width: 170px;
    height:13vh;
    border:1px solid rgba(241, 244, 255, 0.2);
    margin-bottom: 10vh;
    border-radius: 5px;
  }
}
}

/*屏幕中间固定*/
#bigImg{
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
  img{
    width: 100vw;
  }
}
</style>
