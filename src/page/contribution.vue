<template>
    <div class="contribution">
        <div class="title"  v-if="0">
            <span>爱心贡献榜</span>
        </div>
        <div class="top3" v-show="userInfos.length > 3">

            <div>
                <div class="rankingTwo">
                    <!--<img src="../assets/top2@2x.png" class="img2">-->
                    <!--<div class="degree2"></div>-->
                    <div class="headPic2">
                        <img :src="headPic2.headUrl"/>
                        <img class="two" src="../../static/img/2@2x.png"/>
                    </div>
                </div>
                <div class="textcenter">{{headPic2.xiHaBi}}星星</div>
            </div>

            <div>
                <div class="rankingOne">
                    <!--<img src="../assets/top1@2x.png" class="img1">-->
                    <!--<div class="degree1"></div>-->
                    <div class="headPic1">
                        <img :src="headPic1.headUrl"/>
                        <img class="one" src="../../static/img/1@2x.png"/>
                    </div>
                </div>
                <div class="textcenter">{{headPic1.xiHaBi}}星星</div>
            </div>

            <div>
                <div class="rankingThree">
                    <!--<img src="../assets/top3@2x.png" class="img3">-->
                    <!--<div class="degree3"></div>-->
                    <div class="headPic3">
                        <img :src="headPic3.headUrl"/>
                        <img class="three" src="../../static/img/3@2x.png"/>
                    </div>
                </div>
                <div class="textcenter">{{headPic3.xiHaBi}}星星</div>
            </div>

        </div>
        <div class="list" v-infinite-scroll="getData" infinite-scroll-disabled="moreLoading"
             infinite-scroll-distance="0">
            <div v-for="userInfo in userInfos" class="item" :id="userInfo.userId">
                <div class="left">
                    <div>
                        <img :src="userInfo.headUrl" :class="headClass">
                    </div>
                    <div class="left_right">
                        <div v-text="userInfo.userName"></div>
                        <div class="LV" v-cloak>LV{{userInfo.userLevel}}</div>
                    </div>
                </div>
                <div class="right" v-cloak>+{{userInfo.xiHaBi}}</div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'contribution',
        data () {
            return {
                allLoaded: false,
                moreLoading: false, //以上加载更多
                userInfos: [],
                headClass: ['headClass'],
                headPic1: {},
                headPic2: {},
                headPic3: {},
                pageNumber: 1,
                pageSize: 7,
                top3UserInfos: []
            }
        },
        methods: {
            getData(){
                var that = this;
                if (this.allLoaded) {
                    that.moreLoading = true;
                    return false;
                }
                if (that.moreLoading) {
                    return false;
                }
                that.moreLoading = true;
                that.$indicator.open();
                that.$ajax.post('/usercenter/love-rank/loveRankList', {page: that.pageNumber, pageSize: that.pageSize}, res=>{
                    that.$indicator.close();
                if (res.code != 'E000') {
                    that.$toast(res.data.msg);
                    return false;
                }
                if (that.pageNumber == 1) {
                    that.userInfos = [];
                }
                var userInfos = res.data.loveRankListVOList;
                console.log(userInfos);
                if (userInfos.length < that.pageSize) {
                    that.allLoaded = true;
                }
                that.userInfos = that.userInfos.concat(userInfos);
                that.pageNumber = that.pageNumber + 1;
                that.moreLoading = false;
                that.headPic1 = that.userInfos[0];
                that.headPic2 = that.userInfos[1];
                that.headPic3 = that.userInfos[2];
            });
            }
        },
        created: function () {

        }
    }
</script>

<!--
1.Add "scoped" attribute to limit CSS to this component only
2.npm install sass-loader node-sass webpack --save-dev
 -->
<style lang="scss" scoped>
    [v-cloak] {
        display: none;
    }

    .contribution {
        width: 100%;
        color: white;
    }

    .title {
        border-bottom: 1px solid rgba(241, 244, 255, 0.2);
        span {
            width: 90px;
            display: block;
            margin: auto;
            line-height: 10vh;
        }
    }
    .top3 {
        border-bottom: 1px solid rgba(241, 244, 255, 0.2);
        display: flex;
        justify-content: space-around;
        align-items: center;
        padding: 5.33vw 0px;
        box-sizing: border-box;
    }

    .top3 img {
        display: block;
        width: 100%;
        height: 100%;
        border-radius: 50%;
    }

    .rankingTwo {
        width: 21.33vw;
        height: 21.33vw;
        background: url(../../static/img/top2@2x.png) no-repeat left top;
        background-size: 100% 100%;
        position: relative;
    }

    .rankingOne {
        width: 36vw;
        height: 25.33vw;
        background: url(../../static/img/top1@2x.png) no-repeat left top;
        background-size: 100% 100%;
        position: relative;
    }

    .rankingThree {
        width: 21.33vw;
        height: 21.33vw;
        background: url(../../static/img/top3@2x.png) no-repeat left top;
        background-size: 100% 100%;
        position: relative;
    }

    .headPic2 {
        width: 15.73vw;
        height: 15.73vw;
        position: absolute;
        left: 50%;
        bottom: 0.67vw;
        transform: translateX(-50%);
    }

    .headPic1 {
        width: 18.67vw;
        height: 18.67vw;
        position: absolute;
        left: 50%;
        bottom: 0.67vw;
        transform: translateX(-50%);
    }

    .headPic3 {
        width: 15.73vw;
        height: 15.73vw;
        position: absolute;
        left: 50%;
        bottom: 0.67vw;
        transform: translateX(-50%);
    }

    .top3 .two {
        width: 5.33vw;
        height: 5.33vw;
        position: absolute;
        right: 0;
        bottom: 0;
    }

    .top3 .one {
        width: 6.4vw;
        height: 6.4vw;
        position: absolute;
        right: 0;
        bottom: 0;
    }

    .top3 .three {
        width: 5.33vw;
        height: 5.33vw;
        position: absolute;
        right: 0;
        bottom: 0;
    }

    .textcenter {
        text-align: center;
    }

    .item {
        display: flex;
        justify-content: space-around;
        align-items: center;

        border-bottom: 1px solid rgba(241, 244, 255, 0.2);

        padding: 16px 0vh;
    }

    .left {
        width: 60%;
        height: 50px;
    div {
        float: left;
    }
    }

    .left_right {
        display: flex;
        justify-content: space-around;
        flex-direction: column;
        height: 50px;

        margin-left: 6px;
    .LV {
        color: #999999;
    }
    }

    .headClass {
        width: 50px;
        height: 50px;
        margin-right: 1vw;
        border-radius: 50%;
    }
</style>
