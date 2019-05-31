<template>
	<div class="wrap">
		<div class="layerWrap" @click="hideLayer" v-if="ifRule">
			<div class="layerCon">
				<!--<div style="text-align: center;">{{Agreement.title}}</div>-->
				<div v-html="Agreement.content"></div>
			</div>
		</div>
		<div class="account">提现到支付宝：{{countInfo.alipayCount}}</div>
		<div class="takeWrap">
			<div class="takeTitle">
				<span>提现金额</span><img @click="getRule" src="../../static/img/ruleIcon.png" />
			</div>
			<div class="money">
				<span>￥</span><input type="number" :class="inputValue==''?'':'inputCon'" :placeholder="placeholder" @input="oninput" />
			</div>
		</div>
		<div>收益可提现金额¥{{countInfo.currentAfterTaxMoney/100}}</div>
		<div class="btn" @click="deposit">立即提现</div>
	</div>

</template>

<script>
	var store = require('store')
	import axios from 'axios'
	export default {
		name: "deposit",
		components: {

		},
		data() {
			return {
				host: location.protocol + "//" + location.host + process.env.API_HOST,
				cashType: '1',
				countInfo:{},
				placeholder:'今日还可提现3,000元',
				inputValue:0,
				Agreement:{},
				ifRule:false
			}
		},

		created() {
			var that = this;
			that.cashType = that.$route.query.id
			that.getData()
		},
		methods: {
			hideLayer(){
				this.ifRule = false
			},
			getRule(){
				let that = this
				that.$indicator.open();
				that.$ajax.post( '/usercenter/agreement/getAgreement',
		    		{
		    			code: "CASH_OUT"
		    		},
		    		res=>{
		    			that.$indicator.close();
		    			console.log(res.data)
		    			if(res.code!='E000'){
		    				this.$toast(res.msg)
		    				return false
		    			}
		    			that.ifRule = true
		    			that.Agreement = res.data.Agreement
		    		}
		    	)
			},
			oninput(e){
				let that = this
				e.target.value = (e.target.value.match(/^\d*(\.?\d{0,2})/g)[0]) || null
				that.inputValue = e.target.value
//				console.log(e.target.value)
			},
			deposit(){
				let that = this
				if(that.inputValue <= 0){
					that.$toast('请输入金额')
					return ;
				}
				var repeat 
				//获取防重复码
		  		axios({
			      url:  '/auth/getRepeatCode',
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
					      url:  '/userprofit/transfer/alitransfer',
					      method: 'post',
					      headers: {
					        "Content-Type": 'application/json; charset=UTF-8',
					        token:localStorage.getItem('token'),
					        repeat:repeat
					      },
					      data:{
					      	amount: that.inputValue,
							remark: "提现",
							cashType: that.cashType
					      },
					   	}).then(function (res) {
					   		that.$indicator.close();
//					   		console.log(res.data)
					   		if(res.data.code != 'E000'){
					   			
					   			that.$toast(res.data.msg)
					   			return false;
					   		}
					   		that.$toast({message: '成功！',duration: 1500});
					   		that.getData()
					   		location.href = window.location.href.split("/#/")[0]+'/#/mine'
		//			   		this.$router.replace({path: '/mime'})
					    }).catch(function (err) {
					    	that.$indicator.close();
					      	console.log(err)
					    })
			   		
			    }).catch(function (err) {
			    	that.$indicator.open();
			      	console.log(err)
			    })
			},
			getData() {
				let that = this
				//	   	console.log(that.memberGoods.goodsPrice/100)
				that.$indicator.open();
				axios({
					url:  '/userprofit/userwallet/checkCash',
					method: 'post',
					data: {
						cashType:that.cashType
					},
					headers: {
						"Content-Type": 'application/json; charset=UTF-8',
						token: localStorage.getItem('token')
					},
				}).then(function(res) {
					that.$indicator.close();
//					console.log(res.data)
					if(res.data.code != 'E000') {
						
						that.$toast(res.data.msg)
						return;
					}
					that.countInfo = res.data.data
					that.placeholder = '今日还可提现'+res.data.data.surplusCashTotalMoeny+'元'
				}).catch(function(err) {
					that.$indicator.close();
					console.log(err)
				})
			}
		}

	}
</script>

<style scoped>
	.wrap {
		width: 100%;
		padding: 0 4%;
		box-sizing: border-box;
		color: #fff;
		font-size: 4vw;
	}
	.layerWrap{
		width: 100%;
		height: 100vh;
		background: rgba(0,0,0,0.7);
		position: fixed;
		left: 0;
		top: 0;
		z-index: 99;
	}
	.layerCon{
		width: 70%;
		position: absolute;
		left: 15%;
		top: 50%;
		transform: translateY(-50%);
		/*background: #fff;*/
		background: #161723;
		padding: 4vw;
		box-sizing: border-box;
		border-radius: 1.07vw;
		/*background-color:#fff;*/
	}
	.account {
		line-height: 13.47vw;
		border-bottom: 1px solid #333;
	}
	
	.takeWrap {
		width: 100%;
		padding: 4vw 0;
		border-bottom: 1px solid #333;
		box-sizing: border-box;
		margin-bottom: 2.67vw;
	}
	
	.takeTitle {
		display: flex;
		align-items: center;
		margin-bottom: 5.33vw;
	}
	
	.takeTitle img {
		display: block;
		width: 5.87vw;
		height: 5.87vw;
		margin: 2.67vw;
	}
	
	.money {
		font-size: 9.33vw;
		display: flex;
		align-items: center;
	}
	
	input {
		display: inline-block;
		background: transparent;
		border: none;
		outline: none;
		font-size: 4.53vw;
		margin-left: 2.67vw;
		line-height: 9.33vw;
		width: 80%;
		color: #fff;
	}
	.inputCon{
		font-size: 9.33vw;
	}
	.btn {
		position: fixed;
		left: 4%;
		bottom: 21.33vw;
		width: 92%;
		line-height: 10.93vw;
		border-radius: 5.47vw;
		background: #FE3566;
		text-align: center;
		font-size: 5.07vw;
	}
</style>