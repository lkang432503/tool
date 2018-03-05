(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'module'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod);
    global.tool = mod.exports;
  }
})(this, function (exports, module) {
  function UrlSearch() {
    var name, value;
    var str = location.href; //取得整个地址栏
    var num = str.indexOf("?");
    str = str.substr(num + 1); //取得所有参数   stringvar.substr(start [, length ]
    var arr = str.split("&"); //各个参数放到数组里
    for (var i = 0; i < arr.length; i++) {
      num = arr[i].indexOf("=");
      if (num > 0) {
        name = arr[i].substring(0, num);
        value = arr[i].substr(num + 1);
        this[name] = value;
      }
    }
  }
  var PARAMS = new UrlSearch();
  var tool = {
    /**
     * 验证手机号
     */
    isPhone: function (phone) {
      var pattern = /^1[34578]\d{9}$/;
      return pattern.test(phone);
    },
    /**
     *  验证身份证
     */
    isCard: function (card) {
      var pattern = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
      return pattern.test(card);
    },
    /** 
     *  验证邮箱
     */
    isEmail: function (emial) {
      var pattern = /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/;
      return pattern.test(emial);
    },
    /**
     * 验证邮政编码
     */
    isPostcode: function (post) {
      var pattern = /^[1-9][0-9]{5}$/;
      return pattern.test(post);
    },
    /**
     * 返回数据类型
     * @param obj 当前类型
     * @param typeStr 判断类型
     * 
     */
    getInstanceof: function (obj, typeStr) {
      var objStr = Object.prototype.toString.call(obj).toLowerCase();
      if (!typeStr) {
        return objStr.match(/^\[object\s(\w+)\]$/)[1];
      } else {
        var reg = new RegExp("^\\[object " + typeStr + "\\]$");
        return reg.test(objStr);
      }
    },
    /**
     * 替换路由
     */
    replaceHistory: function (str) {
      history.replaceState(null, '', str);
    },
    /**
     * 判断手机是否是IOS终端
     */
    isIOS: function () {
      return /ip(?:hone|od|ad)/i.test(navigator.userAgent);
    },
    /**
     * 判断手机是否是android终端
     */
    isAndroid: function () {
      return /Android/gi.test(navigator.userAgent);
    },
    /**
     * 获取url传过来的值
     */
    Request: function (name) {
      return PARAMS[name];
    },
    /**
     * 修改页面标题
     * vux上已用插件用插件
     * 
     */
    setHeadTitle: function (_title) {
      document.title = _title;
      if (tool.isIOS) {
        var i = document.createElement('iframe');
        i.src = '/favicon.ico';
        i.style.display = 'none';
        i.onload = function () {
          setTimeout(function () {
            i.remove();
          }, 0)
        }
        document.body.appendChild(i);
      }
    },
    /**
     * class 设置了 overflow 属性, 导致 Android 手机下输入框获取焦点时, 输入法挡住输入框的 bug
     * 相关 issue: https://github.com/weui/weui/issues/15
     *  0. 去掉 overflow 属性,
     *  1. Android 手机下, input 或 textarea 元素聚焦时, 主动滚一把
     */
    androidInputBugFix: function () {
      if (tool.isAndroid()) {
        window.addEventListener('resize', function () {
          if (document.activeElement.tagName == 'INPUT' || document.activeElement.tagName == 'TEXTAREA') {
            window.setTimeout(function () {
              document.activeElement.scrollIntoViewIfNeeded();
            }, 0);
          }
        })
      }
    },
    /**
     * yy-mm-dd
     */
    dateFormat: function (d) {
      var month = d.getMonth() + 1;
      if (month < 10) {
        month = '0' + month;
      }
      var day = d.getDate();
      if (day < 10) {
        day = '0' + day;
      }
      return d.getFullYear() + '-' + month + '-' + day;
    },
    /**
     * AJAX......
     */
    // formatParams: function (data) {
    //   if (tool.getInstanceof(data, 'formdata')) {
    //     return data;
    //   }    
    //   var arr = [];    
    //   for (var name in data) {      
    //     arr.push(encodeURIComponent(name) + "=" + encodeURIComponent(data[name]));    
    //   }    
    //   arr.push(("v=" + Math.random()).replace(".", ""));    
    //   return arr.join("&");  
    // },
   /**
    * 当data对象的key对应的值是数组或者对象的时候就要深度遍历
    * @param data 对象为formdata，上传文件
    */
    formatParams: function (data) {
      if (tool.getInstanceof(data, 'formdata')) {
        return data;
      }
      var arr = [];
      function depthParams(_data, _name) {
        if (tool.getInstanceof(_data, 'array')) {
          _data.forEach(function (item) {
            depthParams(item, _name + '[]');
          });
        } else if (tool.getInstanceof(_data, 'object')) {
          for (var n in _data) {
            depthParams(_data[n], _name + '[' + n + ']');
          }
        } else {
          arr.push(encodeURIComponent(_name) + "=" + encodeURIComponent(_data));
        }
      } 
      for (var name in data) {
        depthParams(data[name], name);
      } 
      arr.push(("v=" + Math.random()).replace(".", ""));    
      return arr.join("&");
    },
    ajax: function (options) {
      var formatParams = tool.formatParams;    
      options = options || {};    
      options.type = (options.type || "GET").toUpperCase();    
      options.dataType = options.dataType || "json";
      options.timeout = options.timeout||10000;    
      var params = formatParams(options.data);    
      if (window.XMLHttpRequest) {      
        var xhr = new XMLHttpRequest();    
      } else { //IE6及其以下版本浏览器
              
        var xhr = new ActiveXObject('Microsoft.XMLHTTP');    
      }
      xhr.timeout = options.timeout;
      xhr.onreadystatechange = function () {      
        if (xhr.readyState == 4) {        
          var status = xhr.status;
          if (status >= 200 && status < 300) {
            var DATA = null;
            if (options.dataType.toUpperCase() == 'JSON') {
              DATA = JSON.parse(xhr.responseText);
            } else {
              DATA = xhr.responseText;
            }          
            options.success && options.success(DATA, xhr.responseXML);        
          } else {          
            options.fail && options.fail(status);        
          }      
        }    
      }    
      if (options.type == "GET") {      
        xhr.open("GET", options.url + "?" + params, true);      
        xhr.send(null);    
      } else if (options.type == "POST") {      
        xhr.open("POST", options.url, true);
        if (!tool.getInstanceof(params, 'formdata')) { 
          xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        } else {}      
        xhr.send(params);    
      }  
    },
    /**
     * 页面刷新
     */
    pageSH: function () {
      var isPageHide = false;
      var pageShowFuc = function () {
        if (isPageHide) {
          window.location.reload();
        }
      };
      var pageHideFuc = function () {
        isPageHide = true;
      };
      window.addEventListener('pageshow', pageShowFuc);
      window.addEventListener('pagehide', pageHideFuc);
    },
    /**
     * 判断是否为微信浏览器
     */
    isWeChatBrowser: function () {
      var ua = window.navigator.userAgent.toLowerCase();
      if (ua.match(/MicroMessenger/i) == 'micromessenger') {
        return true;
      } else {
        return false;
      }
    },
    /**
     * 隐藏微信右下面工具栏
     */
    hideToolbar: function () {
      WeixinJSBridge.call('hideToolbar');
    },
    /**
     * 显示微信右下面工具栏
     */
    showToolbar: function () {
      WeixinJSBridge.call('showToolbar');
    },
    /**
     * 隐藏微信右上角三个点按钮。
     */
    hideOptionMenu: function () {
      WeixinJSBridge.call('hideOptionMenu');
    },
    /**
     * 显示微信右上角三个点按钮
     */
    showOptionMenu: function () {
      WeixinJSBridge.call('showOptionMenu');
    },
    /**
     * 微信初始化配置 
     * @param wx 微信接口jssdk对象
     * @param config 初始化参数
     * @param jslist 除分享接口其他需要用到的接口
     * @param isNoDefault true不会使用分享接口
     */
    setWeChatConfig: function (wx, config, jslist, isNoDefault) {
      if (!jslist) jslist = [];
      config.jsApiList = ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ',
        'onMenuShareWeibo', 'onMenuShareQZone'
      ];
      if (isNoDefault) {
        config.jsApiList = [];
      }
      config.jsApiList = config.jsApiList.concat(jslist);
      wx.config(config);
    },
    /**
     * Vue 设置为插件用
     */
    install: function (Vue) {
      Vue.prototype.$tool = tool;
      Vue.tool = tool;
    },
  };
  module.exports = tool;
});