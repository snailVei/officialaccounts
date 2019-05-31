import Vue from 'vue'
var store = require('store')
import axios from 'axios'
import $ajax from './../api/index.js'
import CryptoJS from 'crypto-js'

// 配置API接口地址
var root = process.env.API_HOST ;
//console.log('配置'+root)
var NODE_ENV = process.env.NODE_ENV;

function formatNumber(n) {
  const str = n.toString()
  return str[1] ? str : `0${str}`
}

function formatTime(date) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function timeStyle(str) {
  let now = new Date().getTime()
  let oldTime = new Date(str).getTime()
  let difference = now - oldTime
  let result = ''
  let minute = 1000 * 60
  let hour = minute * 60
  let day = hour * 24
  let month = day * 30
  let year = month * 12
  let _year = difference / year
  let _month = difference / month
  let _week = difference / (7 * day)
  let _day = difference / day
  let _hour = difference / hour
  let _min = difference / minute

  if (_year >= 1) {
    result = '发表于 ' + ~~(_year) + ' 年前'
  } else if (_month >= 1) {
    result = '发表于 ' + ~~(_month) + ' 个月前'
  } else if (_week >= 1) {
    result = '发表于 ' + ~~(_week) + ' 周前'
  } else if (_day >= 1) {
    result = '发表于 ' + ~~(_day) + ' 天前'
  } else if (_hour >= 1) {
    result = '发表于 ' + ~~(_hour) + ' 个小时前'
  } else if (_min >= 1) {
    result = '发表于 ' + ~~(_min) + ' 分钟前'
  } else {
    result = '刚刚'
  }
  return result
}

function getUrlKey(name) {
  let href = location.href;
  try {
    href = decodeURIComponent(href);
  } catch (err) {
    href = location.href;
  }
  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(href) || [, ""])[1].replace(/\+/g, '%20')) || null
}

function getLocUrl() {
  let locUrl = location.protocol + "//" + location.host;
  return locUrl;
}

function deviceInfo() {
  var that = this;
  const ua = navigator.userAgent;
  var isMiniProgram = false;

  function ready() {
    if (window.__wxjs_environment === 'miniprogram') {
      isMiniProgram = true;
    }
  }
  if (!window.WeixinJSBridge || !WeixinJSBridge.invoke) {
    document.addEventListener('WeixinJSBridgeReady', ready, false)
  } else {
    ready()
  }

  var isAndroid = ua.indexOf('Android') > -1 || ua.indexOf('Linux') > -1 || ua.indexOf('Adr') > -1; //android终端
  var isIOS = !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端

  if (ua.indexOf('MicroMessenger') == -1) {
    // 说明不在微信中
    if (isAndroid && ua.indexOf("Version") != -1) {
      deviceInfo = "android" //安卓app
    } else if (isIOS && ua.indexOf('Safari') == -1) {
      deviceInfo = "ios" //苹果app
    } else { //普通浏览器中
      if (isAndroid) {
        deviceInfo = "androidWeb" //安卓(或电脑）上的浏览器
      } else {
        deviceInfo = "iosWeb" //苹果上的浏览器
      }
    }

  } else { //在微信中
    if (isMiniProgram) {
      // 走在小程序的逻辑
      deviceInfo = "miniprogram"
    } else {
      if (isAndroid) {
        deviceInfo = "androidWeiXin"
      } else { //苹果微信
        deviceInfo = "iosWeiXin"
      }
    }
  }
  return deviceInfo;
}

function getWxReady(obj, shareData) {
  var that = this;
  if (!shareData) {
    shareData = {
      "title": "",
      "imgUrl": "",
      "content": ""
    }
  }

  wx.ready(function () {
    var data = {
      title: shareData.title || "女王魔镜",
      imgUrl: shareData.imgUrl,
      desc: shareData.content || "专注美业社交电商，品牌直供，源头供货，物美价廉，统一采购，统一服务。",
      link: shareData.link,
    }
    // let userId = store.get("userId");
    // let str = "?";
    // if (link.indexOf("?") != -1) {
    //   str = "&";
    // }
    // if (store.get("shopId") && link.indexOf("shopId") == -1) { //供应链
    //   data.link = link + str + "shopId=" + store.get("shopId");
    //   str="&";
    // }
    // //邀请人信息
    // if (store.get("objectId")) {
    //   link +=str+"objectType=" + store.get("objectType") + "&objectId=" + store.get("objectId");
    // }

    // if (!shareData.content) {
    //   data.desc = shareData.link;
    // }
    // let deviceInfo = that.deviceInfo();
    // if (deviceInfo == "iosWeiXin" && shareData.link.indexOf(":6080") != -1) {
    //   alert("当前处于测试环境，ios微信上分享功能无效，请在android上测试")
    // }


    //自定义“分享给朋友”及“分享到QQ”按钮的分享内容（1.4.0）
    // wx.updateAppMessageShareData({
    //   title: data.title,
    //   link: data.link,
    //   imgUrl: data.imgUrl,
    //   success: function () {
    //     alert("分享成功")
    //   }
    // })

    // //自定义“分享到朋友圈”及“分享到QQ空间”按钮的分享内容（1.4.0）
    // wx.updateTimelineShareData({
    //   title: data.title,
    //   link: data.link,
    //   imgUrl: data.imgUrl,
    //   success: function () {
    //     alert("分享成功")
    //   }
    // })

    //获取“分享给朋友”按钮点击状态及自定义分享内容接口（即将废弃）
    wx.onMenuShareAppMessage({
      title: data.title,
      link: data.link,
      imgUrl: data.imgUrl,
      desc: data.desc,
      success: function () {
        shareData.shareType = "微信好友";
//      that.hasShared(shareData);
      }
    });

    //获取“分享到朋友圈”按钮点击状态及自定义分享内容接口（即将废弃）
    wx.onMenuShareTimeline({
      title: data.title,
      link: data.link,
      imgUrl: data.imgUrl,
      desc: data.desc,
      success: function () {
        shareData.shareType = "朋友圈";
//      that.hasShared(shareData);
      }
    });

    // 获取“分享到QQ”按钮点击状态及自定义分享内容接口（即将废弃）
    wx.onMenuShareQQ({
      title: data.title,
      link: data.link,
      imgUrl: data.imgUrl,
      desc: data.desc,
      success: function () {
        shareData.shareType = "QQ";
//      that.hasShared(shareData);
      }
    });

    //分享到QQ空间
    wx.onMenuShareQZone({
      title: data.title,
      imgUrl: data.imgUrl,
      link: data.link,
      desc: data.desc,
      success: function () {
        shareData.shareType = "QQ空间";
//      that.hasShared(shareData);
      }
    });

    //分享微博
    wx.onMenuShareWeibo({
      title: data.title,
      imgUrl: data.imgUrl,
      link: data.link,
      desc: data.desc,
      success: function () {
        shareData.shareType = "微博";
//      that.hasShared(shareData);
      }
    });


  });

}

// 根据字典生成随机序列
function randomCode(len, dict) {
  for (var i = 0, rs = ''; i < len; i++) {
    rs += dict.charAt(Math.floor(Math.random() * 100000000) % dict.length);
  }
  return rs;
};
// 生成随机手机号码
function randomPhoneNumber() {
  // 第1位是1 第2位3578,第3位是3456789 第4-7位是* 最后四位随机
  return [1, randomCode(1, '3578'), randomCode(1, '3456789'), '****', randomCode(4, '0123456789')].join('');
};

//校验登录并获取登录信息
function checkLogin(that) {
  if (store.get('token')) {
    store.set('token', token)
  }
  let token = store.get('token');

  if (!token) {
  	store.clearAll();
  	window.location.replace(location.protocol + "//" + location.host+'/h5/officialAccounts/#/')
//  this.clearAllStoreAndLogin();
  }
  return token;
}

//获取环境
function getEnv() {
  if (NODE_ENV == "production") {
  	root = root
//  root = location.protocol + "//" + location.host ;
//  console.log('333'+root)
}
return root;
}

//获取shopId
function getShopId() {
  //防止用浏览器打开带有参数
}

function toAppIndex() {
  let deviceInfo = this.deviceInfo();
  if (deviceInfo == "miniprogram") {
    wx.miniProgram.switchTab({
      url: '/pages/index/index'
    })
  } else if (deviceInfo == "ios" || deviceInfo == "android") {
    try {
      window.NativeCall.index()
    } catch (error) {
      location.href = "nwmj://index";
    }
  } else {
    this.downloadApp();
  }

}

function setTitle() {
  if (navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
    var i = document.createElement('iframe');
    i.style.display = 'none';
    i.onload = function () {
      setTimeout(function () {
        i.remove();
      }, 500)
    }
    document.body.appendChild(i);
  }
}

//DES加密
export const encryptBy = (message) => {
    var key = 'cuican@asd#$%&';
    function encryptByDES (message, key) {
      var keyHex = CryptoJS.enc.Utf8.parse(key)
      var option = {mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7}
      var encrypted = CryptoJS.DES.encrypt(message, keyHex, option)
      return encrypted.ciphertext.toString()
    }
    return encryptByDES(message, key);
}
//DES解密
export const decryptBy = (message) => {
    var key = 'cuican@asd#$%&';
    //DES  ECB模式解密
    function decryptByDES(message,key){
    var keyHex = CryptoJS.enc.Utf8.parse(key);
    var decrypted = CryptoJS.DES.decrypt({
    ciphertext: CryptoJS.enc.Hex.parse(message)
    }, keyHex, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
    });
    var result_value = decrypted.toString(CryptoJS.enc.Utf8);
    return result_value;
    }
    return decryptByDES(message, key);
}

export default {
  formatNumber,
  formatTime,
  timeStyle,
  getUrlKey, //获取参数（app带来的参数）
  getLocUrl,
  deviceInfo, //设备信息
  randomCode,
  randomPhoneNumber, //生成随机手机号
  getWxReady,
  checkLogin,
  getEnv,
  getShopId,
  toAppIndex, //跳转app首页
  setTitle, //ios不能重置title的问题
}
