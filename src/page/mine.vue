<template>
  <div class="wrap">
  	<div class="tips" v-if="ifExChange">
  		<div class="layerCon">
  			<p>当前余额（元）</p>
  			<p class="balance">{{remainingMoney}}</p>
  			<div class="balanceInfo">
  				<span>可兑换</span>
  				<span>{{exchangeable}}嘻哈币</span>
  			</div>
  			<div class="balanceInfo">
  				<span>兑换金额</span>
  				<input type="number" @input="oninput" placeholder="请输入要兑换的金额"></input>
  			</div>
  			<div class="balanceInfo">
  				<span>共计嘻哈币</span>
  				<span style="color: #FE3566;">{{total}}嘻哈币</span>
  			</div>
  			<div :class="nonNull ? 'exchange sureBtn' : 'exchange'" @click="toChange">确认兑换</div>
  			<img @click='closed' class="closedImg" src="../../static/img/closed.png"/>
  		</div>
  	</div>
  	<div class="tips" @click="tipsHide" v-if="ifTips">
  		<div class="tipsCon">
  			<div>未绑定支付宝请前往 APP绑定</div>
  			<div class="tipsBtn">我知道了</div>
  		</div>
  	</div>
    <div class="head">
    	<div class="headPic"><img :src="headPic"/></div>
    	<div>
    		<p class="userName">{{userName}}</p>
    		<p>账号：{{accountNo}}</p>
    	</div>
    </div>
    
    <div class="list members" @click="toBuy">
    	<div>会员购买</div>
    	<div><img class="img" src="../../static/img/back.png"/></div>
    </div>
    <div class="list" @click="recharge">
    	<div>充值嘻哈币</div>
    	<div><img class="img" src="../../static/img/back.png"/></div>
    </div>
    <div class="earnings">
    	<div class="contain">
    		<div class="money">
    			<p>{{earningsMoney.giftAfterTaxMoney/100}}</p>
	    		<span style="color: #999;font-size: 3.2vw;">礼物收益（税后/元）可兑换嘻哈币：{{earningsMoney.giftAfterStarAmount}}</span>
    		</div>
	    	<div class="operation">
	    		<div>
	    			<span @click="exChange($event,1)">兑换</span>
	    			<span @click="takeOut($event,'1')">提现</span>
	    		</div>
	    	</div>	
    	</div>
    	<div class="contain">
    		<div class="money">
    			<p>{{earningsMoney.liveAfterTaxMoney/100}}</p>
	    		<span style="color: #999;font-size: 3.2vw;">直播收益（税后/元）可兑换嘻哈币：{{earningsMoney.liveAfterStarAmount}}</span>
    		</div>
	    	<div class="operation">
	    		<div>
	    			<span @click="exChange($event,2)">兑换</span>
	    			<span @click="takeOut($event,'2')">提现</span>
	    		</div>
	    	</div>	
    	</div>
    	<div class="contain">
    		<div class="money">
    			<p>{{earningsMoney.inviteAfterTaxMoney/100}}</p>
	    		<span style="color: #999;font-size: 3.2vw;">邀请收益（税后/元）可兑换嘻哈币：{{earningsMoney.inviteAfterStarAmount}}</span>
    		</div>
	    	<div class="operation">
	    		<div>
	    			<span @click="exChange($event,3)">兑换</span>
	    			<span @click="takeOut($event,'3')">提现</span>
	    		</div>
	    	</div>		
    	</div>
    	<div class="contain" v-if="earningsMoney.familyOwnerFlag==1">
    		<div class="money">
    			<p>{{earningsMoney.familyAfterTaxMoney/100}}</p>
	    		<span style="color: #999;font-size: 3.2vw;">家族收益（税后/元）可兑换嘻哈币：{{earningsMoney.familyAfterStarAmount}}</span>
    		</div>
	    	<div class="operation">
	    		<div>
	    			<span @click="exChange($event,4)">兑换</span>
	    			<span @click="takeOut($event,'4')">提现</span>
	    		</div>
	    	</div>	
    	</div>
    </div>
    <div class="loginOut" @click="loginout">退出登陆</div>   
  </div>
</template>

<script>

var store = require('store')
import axios from 'axios'
export default {
  name: "mine",
  components: {
    
  },
  data() {
    return {
      host:location.protocol + "//" + location.host+process.env.API_HOST,
      headPic:'../../static/img/headPic.png',
      userName:'',
      accountNo:'',
      isVip:false,
      bandAilFlag:0,
      earningsMoney:{},
      ifTips:false,
      nonNull:false,
      remainingMoney:0,
      exchangeable:0,
      total:0,
      ifExChange:false,
      conversionType:1,
      inputValue:0
    }
  },

  created() {
//	localStorage.setItem('token',store.get('token'))
//	localStorage.setItem('users','bububu')
//	console.log(store.get('token'))
    var that = this;
    var token = localStorage.getItem('token')
    if(!token){
    	that.$router.replace('/')
    	return;
    }
		
		that.dataInfo()
		localStorage.setItem('isVip',that.isVip)
		that.earnings()
 },
  methods: {
  	loginout(){
  		let that = this
  		window.localStorage.removeItem('token')
  		that.$router.replace('/')
  	},
  	closed(){
  		let that = this
  		that.ifExChange = false
  	},
  	oninput(e){
  		let that = this
  		e.target.value = (e.target.value.match(/^\d*(\.?\d{0,2})/g)[0]) || null
//			console.log('e',e.target.value)
			if(e.target.value>0){
				that.nonNull = true
			}else{
				that.nonNull = false
			}
			if(e.target.value>that.remainingMoney){
				e.target.value = that.remainingMoney
//				return;
			}
			that.inputValue = e.target.value
			if(e.target.value == ''){
				that.total = 0
				return;
			}
//		console.log(that.conversionType)
			that.$indicator.open();
			//检查兑换星星信息
			axios({
	      url: '/userprofit/userwallet/checkConversion',
	      method: 'post',
	      headers: {
	        "Content-Type": 'application/json; charset=UTF-8',
	        token:localStorage.getItem('token')
	      },
	      data:{
	      	"conversionType": that.conversionType,
    			"conversionMoney": e.target.value
	      },
	   	}).then(function (res) {
	   		that.$indicator.close();
//	   		console.log(res.data.data)
	   		if(res.data.code != 'E000'){
	   			that.$messagebox.alert('未登录', "提示").then(action => {
//           that.$router.replace({path: '/'});
          });
	   			that.$toast(res.data.msg)
	   			return false;
	   		}
	   		that.total = res.data.data.conversionStar
	   		if(res.data.data.conversionFlag==0){
	   			that.nonNull = false
	   		}
	   		if(res.data.data.conversionFlag==1){
	   			that.nonNull = true
	   		}
//	   		that.aboutUser = res.data.data
	    }).catch(function (err) {
	    	that.$indicator.close();
	      console.log(err)
	    })
  	},
  	toChange(){
  		let that = this
  		if(that.nonNull == false){
  			return ;
  		}
  		that.$indicator.open();
  		var inputValue = that.inputValue*1*100
  		var repeat 
  		axios({
	      url: '/auth/getRepeatCode',
	      method: 'post',
	      headers: {
	        "Content-Type": 'application/x-www-form-urlencoded; charset=UTF-8',
	        token:localStorage.getItem('token')
	      },
	   	}).then(function (res) {
	   		that.$indicator.close();
//	   		console.log(res.data.data)
				if(res.data.code != 'E000'){
					
	   			that.$toast(res.data.msg)
	   			return false;
	   		}
	   		repeat = res.data.data.repeat
	   		that.$indicator.open();
				axios({
		      url: '/userprofit/userwallet/conversion',
		      method: 'post',
		      headers: {
		        "Content-Type": 'application/json; charset=UTF-8',
		        token:localStorage.getItem('token'),
		        repeat:repeat
		      },
		      data:{
		      	"conversionType": that.conversionType,
	    			"conversionMoney": inputValue
		      },
		   	}).then(function (res) {
		   		that.$indicator.close();
	//	   		console.log(res.data.data)
		   		if(res.data.code != 'E000'){
		   			
		   			that.$toast(res.data.msg)
		   			return false;
		   		}
		   		that.$toast({message: '兑换成功！',duration: 1500});
		      setTimeout(function(){
				    that.ifExChange = false
				    that.earnings()
				  }, 1500);
		    }).catch(function (err) {
		    	that.$indicator.close();
		     console.log(err)
		    })
	   		
	    }).catch(function (err) {
	    	that.$indicator.close();
	      console.log(err)
	    })
	    
  	},
  	earnings(){
  		let that = this
  		that.$indicator.open();
//		console.log(that.$ajax/.headers)
			//收益
			axios({
	      url: '/userprofit/userwallet/getMyWalletInfo',
	      method: 'post',
	      headers: {
	        "Content-Type": 'application/x-www-form-urlencoded; charset=UTF-8',
	        token:localStorage.getItem('token')
	      },
	   	}).then(function (res) {
	   		that.$indicator.close();
//	   		console.log(res)
	   		if(res.data.code != 'E000'){
	   			
	   			that.$toast(res.data.msg)
	   			return false;
	   		}
	   		that.bandAilFlag = res.data.data.bandAilFlag
	   		that.earningsMoney = res.data.data
	    }).catch(function (err) {
	    	that.$indicator.close();
	      console.log(err)
	    })
  	},
  	dataInfo(){
  		let that = this
  		that.$indicator.open();
//		console.log(that.$ajax/.headers)
			//用户信息
			
			axios({
	      url: '/usercenter/sys-usercenter/getUserCenterInfo',
	      method: 'post',
	      headers: {
	        "Content-Type": 'application/x-www-form-urlencoded; charset=UTF-8',
	        token:localStorage.getItem('token')
	      },
	   	}).then(function (res) {
	   		that.$indicator.close();
//	   		that.$messagebox.alert('未登录', "提示").then(action => {
////           that.$router.replace({path: '/'});
//    	});
	   		console.log(res)
				if(res.data.code != 'E000'){
					
	   			that.$toast(res.data.msg)
	   			return;
	   		}
	   		that.headPic = res.data.data.headUrl
	   		that.userName = res.data.data.userName
	   		that.accountNo = res.data.data.userCode
	   		if(res.data.data.vipStatus==0){
	   			that.isVip = false
	   		}
	   		if(res.data.data.vipStatus==1){
	   			that.isVip = true
	   		}
	    }).catch(function (err) {
	    	that.$indicator.close();
	      console.log(err+'1')
	    })
  	},
  	exChange(e,id){
  		let that = this
  		that.total = 0
  		if(id==1){
  			that.remainingMoney = that.earningsMoney.giftAfterTaxMoney/100
      	that.exchangeable= that.earningsMoney.giftAfterStarAmount
  		}else if(id==2){
  			that.remainingMoney = that.earningsMoney.liveAfterTaxMoney/100
      	that.exchangeable= that.earningsMoney.liveAfterStarAmount
  		}else if(id==3){
  			that.remainingMoney = that.earningsMoney.inviteAfterTaxMoney/100
      	that.exchangeable= that.earningsMoney.inviteAfterStarAmount
  		}else if(id==4){
  			that.remainingMoney = that.earningsMoney.familyAfterTaxMoney/100
      	that.exchangeable= that.earningsMoney.familyAfterStarAmount
  		}
  		if(that.remainingMoney>0){
  			that.ifExChange = true
  		}else{
//			that.ifExChange = true
				that.ifExChange = false
				that.$toast('余额不足！')
  		}
  		that.conversionType = id
  	},
   	takeOut(e,id){
   		let that = this
   		if(that.bandAilFlag==0){
   			that.ifTips = true
   			return ;
   		}
   		this.$router.push({path: '/deposit',query:{id: id}})
   	},
   	toBuy(){
   		this.$router.push({path: '/members',query:{isVip: this.isVip}})
   	},
   	recharge(){
   		this.$router.push({path: '/recharge'})
   	},
   	tipsHide(){
   		let that = this
   		that.ifTips = false
   	}
  }

}
</script>

<style scoped>
	.wrap{
		width: 100%;
		padding-bottom: 8vw;
		box-sizing: border-box;
		color: #fff;
		font-size: 4.27vw;
	}
	.tips{
		width: 100%;
		height: 100vh;
		background: rgba(0,0,0,0.7);
		position: fixed;
		left: 0;
		top: 0;
	}
	.layerCon{
		width: 80%;
		position: absolute;
		left: 10%;
		top: 50%;
		transform: translateY(-50%);
		background: #fff;
		border-radius: 3.2vw;
		padding:5.33vw 4vw;
		box-sizing: border-box;
		font-size: 4.27vw;
		color: #333;
		text-align:center;
	}
	.balance{
		font-size: 6.93vw;
		color: #FE3566;
		margin-top: 1.5vw;
	}
	.balanceInfo{
		width: 100%;
		padding: 4vw 0;
		border-bottom: 1px solid #ddd;
		box-sizing: border-box;	
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.balanceInfo input{
		display: block;
		text-align: right;
		border: 0;
		/*background: red;*/
		width: 58%;
		outline: none;
	}
	.exchange{
		width: 100%;
		line-height: 10.4vw;
		color: #fff;
		background: #ddd;
		border-radius: 52vw;
		margin-top: 5.33vw;
	}
	.sureBtn{
		background: linear-gradient(#F78261,#F54B64);
	}
	.closedImg{
		display: block;
		width: 8.27vw;
		height: 8.27vw;
		position: absolute;
		left: 50%;
		bottom: -16vw;
		transform: translateX(-50%);
	}
	.tipsCon{
		width: 66%;
		position: absolute;
		left: 17%;
		top: 50%;
		transform: translateY(-50%);
		background: #fff;
		border-radius: 3.2vw;
		padding:5.07vw 10.67vw;
		padding-bottom: 4.27vw;
		box-sizing: border-box;
		font-size: 4.5vw;
		color: #333;
		text-align:center;
	}
	.tipsBtn{
		width: 100%;
		line-height: 9.6vw;
		background: linear-gradient(#F78261,#F54B64);
		border-radius: 4.8vw;
		color: #fff;
		margin-top: 3.2vw;
	}
	.head{
		width: 100%;
		padding: 0 4%;
		display: flex;
		align-items: center;
		padding: 5.33vw 4%;
		border-bottom: 1px solid #333;
		box-sizing: border-box;
	}
	.headPic{
		width: 16vw;
		height: 16vw;
		border-radius:50%;
		margin-right: 2.67vw;
		font-size: 3.73vw;
	}
	.headPic img{
		display: block;
		width: 100%;
		height: 100%;
		border-radius:50%;
	}
	.userName{
		font-size: 5.07vw;
		margin-bottom: 1.07vw;
	}
	.list{
		width: 92%;
		margin: 0 auto;
		line-height: 14.53vw;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.members{
		border-bottom: 1px solid #333;
		box-sizing: border-box;
	}
	.img{
		display: block;
		width: 2.13vw;
		height: 3.47vw;
	}
	.earnings{
		padding: 4%;
		border-top: 1px solid #333;
		box-sizing: border-box;
		width: 100%;
	}
	.contain{
		width: 100%;
		padding: 2.67vw;
		padding-bottom: 4vw;
		border-radius: 1.07vw;
		box-sizing: border-box;
		background: rgba(255,255,255,0.15);
		margin-bottom: 2.67vw;
	}
	.money{
		font-size: 6.67vw;
		width: 100%;
		padding-bottom: 4vw;
		border-bottom: 1px solid #4C4D56;
		box-sizing: border-box;
		margin-bottom: 4vw;
	}
	.operation{
		text-align: right;
	}
	.operation span{
		display: inline-block;
		width: 19.73vw;
		line-height: 7.73vw;
		text-align: center;
		background: #FE3566;
		border-radius: 1.07vw;
		font-size: 3.73vw;
		margin-right: 1.5vw;
	}
	.loginOut{
		width: 84%;
		line-height: 11.73vw;
		text-align: center;
		background: linear-gradient(to right,#F54B64,#F78361);
		margin: 0 auto;
		margin-top: 2.67vw;
		border-radius: 5.87vw;
		font-size: 5.07vw;
	}
</style>
