<template>
  <div class="wrap">
  	<div class="laterWrap" v-if="ifPay">
  		<div class="layer">
  			<div @click="payWaySelect($event,'weixin')">
  				<img class="img" src="../../static/img/wechat.png"/>
  				<span>微信支付</span>
  			</div>
  			<div @click="payWaySelect($event,'alipay')" v-if="!ifWeiXin">
  				<img class="img" src="../../static/img/alipay.png"/>
  				<span>支付宝支付</span>
  			</div>
	  		<form id="form" action="" style="display:none;" method="POST">
					
				</form>
  		</div>
  	</div>
  	<div class="isWeiXin" v-if="weixinHide">
  		<div>
  			<p>微信购买会员升级中，请点击右上角…</p>
  			<p>选择其他浏览器打开</p>
  		</div>
  	</div>
  	<div class="headWrap">
  		<div class="head">
	    	<img :src="aboutUser.headUrl"/>
	    	<div>
	    		<p>{{aboutUser.userName}}</p>
	    		<span v-if="isVip">{{aboutUser.userLevel}}</span>
	    		<span v-if="isVip">{{aboutUser.loseDate}}到期，续费后有效期将顺延</span>
	    	</div>
	    </div>
	    <div class="product">
	    	<div>
	    		<span>{{memberGoods.goodsStarAmount}}个月</span>
	    		<span class="span">|</span>
	    		<span style="color: #FE3566;">¥{{memberGoods.goodsPrice/100}}</span>
	    	</div>
	    	<div class="isMembers" @click="toPay">{{isVip?'续费':'开通'}}</div>
	    </div>
  	</div>
	  <div class="container">
	  	<div class="conTitle">尊享特权</div>	
	  	<div class="con">
	  		<div class="classfy" v-for="(item,index) in privilegelist" :key='index'>
	  			<img :src="item.priImgUrl"/>
	  			<div>{{item.priName}}</div>
	  		</div>  		
	  	</div>
	  </div>  
	  <div class="container">
	  	<div class="conTitle">身份特权</div>	
	  	<div class="explain" v-html="vipExplain"></div>
	  </div>
  </div>
</template>

<script>

var store = require('store')
import axios from 'axios'
import {encryptBy,decryptBy} from './../utils/index';
const sha256 = require("js-sha256").sha256; //引入sha256库
export default {
  name: "members",
  components: {
    
  },
  data() {
    return {
      isVip:false,
      host:location.protocol + "//" + location.host+process.env.API_HOST,
      privilegelist:[],
      aboutUser:{},
      memberGoods:{},
      ifPay:false,
      payWay:'weixin',
      orderNo:'',
      noOrder:false,
      weixinObj:{},
      vipExplain:'',
      ifWeiXin:false,
      weixinHide:false
    }
  },

  created() {
  	let message = '123456';//加密数据
//  let key = '12345678';
//		var pass = sha256('123456');
//		console.log(pass)
//		var timestamp=new Date().getTime()
//		var token = localStorage.getItem('token')
//		var sign = timestamp+token
//		console.log(timestamp)
//		console.log(token)
//		console.log(sign)
//		console.log(sha256(sign+''))
    //加密
//  console.log(encryptBy('123456'));
//  console.log(decryptBy('4bd3c44f2b51b982'));
		
    var that = this;
    that.isVip = localStorage.getItem('isVip')
		//微信浏览器
		var deviceInfo = that.$utils.deviceInfo();
		if (deviceInfo.indexOf("WeiXin") != -1) {
			that.ifWeiXin = true
		}else{
			var token = localStorage.getItem('token')
	    if(!token){
	    	that.$router.push('/')
	    	return;
	    }
		}
		that.userInfo()
		that.goodsList()
		that.getData()
		that.getAgreement()
 },
  methods: {
  	userInfo(){
  		let that = this
  		that.$indicator.open();
//		console.log(that.$ajax/.headers)
			//收益
			axios({
	      url:'/usercenter/vipRecord/getVipInfo',
	      method: 'post',
	      headers: {
	        "Content-Type": 'application/x-www-form-urlencoded; charset=UTF-8',
	        token:localStorage.getItem('token')
	      },
	   	}).then(function (res) {
	   		that.$indicator.close();
	   		console.log(res)
	   		if(res.data.code != 'E000'){
	   			
	   			that.$toast(res.data.msg)
	   			return false;
	   		}
	   		that.aboutUser = res.data.data
	    }).catch(function (err) {
	    	that.$indicator.close();
	      console.log(err)
	    })
  	},
  	goodsList(){
  		let that = this
  		that.$indicator.open();
  		that.$ajax.post('/userprofit/rechargegoodsconfig/selectRechargeGoods',
  		{
  			rechargeType: 2,
    		rechargeWay: 1
  		},
  		res=>{
  			that.$indicator.close();
//			console.log(res)
  			if(res.code != 'E000'){
	   			that.$toast(res.data.msg)
	   			return false;
	   		}
  			that.memberGoods = res.data.rechargeGoodsList[0]
  		})
  	},
   	getData(){
   		let that = this
   		that.$indicator.open();
   		axios({
	      url:'/usercenter/usePrivilege/selectPrivilege',
	      method: 'post',
	      headers: {
	        "Content-Type": 'application/x-www-form-urlencoded; charset=UTF-8',
	        token:localStorage.getItem('token')
	      },
	   	}).then(function (res) {
	   		that.$indicator.close();
//	   		console.log(res.data.data)
	   		if(res.data.code != 'E000'){
	   			if(res.data.code != 'E003'){
	   				window.location.replace(location.protocol + "//" + location.host+'/h5/officialAccounts/#/');
	   				return;
	   			}
	   			that.$toast(res.data.msg)
	   			return false;
	   		}
	   		that.privilegelist = res.data.data.privilegelist
	    }).catch(function (err) {
	    	that.$indicator.close();
	      console.log(err)
	    })
   	},
   	getAgreement(){
   		let that = this
   		that.$indicator.open();
   		that.$ajax.post('/usercenter/agreement/getAgreement',
    		{
    			code: "VIP_DESC"
    		},
    		res=>{
    			that.$indicator.close();
//  			console.log(res.data)
    			if(res.code!='E000'){
    				this.$toast(res.msg)
    				return false
    			}
    			that.vipExplain = res.data.Agreement.content
    		}
    	)
   	},
   	toPay(){
	   	let that = this
	   	if(that.ifWeiXin){
	   		that.weixinHide = true
	   	}else{
	   		that.ifPay = true
	   	}
	   	
	// 	that.$indicator.open();
   	},
   	payOrder(){
	   	let that = this
//	   	console.log(that.memberGoods.goodsPrice/100)
	  	that.$indicator.open();
			var totalAmt = that.memberGoods.goodsPrice/100 + ''
			var params = {
				goodsId: that.memberGoods.id,
				goodsCount: "1",
				totalAmt: totalAmt
			}
			var repeat 
			//获取防重复码
			axios({
		    url:'/auth/getRepeatCode',
		    method: 'post',
		    headers: {
		      "Content-Type": 'application/json; charset=UTF-8',
		      token:localStorage.getItem('token')
		    },
		  }).then(function (res) {
		   	that.$indicator.close();
//		   	console.log(res.data)
		   	if(res.data.code != 'E000'){
		   		
		   		that.$toast(res.data.msg)
		   		return;
		   	}
		   	repeat = res.data.data.repeat
		   	that.$indicator.open();
		   	axios({
			    url:'/userprofit/payorder/recharge',
			    method: 'post',
			    data:params,
			    headers: {
			      "Content-Type": 'application/json; charset=UTF-8',
			      token:localStorage.getItem('token'),
			      repeat:repeat
			    },
			  	}).then(function (res) {
			   		that.$indicator.close();
//			   		that.ifPay = false
	//		   		console.log(res.data)
			   		if(res.data.code != 'E000'){
			   			
			   			that.$toast(res.data.msg)
			   			return;
			   		}
			   		that.orderNo = res.data.data.orderNo
			   		that.payMoney()
		//	   		that.aboutUser = res.data.data
				  }).catch(function (err) {
				    	that.$indicator.close();
				      console.log(err)
//				      that.ifPay = false
				})
			}).catch(function (err) {
			    that.$indicator.close();
			    console.log(err)
			})
	  },
	  payMoney(){
	  	let that = this
//	   	console.log(that.memberGoods.goodsPrice/100)
	  	that.$indicator.open();
			//收益
//			var totalAmt = that.memberGoods.goodsPrice/100 + ''
			var payType
			if(that.payWay=='weixin'){
				payType = '5'
			}
			if(that.payWay=='alipay'){
				payType = '4'
			}
			var params = {
				 		payType: payType,
    				orderNo: that.orderNo
					}
			var repeat 
			//获取防重复码
			axios({
		    url:'/auth/getRepeatCode',
		    method: 'post',
		    headers: {
		      "Content-Type": 'application/json; charset=UTF-8',
		      token:localStorage.getItem('token')
		    },
		  }).then(function (res) {
		   	that.$indicator.close();
//		   	console.log(res.data.data)
		   	if(res.data.code != 'E000'){
		   		
		   		that.$toast(res.data.msg)
		   		return;
		   	}
		   	repeat = res.data.data.repeat
		   	that.$indicator.open();
		   	axios({
			    url:'/userprofit/payorder/getpayinfo',
			    method: 'post',
			    data:params,
			    headers: {
			      "Content-Type": 'application/json; charset=UTF-8',
			      token:localStorage.getItem('token'),
			      repeat:repeat
			    },
			  }).then(function (res) {
			   		that.$indicator.close();
//			   		that.ifPay = false
			   		console.log(res.data.data)
			   		if(res.data.code != 'E000'){
			   			
			   			that.$toast(res.data.msg)
			   			return ;
			   		}
//			   		that.weixinObj = res.data.data
			   		//微信浏览器
//			      if (that.ifWeiXin) {
//			        if (payWay == "weixin") {
//			          that.toWeixinPay(); 
//			        }
//			        return false;
//			      }
						//非微信浏览器
			   		var form = document.getElementById('form');
            let payUrl = "";
            //支付宝
            if (that.payWay == "alipay") {
              payUrl = res.data.data.requestUrl+"?"+res.data.data.params
              form.action =payUrl;
              that.noOrder = true;
            	form.submit();
//            return ;
            } 
           	if (that.payWay == "weixin") {
           		payUrl = res.data.data.mwebUrl
              form.action =payUrl;
              that.noOrder = true;
            	form.submit();
            }
			  }).catch(function (err) {
			    	that.$indicator.close();
			      console.log(err)
			      that.ifPay = false
			  })
		   	
			}).catch(function (err) {
			    that.$indicator.close();
			    console.log(err)
			})
				
	  },
	  toWeixinPay(){
	  	let that = this
	  	let map = that.weixinObj;
	    let appId = map.appId;
	    let timeStamp = map.timeStamp;
	    let nonceStr = map.nonceStr;
	 		let packageStr = map.packageValue;
	    let paySign = map.sign;
	    WeixinJSBridge.invoke(
	      'getBrandWCPayRequest', {
	      "appId": appId, //公众号名称，由商户传入     
	      "timeStamp": timeStamp, //时间戳，自1970年以来的秒数     
	      "nonceStr": nonceStr, //随机串     
	      "package": packageStr,
	      "signType": "MD5", //微信签名方式：     
	      "paySign": paySign, // 支付签名
	    },
	    function (res) {
	      console.log(res)
	      if (res.err_msg == "get_brand_wcpay_request:ok") {
	                // 使用以上方式判断前端返回,微信团队郑重提示：
	                //res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
	//              that.$router.replace({
	//                path: '/shop/payPage',
	//                query: {
	//                  outTradeNo: that.payFlowId,
	//                  biaozhi:that.$route.query.biaozhi
	//                }
	//              })
	      } else if (res.err_msg == 'get_brand_wcpay_request:cancel') {
	       	that.$messagebox.alert("取消支付", "提示").then(action => {
	          that.$router.go(-1);
	        });
	      } else {
	        console.error(JSON.stringify(res));
	        that.$messagebox.alert("支付失败!", "提示").then(action => {
	                  // alert(JSON.stringify(res))
	        that.$router.go(-1);
	      });
	                // that.$messagebox.alert(JSON.stringify(res), "提示")
	      }
	    });
	  },
	  payWaySelect(e,payway){
	   	let that = this
	   	that.payWay = payway
//	   	console.log(payway)
	   	that.payOrder()
	  }
  }

}
</script>

<style scoped>
	.wrap{
		width: 100%;
		color: #fff;
		font-size: 4vw;
	}
	.isWeiXin{
		position: fixed;
		left: 0;
		top: 0;
		width: 100%;
		height: 100vh;
		background: rgba(0,0,0,0.6);
	}
	.isWeiXin div{
		width: 100%;
		background: #fff;
		padding: 4vw;
		box-sizing: border-box;
		position: absolute;
		left: 0;
		top: 0;
		color: #333;
	}
	.laterWrap{
		position: fixed;
		left: 0;
		top: 0;
		width: 100%;
		height: 100vh;
		background: rgba(0,0,0,0.7);
	}
	.layer{
		width: 100%;
		position: fixed;
		left: 0;
		bottom: 0;
		background: #fff;
		padding:0 4vw;
		border-top-left-radius: 1.07vw;
		border-top-right-radius: 1.07vw;
		box-sizing: border-box;
		color: #333;
		font-size: 3.73vw;
		z-index: 22;
	}
	.layer div{
		width: 100%;
		display: flex;
		align-items: center;
		line-height: 16.53vw;
	}
	.layer div:first-of-type{
		border-bottom: 1px solid ghostwhite;
		box-sizing: border-box;
	}
	.img{
		display: block;
		width: 5.87vw;
		height: 5.87vw;
		margin-right: 1.33vw;
	}
	.headWrap{
		width: 100%;
		padding:0 4%;
		padding-bottom: 4vw;
		border-bottom: 1px solid #333;
		box-sizing: border-box;
	}
	.head{
		width: 100%;
		padding: 4vw 0;
		box-sizing: border-box;
		display: flex;
		align-items: center;
	}
	.head img{
		display: block;
		width: 13.07vw;
		height: 13.7vw;
		border-radius: 50%;
		margin-right: 2.67vw;
	}
	.head span{
		display: block;
		font-size: 3.2vw;
		color: #999;
	}
	.product{
		font-size: 4.53vw;
		width: 100%;
		border-radius: 1.07vw;
		background: #333;
		padding: 2.67vw;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.span{
		display: inline-block;
		width: 0.27vw;
		height: 4.53vw;
		margin: 0 2.67vw;
	}
	.isMembers{
		width: 19.73vw;
		line-height: 7.73vw;
		text-align: center;
		background: #FE3566;
		font-size: 3.73vw;
		border-radius: 1.07vw;
	}
	.container{
		width: 100%;
		padding: 2.67vw 0;
		box-sizing: border-box;
	}
	.conTitle{
		margin-left: 4vw;
		padding-left: 2.13vw;
		border-left: 0.8vw solid #F77D62;
		box-sizing: border-box;
		color: #999;
		margin-bottom: 2.67vw;
	}
	.con{
		width: 100%;
		display: flex;
		flex-flow: wrap;
		align-items: center;	
	}
	.classfy{
		/*display: inline-block;*/
		width: 25%;
		text-align: center;
		font-size: 3.73vw;
		margin-bottom: 5vw;
	}
	.classfy img{
		display: block;
		width: 9.33vw;
		height: 9.33vw;
		border-radius: 50%;
		margin: 0 auto;
		margin-bottom: 2.67vw;
	}
	.classfy div{
		width: 100%;
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
	}
	.explain{
		width: 92%;
		margin: 0 auto;
		font-size: 3.73vw;
	}
</style>
