<template>
  <div class="wrap">
  	<div class="isWeiXin" v-if="ifWeiXin">
  		<div>
  			<p>微信购买会员升级中，请点击右上角…</p>
  			<p>选择其他浏览器打开</p>
  		</div>
  	</div>
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
  	<div class="textTitle">充值</div>
  	<div>
  		<div class="list" @click="toPay(index)" v-for="(item,index) in list" :key='index'>
  			<div class="conLeft">
  				<img src="../../static/img/goldIcon.png"/>
  				<div>{{item.goodsName}}</div>
  			</div>
  			<div class="conRight">￥{{item.goodsPrice/100}}</div>
  		</div>
  	</div>
  </div>
</template>

<script>

var store = require('store')
import axios from 'axios'
export default {
  name: "recharge",
  components: {
    
  },
  data() {
    return {
      ifPay:false,
      host:location.protocol + "//" + location.host+process.env.API_HOST,
      list:[],
      payWay:'weixin',
      noOrder:false,
      weixinObj:{},
      listIndex:0,
      ifWeiXin:false
    }
  },

  created() {
    var that = this;
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
//		console.log(that.ifWeiXin)
		that.goodsList()
 },
  methods: {
  	goodsList(){
  		let that = this
  		that.$indicator.open();
  		that.$ajax.post('/userprofit/rechargegoodsconfig/selectRechargeGoods',
  		{
  			rechargeType: 1,
    		rechargeWay: 1
  		},
  		res=>{
  			that.$indicator.close();
//				console.log(res)
  			if(res.code != 'E000'){
	   			that.$toast(res.data.msg)
	   			return false;
	   		}
  			that.list = res.	data.rechargeGoodsList
  		})
  	},
  	payOrder(){
	   	let that = this
//	   	console.log(that.memberGoods.goodsPrice/100)
	  	that.$indicator.open();
			var totalAmt = that.list[that.listIndex].goodsPrice/100 + ''
			var params = {
				goodsId: that.list[that.listIndex].id,
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
				      that.ifPay = false
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
//		   	console.log(res.data.code)
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
//			   		console.log(res.data.data)
			   		if(res.data.code != 'E000'){
			   			
			   			that.$toast(res.data.msg)
			   			return ;
			   		}
			   		that.weixinObj = res.data.data
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
	 		let packageStr = 'prepay_id=' + map.prepayId;
	    let paySign = map.sign;
	//					console.log(WeixinJSBridge.invoke)
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
   	toPay(index){
   		let that = this
   		that.listIndex = index
   		that.ifPay=true
// 		console.log(index)
// 		console.log(that.list[index])
   	},
  	payWaySelect(e,payway){
	   	let that = this
	   	that.payWay = payway
//	   	console.log(payway)
	   	that.payOrder()
//	   	that.ifPay=false
	  }
  }

}
</script>

<style scoped>
	.wrap{
		width: 100%;
		padding: 4.67vw 4%;
		box-sizing: border-box;
		color:#A8A8B0;
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
	.textTitle{
		margin-bottom: 1.33vw;
	}
	.list{
		width: 100%;
		height: 13.33vw;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.conLeft{
		display: flex;
		align-items: center;
	}
	.conLeft img{
		display: block;
		width: 4.53vw;
		height: 4.53vw;
		margin-right: 1.33vw;
	}
	.conRight{
		width: 17.07vw;
		line-height: 6.67vw;
		text-align: center;
		border-radius: 1.07vw;
		background: #FE3566;
		font-size: 3.2vw;
		color: #fff;
	}
</style>
