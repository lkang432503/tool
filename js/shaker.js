
/**
 * 摇一摇功能
 * 不能同时创建多个，
 * 创建后不用了要销毁
*/
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
		global.shaker = mod.exports;
	}
})(this, function (exports, module) {
    var shaker = null;
    var currEventFuc = null;
    var IsAddEvent = false;
    var shake = 4000,
    last_update = 0,
    count = 0,
    x = y = z = last_x = last_y = last_z = 0;
    function deviceMotionHandler(eventData) {
        var acceleration = eventData.accelerationIncludingGravity,
            currTime = new Date().valueOf(),
            diffTime = currTime - last_update;
        if (diffTime > 100) {
            last_update = currTime;
            x = acceleration.x;
            y = acceleration.y;
            z = acceleration.z;
            var speed = Math.abs(x + y + z - last_x - last_y - last_z) / diffTime * 10000;
            if (speed > shake) {
                currEventFuc();   
            } else {
            }
            last_x = x;
            last_y = y;
            last_z = z;
        }
    }
    shaker = function(callBack){
        currEventFuc=callBack;
        if (window.DeviceMotionEvent) {
           window.addEventListener("devicemotion", deviceMotionHandler);
        } else {
           console.log('设备不支持摇一摇事件');
        }
    },
    /**
     * 销毁摇一摇事件
    */
    shaker.destory = function(){
         window.removeEventListener("devicemotion",deviceMotionHandler)
    },
    /**
     * 设置为Vue插件
    */
    shaker.install = function(Vue){
        Vue.prototype.$shaker = shaker;
        Vue.shaker = shaker;
    }
    module.exports = shaker;
});
