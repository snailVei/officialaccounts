// 配置API接口地址
var root = process.env.API_HOST ;
var NODE_ENV = process.env.NODE_ENV;
//console.log(root+' 1')
// 引用axios
require('es6-promise').polyfill();
var axios = require('axios')
import Qs from 'qs'
// 自定义判断元素类型JS
function toType(obj) {
  return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
}
// 参数过滤函数
function filterNull(o) {
  for (var key in o) {
    if (o[key] === null) {
      delete o[key]
    }
    if (toType(o[key]) === 'string') {
      o[key] = o[key].trim()
    } else if (toType(o[key]) === 'object') {
      o[key] = filterNull(o[key])
    } else if (toType(o[key]) === 'array') {
      o[key] = filterNull(o[key])
    }
  }
  return o;
}

/*
 接口处理函数
*/

function apiAxios(method, url, params, success, failure) {
  if (params) {
    params = filterNull(params)
  }
//console.log(NODE_ENV)
  if (NODE_ENV == "production") {
  	root = root
//  root = location.protocol + "//" + location.host ;
//  console.log('222 '+location.protocol + "//" + location.host)
  }
  if(NODE_ENV == "development"){
  	root = location.protocol + "//" + location.host+root
  }
//	console.log('位置'+root)
  axios({
      method: method,
      url: url,
      data: method === 'POST' || method === 'PUT' ? params : null,
      params: method === 'GET' || method === 'DELETE' ? params : null,
      baseURL: root,
      withCredentials: false
    })
    .then(function (res) {
      if (success) {
        success(res.data)
      }

    })
    .catch(function (err) {
      let res = err.response
      if (res) {
        console.error('api error, HTTP CODE: ' + res.status)
      }
    })
}

function postForm(url, params,success) {
  if (params) {
    params = filterNull(params)
  }
if (NODE_ENV == "production") {
	root = root
//  root = location.protocol + "//" + location.host ;
//		console.log('这是'+location.protocol + "//" + location.host)
}
if(NODE_ENV == "development"){
  	root = location.protocol + "//" + location.host+root
 }
	console.log('请求' + root)
  axios({
      url: url,
      baseURL: root,
      data: params,
      method: 'post',
      headers: {
        "Content-Type": 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      transformRequest: [function (params) {
        return Qs.stringify(params);
      }],
    })
    .then(function (res) {
        success(res.data)
    })
    .catch(function (err) {
      let res = err.response
      if (res) {
        console.error('api error, HTTP CODE: ' + res.status)
      }
    })
}

// 返回在vue模板中的调用接口
export default {
  get: function (url, params, success, failure) {
    return apiAxios('GET', url, params, success, failure)
  },
  post: function (url, params, success, failure) {
    return apiAxios('POST', url, params, success, failure)
  },
  put: function (url, params, success, failure) {
    return apiAxios('PUT', url, params, success, failure)
  },
  delete: function (url, params, success, failure) {
    return apiAxios('DELETE', url, params, success, failure)
  },
  postForm: function (url, params,success) {
    return postForm(url, params,success);
  }
}
