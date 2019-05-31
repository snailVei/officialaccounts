<template>
  <div class="wrap">
  	<img class="bgImg" src="../../static/img/bg.jpg"/>
    <div class="login">
    	<img class="logo" src="../../static/img/logoapp@2x.png"/>
    	<input type="number" ref='telNo' oninput="if(value.length>11)value=value.slice(0,11)" placeholder="请输入手机号" />
    	<div class="verify">
    		<input type="number" ref='verCode' value="" placeholder="验证码" />
    		<div @click="getCode">短信验证码</div>
    	</div>
    	<div class="btn" @click="loginbtn">登陆</div>
    </div>
  </div>

</template>

<script>

var store = require('store')
export default {
  name: "login",
  components: {
    
  },
  data() {
    return {
      host:location.protocol + "//" + location.host+process.env.API_HOST
    }
  },

  created() {
    let that = this;
    let reg = /^1[3|4|5|6|7|8|9][0-9]{9}$/;
//  var deviceInfo = that.$utils.deviceInfo()
//		console.log(deviceInfo.indexOf("WeiXin") != -1)
 },
  methods: {
   	loginbtn(){
   		let that = this
   		if (!(/^1[3|4|5|6|7|8|9][0-9]{9}$/.test(that.$refs.telNo.value))) {
        that.$toast('请正确填写手机号')
        return;
     	}
   		if(that.$refs.verCode.value==''){
   			that.$toast('验证码不能为空')
        return;
   		}
   		that.$indicator.open();
   		
   		that.$ajax.post( '/auth/login/vcode',
   		{
   			phoneNumber: that.$refs.telNo.value,
    		validateCode: that.$refs.verCode.value
   		},
   		res=>{
   			that.$indicator.close();
   			if(res.code!='E000'){
    			that.$toast(res.msg)
    			return false
    		}
   			localStorage.setItem('token',res.data.token)
// 			store.set("token", res.data.token);
   			that.$toast({message: '登录成功'});
   			if (that.$router.query.id=='1') {
          that.$router.back(-1)
        } else {
          that.$router.replace({path: '/mine'})
        }
   			
   		})
   	},
   	getCode(){
   		let that = this
// 		console.log(!(/^1[3|4|5|6|7|8|9][0-9]{9}$/.test(that.$refs.telNo.value)))
   		if (!(/^1[3|4|5|6|7|8|9][0-9]{9}$/.test(that.$refs.telNo.value))) {
        that.$toast('请正确填写手机号')
        return;
     	}
// 		var host = location.protocol + "//" + location.host+process.env.API_HOST
// 		console.log(location.protocol)
// 		console.log(location.protocol + "//" + location.host+process.env.API_HOST)
// 		console.log(process.env.API_HOST)
			that.$indicator.open();
   		that.$ajax.post( '/auth/sendVCode',
    		{
    			phoneNumber: that.$refs.telNo.value,
        	validateType: '1'
    		},
    		res=>{
    			that.$indicator.close();
//  			console.log(res)
    			if(res.code!='E000'){
    				this.$toast(res.msg)
    				return false
    			}
    		}
    	)
   	}
  }

}
</script>

<style scoped>
	#app{
		background:#fff;
	}
	.wrap{
		width: 100%;
		height: 100vh;
		background: #fff;
		position: relative;
	}
	.bgImg{
		display: block;
		width: 100%;
		position: absolute;
		left: 0;
		top: 0;
	}
	.login{
		width: 84%;
		position: absolute;
		left: 8%;
		top: 50%;
		transform: translateY(-50%);
		z-index: 99;
	}
	.logo{
		display: block;
		width: 22.4vw;
		height: 22.4vw;
		margin: 0 auto;
		margin-bottom: 10.67vw;
	}
	.login input{
		display: block;
		width: 100%;
		line-height: 11.73vw;
		border-radius: 5.87vw;
		background: rgba(255,255,255,0.2);
		border: 0;
		color: #fff;
		padding-left: 5.33vw;
		box-sizing: border-box;
		font-size: 4.27vw;
		outline: none;
	}
	.login input::-webkit-input-placeholder{
		color: #fff;
	}
	.verify{
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-top: 6.67vw;
	}
	.verify input{
		width: 58%;
	}
	.verify div{
		width: 34%;
		background: rgba(255,255,255,0.2);
		line-height: 11.73vw;
		border-radius: 5.87vw;
		color: #fff;
		text-align: center;
		font-size: 4.27vw;
	}
	.btn{
		width: 100%;
		line-height: 11.73vw;
		border-radius: 5.87vw;
		color: #fff;
		font-size: 5.07vw;
		text-align: center;
		background: linear-gradient(to right,#F54B64,#F78361);
		margin-top: 10.67vw;
	}
</style>
